import { Router } from "express";

import { validate } from "../../shared/middleware/validate.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { register, refresh, login, logout } from "./auth.controller.js";
import { loginSchema, registerUserSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerUserSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", authenticate, logout);

export default router;
