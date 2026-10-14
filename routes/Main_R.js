import express from "express";
import user_routes from "../routes/User_R.js";
import category_routes from "../routes/Category_R.js";
const router = express.Router();


router.use('/user', user_routes);
router.use('/category', category_routes );

export default router;