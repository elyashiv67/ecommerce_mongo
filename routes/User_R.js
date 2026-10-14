import express from 'express';
import {addUser, getAllUsers, getUserById} from "../controllers/User_C.js";
import validate from "../middlewares/validate.js";
import {addOrUpdateUserSchema} from "../services/zod/user_zod.js";



const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post('/addUser', validate(addOrUpdateUserSchema), addUser);

export default router;