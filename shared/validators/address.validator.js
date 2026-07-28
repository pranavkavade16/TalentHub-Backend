import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().trim().optional(),

  city: z.string().trim().min(1, "City is required."),

  state: z.string().trim().min(1, "State is required."),

  country: z.string().trim().min(1, "Country is required."),

  postalCode: z.string().trim().optional(),
});
