import {z} from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const categoryFields = {
    name: z.string().trim().min(2),
    desc: z.string().trim().min(10),
};

const addCategorySchema = z.object(categoryFields);

// every field optional, so a PATCH only changes what was sent
const updateCategorySchema = z.object(categoryFields).partial()
    .refine(data => Object.keys(data).length > 0, 'Nothing to update');

const idSchema = z.object({id: objectId});


export {addCategorySchema, updateCategorySchema, idSchema};
