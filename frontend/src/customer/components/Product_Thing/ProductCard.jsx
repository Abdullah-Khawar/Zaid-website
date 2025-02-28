import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function ProductCard({ product }) {

  const backendUrl = import.meta.env.BACKEND_URL
  
  // Ensure product.price is a string before using .replace()
  const originalPrice = product?.price
    ? parseFloat(String(product.price).replace("$", ""))
    : 0;
  
  const discountedPrice = product?.discountedPrice
    ? parseFloat(String(product.discountedPrice).replace("$", ""))
    : null;
  
  const discountPercentage = originalPrice > 0 && discountedPrice
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;
  


  const firstColor = product?.colors?.length > 0 ? product.colors[0] : null;
  const backendURL = `${backendUrl}/uploads/`;

  const firstColorImageSrc = firstColor?.images?.[0]?.src
    ? `${backendURL}${firstColor.images[0].src.replace("public/", "")}`
    : null;
  

  // const firstColorImageSrc = `/products/Clothes/Men-Stitched/67a4d71a6c43b52288dbbbd9/green/8c7cff4c-2267-4b58-b742-16554fa8c9cd-2.jpg`;


console.log("Final Image URL:", firstColorImageSrc); // Debugging
    
  return (
    <Link
      to={`/products/${product._id}`}
      className="group block pb-2 px-3 pt-3 rounded-lg shadow-md bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out transform"
      aria-label={`View details for ${product.name}`}
    >
      {/* Image Container with Discount Badge */}
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        {discountedPrice && (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs sm:text-sm bg-red-600 text-white font-semibold rounded-full">
            {discountPercentage}% off
          </span>
        )}
        {/* Display the first available color image if imageSrc exists */}
        {firstColorImageSrc && (
         <img
         loading="lazy"
         src={firstColorImageSrc} // Use first available color image
         alt={firstColor?.images?.[0]?.alt || product.name} // Fallback alt text
         className="h-full w-full object-cover object-center group-hover:opacity-100 transition-opacity duration-300"
       />
       
        )}
      </div>
    
      {/* Name */}
      <h3 className="mt-4 text-sm lg:text-lg font-semibold text-gray-700 group-hover:text-gray-600 transition-all duration-300 transform group-hover:translate-y-[-3px]">
        {product.name}
      </h3>
    
      {/* Description */}
      <p className="mt-1 text-xs sm:text-sm lg:text-base text-gray-500 line-clamp-2 group-hover:text-gray-700 transition-all duration-300 transform group-hover:translate-y-[-5px]">
        {product.description || "No description available."}
      </p>
    
      {/* Price and Discount */}
      <div className="mt-2 flex items-center text-md sm:text-base font-medium text-gray-900">
        {discountedPrice ? (
          <>
            <span className="line-through text-gray-500 mr-2 text-sm sm:text-base">
              {product.price} Rs
            </span>
            <span className="mr-2 text-indigo-600">{product.discountedPrice} Rs</span>
          </>
        ) : (
          <span>{product.price} Rs</span>
        )}
      </div>
    </Link>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    discountedPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    colors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            src: PropTypes.string,
            alt: PropTypes.string,
          })
        ),
      })
    ).isRequired,    
    description: PropTypes.string,
  }).isRequired,
};

export default ProductCard;
