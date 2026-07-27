import ApiError from "../../shared/utils/ApiError.js";

import {
  findUserByEmail,
  createUser,
  findUserByEmailWithPassword,
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
