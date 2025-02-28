import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { DollarSign } from "lucide-react";
import SalesTrendChart from "../components/sales/SalesTrendChart";
import SalesByCategoryChart from "../components/sales/SalesByCategoryChart";
import backendUrl from "../../../assets/assets"

const SalesPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salesDataByYear, setSalesDataByYear] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${backendUrl}/orders/sales-summary`);
        if (!response.ok) throw new Error("Failed to fetch sales data");

        const data = await response.json();
        setSalesDataByYear(data.salesByYear);
        setTotalRevenue(data.totalRevenue);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const selectedYearData = salesDataByYear.find((data) => data.year === selectedYear);

  // Ensure sales data is correctly formatted before passing to SalesTrendChart
  const formattedSalesData =
    selectedYearData?.months?.map((sales, index) => ({
      month: new Date(2023, index).toLocaleString("default", { month: "short" }), // Convert index to month name
      sales: sales || 0, // Ensure no null values
    })) || [];

  console.log("Selected Year Data:", selectedYearData); // Debugging log
  console.log("Formatted Sales Data for Chart:", formattedSalesData); // Debugging log

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sales Dashboard" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Revenue" icon={DollarSign} value={`${totalRevenue} RS`} color="#6366F1" />
        </motion.div>

        {/* YEAR SELECTION DROPDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          <div className="flex flex-col space-y-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full p-2 bg-white text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {salesDataByYear.map((data) => (
                <option key={data.year} value={data.year}>
                  {data.year}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : selectedYearData ? (
            <SalesTrendChart salesData={formattedSalesData} />
          ) : (
            <p className="text-center text-gray-500">No data available for this year</p>
          )}
        </div>

        <SalesByCategoryChart />
      </main>
    </div>
  );
};

export default SalesPage;
