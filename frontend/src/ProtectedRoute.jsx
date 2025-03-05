import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { User } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.loggedInUser);
  console.log("USer from protected routes", user)
  if (!user) {
    console.log("Returning USer from protected routes", user)
    return <Navigate to="/login" replace />;
  }

  return children;
};


export default ProtectedRoute;
