import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";
import { TextField, MenuItem, Button } from "@mui/material";
import citiesByProvince from "../../../customer/components/Checkout/citiesByProvince";
const provinces = [
  "Punjab",
  "Sindh",
  "Balochistan",
  "Khyber Pakhtunkhwa",
  "Gilgit_Baltistan",
  "Azad_Kashmir",
  "Islamabad"
];

const ShippingPriceControl = () => {
  const [province, setProvince] = useState("Punjab");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [shippingPrices, setShippingPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const backendUrl = import.meta.env.BACKEND_URL
  useEffect(() => {
    const fetchShippingPrices = async () => {
      try {
        const response = await fetch(`${backendUrl}/admin/shipping-prices`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setShippingPrices(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShippingPrices();
  }, []);

  const handleSave = async () => {
    if (price < 0) {
      toast.error("Price cannot be negative.");
      return;
    }

    const isDuplicate = shippingPrices.some(
      (p) => p.city.toLowerCase() === city.toLowerCase() && p.province === province && p._id !== editingId
    );

    if (isDuplicate) {
      toast.error("Shipping price for this city already exists.");
      return;
    }

    const url = editingId
      ? `${backendUrl}/admin/shipping-prices/${editingId}`
      : `${backendUrl}/admin/shipping-prices`;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ province, city, price }),
      });

      if (!response.ok) throw new Error("Server error");
      const updated = await response.json();
      setShippingPrices(updated);
      toast.success(`Shipping Price ${editingId ? "Updated" : "Added"} Successfully`);

      setCity("");
      setPrice("");
      setEditingId(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to ${editingId ? "Update" : "Add"} Shipping Price`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this price?")) {
      try {
        const response = await fetch(`http://localhost:5000/admin/shipping-prices/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete");
        setShippingPrices((prev) => prev.filter((price) => price._id !== id));
        toast.success("Shipping Price Deleted Successfully");
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to Delete Price");
      }
    }
  };

  const handleEdit = (price) => {
    setProvince(price.province);
    setCity(price.city);
    setPrice(price.price);
    setEditingId(price._id);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
    <div className="mb-6">
  <h2 className="text-xl font-bold text-gray-100 mb-10">Shipping Price Control</h2>
  <div className="grid grid-cols-3 gap-4 mt-4">
  <TextField
  select
  label="Province"
  value={province}
  onChange={(e) => setProvince(e.target.value)}
  fullWidth
  variant="outlined"
  sx={{
    "& .MuiInputBase-root": {
      backgroundColor: "#1f2937",
      color: "#e5e7eb", // Light gray text
    },
    "& .MuiInputLabel-root": {
      color: "#9ca3af", // Gray label color
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4b5563", // Border color
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6b7280",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6",
    },
  }}
  menuprops={{
    PaperProps: {
      sx: {
        backgroundColor: "#000", // Dropdown background color black
        "& .MuiMenuItem-root": {
          color: "#fff", // White text
          "&:hover": {
            backgroundColor: "#10B981", // Green hover background
            color: "#fff", // White text on hover
          },
        },
      },
    },
  }}
>
  {provinces.map((prov) => (
    <MenuItem key={prov} value={prov}>
      {prov}
    </MenuItem>
  ))}
</TextField>

<TextField
  select
  label="City"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  fullWidth
  variant="outlined"
  sx={{
    "& .MuiInputBase-root": {
      backgroundColor: "#1f2937",
      color: "#e5e7eb", // Light gray text
    },
    "& .MuiInputLabel-root": {
      color: "#9ca3af", // Gray label color
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4b5563", // Border color
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6b7280",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3b82f6",
    },
  }}
  menuprops={{
    PaperProps: {
      sx: {
        backgroundColor: "#000", // Dropdown background color black
        "& .MuiMenuItem-root": {
          color: "#fff", // White text
          "&:hover": {
            backgroundColor: "#10B981", // Green hover background
            color: "#fff", // White text on hover
          },
        },
      },
    },
  }}
>
  {citiesByProvince[province]?.map((city) => (
    <MenuItem key={city} value={city}>
      {city}
    </MenuItem>
  ))}
</TextField>



  <TextField
    label="Price"
    type="number"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    fullWidth
    variant="outlined"
    sx={{
      "& .MuiInputBase-root": {
        backgroundColor: "#1f2937",
        color: "#e5e7eb",
      },
      "& .MuiInputLabel-root": {
        color: "#9ca3af",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#4b5563",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#6b7280",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#3b82f6",
      },
    }}
  />

  <Button variant="contained" color="primary" onClick={handleSave} className="col-span-3">
    <span className="text-white">{editingId ? "Update" : "Save"}</span>
  </Button>
</div>

</div>


      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search city..."
          className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Province</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {shippingPrices
              .filter((p) => p.city.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((price) => (
                <motion.tr
                  key={price._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className=" transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{price.province}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{price.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{price.price} PKR</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2" onClick={() => handleEdit(price)}>
                      <Edit size={18} />
                    </button>
                    <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(price._id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ShippingPriceControl;
