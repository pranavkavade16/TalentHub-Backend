import mongoose from "mongoose";

import { addressSchema } from "../../shared/schemas/core/address.schema.js";
import { salarySchema } from "../../shared/schemas/core/salary.schema.js";
import { fileSchema } from "../../shared/schemas/core/file.schema.js";
import { socialLinksSchema } from "../../shared/schemas/core/socialLinks.schema.js";
import { toJSONPlugin } from "../../shared/plungins/toJSON.plugin.js";
import { educationSchema } from "../../shared/schemas/candidate/education.schema.js";
import { experienceSchema } from "../../shared/schemas/candidate/experience.schema.js";
import { projectSchema } from "../../shared/schemas/candidate/project.schema.js";
import { certificationSchema } from "../../shared/schemas/candidate/certification.schema.js";

const { Schema } = mongoose;

const candidateProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    headline: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    summary: {
      type: String,
      maxlength: 2000,
    },

    phone: {
      type: String,
      trim: true,
    },

    dateOfBirth: Date,

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },

    address: addressSchema,

    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior", "lead"],
      default: "fresher",
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentCompany: String,

    currentDesignation: String,

    currentSalary: salarySchema,

    expectedSalary: salarySchema,

    noticePeriod: {
      type: Number,
      default: 0,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    education: [educationSchema],

    experience: [experienceSchema],

    projects: [projectSchema],

    certifications: [certificationSchema],

    socialLinks: socialLinksSchema,

    resume: fileSchema,

    jobPreferences: {
      preferredRoles: [String],

      preferredLocations: [String],

      employmentTypes: [String],

      workplaceTypes: [String],
    },

    isOpenToWork: {
      type: Boolean,
      default: true,
      index: true,
    },

    profileVisibility: {
      type: Boolean,
      default: true,
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

candidateProfileSchema.index({ skills: 1 });
candidateProfileSchema.index({ yearsOfExperience: 1 });

candidateProfileSchema.plugin(toJSONPlugin);

export default mongoose.model("CandidateProfile", candidateProfileSchema);
