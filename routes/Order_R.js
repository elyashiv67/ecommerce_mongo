import express from 'express';
import {getAllOrders , getOrderById , getOrdersByUser , addOrder , updateOrder} from "../controllers/Order_C.js"
import validate from "../middlewares/validate.js";
import {idSchema , addOrderSchema , updateOrderSchema} from "../services/zod/order_zod.js"

const router = express.Router();

router.get('/', getAllOrders);
router.get('/by-user/:id', validate(idSchema, 'params'), getOrdersByUser);
router.get('/:id', validate(idSchema, 'params'), getOrderById);
router.post('/', validate(addOrderSchema), addOrder);
router.patch('/:id' , validate(idSchema , 'params') , validate(updateOrderSchema) , updateOrder);

export default router;
