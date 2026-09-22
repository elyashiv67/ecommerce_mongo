import {z} from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const addOrUpdateProductSchema = z.object({
    _id: objectId.optional(),
    user_id : objectId,
    category_id: objectId,
    title: z.string().min(2),
    desc: z.string().min(2),
    price: z.number(),
});

export {addOrUpdateProductSchema};