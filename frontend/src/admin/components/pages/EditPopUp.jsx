import {
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  FormHelperText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Save, Cancel, Add, Delete, Edit } from "@mui/icons-material";
import CancelIcon from '@mui/icons-material/Cancel';
import { useState, useEffect } from "react";

const categories = ["Clothes", "Accessories"];
const subCategories = [
  "Men-Stitched",
  "Men-Unstitched",
  "Women-Stitched",
  "Women-Unstitched",
  "Women-Purses",
];

const colorOptions = [
  "Red",
  "Blue",
  "Green",
  "Black",
  "White",
  "Gray",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Beige",
  "Teal",
  "Navy",
  "Maroon",
  "LightBlue",
  "LightGreen",
  "Olive",
  "Turquoise",
  "Coral",
];

const sizes = ["XS", "S", "M", "L", "XL"];

const EditPopUp = ({ open, handleClose, product, setProducts }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [newColor, setNewColor] = useState({
    name: "",
    stock: 0,
    imageFiles: [],
    sizes: {},
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.BACKEND_URL
  
  useEffect(() => {
    setEditedProduct({ ...product });
  }, [product]);

  const handleProductChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const handleProductInfoChange = (categoryIndex, itemIndex, value) => {
    const updatedProductInfo = [...editedProduct.productInfo];
    updatedProductInfo[categoryIndex].items[itemIndex] = value;
    setEditedProduct({ ...editedProduct, productInfo: updatedProductInfo });
  };

  const addProductInfoItem = (categoryIndex) => {
    const updatedProductInfo = [...editedProduct.productInfo];
    updatedProductInfo[categoryIndex].items.push("");
    setEditedProduct({ ...editedProduct, productInfo: updatedProductInfo });
  };

  const handleColorChange = (e) => {
    setNewColor({ ...newColor, [e.target.name]: e.target.value });
  };

  const handleColorImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewColor({
      ...newColor,
      imageFiles: [...newColor.imageFiles, ...files], // Append new files
    });
  };
  const addColor = () => {
    // Check if images are uploaded
    if (newColor.imageFiles.length === 0) {
      alert("Please upload at least one image for the color.");
      return;
    }
  
    let updatedColor;
  
    if (editedProduct.category === "Clothes") {
      // Ensure sizes exist and have valid stock values
      if (!newColor.sizes || Object.keys(newColor.sizes).length === 0) {
        alert("Please enter size-wise stock details.");
        return;
      }
  
      const isValidStock = Object.values(newColor.sizes).every(stock => stock > 0);
      if (!isValidStock) {
        alert("Please make sure all sizes have a valid stock amount.");
        return;
      }
  
      updatedColor = {
        ...newColor,
        stock: undefined, // Remove stock field for clothing items
        images: newColor.imageFiles.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name, // Use file name for alt text
        })),
      };
    } else {
      // For non-clothing items, check if stock is valid
      if (isNaN(newColor.stock) || newColor.stock <= 0) {
        alert("Please enter a valid stock amount.");
        return;
      }
  
      updatedColor = {
        ...newColor,
        sizes: {}, // Remove sizes field for non-clothing items
        stock: parseInt(newColor.stock, 10), // Ensure stock is a valid number
        images: newColor.imageFiles.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name, // Use file name for alt text
        })),
      };
    }
  
    // Update product colors array
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      colors: [...prevProduct.colors, updatedColor],
    }));
  
    // Reset the form state for adding another color
    setNewColor({
      name: "",
      stock: editedProduct.category === "Clothes" ? undefined : 0, // Reset stock only for non-clothing
      sizes: editedProduct.category === "Clothes" ? {} : undefined, // Reset sizes only for clothing
      imageFiles: [],
    });
  };
  


  const handleStockChange = (colorIndex, e, size = null) => {
    const updatedColors = [...editedProduct.colors];
    const color = updatedColors[colorIndex];

    const newValue = Number(e.target.value); // Convert input value to a number

    if (size) {
      // Update the size stock
      color.sizes[size] = isNaN(newValue) ? 0 : newValue; // Set to 0 if not a valid number
    } else {
      // Update the general stock
      color.stock = isNaN(newValue) ? 0 : newValue; // Set to 0 if not a valid number
    }

    setEditedProduct({ ...editedProduct, colors: updatedColors });
  };

  const removeColor = async (colorToRemove) => {
    // Call backend to remove color images
    try {
      await fetch(`${backendUrl}/admin/remove-color-images/${editedProduct._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ colorName: colorToRemove.name }),
      });
    } catch (err) {
      console.error("❌ Error removing color images:", err);
    }
  
    setEditedProduct({
      ...editedProduct,
      colors: editedProduct.colors.filter((c) => c !== colorToRemove),
    });
  };
  
  const handleImageReplace = async (colorIndex, imageIndex, files) => {
    const updatedColors = [...editedProduct.colors];
    const color = updatedColors[colorIndex];
  
    if (files) {
      color.images[imageIndex] = {
        src: URL.createObjectURL(files[0]),
        alt: `Image for ${color.name} - ${imageIndex}`,
      };
    } else {
      // Call backend to remove image
      try {
        await fetch(`${backendUrl}/admin/remove-image/${editedProduct._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: color.images[imageIndex].src }),
        });
      } catch (err) {
        console.error("❌ Error removing image:", err);
      }
  
      color.images.splice(imageIndex, 1); // Remove the image at the specific index
    }
  
    setEditedProduct({ ...editedProduct, colors: updatedColors });
  };

  const removeImage = (index) => {
    const updatedImages = [...newColor.imageFiles];
    updatedImages.splice(index, 1); // Remove the image at the given index
    setNewColor((prevColor) => ({
      ...prevColor,
      imageFiles: updatedImages, // Update the imageFiles array
    }));
  };

  const handleSizeStockChange = (size, value) => {
    const stockValue = parseInt(value, 10);

    setNewColor((prevColor) => {
      const updatedSizes = { ...prevColor.sizes };

      if (!stockValue || stockValue <= 0) {
        delete updatedSizes[size]; // Remove size if stock is empty or 0
      } else {
        updatedSizes[size] = stockValue; // Otherwise, update stock
      }

      return { ...prevColor, sizes: updatedSizes };
    });
  };

  const handleAddNewPhoto = (index, event) => {
    if (!event || !event.target || !event.target.files) {
      console.error("Event is undefined or missing files.");
      return;
    }
  
    const file = event.target.files[0];
    if (file) {
      const newImage = {
        src: URL.createObjectURL(file), // Temporary preview URL
        alt: file.name, // Use file name as alt
      };
  
      // Ensure editedProduct and colors exist
      if (!editedProduct || !editedProduct.colors) {
        console.error("editedProduct or editedProduct.colors is undefined.");
        return;
      }
  
      // Clone colors array
      const updatedColors = [...editedProduct.colors];
  
      // Ensure the color exists
      if (!updatedColors[index]) {
        console.error(`No color found at index ${index}`);
        return;
      }
  
      // Add to images and also store the actual file in imageFiles
      updatedColors[index] = {
        ...updatedColors[index],
        images: [...(updatedColors[index].images || []), newImage],
        imageFiles: [...(updatedColors[index].imageFiles || []), file], // ✅ Store actual file
      };
  
      // Update state
      setEditedProduct((prevProduct) => ({
        ...prevProduct,
        colors: updatedColors,
      }));
    }
  };
  
  
  const handleSave = async () => {
    if (!editedProduct.name || !editedProduct.price || !editedProduct.description) {
      setError("Please fill in all required fields.");
      return;
    }
  
    const formData = new FormData();
  
    for (let color of editedProduct.colors) {
      const imageFiles = color.imageFiles || []; // New images
      const existingImages = color.images || []; // Cloudinary images
  
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
  
        // Append new image files (for Cloudinary upload)
        formData.append(`color[${color.name}]_image_${i}`, file);
      }
    }
  
    // Prepare updated product data
    const updatedProductData = {
      name: editedProduct.name,
      price: editedProduct.price,
      discountedPrice: editedProduct.discountedPrice,
      description: editedProduct.description,
      colors: editedProduct.colors.map((color) => ({
        name: color.name,
        ...(editedProduct.category === "Clothes"
          ? { sizes: color.sizes || {} }
          : { stock: color.stock || 0 }),
        images: (color.images || []).map((image) => ({
          src: image.src.includes("blob") ? "" : image.src, // Keep Cloudinary URLs only
          alt: image.alt || "",
        })),
      })),
      productInfo: editedProduct.productInfo || [],
    };
  
    console.log("Updated product data:", updatedProductData);
    
    formData.append("productData", JSON.stringify(updatedProductData));
  
    setLoading(true);
  
    try {
      const response = await fetch(
        `${backendUrl}/admin/update-products/${editedProduct._id}`,
        {
          method: "PATCH",
          body: formData, // ✅ Send as FormData (Cloudinary will receive new images)
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
  
      const updatedProductResponse = await response.json();
      console.log("✅ Product updated successfully:", updatedProductResponse);
  
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProductResponse._id ? updatedProductResponse : p))
      );
  
      handleClose();
    } catch (err) {
      console.error("❌ Error updating product:", err);
      setError("There was an error updating the product.");
    } finally {
      setLoading(false);
    }
  };
  

  const [newSize, setNewSize] = useState("");
const [newSizeStock, setNewSizeStock] = useState("");

const addNewSize = (colorIndex, size, stock) => {
  if (!size || !stock || stock <= 0) {
    alert("Please select a valid size and enter a valid stock amount.");
    return;
  }

  const updatedColors = [...editedProduct.colors];
  const color = updatedColors[colorIndex];

  color.sizes[size] = parseInt(stock, 10);

  setEditedProduct({ ...editedProduct, colors: updatedColors });
  setNewSize("");
  setNewSizeStock("");
};


  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: "white",
          width: "90vw",
          maxWidth: 1200,
          margin: "auto",
          mt: 5,
          borderRadius: 2,
          overflow: "hidden",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div
          className="form-content"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={editedProduct.name}
            onChange={handleProductChange}
            required
            helperText="Enter the name of the product."
          />
          <TextField
            fullWidth
            type="number"
            label="Price"
            name="price"
            value={editedProduct.price}
            onChange={handleProductChange}
            required
            helperText="Enter the price of the product."
          />
          <TextField
            fullWidth
            type="number"
            label="Discounted Price"
            name="discountedPrice"
            value={editedProduct.discountedPrice}
            onChange={handleProductChange}
            required
            helperText="Enter the discounted price."
          />

          <Select
            fullWidth
            name="category"
            value={editedProduct.category || ""} // Use an empty string or default category value
            onChange={handleProductChange} // Ensure this function is properly updating the state
            disabled // Make the category field read-only
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            name="subCategory"
            value={editedProduct.subCategory}
            onChange={handleProductChange}
            disabled // Make the subCategory field read-only
          >
            {subCategories.map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
          </Select>

          <h3 className="font-bold">Colors</h3>

          <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "60vh",
    overflowY: "auto",
  }}
>
  {editedProduct.colors.map((color, index) => (
    <div
      key={index}
      className="border p-4 mb-4"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridGap: "16px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      {/* Color and stock or size options */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>
          Color: {color.name}
        </span>

        {editedProduct.category === "Clothes" ? (
  // If category is Clothing, show size-based stock inputs
  <>
    <div style={{ fontWeight: "bold" }}>Sizes:</div>
    {Object.keys(color.sizes || {}).map((size) => (
      <div
        key={size}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>{size}: </span>
        <TextField
          type="number"
          value={color.sizes[size] || ""} // If the size is not set, show an empty string
          onChange={(e) => handleStockChange(index, e, size)}
          style={{ width: "80px" }}
          size="small"
        />
      </div>
    ))}
    <div style={{ marginTop: "16px" }}>
      <h4>Add New Size</h4>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Select
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          displayEmpty
          style={{ width: "100px" }}
        >
          <MenuItem value="" disabled>
            Select Size
          </MenuItem>
          {sizes
            .filter((size) => !Object.keys(color.sizes).includes(size))
            .map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
        </Select>
        <TextField
          type="number"
          label="Stock"
          value={newSizeStock}
          onChange={(e) => setNewSizeStock(e.target.value)}
          style={{ width: "80px" }}
          size="small"
        />
        <Button
          onClick={() => addNewSize(index, newSize, newSizeStock)}
          color="primary"
          startIcon={<Add />}
          size="small"
        >
          Add Size
        </Button>
      </div>
    </div>
  </>
) : (
  // For other categories, just show stock input
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <span style={{ fontWeight: "bold" }}>Stock: </span>
    <TextField
      type="number"
      value={color.stock || 0}
      onChange={(e) => handleStockChange(index, e)}
      style={{ width: "80px" }}
      size="small"
    />
  </div>
)}
      </div>

      {/* Image Grid Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(120px, 1fr))",
          gridGap: "16px",
          maxWidth: "100%",
          overflow: "hidden",
          padding: "16px",
        }}
      >
      <span style={{ fontWeight: "bold" }}>Images: </span>
        {color.images &&
          color.images.map((image, imageIndex) => (
         
            <div
              key={imageIndex}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
              }}
            >
             
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "80px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "8px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
               

                {/* Delete Button */}
                <Button
                  onClick={() =>
                    handleImageReplace(index, imageIndex, null)
                  }
                  startIcon={<Delete />}
                  color="error"
                  size="small"
                />
              </div>
            </div>
          ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "16px" }}>
  <input
    type="file"
    onChange={(event) => handleAddNewPhoto(index, event)}
    accept="image/*"
    style={{ display: "none" }}
    id={`color-image-upload-${index}`}
  />
  <label 
    htmlFor={`color-image-upload-${index}`} 
    style={{
      cursor: "pointer",
      color: "#1976D2", // Material-UI primary color
      fontWeight: "bold",
      fontSize: "14px",
      textDecoration: "underline",
    }}
  >
    Add New Photo
  </label>
</div>


      {/* Remove Color Button */}
      <div style={{ marginTop: "16px" }}>
        <Button
          onClick={() => removeColor(color)}
          color="error"
          startIcon={<Delete />}
          size="small"
        >
          Remove Color
        </Button>
      </div>
    </div>
  ))}
</div>

          {/* Dropdown for Color Selection */}
          <Select
            fullWidth
            name="name"
            value={newColor.name}
            onChange={handleColorChange}
          >
            {colorOptions.map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>

          {editedProduct.category === "Clothes" ? (
            <>
              <h4>Sizes</h4>
              {sizes.map((size) => (
                <TextField
                  key={size}
                  type="number"
                  label={size}
                  name={size}
                  value={newColor.sizes[size] || ""}
                  onChange={(e) =>
                    handleSizeStockChange(size, e.target.value)
                  }
                  style={{width: "80px", }}
                  size="small"
                />
              ))}
            </>
          ) : (
            <TextField
              fullWidth
              type="number"
              label="Stock"
              name="stock"
              value={newColor.stock}
              onChange={handleColorChange}
              required
              helperText="Enter the stock quantity for this color."
            />
          )}

          <label
            htmlFor="colorImage"
            className="flex items-center justify-center h-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors mt-2"
          >
            {newColor.imageFiles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {newColor.imageFiles.map((file, index) => (
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
            multiple
            onChange={handleColorImageChange}
            hidden
          />

          <Button onClick={addColor} startIcon={<Add />}>
            Add Color
          </Button>

          {/* Product Info Section */}
          <h3 className="font-bold">Product Information</h3>
          {editedProduct.productInfo.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ marginBottom: "16px" }}>
              <h4>{category.category}</h4>
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2 mt-4">
                  <TextField
                    fullWidth
                    value={item}
                    onChange={(e) =>
                      handleProductInfoChange(
                        categoryIndex,
                        itemIndex,
                        e.target.value
                      )
                    }
                    label={`Item ${itemIndex + 1}`}
                    variant="outlined"
                  />
                  <IconButton
                    onClick={() => addProductInfoItem(categoryIndex)}
                    color="primary"
                    size="small"
                    aria-label="Add Item"
                  >
                    <Add />
                  </IconButton>
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={handleSave}
              color="primary"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
            <Button onClick={handleClose} color="error" startIcon={<Cancel />}>
              Cancel
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default EditPopUp;