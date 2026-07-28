import { Router } from "express";

import { createJob, getJobs } from "./job.controller.js";

import { authenticate } from "../../shared/middleware/authenticate.js";
import { authorize } from "../../shared/middleware/authorize.js";
import { validate } from "../../shared/middleware/validate.js";

import { ROLES } from "../../shared/constants/auth/roles.js";
import { createJobSchema, getJobsSchema } from "./job.validator.js";

const router = Router();

router.post(
  "/jobs",
  authenticate,
  authorize(ROLES.RECRUITER),
  validate(createJobSchema),
  createJob,
);

router.get("/jobs", validate(getJobsSchema), getJobs);

export default router;
