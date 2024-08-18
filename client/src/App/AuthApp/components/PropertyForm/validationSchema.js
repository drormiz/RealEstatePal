import { z } from "zod";

export const PropertyFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(1, "Price is required"),
    floor: z.coerce.number().min(1, "Floor is required"),
    propertyType: z.string().min(1, "Property Type is required"),
    numberOfRooms: z.coerce.number().min(1, "Number of Rooms is required"),
    meters: z.coerce.number().min(1, "Size is required"),
    hasElevator: z.boolean(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .refine(
    (data) => data.latitude !== undefined && data.longitude !== undefined,
    {
      message: "Location is required",
      path: ["latitude"],
    }
  );
