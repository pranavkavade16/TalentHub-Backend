import { z } from "zod";

export const salarySchema = z
  .object({
    currency: z.string().trim().default("INR"),

    min: z.number().min(0, "Minimum salary cannot be negative.").optional(),

    max: z.number().min(0, "Maximum salary cannot be negative.").optional(),

    isNegotiable: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (
      data.min !== undefined &&
      data.max !== undefined &&
      data.max < data.min
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max"],
        message:
          "Maximum salary must be greater than or equal to minimum salary.",
      });
    }
  });
