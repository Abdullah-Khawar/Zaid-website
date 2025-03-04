import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/mongoDB.js';
import adminRoutes from './routers/ProductsRoutes/AdminProduct.router.js';
import userRoutes from  './routers/ProductsRoutes/UserProduct.router.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routers/Users/auth.router.js';
import orderRoutes from './routers/ProductsRoutes/order.route.js';

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend domain
    credentials: true, // Allow cookies & authentication headers
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRoutes);
// Routes
app.use('/auth', authRoutes);
// app.use("/uploads", express.static("public"));
app.use('/admin', adminRoutes);
app.use("/orders", orderRoutes);

// Add a test endpoint for GET /
app.get('/', (req, res) => {
  res.send('Server is up and running');
});

// Add error-handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

connectDB();

// Export app for Vercel
export default app;