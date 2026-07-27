import { findUserByEmail, createUser } from "./users.repository.js";

export const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await createUser(userData);

  return user;
};
