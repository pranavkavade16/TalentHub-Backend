import { Router } from "express";

import { validate } from "../../shared/middleware/validate.js";

import { register, refresh, login } from "./auth.controller.js";
import { loginSchema, registerUserSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerUserSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

export default router;
