import { Router } from "express";

import validate from "../../shared/middleware/validate.js";

import { registerUser } from "./auth.controller.js";
import { registerUserSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerUserSchema), registerUser);

export default router;
