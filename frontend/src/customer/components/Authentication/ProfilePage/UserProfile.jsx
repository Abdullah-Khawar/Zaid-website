import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null); // Initially null
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/profile`, {
          credentials: "include", // Ensures cookies (token) are sent
        });
  
        if (response.status === 401) {
          // User is not logged in, set user to null and prevent error
          setUser(null);
          return;
        }
  
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
  
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDetails();
  }, []);
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Save changes to backend
  const saveChanges = async () => {
    try {
      const response = await fetch(`${backendUrl}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Failed to update user");

      console.log("User updated successfully");
      setIsEditing(false);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Render profile picture or first letter
  const renderProfilePicture = () => {
    if (user?.profilePicture) {
      return (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-36 h-36 rounded-full border-4 border-blue-500 mx-auto mb-4"
        />
      );
    } else {
      return (
        <div className="w-36 h-36 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl mx-auto mb-4">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      );
    }
  };

  // Show loading or error messagesif (loading) return <div className="text-white text-center">Loading...</div>;

if (!user) {
  return (
    <div className="text-center text-white">
      <h2>You are not logged in</h2>
       </div>
  );
}

  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white py-6">
      <div className="w-full sm:max-w-md lg:max-w-2xl bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          {renderProfilePicture()}
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="w-3/4 p-2 bg-gray-700 text-white border border-blue-500 rounded-md mb-2"
            />
          ) : (
            <h1 className="text-xl">{user.name}</h1>
          )}
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Gender:</span>
            {isEditing ? (
              <select
                name="gender"
                value={user.gender}
                onChange={handleInputChange}
                className="bg-gray-700 text-white border border-blue-500 rounded-md p-2 w-2/3"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            ) : (
              <span>{user.gender}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Phone:</span>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                className="bg-gray-700 text-white border border-blue-500 rounded-md p-2 w-2/3"
              />
            ) : (
              <span>{user.phone}</span>
            )}
          </div>
          <div className="flex justify-between items-center space-x-7">
            <span className="font-semibold">Address:</span>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleInputChange}
                className="bg-gray-700 text-white border border-blue-500 rounded-md p-2 w-2/3"
              />
            ) : (
              <span>{user.address}</span>
            )}
          </div>
        </div>
        <div className="mt-6 text-center">
          {isEditing ? (
            <button
              onClick={saveChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
