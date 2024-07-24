import * as z from 'zod';

export const PurchaseGroupRequestSchema = z.object({
  priceToInvest: z.number().min(0, { message: 'Price must be a positive number' }),
  description: z.string().min(1, { message: 'Description is required' }),
});
