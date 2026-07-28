import { z } from "zod";

export const benefitSchema = z.object({
  title: z.string().trim().min(1, "Benefit title is required."),

  description: z.string().trim().optional().default(""),
});
