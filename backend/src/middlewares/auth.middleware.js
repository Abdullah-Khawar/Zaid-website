// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from '../models/user.models.js';
import bcrypt from "bcrypt";

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, invalid token" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Ensure token is coming from cookies
  
    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({ message: "Unauthorized: No token" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      
      req.user = decoded; // Attach user data to request
      next();
    });
  };
  

export const checkRole = (roles) => {
  return async (req, res, next) => {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
          try {
              token = req.headers.authorization.split(" ")[1];
              const decoded = jwt.verify(token, process.env.JWT_SECRET);
              
              const user = await User.findById(decoded.id);
              if (!user) {
                  return res.status(401).json({ message: "User not found" });
              }

              // Check if user role matches the required role
              if (!roles.includes(user.role)) {
                  return res.status(403).json({ message: "Access denied" });
              }

              req.user = user;
              next();
          } catch (error) {
              return res.status(401).json({ message: "Invalid token" });
          }
      } else {
          return res.status(401).json({ message: "No token provided" });
      }
  };
};



export const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10); // Set a strong password

    const adminUser = new User({
      name: "Admin",
      email: "adminzaid2225@gmail.com",
      password: hashedPassword,
      role: "admin", // Add role field
    });

    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};
