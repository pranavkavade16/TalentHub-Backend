import ApiError from "../../shared/utils/ApiError.js";

import { findUserByEmail, createUser } from "../users/users.repository.js";

export const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists.");
  }

  const user = await createUser(userData);

  return user;
};
