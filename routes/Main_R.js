import express from "express";
import user_routes from "../routes/User_R.js";
import category_routes from "../routes/Category_R.js";
import product_routes from "../routes/Product_R.js";
import order_routes from "../routes/Order_R.js";

const router = express.Router();


router.use('/user', user_routes);
router.use('/category', category_routes);
router.use('/product', product_routes);
router.use('/order', order_routes);

export default router;