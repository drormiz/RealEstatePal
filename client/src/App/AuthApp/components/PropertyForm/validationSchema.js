import { z } from 'zod';

export const addEditPropertyFormSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().min(1),
    floor: z.coerce.number().min(1),
    propertyType: z.string().min(1),
    numberOfRooms: z.coerce.number().min(1),
    meters: z.coerce.number().min(1),
    hasElevator: z.boolean()
});