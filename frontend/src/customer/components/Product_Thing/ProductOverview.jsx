import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { StarIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import Size_Chart from "./Size/Size_Chart";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../reduxStore/features/cartSlice";
import { toast } from "react-toastify";
import { setCartItems } from "../../../reduxStore/features/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProductOverview() {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser); // Get logged-in user from Redux store
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState({
    src: "",
    alt: "No image available",
  });
  const [selectedColorData, setSelectedColorData] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const backendUrl = import.meta.env.BACKEND_URL

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${backendUrl}/products/${_id}`);
        if (!response.ok) throw new Error("Failed to fetch product data");

        const data = await response.json();
        setProduct(data);
        setLoading(false);

        const firstColor = data?.colors?.[0] || null;

        const firstColorImageSrc = firstColor?.images?.[0]?.src
          ? firstColor.images[0].src.replace("public/", "")
          : null;

        setSelectedColor(firstColor?.name || "");
        setSelectedImage({
          src: firstColorImageSrc,
          alt: firstColor?.images?.[0]?.alt || "No image available",
        });

        if (data.category === "Clothes") {
          // Handle Clothing Items (Size-Based Stock)
          const firstSize = firstColor?.sizes
            ? Object.keys(firstColor.sizes)[0]
            : "";
          const firstSizeStock = firstColor?.sizes?.[firstSize] || 0;

          setSelectedSize(firstSize);
          setSelectedColorData({ ...firstColor, stock: firstSizeStock });
        } else {
          // Handle Non-Clothing Items (General Stock)
          setSelectedColorData({
            ...firstColor,
            stock: firstColor?.stock || 0,
          });
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [_id]);

  const handleIncreaseQuantity = () => setQuantity(quantity + 1);
  const handleDecreaseQuantity = () =>
    setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);
    const newSelectedColor = product?.colors?.find(
      (colorObj) => colorObj.name === colorName
    );

    if (newSelectedColor) {
      const backendURL = `${backendUrl}/uploads/`;
      const newImageSrc = newSelectedColor?.images?.[0]?.src
        ? `${backendURL}${newSelectedColor.images[0].src.replace(
            "public/",
            ""
          )}`
        : null;

      setSelectedImage({
        src: newImageSrc,
        alt: newSelectedColor?.images?.[0]?.alt || "No image available",
      });

      if (product.category === "Clothes") {
        // Handle Clothing Items (Size-Based Stock)
        const firstSize = Object.keys(newSelectedColor?.sizes || {})[0] || "";
        const firstSizeStock = newSelectedColor?.sizes?.[firstSize] || 0;

        setSelectedSize(firstSize);
        setSelectedColorData({ ...newSelectedColor, stock: firstSizeStock });
      } else {
        // Handle Non-Clothing Items (General Stock)
        setSelectedColorData({
          ...newSelectedColor,
          stock: newSelectedColor?.stock || 0,
        });
      }
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);

    const selectedColorData = product?.colors?.find(
      (colorObj) => colorObj.name === selectedColor
    );
    if (selectedColorData && selectedColorData.sizes) {
      const stock = selectedColorData.sizes[size] || 0;
      setSelectedColorData({
        ...selectedColorData,
        stock: stock,
      });
    }
  };
 

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedColor) {
      toast.error("Please select a color.");
      return;
    }
  
    // Size validation only for Clothes category
    if (product.category === "Clothes" && !selectedSize) {
      toast.error("Size for clothes is mandatory.");
      return;
    }
  
    if (!loggedInUser) {
      toast.error("You must be logged in to add items to your cart.");
      return;
    }
  
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      toast.error("Invalid quantity.");
      return;
    }
  
    const cartItem = {
      userId: loggedInUser._id,
      productId: product._id,
      name: product.name,
      price: product.discountedPrice || product.price,
      variations: [
        {
          color: selectedColor,
          quantity: Number(quantity),
          image: selectedImage.src,
          ...(product.category === "Clothes" && selectedSize ? { size: selectedSize } : {}),
        },
      ],
    };
  
    console.log("Cart Item Payload:", cartItem);
  
    try {
      const response = await fetch(`${backendUrl}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cartItem),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add item to cart.");
      }
  
      const data = await response.json();
      console.log("Cart data", data)
      dispatch(setCartItems({ cartItems: data.cart.cartItems, totalQuantity: data.totalQuantity }));
      toast.success(data.message || "Item added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.message);
    }
  }, [product, selectedColor, selectedSize, quantity, selectedImage, loggedInUser, dispatch]);
  


  if (loading) {
    return <div className="text-center text-lg py-10">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Determine stock based on category
  const stockAvailability =
    product.category === "Clothes"
      ? selectedColorData?.stock
      : product?.colors?.[0]?.stock;

  // Error and loading handling
  if (loading) {
    return <div className="text-center text-lg py-10">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white mb-20 mt-10">
      <div className="pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
            {/* Left Section */}
            <div>
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden group relative">
                <Zoom>
                  <img
                    src={selectedImage.src || ""}
                    alt={selectedImage.alt || "Image not available"}
                    className="h-full w-full object-cover "
                  />
                </Zoom>
              </div>
              {/* Thumbnails */}
              <div className="mt-4 flex gap-x-4 justify-center">
                {product.colors
                  .find((colorObj) => colorObj.name === selectedColor)
                  ?.images?.map((image, index) => {
                    const imageSrc = image.src
                      ? `http://localhost:5000/uploads/${image.src.replace(
                          "public/",
                          ""
                        )}`
                      : "";
                    return (
                      <img
                        key={`${image.src}-${index}`}
                        src={imageSrc}
                        alt={image.alt || ""}
                        onClick={() =>
                          setSelectedImage({ src: imageSrc, alt: image.alt })
                        }
                        className={classNames(
                          selectedImage.src === imageSrc
                            ? "ring-2 ring-indigo-500 scale-110"
                            : "ring-1 ring-gray-300",
                          "h-24 w-24 rounded-lg object-cover cursor-pointer transition-transform duration-200 hover:scale-110 hover:ring-indigo-600"
                        )}
                      />
                    );
                  })}
              </div>
            </div>

            {/* Right Section */}
            <div className="mt-10 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center space-x-4">
                <p className="text-2xl font-semibold text-gray-900">
                  ${parseFloat(product.discountedPrice).toFixed(2)}
                </p>

                {product.price && product.discountedPrice && (
                  <>
                    <p className="text-lg text-gray-500 line-through">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                    <p className="text-lg font-medium text-red-600">
                      {Math.round(
                        ((parseFloat(product.price) -
                          parseFloat(product.discountedPrice)) /
                          parseFloat(product.price)) *
                          100
                      )}
                      % OFF
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 text-gray-700">{product.description}</div>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center">
                <button
                  onClick={handleDecreaseQuantity}
                  className="text-xl font-bold px-4 py-2 bg-red-400 rounded-l cursor-pointer"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                <input
                  type="number"
                  value={quantity ?? 1} // Ensure it never becomes null
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)} // Prevent NaN
                  className="text-center border-t border-b w-12 py-2"
                />
                <button
                  onClick={handleIncreaseQuantity}
                  className="text-xl font-bold px-4 py-2 bg-red-400 rounded-r cursor-pointer"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Color Options */}
              <div className="mt-4">
                <p className="font-medium text-gray-900">Color:</p>
                <div className="flex gap-x-4">
                  {product.colors.map((color) => {
                    const colorImageSrc = color.images?.[0]?.src
                      ? `http://localhost:5000/uploads/${color.images[0].src.replace(
                          "public/",
                          ""
                        )}`
                      : "";
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color.name)}
                        className={classNames(
                          selectedColor === color.name
                            ? "ring-2 ring-indigo-500"
                            : "ring-1 ring-gray-300",
                          "relative p-1 rounded-full cursor-pointer"
                        )}
                        style={{
                          backgroundColor: color.name, // Use the color name as background color
                        }}
                      >
                        <div
                          className="h-8 w-8 rounded-full border-none"
                          style={{
                            backgroundColor: color.name, // Set the background color dynamically
                          }}
                        ></div>

                        {selectedColor === color.name && (
                          <span className="absolute inset-0 border-2 border-none rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Size Options */}
              {product.colors[0].sizes && (
                <div className="mt-4">
                  <p className="font-medium text-gray-900">Size:</p>
                  <div className="flex gap-x-4">
                    {Object.keys(product.colors[0].sizes).map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        className={`px-3 py-1 border rounded-full text-gray-700 cursor-pointer ${
                          selectedSize === size
                            ? "ring-2 ring-indigo-500"
                            : "ring-1 ring-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Chart Toggle Button */}
              {product?.colors?.[0]?.sizes?.length > 0 && (
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow"
                >
                  {showSizeChart ? "Hide Size Chart" : "Show Size Chart"}
                </button>
              )}

              {/* Display Size Chart When Button is Clicked */}
              {showSizeChart && <Size_Chart />}

              {/* Stock Availability */}

              {selectedColorData?.stock !== undefined && (
                <div className="mt-4">
                  <p className="font-medium text-gray-900">
                    Stock Availability:
                  </p>
                  {selectedColorData.stock > 0 ? (
                    <p className="text-green-600">
                      {selectedColorData.stock} items available
                    </p>
                  ) : (
                    <p className="text-red-600">Out of Stock</p>
                  )}
                </div>
              )}
              {/* Add to bag button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-500 cursor-pointer"
                >
                  Add to cart
                </button>
              </div>

              {/* Dynamic Disclosure Sections */}
              <div className="mt-10">
                {product.productInfo.map((section) => (
                  <Disclosure key={section.category} as="div" className="mb-4">
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full justify-between items-center bg-gray-100 px-4 py-3 text-gray-900 font-medium rounded-lg focus:outline-none">
                          <span>{section.category}</span>
                          {open ? (
                            <MinusIcon className="h-5 w-5 text-indigo-600" />
                          ) : (
                            <PlusIcon className="h-5 w-5 text-indigo-600" />
                          )}
                        </DisclosureButton>
                        <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-700">
                          <ul className="space-y-2">
                            {section.items.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <span>•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductOverview;
