import {z} from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const addOrUpdateCategorySchema = z.object({
    _id: objectId.optional(),
    name: z.string().min(2) ,
    desc: z.string().min(10),
});

export {addOrUpdateCategorySchema};