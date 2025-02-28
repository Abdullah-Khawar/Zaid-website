import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder, 
    getDailyOrders,
    getOrderStatusDistribution,
    getOrderStats,
    getSalesSummary,
    getMonthlySalesTrend,
    getSalesByCategory
} from '../../controllers/Products/order.controller.js';
import { checkRole } from "../../middlewares/auth.middleware.js";
const router = express.Router();



router.get("/sales-by-category", getSalesByCategory);
router.get('/daily-sales-trend',getMonthlySalesTrend);
router.get("/sales-summary" , getSalesSummary);
router.get("/stats", getOrderStats);
// Get daily orders
router.get("/daily", getDailyOrders);
router.get("/order-status-distribution", getOrderStatusDistribution);

// Create a new order
router.post("/", createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get order by ID
router.get("/:id", getOrderById);

// Update order status
router.patch("/:id", updateOrderStatus);

// Delete order
router.delete("/:id", deleteOrder);




export default router;
