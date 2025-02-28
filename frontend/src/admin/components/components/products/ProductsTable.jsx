import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import EditPopUp from "../../pages/EditPopUp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsTable = ({products}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => { 
    setProducts(products);
  }, [products]);

    // // Fetch products from backend API
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/products");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch products");
  //       }     
  //       <tbody className="divide-y divide-gray-700">
  //         {products
  //           .filter(
  //             (product) =>
  //               product.name.toLowerCase().includes(searchTerm) ||
  //               product.category.toLowerCase().includes(searchTerm)
  //           )
  //           .map((product) => (
  //             <motion.tr
  //               key={product._id} // Ensure unique key
  //               initial={{ opacity: 0 }}
  //               animate={{ opacity: 1 }}
  //               transition={{ duration: 0.3 }}
  //             >
  //               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
  //                 {product.name}
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
  //                 {product.category}
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
  //                 {product.subCategory}
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
  //                 ${product.price}
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
  //                 ${product.discountedPrice}
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
  //                 <button
  //                   className="text-indigo-400 hover:text-indigo-300 mr-2"
  //                   onClick={() => handleEdit(product)}
  //                 >
  //                   <Edit size={18} />
  //                 </button>
  //                 <button
  //                   className="text-red-400 hover:text-red-300"
  //                   onClick={() => handleDelete(product._id)}
  //                 >
  //                   <Trash2 size={18} />
  //                 </button>
  //               </td>
  //             </motion.tr>
  //           ))}
  //       </tbody>
  
  //       const data = await response.json();
  //       setProducts(data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // // Log products when the products state changes
  // useEffect(() => {
  //   console.log("Products fetched:", products);
  // }, [products]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };


const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onConfirm}
          className="confirm-button bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="cancel-button bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          No
        </button>
      </div>
    </div>
  );
};

const showConfirmDialog = (message, onConfirm) => {
    const toastId = toast(
      <ConfirmDialog
        message={message}
        onConfirm={() => {
          toast.dismiss(toastId);
          onConfirm();
        }}
        onCancel={() => toast.dismiss(toastId)}
      />,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleDelete = async (_id) => {
    showConfirmDialog("Are you sure you want to delete this product?", async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/products/${_id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
  
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== _id));
  
        toast.success("Product deleted successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error deleting product:", error.message);
        toast.error("Failed to delete product. Please try again.", {
          position: "top-center",
        });
      }
    });
  };

  
  const handleEdit = (product) => {
    console.log("Editing product", product._id);
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Subcategory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Discounted Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {products
              .filter(
                (product) =>
                  product.name.toLowerCase().includes(searchTerm) ||
                  product.category.toLowerCase().includes(searchTerm)
              )
              .map((product) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.subCategory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${product.discountedPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Edit PopUp */}
      {isEditOpen && (
        <EditPopUp
          open={isEditOpen}
          handleClose={() => setIsEditOpen(false)}
          product={selectedProduct}
          setProducts={setProducts}
        />
      )}
    </motion.div>
  );
};

export default ProductsTable;
