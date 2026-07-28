import mongoose from "mongoose";

import { addressSchema } from "../../shared/schemas/core/address.schema.js";
import { salarySchema } from "../../shared/schemas/core/salary.schema.js";
import { benefitSchema } from "../../shared/schemas/core/benefit.schema.js";
import { toJSONPlugin } from "../../shared/plungins/toJSON.plugin.js";

import {
  EMPLOYMENT_TYPES,
  WORKPLACE_TYPES,
  EXPERIENCE_LEVELS,
  JOB_STATUS,
} from "../../shared/constants";

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
    },

    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    experienceLevel: {
      type: String,
      enum: Object.values(EXPERIENCE_LEVELS),
      required: true,
    },

    minimumExperience: {
      type: Number,
      default: 0,
      min: 0,
    },

    maximumExperience: {
      type: Number,
      default: 0,
      min: 0,
    },

    employmentType: {
      type: String,
      enum: Object.values(EMPLOYMENT_TYPES),
      required: true,
    },

    workplaceType: {
      type: String,
      enum: Object.values(WORKPLACE_TYPES),
      required: true,
    },

    salary: salarySchema,

    location: addressSchema,

    vacancies: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    applicationDeadline: {
      type: Date,
    },

    benefits: [benefitSchema],

    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.DRAFT,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    applicationCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },

  {
    timestamps: true,
  },
);

jobSchema.index({
  status: 1,
  createdAt: -1,
});

jobSchema.index({
  title: "text",
  description: "text",
});

jobSchema.index({
  company: 1,
  status: 1,
});

jobSchema.index({
  skills: 1,
});

jobSchema.index({
  employmentType: 1,
  workplaceType: 1,
});

jobSchema.index({
  experienceLevel: 1,
});

jobSchema.index({
  "location.city": 1,
});

jobSchema.index({
  featured: 1,
});

jobSchema.pre("validate", function (next) {
  if (
    this.maximumExperience &&
    this.maximumExperience < this.minimumExperience
  ) {
    return next(
      new Error("Maximum experience cannot be less than minimum experience."),
    );
  }

  next();
});

jobSchema.plugin(toJSONPlugin);

export default mongoose.model("Job", jobSchema);
