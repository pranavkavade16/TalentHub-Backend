import ApiResponse from "../../shared/utils/ApiResponse.js";
import { registerUser } from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json(
      new ApiResponse(201, "User registered successfully.", {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }),
    );
  } catch (error) {
    next(error);
  }
};
