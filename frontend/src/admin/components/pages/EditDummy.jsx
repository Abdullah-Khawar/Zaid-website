import React, { useState } from "react";
import { 
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { Save, Cancel, Add, Delete, Edit } from "@mui/icons-material";

const categories = ["Clothing", "Accessories"];
const subCategories = [
  "Men-Stitched",
  "Men-Unstitched",
  "Women-Stitched",
  "Women-Unstitched",
  "Women-Purses",
];

const colorOptions = [
  "Red", "Blue", "Green", "Black", "White", "Gray", "Yellow", "Pink", 
  "Purple", "Orange", "Brown", "Beige", "Teal", "Navy", "Maroon", 
  "LightBlue", "LightGreen", "Olive", "Turquoise", "Coral"
];
const sizesAvailable = ["XS", "S", "M", "L", "XL"];


const EditPopUp = ({ open, handleClose, product, setProducts }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });
  console.log(editedProduct);
  const [newColor, setNewColor] = useState({
    name: "",
    stock: "",
    imageFiles: [],
  });
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (
      !editedProduct.name ||
      !editedProduct.price ||
      !editedProduct.discountedPrice
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p._id === editedProduct._id ? editedProduct : p))
    );
    handleClose();
  };

  const handleProductChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

 const handleSizeChange = (size) => {
  setEditedProduct((prev) => {
    const sizes = prev.sizes ? [...prev.sizes] : [];
    if (sizes.includes(size)) {
      return { ...prev, sizes: sizes.filter((s) => s !== size) };
    } else {
      return { ...prev, sizes: [...sizes, size] };
    }
  });
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
    setNewColor({ ...newColor, imageFiles: Array.from(e.target.files) });
  };

  const addColor = () => {
    setEditedProduct({
      ...editedProduct,
      colors: [
        ...editedProduct.colors,
        {
          name: newColor.name,
          stock: newColor.stock,
          images: newColor.imageFiles,
        },
      ],
    });
    setNewColor({ name: "", stock: "", imageFiles: [] });
  };

  const removeColor = (colorToRemove) => {
    setEditedProduct({
      ...editedProduct,
      colors: editedProduct.colors.filter((c) => c !== colorToRemove),
    });
  };

  const handleImageReplace = (colorIndex, imageIndex, files) => {
    const updatedColors = [...editedProduct.colors];
    const color = updatedColors[colorIndex];

    if (files) {
      color.images[imageIndex] = {
        src: URL.createObjectURL(files[0]),
        alt: `Image for ${color.name} - ${imageIndex}`,
      };
    } else {
      color.images.splice(imageIndex, 1); // Remove the image at the specific index
    }

    setEditedProduct({ ...editedProduct, colors: updatedColors });
  };

  // Handle stock change for each color
  const handleStockChange = (colorIndex, e) => {
    const updatedColors = [...editedProduct.colors];
    updatedColors[colorIndex].stock = e.target.value;
    setEditedProduct({ ...editedProduct, colors: updatedColors });
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
            value={editedProduct.category}
            onChange={handleProductChange}
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
          >
            {subCategories.map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
          </Select>

          <h3 className="font-bold">Sizes</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: "16px",
              marginTop: "8px",
            }}
          >
            {sizesAvailable.map((size) => (
              <label key={size} className="inline-flex items-center">
                <Checkbox
                  checked={editedProduct.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}
          </div>

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
  <div key={index} className="border p-4 mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr', gridGap: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
    
{/* First Row: Color name and Stock input */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <span style={{ fontWeight: 'bold' }}>Color: {color.name}</span>
  
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ fontWeight: 'bold' }}>Stock: </span>
    <TextField
      type="number"
      value={color.stock}
      onChange={(e) => handleStockChange(index, e)}
      style={{ width: '80px' }}
      size="small"
    />
    
  </div>
</div>


 {/* Image Grid Section */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',  // Adjust grid size
  gridGap: '16px',  // Adjust spacing between grid items
  maxWidth: '100%',  // Ensure the container is responsive
  overflow: 'hidden',  // Prevent overflow
  padding: '16px',  // Add padding around the container
}}>
  {color.images &&
    color.images.map((image, imageIndex) => (
      <div
        key={imageIndex}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          maxWidth: '100%',  // Ensure image block is responsive
          overflow: 'hidden',  // Prevent overflow of image block
        }}
      >
        <img
          src={image.src}
          alt={image.alt}
          style={{
            width: '100%',
            height: 'auto',  // Make the image responsive
            maxWidth: '80px',  // Max width for image
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />

        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '8px',
          alignItems: 'center',
          justifyContent: 'center', // Align buttons horizontally
        }}>
          {/* Edit Icon */}
          <label htmlFor={`color-image-upload-${index}-${imageIndex}`} style={{ cursor: 'pointer' }}>
            <IconButton component="span" color="primary" size="small">
              <Edit />
            </IconButton>
          </label>

          {/* Delete Button */}
          <Button
            onClick={() => handleImageReplace(index, imageIndex, null)}
            startIcon={<Delete />}
            color="error"
            size="small"
          >
          </Button>
        </div>
      </div>
    ))}
</div>


    {/* Add New Photo Input */}
    <div style={{ marginTop: '16px' }}>
      <input
        type="file"
        onChange={handleColorImageChange}
        style={{ marginBottom: '10px' }}
      />
      <Button
        onClick={() => handleAddNewPhoto(index)}
        startIcon={<Add />}
        color="primary"
        size="small"
      >
        Add Photo
      </Button>
    </div>

    {/* Remove Color Button */}
    <div style={{ marginTop: '16px' }}>
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
          <input
            type="file"
            multiple
            onChange={handleColorImageChange}
            style={{ marginBottom: "10px" }}
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
            <Button onClick={handleSave} color="primary" startIcon={<Save />}>
              Save
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
