import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCustomerOrders } from "../../../../reduxStore/features/orderSlice.jsx";
import { Link } from "react-router-dom";
import { orderHistoryData } from "../../Cart/orderHistoryData.jsx";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function OrderHistoryPage() {
  const dispatch = useDispatch();

  // Accessing the customer orders from the Redux store
  const customerOrderHistory = useSelector(
    (state) => state.orders.customerOrders
  );

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState("all"); // Default filter is 'all'

  // Only dispatch the order data if it's not already in the store
  useEffect(() => {
    if (customerOrderHistory.length === 0) {
      dispatch(setCustomerOrders(orderHistoryData)); // Dispatch customer orders to Redux store if no orders in state
    }
  }, [dispatch, customerOrderHistory.length]); // Only dispatch if there are no orders in the store

  // Filter orders based on the selected filter
  const filteredOrders = customerOrderHistory.flatMap((user) =>
    user.orders.filter((order) => {
      if (orderFilter === "all") return true;
      return order.orderStatus.toLowerCase() === orderFilter.toLowerCase();
    })
  );

  // Cancel Order Function
  const handleCancelOrder = (orderId) => {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to cancel this order?</p>
        <div className="flex justify-center gap-4 mt-2">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
            onClick={() => confirmCancelOrder(orderId, toastId)}
          >
            Yes
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            onClick={() => toast.dismiss(toastId)}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const confirmCancelOrder = (orderId, toastId) => {
    toast.dismiss(toastId);
    
    const updatedOrders = customerOrderHistory.map((user) => ({
      ...user,
      orders: user.orders.map((order) =>
        order.orderId === orderId && order.orderStatus === "Pending"
          ? { ...order, orderStatus: "cancelled" }
          : order
      ),
    }));

    dispatch(setCustomerOrders(updatedOrders)); // Update Redux store
    toast.success("Order has been cancelled successfully.");
  };



  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Order History
        </h2>


        {/* Filter Buttons */}
        <div className="mb-4 flex flex-wrap gap-4">
          <button
            onClick={() => setOrderFilter("all")}
            className={`cursor-pointer ${
              orderFilter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-md transition-colors hover:bg-indigo-500`}
          >
            All Orders
          </button>
          <button
            onClick={() => setOrderFilter("pending")}
            className={`cursor-pointer ${
              orderFilter === "pending"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-md transition-colors hover:bg-indigo-500`}
          >
            Pending Orders
          </button>
          <button
            onClick={() => setOrderFilter("delivered")}
            className={`cursor-pointer ${
              orderFilter === "delivered"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-md transition-colors hover:bg-indigo-500`}
          >
            Delivered Orders
          </button>
          <button
            onClick={() => setOrderFilter("cancelled")}
            className={`cursor-pointer ${
              orderFilter === "cancelled"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-md transition-colors hover:bg-indigo-500`}
          >
            Cancelled Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Total Amount</th>
                <th className="p-4 text-left">Order Date</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderId} className="border-t border-gray-200">
                    <td className="p-4 text-gray-900 font-medium">{order.orderId}</td>
                    <td className="p-4 text-indigo-600 font-medium">{order.orderStatus}</td>
                    <td className="p-4 text-gray-900 font-semibold">{order.totalAmount}</td>
                    <td className="p-4 text-gray-500">{order.orderDate}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
                      >
                        View Details
                      </button>
                      {order.orderStatus === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Order Details - {selectedOrder?.orderId}
            </h3>

            <div className="space-y-4">
              {selectedOrder?.products.map((item) => (
                <div
                  key={item.productId}
                  className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 md:p-6"
                >
                  <div className="flex items-center justify-between space-x-6">
                    <Link to={`/products/${item.productId}`} target="_blank" rel="noopener noreferrer">
                      <img
                        className="h-20 w-20 rounded-md object-cover hidden md:block"
                        src={item.colors.find((color) => color.name === item.selectedColor)?.imageSrc}
                        alt={item.productName}
                      />
                    </Link>

                    <div className="flex-1 space-y-2">
                      <p className="text-base font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                    </div>

                    <p className="text-sm font-semibold text-gray-900">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="cursor-pointer bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-green-500"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
