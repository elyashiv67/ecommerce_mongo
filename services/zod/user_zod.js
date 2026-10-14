import {z} from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const userFields = {
    name: z.string().min(2),
    phone: z.string().length(10).startsWith('0'),
    email: z.email(),
    address: z.string().min(2),
    role: z.enum(['user', 'seller', 'admin']),
};

const addUserSchema = z.object({...userFields, role: userFields.role.default('user')});

// every field optional and no default, so a PATCH only changes what was sent
const updateUserSchema = z.object(userFields).partial()
    .refine(data => Object.keys(data).length > 0, 'Nothing to update');

const idSchema = z.object({id: objectId});


export {addUserSchema, updateUserSchema, idSchema};
