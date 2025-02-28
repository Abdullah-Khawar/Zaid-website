import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import Header from "../components/common/Header";
import { Select, MenuItem, IconButton } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendUrl from "../../../assets/assets"

const colorOptions = [
  "red",
  "blue",
  "green",
  "black",
  "White",
  "gray",
  "yellow",
  "pink",
  "purple",
  "orange",
  "brown",
  "beige",
  "teal",
  "navy",
  "maroon",
  "lightBlue",
  "lightGreen",
  "olive",
  "turquoise",
  "coral",
];

const AddProduct = ({ handleClose }) => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    discountedPrice: "",
    category: "",
    subCategory: "",
    description: "",
    colors: [],
    productInfo: [
      { category: "Features", items: [] },
      { category: "Care", items: [] },
      { category: "Return Policy", items: [] },
    ],
  });

  const sizes = ["XS", "S", "M", "L", "XL"];

  const [color, setColor] = useState({
    name: "",
    sizes: {},
    imageFiles: [],
    stock: 0,
  });
  const [error, setError] = useState(""); 

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleColorChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFiles") {
      setColor((prevColor) => ({
        ...prevColor,
        [name]: [...prevColor.imageFiles, ...Array.from(files)],
      }));
    } else {
      setColor((prevColor) => ({ ...prevColor, [name]: value }));
    }
  };

  useEffect(() => {
    return () => {
      color.imageFiles.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [color.imageFiles]);

  const addColor = () => {
    // Check if there are images uploaded
    if (color.imageFiles.length === 0) {
      toast.error("Please upload at least one image for the color.");
      return;
    }

    // Validate stock logic based on the category
    let updatedColor;

    if (product.category === "Clothes") {
      // Validate sizes stock
      const isValidStock = Object.values(color.sizes).every(stock => stock > 0);
      if (!isValidStock) {
        alert("Please make sure all sizes have a valid stock amount.");
        return;
      }

      updatedColor = {
        ...color,
        sizes: color.sizes, // Include sizes if it's a clothing item
        imageAlts: color.imageFiles.map((file) => file.name), // Assuming `file.name` as the alt text for the image
        imageSrc: color.imageFiles.map((file) => URL.createObjectURL(file)), // Create image preview URLs
      };
    } else {
      // If not clothing, only handle stock for color
      if (parseInt(color.stock) <= 0) {
        alert("Please enter a valid stock amount.");
        return;
      }

      updatedColor = {
        ...color,
        sizes: {}, // No sizes needed for non-clothing items
        stock: parseInt(color.stock), // Only stock for non-clothing items
        imageAlts: color.imageFiles.map((file) => file.name), // Assuming `file.name` as the alt text for the image
        imageSrc: color.imageFiles.map((file) => URL.createObjectURL(file)), // Create image preview URLs
      };
    }

    // Add the new color to the product colors array
    setProduct((prevProduct) => ({
      ...prevProduct,
      colors: [...prevProduct.colors, updatedColor], // Ensure this array is updated
    }));

    // Reset the color form state for adding another color
    setColor({
      name: "",
      sizes: product.category === "Clothes" ? {} : undefined, // Only reset sizes if it's a clothing item
      imageFiles: [],
      stock: 0, // Reset stock
    });
  };

  const handleProductInfoChange = (categoryIndex, itemIndex, value) => {
    const updatedProductInfo = [...product.productInfo];
    updatedProductInfo[categoryIndex].items[itemIndex] = value;
    setProduct({ ...product, productInfo: updatedProductInfo });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (
      !product.name ||
      !product.price ||
      !product.category ||
      !product.subCategory ||
      !product.description
    ) {
      setError("Please fill in all required fields.");
      return;
    }
  
    const formData = new FormData();
    console.log("form data",formData)
  
    // Loop through colors and append images to formData
    for (let color of product.colors) {
      for (let i = 0; i < color.imageFiles.length; i++) {
        const file = color.imageFiles[i];
        const imageAlt = color.imageAlts[i];
  
        // Append image file to formData
        formData.append(`color[${color.name}]_image_${i}`, file); // File itself
        formData.append(`color[${color.name}]_imageAlt_${i}`, imageAlt);
      }
    }
  
    // Prepare the product data (excluding image files) as JSON
    const productData = {
      name: product.name,
      price: product.price,
      discountedPrice: product.discountedPrice,
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      colors: product.colors.map((color) => ({
        name: color.name, ...(product.category === "Clothes"
          ? { sizes: color.sizes || {} } // Ensure sizes exist for Clothing
          : { stock: color.stock || 0 } // Ensure stock exists for other categories
        ),
        images: color.imageFiles.map((file, index) => ({
          // Don't use `URL.createObjectURL` anymore, we'll get Cloudinary URLs on the backend
          src: "",  // This will be filled in by Cloudinary on the backend
          alt: color.imageAlts[index],  // Store alt text as well
        })),
      })),
      productInfo: product.productInfo,
    };
  
    console.log("product data", productData);
    // Append the rest of the product data as JSON to formData
    formData.append("productData", JSON.stringify(productData));
  
    try {
      const response = await fetch(`${backendUrl}/admin/add-products`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
  
      const result = await response.json();
      console.log("✅ Product added successfully:", result);
  
      // Reset form and close modal
      setProduct({
        name: "",
        price: "",
        discountedPrice: "",
        category: "",
        subCategory: "",
        description: "",
        colors: [],
        productInfo: [
          { category: "Features", items: [] },
          { category: "Care", items: [] },
          { category: "Return Policy", items: [] },
        ],
      });
  
      // handleClose();  // Uncomment if modal should close
  
    } catch (error) {
      console.error("❌ Error adding product:", error);
      setError("There was an error adding the product.");
    }
  };
  
  
  

  const categorySubcategories = {
    Clothes: [
      "Men-Stitched",
      "Men-Unstitched",
      "Women-Stitched",
      "Women-Unstitched",
    ],
    Accessories: ["Women-Purses"],
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedCategory,
      subCategory: "", // Reset subCategory when category changes
    }));
    setColor((prevColor) => ({
      ...prevColor,
      sizes: selectedCategory === "Clothes" ? {} : undefined,
    }));
  };

  const handleSizeStockChange = (size, value) => {
    const stockValue = parseInt(value, 10);

    setColor((prevColor) => {
      const updatedSizes = { ...prevColor.sizes };

      if (!stockValue || stockValue <= 0) {
        delete updatedSizes[size]; // Remove size if stock is empty or 0
      } else {
        updatedSizes[size] = stockValue; // Otherwise, update stock
      }

      return { ...prevColor, sizes: updatedSizes };
    });
  };

  const handleSubCategoryChange = (e) => {
    setProduct({ ...product, subCategory: e.target.value });
  };
  const handleColorImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast.error("Only image files are allowed.");
      return;
    }
    setColor({
      ...color,
      imageFiles: [...color.imageFiles, ...validFiles],
    });
  };
  
  

  const removeImage = (index) => {
    const updatedImages = [...color.imageFiles];
    updatedImages.splice(index, 1); // Remove the image at the given index
    setColor((prevColor) => ({
      ...prevColor,
      imageFiles: updatedImages, // Update the imageFiles array
    }));
  };

  return (
    <div className="flex-1 items-center justify-center overflow-auto relative z-10">
      <Header title="Add Product" />

      {/* FORM SECTION */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-1 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit}>
          {/* PRODUCT DETAILS SECTION */}
          <div className="bg-primary-900 text-white-200 p-6 w-full rounded-lg shadow-md flex-1 items-center justify-center overflow-auto relative z-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
              <Tag className="w-5 h-5 text-white" /> Product Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-100">
                  Product Name
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                  type="text"
                  placeholder="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-100">
                  Product Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                  placeholder="Product Description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-100">
                    Category
                  </label>
                  <select
                    className="w-full bg-gray-800 text-white px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="category"
                    value={product.category}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="" disabled className="text-gray-500">
                      Select Category
                    </option>
                    <option value="Clothes">Clothes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-100">
                    Subcategory
                  </label>
                  <select
                    className="w-full bg-gray-800 text-white px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="subCategory"
                    value={product.subCategory}
                    onChange={handleSubCategoryChange}
                    required
                  >
                    <option value="" disabled className="hover:bg-black">
                      Select Subcategory
                    </option>
                    {(categorySubcategories[product.category] || []).map(
                      (subCat) => (
                        <option key={subCat} value={subCat}>
                          {subCat}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100">
                  Price
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                  type="number"
                  placeholder="Product Price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-100">
                  Discounted Price
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                  type="number"
                  placeholder="Discounted Price"
                  name="discountedPrice"
                  value={product.discountedPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="border p-4">
                <h3>Add Colors</h3>

                {/* Color Selection */}
                <Select
                  fullWidth
                  name="name"
                  value={color.name}
                  onChange={handleColorChange}
                  displayEmpty
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-red" // Changed to text-black
                  sx={{
                    color: "gray", // Text color
                    "& .MuiSelect-icon": {
                      color: "gray", // Dropdown arrow color
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a color {/* Placeholder */}
                  </MenuItem>
                  {colorOptions.map((colorOption) => (
                    <MenuItem key={colorOption} value={colorOption}>
                      {colorOption}
                    </MenuItem>
                  ))}
                </Select>

                {/* Stock for non-clothing */}
                {product.category !== "Clothes" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-100">
                      Stock
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                      type="number"
                      name="stock"
                      value={color.stock}
                      onChange={handleColorChange}
                    />
                  </div>
                )}

                {/* Size Stock Section - Only for Clothing Category */}
                {product.category === "Clothes" && (
                  <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Size Stock
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {sizes.map((size) => (
                        <div key={size} className="flex flex-col items-center">
                          <label className="text-sm font-medium text-gray-300">
                            {size}
                          </label>
                          <input
                            type="number"
                            value={color.sizes[size] || ""}
                            onChange={(e) =>
                              handleSizeStockChange(size, e.target.value)
                            }
                            placeholder="Stock"
                            className="w-full text-center bg-gray-900 text-white px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:border-yellow-500 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Upload Section */}
                <label
                  htmlFor="colorImage"
                  className="flex items-center justify-center h-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors mt-2"
                >
                  {color.imageFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {color.imageFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            className="w-24 h-24 object-cover rounded-lg"
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded Preview ${index + 1}`}
                          />
                          <IconButton
                            aria-label="remove"
                            className="absolute top-0 right-0 bg-white text-white"
                            onClick={() => removeImage(index)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">Choose Images</span>
                  )}
                </label>
                <input
                  id="colorImage"
                  type="file"
                  name="images"
                  multiple
                  onChange={handleColorImageChange}
                  hidden
                />

                {/* Add Color Button */}
                <button
                  type="button"
                  onClick={addColor}
                  className="w-full cursor-pointer px-6 py-3 bg-yellow-600 rounded-lg hover:bg-black-500 transition-colors mt-2 text-gray-100"
                >
                  Add Color
                </button>
              </div>

              {product.productInfo.map((info, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {info.category}
                  </h3>
                  {info.items.map((item, itemIndex) => (
                    <input
                      key={itemIndex}
                      type="text"
                      placeholder={`${info.category} Item ${itemIndex + 1}`}
                      value={item}
                      onChange={(e) =>
                        handleProductInfoChange(
                          categoryIndex,
                          itemIndex,
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2 text-gray-100"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedProductInfo = [...product.productInfo];
                      updatedProductInfo[categoryIndex].items.push("");
                      setProduct({
                        ...product,
                        productInfo: updatedProductInfo,
                      });
                    }}
                    className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    + Add {info.category} Item
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <motion.div
            className="mt-6 mb-6 flex justify-center" // Add flex and justify-center for centering
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              type="submit"
              className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-yellow-600 text-black rounded-lg hover:bg-black-700 hover:text-yellow transition-colors"
            >
              Add Product
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;
