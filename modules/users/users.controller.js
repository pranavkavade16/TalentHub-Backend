import { registerUserSchema } from "./users.validation.js";
import { registerUser } from "./users.service.js";

export const register = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = registerUserSchema.parse(req.body);

    // Call service
    const user = await registerUser(validatedData);

    // Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
