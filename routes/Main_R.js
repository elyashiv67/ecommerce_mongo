import express from "express";
import user_routes from "../routes/User_R.js";

const router = express.Router();


router.use('/user', user_routes);

export default router;