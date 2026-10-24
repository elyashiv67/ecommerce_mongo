import {z} from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const orderStatus = z.enum(["pending", "working", "completed", "canceled"]);

// only ids and quantities come from the client, prices and status are set by the server
const addOrderSchema = z.object({
    user_id: objectId,
    products: z.array(
        z.object({
            product_id: objectId,
            quantity: z.number().int().positive(),
        })
    ).min(1)
        .refine(products => new Set(products.map(p => p.product_id)).size === products.length,
            'Each product can appear only once, use quantity instead'),
});

// products can't be changed after the order is made (stock was already taken), only the status
const updateOrderSchema = z.object({
    status: orderStatus,
});

const idSchema = z.object({id: objectId});


export {addOrderSchema, updateOrderSchema, idSchema};
