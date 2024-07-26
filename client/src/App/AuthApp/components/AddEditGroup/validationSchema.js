import { z } from "zod";

export const addEditGroupFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  _id: z.string().optional(),
  owner: z.string().min(1).optional(),
  property: z.string().min(1).optional(),
});
