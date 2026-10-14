import {z} from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const addOrUpdateOrderSchema = z.object({
    _id: objectId.optional(),
    user_id : objectId,
    products: z.array(
        z.object({
            product_id : objectId,
            quantity : z.number().int().positive(),
            total_price : z.number().default(0),
        })
    ),
    status : z.enum(["pending", "working", "completed", "canceled"]).optional(),
    total_price: z.number().default(0),
});

export {addOrUpdateOrderSchema}