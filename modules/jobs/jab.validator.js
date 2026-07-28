import { z } from "zod";

import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_STATUS,
  WORKPLACE_TYPES,
} from "../../shared/constants";

import { addressSchema } from "../../shared/validators/address.validation.js";
import { benefitSchema } from "../../shared/validators/benefit.validation.js";
import { salarySchema } from "../../shared/validators/salary.validation.js";

export const createJobSchema = z
  .object({
    body: z.object({
      title: z
        .string()
        .trim()
        .min(3, "Job title must be at least 3 characters.")
        .max(120),

      description: z
        .string()
        .trim()
        .min(20, "Job description must be at least 20 characters."),

      responsibilities: z.array(z.string().trim().min(1)).default([]),

      requirements: z.array(z.string().trim().min(1)).default([]),

      skills: z.array(z.string().trim().min(1)).default([]),

      experienceLevel: z.enum(Object.values(EXPERIENCE_LEVELS)),

      minimumExperience: z.number().min(0).default(0),

      maximumExperience: z.number().min(0).default(0),

      employmentType: z.enum(Object.values(EMPLOYMENT_TYPES)),

      workplaceType: z.enum(Object.values(WORKPLACE_TYPES)),

      salary: salarySchema,

      location: addressSchema,

      vacancies: z.number().int().min(1),

      applicationDeadline: z.coerce.date().optional(),

      benefits: z.array(benefitSchema).default([]),

      status: z
        .enum(Object.values(JOB_STATUS))
        .optional()
        .default(JOB_STATUS.DRAFT),
    }),
  })
  .superRefine(({ body }, ctx) => {
    if (body.maximumExperience < body.minimumExperience) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body", "maximumExperience"],
        message: "Maximum experience cannot be less than minimum experience.",
      });
    }

    if (body.applicationDeadline && body.applicationDeadline <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["body", "applicationDeadline"],
        message: "Application deadline must be in the future.",
      });
    }
  });
