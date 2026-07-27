import { Schema } from "mongoose";

export const addressSchema = new Schema(
  {
    street: String,

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    postalCode: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);
