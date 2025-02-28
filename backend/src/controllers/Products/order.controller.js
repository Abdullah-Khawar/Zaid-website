import Order from "../../models/order.model.js";
import User from "../../models/user.models.js"; // Import User model
import Product from "../../models/products.models.js"; // Import Product model

export const createOrder = async (req, res) => {
    try {
        const { customerId, productsTotal, shippingCost, products } = req.body;

        // Validate request body
        if (!customerId || !productsTotal || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid request data. Ensure customerId, productsTotal, and products array are provided." });
        }

        // Validate if customerId exists in the User collection
        const user = await User.findById(customerId);
        if (!user) {
            return res.status(400).json({ message: "Invalid customerId. User does not exist." });
        }


        // Extract product IDs from request
        const productIds = products.map(p => p.productId);

        // Validate if all product IDs exist
        const existingProducts = await Product.find({ _id: { $in: productIds } });

        if (existingProducts.length !== products.length) {
            return res.status(400).json({ message: "One or more products do not exist." });
        }

        // Calculate finalAmount (including shipping cost)
        const finalAmount = productsTotal + (shippingCost || 0);

        // Create and save order
        const order = new Order({ 
            ...req.body, 
            customerName: user.name,
            customerEmail: user.email,
          
            finalAmount 
        });

        await order.save();
        res.status(201).json({ message: "Order created successfully", order });

    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("customerId", "name email");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("customerId", "name email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch order", error: error.message });
    }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        // Validate request body
        if (!orderStatus) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order", error: error.message });
    }
};

// Delete Order
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete order", error: error.message });
    }
};


export const getDailyOrders = async (req, res) => {
  try {
    console.log("Fetching daily orders...");

    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } }, // Ensure orderDate exists
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    if (!orders.length) {
      console.log("No orders found!");
    }

    console.log("Daily orders fetched:", orders);

    // Transform data for frontend
    const formattedData = orders.map((order) => ({
      date: order._id,
      orders: order.totalOrders,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("❌ Error fetching daily orders:", error);
    res.status(500).json({ message: "Failed to fetch daily orders", error: error.message });
  }
};

export const getOrderStatusDistribution = async (req, res) => {
    try {
        const statusDistribution = await Order.aggregate([
          {
            $group: {
              _id: "$orderStatus", // Group by order status
              count: { $sum: 1 },  // Count orders per status
            }
          }
        ]);
    
        // Format data for the frontend PieChart
        const formattedData = statusDistribution.map(item => ({
          name: item._id.charAt(0).toUpperCase() + item._id.slice(1), // Capitalize first letter
          value: item.count
        }));
    
        res.json(formattedData);
      } catch (error) {
        console.error("Error fetching order status distribution:", error);
        res.status(500).json({ message: "Failed to fetch order status distribution" });
      }
};


export const getOrderStats = async (req, res) => { try {
    const orders = await Order.find(); // Fetch all orders from the database

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.orderStatus === "pending").length,
      completedOrders: orders.filter((order) => order.orderStatus === "delivered").length,
      cancelledOrders: orders.filter((order) => order.orderStatus === "cancelled").length,
      shippedOrders: orders.filter((order) => order.orderStatus === "shipped").length,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ------------------- Sales Summary -------------------

export const getSalesSummary = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: "delivered" });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);

    // Process sales by year
    const salesByYear = {};
    orders.forEach((order) => {
      const year = new Date(order.orderDate).getFullYear();
      const month = new Date(order.orderDate).getMonth();

      if (!salesByYear[year]) {
        salesByYear[year] = { year, months: Array(12).fill(0) };
      }
      salesByYear[year].months[month] += order.finalAmount;
    });

    console.log(orders)
    res.json({
      orderHistory: orders,
      totalRevenue,
      salesByYear: Object.values(salesByYear),
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// export const getMonthlySalesTrend = async (req, res) => {
//     try {
//       // Fetch only delivered orders
//       const orders = await Order.find({ orderStatus: "delivered" });
  
//       if (!orders.length) {
//         return res.status(404).json({ message: "No delivered orders found" });
//       }
  
//       const salesByYear = {};
  
//       orders.forEach((order) => {
//         if (!order.orderDate || !order.finalAmount) {
//           console.warn("Skipping order due to missing orderDate or finalAmount:", order);
//           return;
//         }
  
//         const date = new Date(order.orderDate);
//         const year = date.getFullYear();
//         const month = date.toLocaleString("default", { month: "short" });
  
//         if (!salesByYear[year]) {
//           salesByYear[year] = {};
//         }
//         if (!salesByYear[year][month]) {
//           salesByYear[year][month] = 0;
//         }
  
//         salesByYear[year][month] += order.finalAmount; // Using finalAmount for total order value
//       });
  
//       // Convert sales data into an array for response
//       const salesTrend = Object.keys(salesByYear).map((year) => {
//         const monthsData = Object.keys(salesByYear[year]).map((month) => ({
//           month,
//           sales: salesByYear[year][month] || 0, // Ensuring sales is never null
//         }));
  
//         // Sorting months in correct order (Jan - Dec)
//         const monthOrder = [
//           "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//         ];
  
//         return {
//           year,
//           months: monthsData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)),
//         };
//       });
  
//       console.log("Sales Trend Data:", JSON.stringify(salesTrend, null, 2));
  
//       res.json(salesTrend);
//     } catch (error) {
//       console.error("Error fetching sales trend:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };


  export const getMonthlySalesTrend = async (req, res) => {
    try {
      // Fetch only delivered orders
      const orders = await Order.find({ orderStatus: "delivered" });
  
      if (!orders.length) {
        return res.status(404).json({ message: "No delivered orders found" });
      }
  
      const salesByYear = {};
  
      orders.forEach((order) => {
        if (!order.orderDate || !order.finalAmount) {
          console.warn("Skipping order due to missing orderDate or finalAmount:", order);
          return;
        }
  
        const date = new Date(order.orderDate);
        const year = date.getFullYear();
        const month = date.toLocaleString("default", { month: "short" });
  
        if (!salesByYear[year]) {
          salesByYear[year] = {};
        }
        if (!salesByYear[year][month]) {
          salesByYear[year][month] = 0;
        }
  
        salesByYear[year][month] += order.finalAmount; // Using finalAmount for total order value
      });
  
      // Convert sales data into an array for response
      const salesTrend = Object.keys(salesByYear).map((year) => {
        const monthsData = Object.keys(salesByYear[year]).map((month) => ({
          month,
          sales: salesByYear[year][month] || 0, // Ensuring sales is never null
        }));
  
        // Sorting months in correct order (Jan - Dec)
        const monthOrder = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
  
        return {
          year,
          months: monthsData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)),
        };
      });
  
      console.log("Sales Trend Data:", JSON.stringify(salesTrend, null, 2));
  
      res.json(salesTrend);
    } catch (error) {
      console.error("Error fetching sales trend:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };




export const getSalesByCategory = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      { $match: { orderStatus: "delivered" } }, // Filter to include only delivered orders
      { $unwind: "$products" }, // Flatten products array

      // Lookup product details from the Products collection with type conversion
      {
        $lookup: {
          from: "products",
          let: { productId: { $toObjectId: "$products.productId" } }, // Ensure ObjectId match
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
            { $project: { category: 1, subCategory: 1 } }, // Only return required fields
          ],
          as: "productDetails",
        },
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } }, 

      // Group by category and subCategory from product details
    
      {
        $group: {
          _id: { 
            category: "$productDetails.category", 
            subCategory: "$productDetails.subCategory"
          },
          totalSales: { $sum: "$productsTotal" } // Sum from order level, not product level
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          subCategory: "$_id.subCategory",
          totalSales: 1
        }
      }
      


    ]);

    console.log(salesData);
    res.json(salesData);
  } catch (error) {
    console.error("Error fetching sales by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
