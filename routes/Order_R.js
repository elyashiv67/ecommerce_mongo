import express from 'express';
import {getAllOrders , getOrderById , addOrder , updateOrder} from "../controllers/Order_C.js"
import validate from "../middlewares/validate.js";
import {idSchema , addOrderSchema , updateOrderSchema} from "../services/zod/order_zod.js"

const router = express.Router();

router.get('/all', getAllOrders);
router.get('/:id', validate(idSchema, 'params'), getOrderById);
router.post('/add', validate(addOrderSchema),validate(addOrderSchema) , addOrder);
router.patch('/:id' , validate(idSchema , 'params') , validate(updateOrderSchema) , updateOrder);

export default router;