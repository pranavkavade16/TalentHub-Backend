import ApiResponse from "../../shared/utils/ApiResponse.js";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
} from "./auth.service.js";

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

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const accessToken = await refreshAccessToken(refreshToken);

    return res.status(200).json(
      new ApiResponse(200, "Access token refreshed successfully.", {
        accessToken,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json(new ApiResponse(200, "Logout successful."));
  } catch (error) {
    next(error);
  }
};

export const getLoggedUser = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.userId);

    return res
      .status(200)
      .json(new ApiResponse(true, "User fetched successfully.", user));
  } catch (error) {
    next(error);
  }
};
