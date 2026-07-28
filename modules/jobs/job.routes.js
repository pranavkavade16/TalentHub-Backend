import { Router } from "express";

import { createJob, getJobs } from "./jobs.controller.js";

import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import validate from "../../middlewares/validate.js";

import { ROLES } from "../../shared/constants/auth/roles.js";
import { createJobSchema, getJobSchema } from "./jobs.validation.js";

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
