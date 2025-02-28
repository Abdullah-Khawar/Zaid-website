import express from 'express';
import { checkRole, verifyToken } from '../../middlewares/auth.middleware.js';
import { getUserProfile } from '../../controllers/Users/auth.controller.js';
import { GetAllProduct, getCart, addToCart, getProductByCategoryAndSubCategory, getProductByID, removeFromCart, updateCart } from '../../controllers/Products/CustomerProducts.controller.js';

const router = express.Router();

router.get("/products", GetAllProduct);
router.get("/products/:_id", getProductByID);
router.get("/productsFilter", getProductByCategoryAndSubCategory);
router.get("/profile", verifyToken, getUserProfile);

// Ensure the /cart endpoint is protected by verifyToken middleware
router.get('/cart', verifyToken, getCart);
router.post("/cart/add", addToCart);
router.delete('/cart/remove', removeFromCart)
router.put('/cart/update', updateCart);


router.post('/cart/updateCart', updateCart)



export default router;


