
import Sidebar from "./components/common/Sidebar";
import { useState } from "react";
import { initialProducts } from "./components/customer/ProductsData";
import { Outlet } from "react-router-dom";

function AdminPanel() {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Background Styling */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet /> {/* Ensures nested routes work */}
      </div>
    </div>
  );
}

export default AdminPanel;
