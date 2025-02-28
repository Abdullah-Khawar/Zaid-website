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
    origin: "http://localhost:5173", // Allow frontend to communicate
    credentials: true, // Allow cookies & authentication headers
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use("/uploads", express.static("public"));
app.use('/admin', adminRoutes);
app.use('/', userRoutes);
app.use("/orders", orderRoutes);


const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});