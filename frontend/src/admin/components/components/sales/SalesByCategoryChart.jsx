import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

const SalesByCategoryChart = () => {
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.BACKEND_URL
  
useEffect(() => {
  const fetchSalesData = async () => {
    try {
      const response = await fetch(`${backendUrl}/orders/sales-by-category`);
      if (!response.ok) throw new Error("Failed to fetch sales data");

      const data = await response.json();
      console.log("Fetched Sales by Category:", data); // Debugging log

      // Ensure data is properly formatted
      const formattedData = data
        .filter(({ category, subCategory }) => category && subCategory) // Remove undefined
        .map(({ category, subCategory, totalSales }) => ({
          name: `${category || "Unknown"} - ${subCategory || "Unknown"}`, // Fallback to "Unknown"
          value: totalSales || 0, // Ensure value is numeric
        }));

      setSalesByCategory(formattedData);
    } catch (err) {
      console.error("Error fetching sales by category:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchSalesData();
}, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Sales by Category & Subcategory</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : salesByCategory.length === 0 ? (
        <p className="text-center text-gray-500">No data available</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={salesByCategory}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default SalesByCategoryChart;
