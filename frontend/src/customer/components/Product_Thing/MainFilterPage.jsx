import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Product from "./Product";
import { initialProducts } from "./ProductsData"; // This should include your product data
import filters from "./Filters";

const sortOptions = [
  { name: "Price: Low to High", value: "price-low-high", current: false },
  { name: "Price: High to Low", value: "price-high-low", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MainFilterPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleProductsCount, setVisibleProductsCount] = useState(3); // initial count of products to show
  const [filteredProducts, setFilteredProducts] = useState([]); // Set filtered products based on selected filters
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]); // Default to "Most Popular"
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const backendUrl = import.meta.env.BACKEND_URL
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/products`); // Backend URL

      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setFilteredProducts(data);
      setLoading(false);
    } 
    catch (err) {
      setError(err.message); // Handling error
      setLoading(false);
    }
  }, []); // useCallback ensures the function is not recreated unless dependencies change

  // Call fetchProducts on initial render (componentDidMount equivalent)
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); 


  // Handle Load More
  const loadMoreProducts = () => {
    setVisibleProductsCount(visibleProductsCount + 4); // Increase the count when Load More is clicked
  };

  // Handle Filter Change
  const handleFilterChange = (filterId, optionValue) => {
    const updatedFilters = filters.map((filter) => {
      if (filter.id === filterId) {
        filter.options = filter.options.map((option) => {
          if (option.value === optionValue) {
            option.checked = !option.checked;
          }
          return option;
        });
      }
      return filter;
    });

    // Apply filtering logic here
    const selectedFilters = updatedFilters.reduce((acc, filter) => {
      const selectedOptions = filter.options
        .filter((option) => option.checked)
        .map((option) => option.value);
      acc[filter.id] = selectedOptions;
      return acc;
    }, {});

    // Filter the products based on selected filters
    const filteredData = initialProducts.filter((product) => {
      const isCategoryMatch = selectedFilters.category.length
        ? selectedFilters.category.includes(product.category.toLowerCase())
        : true; // If no category filter is applied, don't filter by category
      const isSubCategoryMatch = selectedFilters.subCategory.length
        ? selectedFilters.subCategory.includes(
            product.subCategory.toLowerCase()
          )
        : true; // If no subCategory filter is applied, don't filter by subCategory
      const isSizeMatch = selectedFilters.size.length
        ? selectedFilters.size.some((size) => product.sizes.includes(size))
        : true; // If no size filter is applied, don't filter by size
      const isColorMatch = selectedFilters.color.length
        ? selectedFilters.color.some((color) =>
            product.colors.some((productColor) => productColor.name === color)
          )
        : true; // If no color filter is applied, don't filter by color

      return (
        isCategoryMatch && isSubCategoryMatch && isSizeMatch && isColorMatch
      );
    });

    setFilteredProducts(filteredData);
  };

  // Handle Sort Change
  const handleSortChange = (selectedSort) => {
    setSelectedSortOption(selectedSort);
    // Apply sorting logic
    const sortedProducts = [...filteredProducts];
    switch (selectedSort.value) {
      case "most-popular":
        // Example of sorting logic: Most Popular (no sorting logic in place, just for structure)
        break;
      case "newest":
        sortedProducts.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        ); // Example: sort by newest
        break;
      case "price-low-high":
        sortedProducts.sort((a, b) => a.price - b.price); // Example: sort by price low to high
        break;
      case "price-high-low":
        sortedProducts.sort((a, b) => b.price - a.price); // Example: sort by price high to low
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  useEffect(() => {
    console.log(filteredProducts); // Logs whenever the filtered products change
  }, [filteredProducts]);


   // Display loading or error message, or the products
   if (loading) return <div>Loading...</div>;
   if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />


          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                type="checkbox"
                                checked={option.checked}
                                onChange={() =>
                                  handleFilterChange(section.id, option.value)
                                }
                                className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                              />
                            </div>
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="text-sm text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Filter
            </h1>
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 shadow-2xl ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <button
                          onClick={() => handleSortChange(option)}
                          className={classNames(
                            selectedSortOption.value === option.value
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden"
                          )}
                        >
                          {option.name}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="lg:grid lg:grid-cols-4 lg:gap-x-2">
              {/* Filters */}
              <div className="hidden lg:block lg:col-span-1">
                <form className="space-y-6">
                  {filters.map((section) => (
                    <Disclosure
                      key={section.id}
                      as="div"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      <h3 className="-mx-2 -my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {section.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="size-5 group-data-open:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="size-5 group-not-data-open:hidden"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="space-y-6">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  type="checkbox"
                                  checked={option.checked}
                                  onChange={() =>
                                    handleFilterChange(section.id, option.value)
                                  }
                                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                              </div>
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="text-sm text-gray-500"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                </form>
              </div>

              {/* Products */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]">
                  {filteredProducts
                    .slice(0, visibleProductsCount)
                    .map((product) => (
                      <Product key={product._id} products={[product]} />
                    ))}
                </div>
                {filteredProducts.length > visibleProductsCount && (
                  <div className="mt-10">
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={loadMoreProducts}
                        className=" inline-flex items-center justify-center px-6 py-3 text-base cursor-pointer font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none"
                      >
                        Load More
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
