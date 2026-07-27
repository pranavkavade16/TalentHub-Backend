import { Schema } from "mongoose";

export const educationSchema = new Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
    },

    fieldOfStudy: {
      type: String,
      trim: true,
    },

    grade: String,

    startDate: Date,

    endDate: Date,

    currentlyStudying: {
      type: Boolean,
      default: false,
    },

    description: String,
  },
  {
    _id: false,
  },
);
