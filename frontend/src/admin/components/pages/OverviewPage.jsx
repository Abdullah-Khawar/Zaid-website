import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";




const OverviewPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [userList, setUserList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const backendUrl = import.meta.env.BACKEND_URL
  // Fetch users from the backend
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/admin/getUsers`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUserList(data);
      } catch (error) {
        setError(error.message);
        toast.error("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  // Fetch products from the backend
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch order history and statistics
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/stats`);
        if (!response.ok) throw new Error("Failed to fetch order stats");
        const statsData = await response.json();
        setOrderStats(statsData);
        setOrderHistory(statsData.orders || []);
      } catch (error) {
        setError(error.message);
        toast.error("Error fetching order stats");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, []);

  // Calculate total delivered products (sum of quantity from all delivered orders)
  const totalDeliveredProducts = useMemo(() => {
    return orderHistory.reduce((acc, order) => {
      if (order.orderStatus === "delivered") {
        return (
          acc +
          order.products.reduce(
            (productAcc, product) => productAcc + product.quantity,
            0
          )
        );
      }
      return acc;
    }, 0);
  }, [orderHistory]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      {error && <div className="text-red-500">{error}</div>}

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Sales (Delivered Products)"
            icon={Zap}
            value={orderStats?.completedOrders || totalDeliveredProducts}
            color="#6366F1"
          />
          <StatCard
            name="Total Customers"
            icon={Users}
            value={userList.length}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value={products.length}
            color="#EC4899"
          />
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <SalesByCategoryChart />
          <CategoryDistributionChart initialProducts={products} />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
