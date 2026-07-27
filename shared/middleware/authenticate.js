import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";

import { findUserById } from "../../modules/users/users.repository.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await findUserById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account is inactive.");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
