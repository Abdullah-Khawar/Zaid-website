import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation/Navigation";
import Footer from "./Footer/Footer";


function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
