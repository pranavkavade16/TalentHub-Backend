import { Schema } from "mongoose";

export const experienceSchema = new Schema({
  company: {
    type: String,
    required: true,
  },

  designation: {
    type: String,
    required: true,
  },

  employmentType: String,

  location: String,

  startDate: Date,

  endDate: Date,

  currentlyWorking: {
    type: Boolean,
    default: false,
  },

  description: String,

  skills: [String],
});
