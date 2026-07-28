import mongoose from "mongoose";

import { APPLICATION_STATUS } from "../../shared/constants";
import { toJSONPlugin } from "../../shared/plungins/toJSON.plugin";
const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
      index: true,
    },

    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "RecruiterProfile",
      required: true,
      index: true,
    },

    resume: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    coverLetter: {
      type: String,
      maxlength: 3000,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
      index: true,
    },

    aiMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    recruiterNotes: {
      type: String,
      maxlength: 5000,
    },

    candidateNotes: {
      type: String,
      maxlength: 5000,
    },

    source: {
      type: String,
      enum: ["direct", "referral", "linkedin", "indeed", "ai"],
      default: "direct",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    lastStatusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index(
  {
    candidate: 1,
    job: 1,
  },
  {
    unique: true,
  },
);

applicationSchema.index({
  recruiter: 1,
  status: 1,
});

applicationSchema.plugin(applicationSchema);

export default mongoose.model("Application", applicationSchema);
