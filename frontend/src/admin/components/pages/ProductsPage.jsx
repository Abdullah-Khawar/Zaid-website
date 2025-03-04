import { motion } from "framer-motion";
import { useMemo, useState, useEffect, useCallback } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, Package } from "lucide-react";
import ProductsTable from "../components/products/ProductsTable";
import StockTable from "../components/products/StockTable";
import { orderHistoryData } from "../components/customer/CustomerOrdersData";
import getSalesByYearAndMonth from "../components/sales/GetSalesByYearAndMonth";

const ProductsPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(""); // Reset error before fetching

    
    try {
      const response = await fetch(`${backendUrl}/products`);
  
      if (!response.ok) throw new Error("Failed to fetch products");
  
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setOrderHistory(orderHistoryData);
  }, []);

  // Compute Stats
  const totalProducts = products.length;

  // Calculate Low Stock (For Clothing & Non-Clothing)
  const lowStock = useMemo(() => {
    return products.reduce((count, product) => {
      if (product.category.toLowerCase() === "clothes") {
        return count + product.colors.reduce((colorCount, color) => {
          if (color.sizes) {
            const hasZeroStockSize = Object.values(color.sizes).some(sizeStock => sizeStock === 0);
            return colorCount + (hasZeroStockSize ? 1 : 0);
          }
          return colorCount;
        }, 0);
      } else {
        const lowStockColors = product.colors.filter(color => color.stock === 0);
        return count + lowStockColors.length;
      }
    }, 0);
  }, [products]);

  // Calculate Out-of-Stock Products
  const outOfStockProducts = useMemo(() => {
    return products.filter(product => {
      if (product.category.toLowerCase() === "clothes") {
        return product.colors.every(color => 
          color.sizes && Object.values(color.sizes).every(sizeStock => sizeStock === 0)
        );
      } else {
        return product.colors.every(color => color.stock === 0);
      }
    });
  }, [products]);

  // Get sales data for all years
  const salesDataByYear = useMemo(() => getSalesByYearAndMonth(orderHistoryData), []);

  // Get sales data for the selected year
  const selectedYearData = useMemo(() => {
    return salesDataByYear.find(data => data.year.toString() === selectedYear.toString());
  }, [salesDataByYear, selectedYear]);

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Products" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Products" icon={Package} value={totalProducts} color="#6366F1" />
          <StatCard name="Low Stock" icon={AlertTriangle} value={lowStock} color="#F59E0B" />
        </motion.div>

        {/* Product and Stock Table */}
        <ProductsTable products={products} fetchProducts={fetchProducts} />
        <StockTable products={products} />
      </main>
    </div>
  );
};

export default ProductsPage;