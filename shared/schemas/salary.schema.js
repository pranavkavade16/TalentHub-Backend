import { Schema } from "mongoose";

export const salarySchema = new Schema(
  {
    currency: {
      type: String,
      default: "INR",
    },

    min: {
      type: Number,
      min: 0,
    },

    max: {
      type: Number,
      min: 0,
    },

    isNegotiable: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);
