import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

const UsersTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL



    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${backendUrl}/admin/getUsers`);
            if (!response.ok) {
                throw new Error("Failed to fetch users data");
            }
            const users = await response.json();
            setAllUsers(users);
            sortUsers(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users.");
        }
    };

    const sortUsers = (usersList) => {
        const sortedUsers = [...usersList].sort((a, b) => {
            if (a.role === "admin") return -1;
            if (b.role === "admin") return 1;
            return 0;
        });
        setFilteredUsers(sortedUsers);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = allUsers.filter(
            (user) =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
        );

        sortUsers(filtered);
    };

    const handleDelete = (userId) => {
        const userToDelete = allUsers.find(user => user._id === userId);

        if (userToDelete.role === "admin") {
            toast.warning("Admin user cannot be deleted!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        const toastId = toast.info(
            <div>
                <span>Are you sure you want to delete this user?</span>
                <div className="mt-2">
                    <button
                        className="bg-red-500 text-white py-1 px-3 rounded mr-2"
                        onClick={() => confirmDelete(userId, toastId)}
                    >
                        Yes
                    </button>
                    <button
                        className="bg-gray-500 text-white py-1 px-3 rounded"
                        onClick={() => toast.dismiss(toastId)}
                    >
                        No
                    </button>
                </div>
            </div>,
            { position: "top-right", autoClose: false }
        );
    };

    const confirmDelete = async (userId, toastId) => {
        try {
            const response = await fetch(`${backendUrl}/admin/getUsers/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            const updatedUsers = allUsers.filter((user) => user._id !== userId);
            setAllUsers(updatedUsers);
            sortUsers(updatedUsers);

            toast.update(toastId, {
                render: "User deleted successfully!",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.error("Error deleting user.");
            console.error("Delete error:", error);
        }
    };

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Users</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {filteredUsers.map((user) => (
                            <motion.tr
                                key={user._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-100">{user.name}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">{user.email}</div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === "admin" ? "bg-yellow-800 text-yellow-100" : "bg-blue-800 text-blue-100"
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <button
                                        className="text-red-400 hover:text-red-300"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default UsersTable;
