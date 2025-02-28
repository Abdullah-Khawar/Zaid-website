import { useEffect, useState } from "react";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";  // Importing react-toastify

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable"; 
import UserGrowthChart from "../components/users/UserGrowthChart";

const UsersPage = () => {
  const [userList, setUserList] = useState([]);
  // const API_URL = "http://localhost:5000/admin/getUsers"; 
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
        toast.error("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  // Calculate user statistics
  const totalUsers = userList.length;
  const newUsersToday = userList.filter(user => {
    const today = new Date();
    const userCreatedAt = new Date(user.createdAt);
    return (
      userCreatedAt.getDate() === today.getDate() &&
      userCreatedAt.getMonth() === today.getMonth() &&
      userCreatedAt.getFullYear() === today.getFullYear()
    );
  }).length;

  const activeUsers = userList.filter(user => {
    const lastLogin = new Date(user.lastLogin);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return lastLogin >= oneMonthAgo;
  }).length;

  const churnedUsers = userList.filter(user => {
    const lastLogin = new Date(user.lastLogin);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return lastLogin <= threeMonthsAgo;
  }).length;

  const churnRate = (churnedUsers / totalUsers * 100).toFixed(1);

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    const toastId = toast.loading("Are you sure you want to delete this user?", {
      position: "top-center",
      autoClose: false,
    });

    toast.info(
      <div>
        <span>Are you sure?</span>
        <div>
          <button
            onClick={() => handleConfirmDelete(userId, toastId)}
            className="bg-red-500 text-white py-1 px-3 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-500 text-white py-1 px-3 rounded ml-2"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const handleConfirmDelete = async (userId, toastId) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      // Update state after successful deletion
      setUserList(userList.filter(user => user.id !== userId));

      toast.update(toastId, {
        render: "User deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error deleting user",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Users' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name='Total Users'
            icon={UsersIcon}
            value={totalUsers.toLocaleString()}
            color='#6366F1'
          />
        </motion.div>

        {/* Displaying the Users Table */}
        <UsersTable users={userList} onDelete={handleDeleteUser} />

        {/* USER CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-1 gap-6 mt-8'>
          <UserGrowthChart />
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
