import Product from "../../models/products.models.js";
import User from "../../models/user.models.js";
import Cart from "../../models/cart.models.js";
import { v4 as uuidv4 } from 'uuid'; // Correct import for uuidv4
import mongoose from "mongoose";


export const GetAllProduct = async (req, res) => {
    try {
      const products = await Product.find(); 
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch products', error: err.message });
    }
};

export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.query; // Get query parameters from frontend
    let filter = {}; // Initialize filter object

    if (category) {
      filter.category = category;
    }

    if (subCategory) {
      filter.subCategory = subCategory;
    }

    const products = await Product.find(filter); // Fetch filtered products from DB
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

export const getProductByID = async (req, res) => {
  try {
      const { _id } = req.params;

      if (_id) {
          // Fetch single product by ID
          const product = await Product.findById(_id);

          if (!product) {
              return res.status(404).json({ message: "Product not found" });
          }

          return res.status(200).json(product);
      }

      // Fetch all products
      const products = await Product.find();
      res.status(200).json(products);
      
  } 
  catch (err) {
      res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};


// export const addToCart = async (req, res) => {
//   try {
//       const { userId, productId, name, price, colors } = req.body;
//       let sessionId = req.cookies.sessionId;

//       console.log("Added process begins");

//       if (!colors || colors.length === 0) {
//           return res.status(400).json({ message: "Color selection is required." });
//       }

//       const { color, size, quantity, image } = colors[0]; // Extract first color object
//       const parsedQuantity = Number(quantity);

//       if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
//           return res.status(400).json({ message: "Invalid quantity. Must be a positive number." });
//       }

//       let cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] });

//       if (!cart) {
//           cart = new Cart({ userId, sessionId, cartItems: [] });
//       }

//       let existingProduct = cart.cartItems.find(item => item.productId.equals(productId));

//       if (existingProduct) {
//           let existingVariation = existingProduct.variations.find(
//               (variant) => variant.color === color && variant.size === size
//           );

//           if (existingVariation) {
//               existingVariation.quantity += parsedQuantity;
//           } else {
//               existingProduct.variations.push({ color, size, quantity: parsedQuantity, image });
//           }
//       } else 
//       {
//           cart.cartItems.push({
//               productId,
//               name,
//               price,
//               variations: [{ color, size, quantity: parsedQuantity, image }]
//           });
//       }

//       await cart.save();

//       // Calculate total quantity of all items in cart
//       const totalQuantity = cart.cartItems.reduce((sum, item) => {
//           return sum + item.variations.reduce((varSum, v) => varSum + v.quantity, 0);
//       }, 0);

//       res.status(200).json({ 
//           message: "Item added to cart successfully!", 
//           cart, 
//           totalQuantity 
//       });
//   } 
//   catch (error) {
//       console.error("Error adding to cart:", error);
//       res.status(500).json({ message: "Error adding to cart", error });
//   }
// };
export const getCart = async (req, res) => {
  const userId = req.query.userId; // ✅ Get userId from query
  const sessionId = req.cookies.sessionId;

  console.log("Extracted userId:", userId || "No userId available");
  console.log("Session ID from cookies:", sessionId);

  try {
    if (!userId && !sessionId) {
      return res.status(400).json({ message: "No user or session provided" });
    }

    const cart = await Cart.findOne({
      $or: [{ userId }, { sessionId }],
    }).populate("cartItems.productId");

    if (!cart) {
      console.log("Cart not found for userId or sessionId.");
      return res.status(404).json({ message: "Cart is empty" });
    }

    console.log("Cart retrieved:", cart);
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

export const addToCart = async (req, res) => {
  try {
      const { userId, productId, name, price, variations } = req.body;
      let sessionId = req.cookies.sessionId;

      console.log("Added process begins", variations);

      if (!variations || variations.length === 0) {
          return res.status(400).json({ message: "Color selection is required." });
      }

      console.log("color k bad  process begins");

      const parsedVariations = variations.map(({ color, size, quantity, image }) => {
          const parsedQuantity = Number(quantity);
          if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
              throw new Error("Invalid quantity. Must be a positive number.");
          }
          return { color, size: size || null, quantity: parsedQuantity, image };
      });

      let cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] });

      if (!cart) {
          cart = new Cart({ userId, sessionId, cartItems: [] });
      }

      for (let variation of parsedVariations) {
          const { color, size, quantity, image } = variation;
          let existingProduct = cart.cartItems.find(item => item.productId.equals(productId));

          if (existingProduct) {
              let existingVariation = existingProduct.variations.find(
                  (variant) => variant.color === color && (variant.size === size || (!variant.size && !size))
              );

              if (existingVariation) {
                  existingVariation.quantity += quantity;
              } else {
                  existingProduct.variations.push({ color, size, quantity, image });
              }
          } else {
              cart.cartItems.push({
                  productId,
                  name,
                  price,
                  variations: [{ color, size, quantity, image }]
              });
          }
      }

      await cart.save();

      // Calculate total quantity of all items in cart
      const totalQuantity = cart.cartItems.reduce((sum, item) => {
          return sum + item.variations.reduce((varSum, v) => varSum + v.quantity, 0);
      }, 0);

      res.status(200).json({ 
          message: "Item added to cart successfully!", 
          cart, 
          totalQuantity 
      });
  } 
  catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId, size, color } = req.body;
    
    const sessionId = req.cookies.sessionId;
    console.log("REMOVE REQUEST:", req.body);

    if (!userId && !sessionId) {
      return res.status(400).json({ message: "User not identified" });
    }

    // Find the cart by userId or sessionId
    const cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Loop through cart items and remove the variation
    cart.cartItems = cart.cartItems
      .map((item) => {
        if (item.productId.toString() === productId) {
          // Filter out the specific variation
          item.variations = item.variations.filter(
            (variation) => !(variation.size === size && variation.color === color)
          );

          // If no variations left, remove the product from cart
          return item.variations.length > 0 ? item : null;
        }
        return item;
      })
      .filter(Boolean); // Remove null entries

    console.log("Remove se pehle");
    await cart.save();
    console.log("Remove k bad");
    
    // Calculate total quantity after removal
    const totalQuantity = cart.cartItems.reduce((sum, item) => {
      return sum + item.variations.reduce((varSum, v) => varSum + v.quantity, 0);
    }, 0);

    res.status(200).json({ message: "Item removed from cart", cart, totalQuantity });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart", error });
  }
};

export const mergeCart = async (req, res) => {
  const { userId } = req.body;
  const sessionId = req.cookies.sessionId;
  
  try {
      const guestCart = await Cart.findOne({ sessionId });
      const userCart = await Cart.findOne({ userId });
  
      if (guestCart && userCart) {
          guestCart.cartItems.forEach((guestItem) => {
              const existingItem = userCart.cartItems.find(item => item.productId.equals(guestItem.productId));
              if (existingItem) {
                  existingItem.quantity += guestItem.quantity;
              } else {
                  userCart.cartItems.push(guestItem);
              }
          });
  
          await userCart.save();
          await Cart.deleteOne({ sessionId }); // Remove guest cart
      }
  
      res.clearCookie('sessionId'); // Remove guest session
      res.status(200).json(userCart || guestCart);
  } catch (error) {
      res.status(500).json({ message: 'Error merging cart', error });
  }
};


export const updateCart = async (req, res) => {
    try {
      const { userId, cartItems, sessionId } = req.body;
      
      if (!userId && !sessionId) {
        return res.status(400).json({ message: "User not identified" });
      }
  
      // Find the cart by userId or sessionId
      let cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      console.log("Received Cart Items to Update: ", cartItems);
  
      for (const cartItem of cartItems) {
        const { productId, variations } = cartItem;
        let existingProduct = cart.cartItems.find((item) => item.productId.equals(productId));
  
        if (existingProduct) {
          for (const variation of variations) {
            const { size, color, quantity } = variation;
  
            let existingVariation = existingProduct.variations.find(
              (v) => v.color === color && (v.size === size || (!v.size && !size))
            );
  
            if (existingVariation) {
              existingVariation.quantity = quantity; // Update quantity
            }
          }
        }
      }
  
      // Remove items with zero quantity
      cart.cartItems = cart.cartItems.filter((item) => {
        item.variations = item.variations.filter((variation) => variation.quantity > 0);
        return item.variations.length > 0;
      });
  
      await cart.save();
  
      // Calculate total quantity after update
      const totalQuantity = cart.cartItems.reduce((sum, item) => {
        return sum + item.variations.reduce((varSum, v) => varSum + v.quantity, 0);
      }, 0);
  
      res.status(200).json({ message: "Cart updated successfully", cart, totalQuantity });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ message: "Error updating cart", error: error.message });
    }
  };
  

// export const updateCart = async (req, res) => {
//   const { userId, cartItems } = req.body;

//   try {
//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, cartItems });
//     } else {
//       cartItems.forEach(newItem => {
//         const existingItemIndex = cart.cartItems.findIndex(item => item.productId.equals(newItem.productId));

//         if (existingItemIndex !== -1) {
//           // Product already exists in the cart
//           const existingItem = cart.cartItems[existingItemIndex];

//           newItem.colors.forEach(newColor => {
//             const existingColorIndex = existingItem.colors.findIndex(c => c.color === newColor.color);

//             if (existingColorIndex !== -1) {
//               // Color already exists, update sizes
//               existingItem.colors[existingColorIndex].sizes.push(...newColor.sizes);
//             } else {
//               // Add new color
//               existingItem.colors.push(newColor);
//             }
//           });

//           cart.cartItems[existingItemIndex] = existingItem;
//         } else {
//           // Add new product
//           cart.cartItems.push(newItem);
//         }
//       });
//     }

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     res.status(500).json({ message: "Error updating cart", error });
//   }
// };



// export const updateQuantity = async (req, res) => {
//   try {
//     const { userId, sessionId, productId, size, color, quantity } = req.body;

//     console.log("UPDATE REQUEST:", req.body);

//     if (!userId && !sessionId) {
//       return res.status(400).json({ message: "User not identified" });
//     }
//     if (!productId || !size || !color || quantity < 1) {
//       return res.status(400).json({ message: "Invalid request data" });
//     }

//     // Find the cart by userId or sessionId
//     const cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

    
//     // Convert productId to ObjectId properly
//     const productIdObj = new mongoose.Types.ObjectId(String(productId));

//     // Find the product inside cart
//     const productIndex = cart.cartItems.findIndex(
//       (item) =>
//         item.productId.toString() === productIdObj.toString() &&
//         item.variations.some((v) => v.size === size && v.color === color)
//     );

//     if (productIndex === -1) {
//       return res.status(404).json({ message: "Product not found in cart" });
//     }

//     // Update the quantity of the specific variation
//     cart.cartItems[productIndex].variations.forEach((variation) => {
//       if (variation.size === size && variation.color === color) {
//         variation.quantity = quantity;
//       }
//     });


//     cart.updatedAt = new Date(); // Update timestamp
//       console.log("NHI Hva save abi")
//     await cart.save();
//     console.log("SAve hgya")
//     res.json({ message: "Cart updated successfully", cart });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




