import express from 'express';
import {
    addProduct, deleteProductById,
    getAllProducts,
    getAllProductsByCategory,
    getAllProductsByUser,
    getProductById, updateProductById
} from "../controllers/Products_C.js";
import validate from "../middlewares/validate.js";
import {addProductSchema, idSchema, updateProductSchema} from "../services/zod/product_zod.js";

const router = express.Router();

router.get('/all', getAllProducts);
router.get('/by-user', validate(idSchema, 'query'), getAllProductsByUser);
router.get('/by-category/:id', validate(idSchema, 'params'), getAllProductsByCategory);
router.get('/:id', validate(idSchema, 'params'), getProductById);
router.post('/', validate(addProductSchema), addProduct);
router.patch('/:id',validate(idSchema,'params'),validate(updateProductSchema),updateProductById);
router.delete('/:id',validate(idSchema,'params'), deleteProductById);

export default router;