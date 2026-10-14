import express from 'express'
import {addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory} from "../controllers/Category_C.js";
import validate from "../middlewares/validate.js";
import {addCategorySchema, idSchema, updateCategorySchema} from "../services/zod/category_zod.js";

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', validate(idSchema, 'params'), getCategoryById);
router.post('/', validate(addCategorySchema), addCategory);
router.patch('/:id', validate(idSchema, 'params'), validate(updateCategorySchema), updateCategory);
router.delete('/:id', validate(idSchema, 'params'), deleteCategory);


export default router