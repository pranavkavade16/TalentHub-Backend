import { Schema } from "mongoose";

export const contactSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);
