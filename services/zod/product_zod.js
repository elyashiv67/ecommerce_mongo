import {z} from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const productFields = {
    user_id: objectId,
    category_id: objectId,
    title: z.string().trim().min(2),
    desc: z.string().trim().min(2),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
};

const addProductSchema = z.object(productFields);

// every field optional, so a PATCH only changes what was sent
const updateProductSchema = z.object(productFields).partial()
    .refine(data => Object.keys(data).length > 0, 'Nothing to update');

const idSchema = z.object({id: objectId});


export {addProductSchema, updateProductSchema, idSchema};
