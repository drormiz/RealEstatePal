import { z } from 'zod';

export const addEditPropertyFormSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    _id: z.string().optional(),
    owner: z.string().min(1).optional(),
    price: z.number().positive()
});