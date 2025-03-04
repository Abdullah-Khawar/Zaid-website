import {
  setCartItems,
  updateQuantity,
  removeFromCart,
} from "../../../reduxStore/features/cartSlice";

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";


import navigation from "./navigationData";
import AuthOptions from "./AuthOptions";
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';




export default function Navigation() {

  const backendUrl = import.meta.env.VITE_BACKEND_URL; 

useEffect(()=>{
  console.log("Backend URL in navigation updated:", backendUrl);
}, [])

  const [open, setOpen] = useState(false);

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle search query change
  const handleSearch = (query) => {
    setQuery(query);  // Directly set the query
    if (query.trim()) {
      debouncedSearch(query);  // Trigger the debounced search
    } else {
      setIsLoading(false);  // Reset loading if the query is empty
    }
  };

  // Search API call simulation (replace with actual API call)
  const fetchSearchResults = async (searchQuery) => {
    setIsLoading(true);
    try {
      // Mock response for testing
      const mockData = [
        {
          productId: 1,
          productName: 'Basic Tee 6-Pack',
          selectedColor: 'black',
          selectedSize: 'M',
          quantity: 2,
          discountedPrice: '$1622',
          totalPrice: '$3244',
          colors: [
            {
              name: 'black',
              imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
              imageAlt: 'Black Basic Tee'
            },
          ],
          sizes: ['S', 'M', 'L'],
        },
        {
          productId: 2,
          productName: 'Focus Paper Refill',
          selectedColor: 'white',
          selectedSize: 'S',
          quantity: 1,
          discountedPrice: '$71',
          totalPrice: '$71',
          colors: [
            {
              name: 'white',
              imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
              imageAlt: 'White Focus Paper Refill'
            },
          ],
          sizes: ['S'],
        },
      ];
  
      // Simulate an API delay with setTimeout
      setTimeout(() => {
        setIsLoading(false);
        if (searchQuery && searchQuery.trim() !== '') {
          const filteredData = mockData.filter(item =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase())
          );
          // Navigate to search page with results
          if (filteredData.length > 0) {
            navigate(`/search?q=${searchQuery}`);
          } else {
            // No results found
            console.log('No products found for your search query.');
          }
        }
      }, 1000); // Simulating 1 second delay for API call
    } catch (error) {
      console.error('Error fetching search results:', error);
      setIsLoading(false);
    }
  };
  
  

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    fetchSearchResults(query);
  }, 500); // 500ms debounce delay



  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const cartItems = useSelector((state) => state.cart.cartItems || []); // Default to empty array
  const customerOrders = useSelector((state) => state.user.customerOrders);

  // Calculate total quantity of items in cart
  const totalItems = cartItems.reduce((total, item) => {
    return total + item.variations.reduce((sum, variation) => sum + (variation.quantity || 0), 0);
  }, 0);
  

  useEffect(() => {
    if (loggedInUser) {
      console.log("Cart Items: ", cartItems)
      const customerData = customerOrders.find(
        (order) => order.customerId === loggedInUser.customerId
      );
      if (customerData) {
        dispatch(setCartItems(customerData.products || [])); // Ensure no undefined or null values
      }
    }
  }, [loggedInUser, customerOrders, dispatch]);

  return (
    <div className="bg-white z-999">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pt-10 pb-8"
                  >
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <a
                            href={item.href}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p
                          id={`${category.id}-${section.id}-heading-mobile`}
                          className="font-medium text-gray-900"
                        >
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <a
                                href={item.href}
                                className="-m-2 block p-2 text-gray-500"
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    to={page.to} // Correct property is 'to' instead of 'href'
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <AuthOptions />

  
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white ">
        <p
          className="flex h-10 items-center justify-center px-4 text-sm font-medium text-black sm:px-6 lg:px-8"
          style={{ backgroundColor: "oklch(0.87 0.21 102.34)" }}
        >
          Get free delivery on orders over $100
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">ZFSTUDIO</span>
                  <img
                    alt=""
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:border-indigo-600 data-open:text-indigo-600">
                          {category.name}
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                      >
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 top-1/2 bg-white shadow-sm"
                        />

                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div
                                    key={item.name}
                                    className="group relative text-base sm:text-sm"
                                  >
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                    />
                                    <a
                                      href={item.href}
                                      className="mt-6 block font-medium text-gray-900"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 z-10"
                                      />
                                      {item.name}
                                    </a>
                                    <p aria-hidden="true" className="mt-1">
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p
                                      id={`${section.name}-heading`}
                                      className="font-medium text-gray-900"
                                    >
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <a
                                            href={item.href}
                                            className="hover:text-gray-800"
                                          >
                                            {item.name}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.to} // Use `to` for React Router's Link, ensure it's pointing to a valid route
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
              <AuthOptions />
              
                {/* Search */}
                <div className="flex lg:ml-6">
                  <Link to="/search" className="p-2 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="size-6"
                    />
                  </Link>
                </div>



                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link to="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {totalItems}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
