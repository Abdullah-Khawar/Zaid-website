import { useState, useEffect } from "react";
import { CheckCircle, Clock, DollarSign, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import backendUrl from "../../../assets/assets"

const OrdersPage = () => {
  const [orderStats, setOrderStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Fetch order statistics
        const statsResponse = await fetch(`${backendUrl}/orders/stats`);
        const statsData = await statsResponse.json();
        setOrderStats(statsData);

        
        setOrders(statsData);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title="Orders" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Order Statistics */}
        {orderStats ? (
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard name="Total Orders" icon={ShoppingBag} value={orderStats.totalOrders} color="#6366F1" />
            <StatCard name="Pending Orders" icon={Clock} value={orderStats.pendingOrders} color="#F59E0B" />
            <StatCard name="Completed Orders" icon={CheckCircle} value={orderStats.completedOrders} color="#10B981" />
            <StatCard name="Cancelled Orders" icon={DollarSign} value={orderStats.cancelledOrders} color="#EF4444" />
            <StatCard name="Shipped Orders" icon={Truck} value={orderStats.shippedOrders} color="#4ECDC4" />
          </motion.div>
        ) : (
          <p className="text-center text-white">Loading statistics...</p>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyOrders />
          <OrderDistribution />
        </div>

        {/* Orders Table */}
        {loading ? (
          <p className="text-center text-white">Loading orders...</p>
        ) : (
          <OrdersTable orders={orders} />
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
