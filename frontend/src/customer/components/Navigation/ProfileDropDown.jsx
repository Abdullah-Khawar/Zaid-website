import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useDispatch } from "react-redux";
import { logout } from "../../../reduxStore/features/userSlice";
import {
  PowerIcon,
  UserIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";


export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const backendUrl = import.meta.env.BACKEND_URL
  
  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/auth/logout`, { method: "POST", credentials: "include" });
      dispatch(logout()); // Dispatch Redux logout action
      navigate("/"); // Correct way to redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="cursor-pointer flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
        <UserIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
      </MenuButton>

      <MenuItems className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none">
        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <Link
                to="/userProfile"
                className={`flex items-center px-4 py-2 text-sm text-gray-700 ${
                  active ? "bg-gray-100" : ""
                }`}
              >
                <UserIcon className="w-5 h-5 mr-2 text-gray-500" />
                View Profile
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <Link
                to="/orderHistory"
                className={`flex items-center px-4 py-2 text-sm text-gray-700 ${
                  active ? "bg-gray-100" : ""
                }`}
              >
                <ClipboardDocumentListIcon className="size-6" />
                Order History
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`w-full text-left flex items-center px-4 py-2 cursor-pointer text-sm text-gray-700 ${
                  active ? "bg-gray-100" : ""
                }`}
              >
                <PowerIcon className="size-6" />
                Logout
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
