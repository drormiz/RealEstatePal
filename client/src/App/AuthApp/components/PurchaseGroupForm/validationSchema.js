import { z } from "zod";

export const purchaseGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  maxMembersCount: z.coerce.number().min(0),
  participationPrice: z.coerce.number().min(0),
  profitPercentage: z.coerce.number().min(0),
  _id: z.string().optional(),
  owner: z.string().min(1).optional(),
  property: z.string().min(1).optional(),
});
