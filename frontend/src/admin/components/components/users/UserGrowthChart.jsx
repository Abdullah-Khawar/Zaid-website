import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { getUserGrowthByYearAndMonth } from "./getUserGrowthByYearAndMonth";

const UserGrowthChart = () => {
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        const fetchUserGrowthData = async () => {
            try {
                const response = await fetch(`${backendUrl}/admin/getUsers`);
                const users = await response.json();
                const formattedData = getUserGrowthByYearAndMonth(users);
                setUserGrowthData(formattedData);
                setSelectedYear(formattedData[0]?.year || "");
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserGrowthData();
    }, []);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const currentYearData = userGrowthData.find(data => data.year === selectedYear)?.months || [];

    if (loading) {
        return <p className='text-white'>Loading...</p>;
    }

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-gray-100'>User Growth</h2>
                <select
                    className='bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={selectedYear}
                    onChange={handleYearChange}
                >
                    {userGrowthData.map(data => (
                        <option key={data.year} value={data.year}>{data.year}</option>
                    ))}
                </select>
            </div>

            <div className='h-[320px]'>
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={currentYearData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='month' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Line
                            type='monotone'
                            dataKey='users'
                            stroke='#8B5CF6'
                            strokeWidth={2}
                            dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default UserGrowthChart;
