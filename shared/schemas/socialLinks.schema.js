import { Schema } from "mongoose";

export const socialLinksSchema = new Schema(
  {
    linkedin: String,

    github: String,

    portfolio: String,

    twitter: String,

    website: String,
  },
  {
    _id: false,
  },
);
