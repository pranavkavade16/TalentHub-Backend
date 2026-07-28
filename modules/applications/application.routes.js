import { Router } from "express";

import authenticate from "../../shared/middlewares/authenticate.js";
import authorize from "../../shared/middlewares/authorize.js";
import validate from "../../shared/middlewares/validate.js";
import { ROLES } from "../../shared/constants/auth/roles.js";
import { applyJob } from "./application.controller.js";
import { applyJobSchema } from "./application.validator.js";

const router = Router();

router.post(
  "/application",
  authenticate,
  authorize(ROLES.CANDIDATE),
  validate(applyJobSchema),
  applyJob,
);

export default router;
