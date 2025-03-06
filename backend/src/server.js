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

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://zefton-git-main-abdullah-s-projects-37f00909.vercel.app", // Add Vercel preview domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy does not allow this origin!"));
      }
    },
    credentials: true,
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

// Replace the GET '/' test endpoint with a health check endpoint to avoid conflicts
app.get('/health', (req, res) => {
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



