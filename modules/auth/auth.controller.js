import ApiResponse from "../../shared/utils/ApiResponse.js";
import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully.", user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(200, "Login successful.", {
        accessToken,
        user,
      }),
    );
  } catch (error) {
    next(error);
  }
};
