import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button, MenuItem, Select } from "@mui/material"; // Added Select & MenuItem
import { backendUrl } from "../../../../assets/assets";
const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allOrders, setAllOrders] = useState([]); 
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [openModal, setOpenModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${backendUrl}/orders`); 
        const data = await response.json();
        setAllOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterOrders(term, statusFilter);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterOrders(searchTerm, status);
  };

  const filterOrders = (search, status) => {
    let filtered = allOrders;

    if (search) {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(search) ||
          order.customerName.toLowerCase().includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter((order) => order.orderStatus === status);
    }

    setFilteredOrders(filtered);
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
  <div className="w-full flex flex-col justify-between items-center mb-6">
  <h1 className="text-xl font-semibold text-gray-100 mb-4">Order List</h1>

  <div className="w-full flex flex-col md:flex-row items-center gap-4">
    {/* Search Input - Full Width */}
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search orders..."
        className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>

    {/* Status Filter */}
    <Select
      value={statusFilter}
      onChange={handleStatusFilter}
      displayEmpty
      className="bg-gray-100 text-gray-800 rounded-lg w-full md:w-auto"
    >
      <MenuItem value="">All Statuses</MenuItem>
      <MenuItem value="pending">Pending</MenuItem>
      <MenuItem value="shipped">Shipped</MenuItem>
      <MenuItem value="delivered">Delivered</MenuItem>
      <MenuItem value="cancelled">Cancelled</MenuItem>
    </Select>
  </div>
</div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide divide-gray-700">
            {filteredOrders.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.customerEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.finalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.orderStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(order.orderDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleOpenModal(order)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <motion.div
          className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DialogTitle className="text-2xl font-semibold text-gray-800 mb-4">
            Order Details
          </DialogTitle>
          <DialogContent className="bg-white p-6">
            {selectedOrder?.products?.length > 0 ? (
              selectedOrder.products.map((product, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                  <Typography variant="body1" className="text-gray-800">
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Color: {product.selectedColor}
                  </Typography>
                  {product.selectedSize && (
                    <Typography variant="body2" color="textSecondary">
                      Size: {product.selectedSize}
                    </Typography>
                  )}
                  <Typography variant="body2" className="text-gray-800">
                    Qty: {product.quantity}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No products available for this order.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary" variant="contained">
              Close
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>
    </motion.div>
  );
};

export default OrdersTable;
