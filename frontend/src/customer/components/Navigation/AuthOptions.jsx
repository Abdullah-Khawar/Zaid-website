import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileDropdown from "./ProfileDropDown";

export default function AuthOptions() {
  const loggedInUser = useSelector((state) => state.user.loggedInUser);

console.log("USER ",loggedInUser);

  return (
    loggedInUser ? (
      <ProfileDropdown />
  ) : ( // Show login and signup links when user is not logged in 
    <div className="hidden lg:flex lg:items-center lg:justify-end lg:space-x-6">
    <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-800">
      Sign in
    </Link>
    <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
    <Link to="/signup" className="text-sm font-medium text-gray-700 hover:text-gray-800">
      Create account
    </Link>
  </div>
  )
  );
}
