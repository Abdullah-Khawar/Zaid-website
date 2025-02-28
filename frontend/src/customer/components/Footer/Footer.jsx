import React from "react";
import { Grid2, IconButton } from "@mui/material";
import { Facebook, Instagram, LinkedIn, X as XIcon } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Grid2 container rowSpacing={10} columnSpacing={22}>
          {/* Logo Section */}
          <Grid2 xs={12} md={2}>
            <div className="flex justify-center md:justify-start">
              <img src="logo.png" alt="Brand Logo" className="h-12" />
            </div>
          </Grid2>

          {/* Solutions Section */}
          <Grid2 xs={12} md={2}>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Marketing</li>
              <li className="hover:text-white cursor-pointer">Analytics</li>
              <li className="hover:text-white cursor-pointer">Automation</li>
              <li className="hover:text-white cursor-pointer">Commerce</li>
              <li className="hover:text-white cursor-pointer">Insights</li>
            </ul>
          </Grid2>

          {/* Support Section */}
          <Grid2 xs={12} md={2}>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Submit ticket</li>
              <li className="hover:text-white cursor-pointer">Documentation</li>
              <li className="hover:text-white cursor-pointer">Guides</li>
            </ul>
          </Grid2>

          {/* Company Section */}
          <Grid2 xs={12} md={2}>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Jobs</li>
              <li className="hover:text-white cursor-pointer">Press</li>
            </ul>
          </Grid2>

          {/* Legal Section */}
          <Grid2 xs={12} md={2}>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Terms of service</li>
              <li className="hover:text-white cursor-pointer">Privacy policy</li>
              <li className="hover:text-white cursor-pointer">License</li>
            </ul>
          </Grid2>
        </Grid2>

        {/* Social Media Section */}
        <div className="mt-8 flex justify-center space-x-4">
          <IconButton href="#" color="inherit" aria-label="Facebook">
            <Facebook fontSize="large" />
          </IconButton>
          <IconButton href="#" color="inherit" aria-label="Instagram">
            <Instagram fontSize="large" />
          </IconButton>
          {/* X (Twitter) Logo */}
          <IconButton href="https://x.com" color="inherit" aria-label="X">
            <XIcon fontSize="large" />
          </IconButton>
          <IconButton href="#" color="inherit" aria-label="LinkedIn">
            <LinkedIn fontSize="large" />
          </IconButton>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-center items-center">
          <p className="text-sm">© 2025 ZFSTUDIO. All rights reserved.</p>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8">
          <h3 className="text-white font-semibold">Subscribe to our newsletter</h3>
          <p className="text-sm">The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className="mt-4 flex flex-col md:flex-row justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full  px-4 py-2 rounded-l-md bg-gray-800 text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button className="mt-4 md:mt-0 md:ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-500">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
