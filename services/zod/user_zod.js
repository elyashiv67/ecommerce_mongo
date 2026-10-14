import {z} from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const addOrUpdateUserSchema = z.object({
    _id: objectId.optional(),
    name: z.string().min(2) ,
    phone: z.string().min(10).max(10).startsWith('0'),
    email: z.email(),
    address: z.string().min(2) ,
    role: z.enum(['user', 'seller' , 'admin']).default('user'),
});


export {addOrUpdateUserSchema};