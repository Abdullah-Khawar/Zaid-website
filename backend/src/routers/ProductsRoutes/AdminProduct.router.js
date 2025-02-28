// Initialize express router
import express from 'express';
import { uploadArray } from '../../middlewares/upload.middleware.js';;
import { addProduct, deleteProduct, updateProduct, deleteColorImages, deleteImage } from '../../controllers/Products/AdminProducts.controller.js';
import { getUsers, deleteUser, getShippingPricesByQuery } from '../../controllers/Users/AdminUsers.controller.js';
import { getProductsCategoryCount } from '../../controllers/Products/AdminProducts.controller.js';
import { getShippingPrices, addShippingPrice, updateShippingPrice, deleteShippingPrice } from '../../controllers/Users/AdminUsers.controller.js';
import { checkRole } from '../../middlewares/auth.middleware.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
const router = express.Router();



router.get("/products/category-count", getProductsCategoryCount);
router.post("/add-products", uploadArray, addProduct);
router.delete("/products/:id", deleteProduct);
router.patch("/update-products/:id", uploadArray, updateProduct);
router.delete("/remove-color-images/:id", deleteColorImages);
router.delete("/remove-image/:id", deleteImage);
router.get("/getUsers", getUsers);
router.delete("/getUsers/:id", deleteUser);



router.get('/shipping-prices', getShippingPrices);
router.get('/shipping-price', getShippingPricesByQuery)
router.post('/shipping-prices', addShippingPrice);
router.put('/shipping-prices/:id', updateShippingPrice);
router.delete('/shipping-prices/:id', deleteShippingPrice);

export default router;
