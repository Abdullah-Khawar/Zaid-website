import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { orderHistoryData } from "../customer/CustomerOrdersData";
import getSalesByYearAndMonth from "../sales/GetSalesByYearAndMonth";
import { backendUrl } from "../../../../assets/assets";

const StockTable = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]); // State to hold the products data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  // Get sales data by year and month
  const salesDataByYear = useMemo(() => getSalesByYearAndMonth(orderHistoryData), [orderHistoryData]);
  const selectedYearData = salesDataByYear.find(data => data.year.toString() === selectedYear.toString());

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${backendUrl}/products`); // Replace with your actual API URL
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data); // Set the fetched products
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError(err.message); // Set error message if there's an issue fetching
        setLoading(false);
      }
    };

    fetchProducts(); // Call the fetch function
  }, []);

  // Low stock detection logic (for clothes and non-clothes)
  const lowStockProducts = products.filter(product => {
    if (product.category.toLowerCase() === "clothes") {
      return product.colors.some(color => {
        // Check if any size in this color is out of stock
        if (color.sizes) {
          return Object.values(color.sizes).some(sizeStock => sizeStock === 0);
        }
        return false;
      });
    } else {
      // Non-clothing products: Check if any color is out of stock
      return product.colors.some(color => color.stock === 0);
    }
  });

  // Filter out products based on search term
  const filteredLowStockProducts = lowStockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render loading or error states if necessary
  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <>
      {/* Low Stock Products Table */}
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Low Stock Products</h2>
        </div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name"
            className="px-4 py-2 w-full bg-gray-700 text-gray-200 rounded-lg shadow-sm focus:outline-none"
          />
        </motion.div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subcategory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredLowStockProducts.map((product) => (
                product.colors.filter(color => color.stock === 0 || (color.sizes && Object.values(color.sizes).some(sizeStock => sizeStock === 0))).map((color, index) => (
                  <motion.tr key={`${product._id}-${index}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.subCategory}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{color.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {color.sizes ? Object.entries(color.sizes).filter(([size, stock]) => stock === 0).map(([size]) => size).join(", ") : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">0</td>
                  </motion.tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
};

export default StockTable;
