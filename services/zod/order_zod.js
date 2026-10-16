import {z} from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const orderFields = {
    user_id: objectId,
    products: z.array(
        z.object({
            product_id: objectId,
            quantity: z.number().int().positive(),
            total_price: z.number().nonnegative().default(0),
        })
    ).min(1),
    status: z.enum(["pending", "working", "completed", "canceled"]),
    total_price: z.number().nonnegative(),
};

const addOrderSchema = z.object({
    ...orderFields,
    status: orderFields.status.default("pending"),
    total_price: orderFields.total_price.default(0),
});

// every field optional and no default, so a PATCH only changes what was sent
const updateOrderSchema = z.object(orderFields).partial()
    .refine(data => Object.keys(data).length > 0, 'Nothing to update');

const idSchema = z.object({id: objectId});


export {addOrderSchema, updateOrderSchema, idSchema};
