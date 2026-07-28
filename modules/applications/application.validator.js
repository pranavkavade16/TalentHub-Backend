import { z } from "zod";

export const applyJob = z.object({
  body: z.object({
    jobId: z.string().trim().min(1, "Job ID is required."),
    resumeId: z.string().trim().min(1, "Resume ID is required."),
    coverLetter: z
      .string()
      .trim()
      .max(3000, "Cover letter cannot exceed 3000 characters.")
      .optional(),
  }),
});
