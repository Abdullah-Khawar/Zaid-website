import React from "react";

function HomeCard({ cardWidth, cardHeight, fontSizeTitle, fontSizeDescription, data }) {
  // Ensure price values are numbers
  const originalPrice = parseFloat(data.price); 
  const discountedPrice = data.discountedPrice ? parseFloat(data.discountedPrice) : originalPrice;

  
  return (
    <div
      className="flex flex-col items-center justify-between bg-white shadow-md rounded-lg overflow-hidden relative"
      style={{
        width: cardWidth,
        height: cardHeight,
      }}
    >
      {/* Discount Badge */}
      {originalPrice > discountedPrice && (
        <div
          className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-sm font-bold rounded"
          style={{ zIndex: 10 }}
        >
          {Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}% off
        </div>
      )}

      {/* Image */}
       <img
        src={data.colors?.[0].images[0].src || ""}
        alt={data.name}
        className="w-full h-65 object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col items-center text-center">
        {/* Title */}
        <h3
          className="font-semibold mb-2"
          style={{ fontSize: fontSizeTitle }}
        >
          {data.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          {originalPrice > discountedPrice && (
            <span
              className="text-sm text-gray-400 line-through"
              style={{ fontSize: fontSizeDescription }}
            >
              ${originalPrice.toFixed(2)}
            </span>
          )}
          <span
            className="text-lg font-bold text-green-600"
            style={{ fontSize: fontSizeDescription }}
          >
            ${discountedPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
