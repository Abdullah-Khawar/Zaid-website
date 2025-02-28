import Product from "../../models/products.models.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../middlewares/upload.middleware.js";


export const addProduct = async (req, res) => {
  try {
    console.log("📥 Received request:", req.body);
    console.log("📸 Files received:", req.files);

    // Ensure `productData` exists in the request body and parse it
    if (!req.body.productData) {
      return res.status(400).json({ message: "Missing product data" });
    }
    const productData = JSON.parse(req.body.productData);

    if (!productData.colors || productData.colors.length === 0) {
      return res.status(400).json({ message: "No colors data provided" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log("🌤 Uploading images to Cloudinary...");
    const uploadedImages = await uploadToCloudinary(req.files);
    console.log("✅ Images uploaded successfully:", uploadedImages);

    // Assign uploaded images to correct colors
    const colorImageMap = {};
    
    // Loop through uploaded images and assign them to their corresponding colors
    req.files.forEach((file, index) => {
      const match = file.fieldname.match(/color\[(.*?)\]_image_\d+/); // Extract color name
      if (match) {
        const colorName = match[1]; // Extracted color name
        if (!colorImageMap[colorName]) {
          colorImageMap[colorName] = [];
        }
        colorImageMap[colorName].push(uploadedImages[index].src);
      }
    });

    console.log("🖼 Mapped Color-Image Data:", colorImageMap);

    // Update `colors` array with Cloudinary URLs
    productData.colors = productData.colors.map((color) => ({
      name: color.name,
      sizes: productData.category === "Clothes" ? color.sizes : undefined,
      stock: productData.category !== "Clothes" ? color.stock : undefined,
      images: (colorImageMap[color.name] || []).map((src, index) => ({
        src,
        alt: color.images?.[index]?.alt || "", // Preserve alt text if available
      })),
    }));

    console.log("🎨 Final Colors Data:", productData.colors);

    // Create new product object with processed data
    const newProduct = new Product({
      name: productData.name,
      price: productData.price,
      discountedPrice: productData.discountedPrice,
      category: productData.category,
      subCategory: productData.subCategory,
      description: productData.description,
      colors: productData.colors,
      productInfo: productData.productInfo,
    });

    console.log("💾 Saving product to database...");
    await newProduct.save();
    console.log("✅ Product saved successfully");

    res.status(201).json({ message: "Product added successfully", newProduct });

  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log("📥 Received request:", req.body);
    console.log("📸 Files received:", req.files);

    if (!req.body.productData) {
      return res.status(400).json({ message: "Missing product data" });
    }

    const productData = JSON.parse(req.body.productData);

    // Check for product ID in params
    if (!req.params.id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the existing product by ID
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update basic product fields
    existingProduct.name = productData.name || existingProduct.name;
    existingProduct.price = productData.price || existingProduct.price;
    existingProduct.discountedPrice = productData.discountedPrice || existingProduct.discountedPrice;
    existingProduct.category = productData.category || existingProduct.category;
    existingProduct.subCategory = productData.subCategory || existingProduct.subCategory;
    existingProduct.description = productData.description || existingProduct.description;
    existingProduct.productInfo = productData.productInfo || existingProduct.productInfo;

    // If there are new images (i.e., req.files is not empty or undefined)
    if (req.files && req.files.length > 0) {
      console.log("🌤 Uploading images to Cloudinary...");

      // Upload new images
      const uploadedImages = await uploadToCloudinary(req.files);
      console.log("✅ Images uploaded successfully:", uploadedImages);

      // Map the uploaded images to their corresponding colors
      const colorImageMap = {};
      req.files.forEach((file, index) => {
        const match = file.fieldname.match(/color\[(.*?)\]_image_\d+/); // Extract color name
        if (match) {
          const colorName = match[1];
          if (!colorImageMap[colorName]) {
            colorImageMap[colorName] = [];
          }
          colorImageMap[colorName].push(uploadedImages[index].src);
        }
      });

      console.log("🖼 Mapped Color-Image Data:", colorImageMap);

      const updatedColors = await Promise.all(
        productData.colors.map((color) => {
          const existingColor = existingProduct.colors.find((c) => c.name === color.name);
          const existingImages = existingColor?.images || [];
          const newImages = (colorImageMap[color.name] || []).map((src, index) => ({
            src,
            alt: color.images?.[index]?.alt || "", // Ensure alt is set
          }));

      
          return {
            ...color,
            images: [...existingImages, ...newImages], // Combine existing and new images
            sizes: color.sizes ? { ...color.sizes } : undefined,
            stock: productData.category !== "Clothes" ? color.stock : undefined,
          };
        })
      );
      

      existingProduct.colors = updatedColors;
    } else {
      // If no new files, preserve the existing images
      existingProduct.colors = productData.colors.map((color) => ({
        ...color,
        images: color.images.map((image) => ({
          ...image,
          alt: image.alt || "", // Ensure alt is set
        })),
      }));
    }

    // Save the updated product to the database
    const updatedProduct = await existingProduct.save();
    console.log("✅ Product updated:", updatedProduct);

    // Send the response with updated product
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteColorImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { colorName } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const color = product.colors.find((color) => color.name === colorName);
    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    // Delete images from Cloudinary
    for (const image of color.images) {
      await deleteFromCloudinary(image.src);
    }

    // Remove the color from the product
    product.colors = product.colors.filter((color) => color.name !== colorName);

    await product.save();
    res.status(200).json({ message: "Color images deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting color images:", error);
    res.status(500).json({ message: "Failed to delete color images", error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the color that contains the image
    const color = product.colors.find((color) =>
      color.images.some((image) => image.src === imageUrl)
    );
    if (!color) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the image from Cloudinary
    await deleteFromCloudinary(imageUrl);

    // Remove the image from the color
    color.images = color.images.filter((image) => image.src !== imageUrl);

    await product.save();
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the product by ID
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

export const getProductsCategoryCount = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products

    let clothingCount = 0;
    let nonClothingCount = 0;

    products.forEach((product) => {
      if (product.category.toLowerCase() === "clothes") {
        clothingCount++;
      } else {
        nonClothingCount++;
      }
    });

    res.json({ clothing: clothingCount, nonClothing: nonClothingCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};