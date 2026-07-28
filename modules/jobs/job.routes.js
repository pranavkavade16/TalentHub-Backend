import { Router } from "express";

import { createJob } from "./jobs.controller.js";

import authenticate from "../../middlewares/authenticate.js";
import authorize from "../../middlewares/authorize.js";
import validate from "../../middlewares/validate.js";

import { ROLES } from "../../shared/constants/auth/roles.js";
import { createJobSchema } from "./jobs.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.RECRUITER),
  validate(createJobSchema),
  createJob,
);

export default router;
