import jwt from "jsonwebtoken";
import User from "../../models/user.models.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/sendEmail.util.js";
import crypto from "crypto"; // Add this line
import { validationResult } from "express-validator";

dotenv.config();

// Generate JWT Token
export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const googleAuthSuccess = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Google authentication failed" });
  }

  if (!req.user.email) {
    return res.status(400).json({ message: "Google account does not provide an email" });
  }

  // ✅ Remove the duplicate check for existing user!

  const token = generateToken(req.user);
  res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });

  // Redirect to frontend after successful login
  res.redirect("http://localhost:5173");
};


export const logout = (req, res, next) => {
  // Clear the authentication token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,  // Ensure this is `false` in development if using HTTP instead of HTTPS
    sameSite: 'Strict'
  });

  // Passport logout (requires callback)
  req.logout((err) => {
    if (err) {
      return next(err); // Pass error to Express error handler
    }
    
    // Destroy session if using session-based authentication
    req.session?.destroy((sessionErr) => {
      if (sessionErr) {
        return next(sessionErr);
      }

      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};


export const signUp = async (req, res) => {
    try {
      const { fullName, email, password, gender, phone } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists!" });
      }
  
      // ❌ Don't hash the password manually
      const newUser = new User({
        name: fullName,
        email,
        password,  // Just pass plain password, schema will hash it
        gender,
        phone
      });
  
      console.log(newUser); // Debugging: check the raw password before saving
  
      await newUser.save();
      res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error. Try again later." });
    }
  };
  

  export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000, // 1-day expiry
        });

        res.json({ user });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found:", user.email);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log("before updating password:", user.password);
        user.password = hashedPassword;
        console.log("after updating password:", user.password);

        console.log("========================");

        console.log("Password updated for user:", hashedPassword);

        console.log("Password updated for user:", user.email);

        user.password = hashedPassword;

        // Clear reset fields
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        
        // Save the updated user
        console.log("before saving user:", user);
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const verifyResetCode = async (req, res) => {
    const { email, resetCode } = req.body;

    if (!email || !resetCode) {
        return res.status(400).json({ error: "Email and reset code are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    if (!user.resetPasswordCode || Date.now() > user.resetPasswordExpires) {
        return res.status(400).json({ error: "Reset code expired. Request a new one." });
    }

    if (user.resetPasswordCode !== resetCode) {
        return res.status(400).json({ error: "Invalid reset code. Please try again." });
    }

    res.status(200).json({ message: "Code verified. Redirecting to reset password page." });
};



export const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate a 6-character alphanumeric reset code
        const resetCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // Example: "A9B3C7"

        // Store the reset code in the user record (without hashing)
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Code valid for 10 minutes
        await user.save();

        // const confirmPage = process.env.CLIENT_URL;
        // Email message
        const message = `Your password reset code is: ${resetCode}`;
        const htmlMessage = `<p>Your password reset code is: <strong>${resetCode}</strong></p>`;

        // Send the email
        await sendEmail(user.email, "Password Reset Code", message, htmlMessage);

        res.status(200).json({ message: "Reset code sent to email" });

    } catch (error) {
        console.error("Error in resetPasswordRequest:", error.message);

        res.status(500).json({ error: "Internal Server Error. Please try again." });
    }
};


export const getUserProfile =  async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
