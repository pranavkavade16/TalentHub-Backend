import { Schema } from "mongoose";

export const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  technologies: [String],

  projectUrl: String,

  githubUrl: String,

  startDate: Date,

  endDate: Date,
});
