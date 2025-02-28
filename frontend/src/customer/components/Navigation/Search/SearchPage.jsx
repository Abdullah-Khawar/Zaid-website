import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';  // Get query params and navigation
import { debounce } from 'lodash';  // For debouncing the search
import { customerOrders } from '../../Cart/CustomerOrdersData'; // Import customer orders data

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams(); // Get the search query from URL
  const navigate = useNavigate(); // To navigate to product page

  // Set query based on the URL when the component mounts or the search changes
  useEffect(() => {
    const searchQuery = searchParams.get('q') || ''; // Extract query parameter
    setQuery(searchQuery); // Set query state from URL
    if (searchQuery) {
      fetchSearchResults(searchQuery); // Call search if query exists
    }
  }, [searchParams]); // Re-run when the query parameter changes

  // Simulate an API call to fetch search results
  const fetchSearchResults = async (searchQuery) => {
    setIsLoading(true);

    // Flatten the customer orders and filter products based on the search query
    const allProducts = customerOrders.flatMap(order => order.products); // Flatten products from orders
    const filteredResults = allProducts.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filteredResults);
    setIsLoading(false);
  };

  // Handle search input change (debounced)
  const debouncedSearch = debounce((query) => {
    fetchSearchResults(query);
  }, 500);

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      debouncedSearch(value); // Trigger the debounced search
    } else {
      setResults([]); // Clear results if query is empty
    }
  };

  // Handle product click (navigation to product detail page)
  const handleProductClick = (id) => {
    navigate(`/products/${id}`); // Navigate to product detail page
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gray-50 pt-10"> {/* Added padding to shift upward */}
      {/* Search Bar */}
      <div className="w-full max-w-lg mb-8">
        <input
          type="text"
          className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search for products..."
          value={query}
          onChange={handleSearchChange}
        />
      </div>

      {/* Show loading indicator if search is in progress */}
      {isLoading && <div className="text-center">Loading...</div>}

      {/* Display the results here */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Search Results for "{query}"</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.productId}
                className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-lg"
                onClick={() => handleProductClick(product.productId)} // Navigate on product click
              >
                <img
                  src={product.colors[0].imageSrc} // Image from product color options
                  alt={product.productName}
                  className="w-32 h-32 object-cover mb-4"
                />
                <h3 className="text-sm font-semibold text-center">{product.productName}</h3>
                <p className="text-gray-500 text-center">{product.discountedPrice}</p>
              </div>
            ))
          ) : (
            <p>No products found matching "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
