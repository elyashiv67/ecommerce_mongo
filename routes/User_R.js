import express from 'express';
import {addUser, deleteUser, getAllUsers, getUserById, updateUser} from "../controllers/User_C.js";
import validate from "../middlewares/validate.js";
import {addUserSchema, updateUserSchema, idSchema} from "../services/zod/user_zod.js";



const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", validate(idSchema, 'params'), getUserById);
router.post('/', validate(addUserSchema), addUser);
router.patch('/:id', validate(idSchema, 'params'), validate(updateUserSchema), updateUser);
router.delete('/:id', validate(idSchema, 'params'), deleteUser);

export default router;