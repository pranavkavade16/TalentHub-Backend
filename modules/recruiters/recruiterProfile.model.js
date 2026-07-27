import mongoose from "mongoose";

import { contactSchema } from "../../shared/schemas/core/contact.schema.js";
import { socialLinksSchema } from "../../shared/schemas/core/socialLinks.schema.js";

const { Schema } = mongoose;

const recruiterProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    department: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    contact: contactSchema,

    bio: {
      type: String,
      maxlength: 1000,
    },

    socialLinks: socialLinksSchema,

    isPrimaryRecruiter: {
      type: Boolean,
      default: false,
    },

    isHiring: {
      type: Boolean,
      default: true,
      index: true,
    },

    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

recruiterProfileSchema.index({ company: 1 });
recruiterProfileSchema.index({ isHiring: 1 });

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);
