import { z } from "zod";

import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_STATUS,
  WORKPLACE_TYPES,
} from "../../shared/constants/index.js";

import { addressSchema } from "../../shared/validators/address.validator.js";
import { benefitSchema } from "../../shared/validators/benefit.validator.js";
import { salarySchema } from "../../shared/validators/salary.validator.js";

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

export const getJobsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    employmentType: z.enum(Object.values(EMPLOYMENT_TYPES)).optional(),

    workplaceType: z.enum(Object.values(WORKPLACE_TYPES)).optional(),

    experienceLevel: z.enum(Object.values(EXPERIENCE_LEVELS)).optional(),

    city: z.string().trim().optional(),

    skills: z.string().trim().optional(),

    sort: z
      .enum(["newest", "oldest", "titleAsc", "titleDesc"])
      .default("newest"),
  }),
});

export const getMyJobsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    status: z.enum(Object.values(JOB_STATUS)).optional(),

    sort: z
      .enum(["newest", "oldest", "titleAsc", "titleDesc"])
      .default("newest"),
  }),
});

export const getJobByIdSchema = z.object({
  params: z.object({
    jobId: z.string().trim().min(1, "Job ID is required."),
  }),
});
