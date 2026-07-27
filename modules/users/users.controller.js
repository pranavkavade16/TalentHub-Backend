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
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};