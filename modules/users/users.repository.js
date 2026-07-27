import User from "./users.model.js";

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const createUser = async (userData) => {
  return User.create(userData);
};

export const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select("+password +refreshToken");
};

export const findUserById = async (id) => {
  return User.findById(id);
};

export const findUserByIdWithRefreshToken = async (id) => {
  return User.findById(id).select("+refreshToken");
};
