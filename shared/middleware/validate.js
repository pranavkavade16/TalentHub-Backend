import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ApiError(400, "Validation failed", error.issues));
      }

      next(error);
    }
  };
};


