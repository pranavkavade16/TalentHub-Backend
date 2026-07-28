import ApiError from "../../shared/utils/ApiError.js";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  createUser,
  findUserByEmailWithPassword,
  findUserByIdWithRefreshToken,
  updateRefreshToken,
} from "../users/users.repository.js";

export const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists.");
  }

  const user = await createUser(userData);

  return user;
};

export const loginUser = async (loginData) => {
  const { email, password } = loginData;

  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const accessToken = user.generateAccessToken();

  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required.");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await findUserByIdWithRefreshToken(decoded.id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Refresh token is invalid.");
  }

  const accessToken = user.generateAccessToken();

  return accessToken;
};

export const logoutUser = async (userId) => {
  await updateRefreshToken(userId, null);
};


