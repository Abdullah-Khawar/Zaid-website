import React from 'react';
import ProductCard from './ProductCard';

function Product({ products }) {
  if (!Array.isArray(products)) {
    console.error("Expected 'products' to be an array but got:", products);
    return <div>No products available</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-2 py-0 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-3 lg:py-1 md:py-1.5">
        <h2 className="sr-only">Products</h2>

        {/* Responsive grid */}
        <div className="grid grid-cols-1  gap-x-6 gap-y-2">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
