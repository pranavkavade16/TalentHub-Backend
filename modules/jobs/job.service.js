import Job from "./jobs.model.js";
import RecruiterProfile from "../recruiters/recruiterProfile.model.js";

import ApiError from "../../shared/utils/ApiError.js";

export const createJob = async (userId, jobData) => {
  const recruiter = await RecruiterProfile.findOne({
    user: userId,
  });

  if (!recruiter) {
    throw new ApiError(404, "Recruiter profile not found.");
  }

  if (!recruiter.company) {
    throw new ApiError(
      400,
      "Recruiter must be associated with a company before posting jobs.",
    );
  }

  const job = await Job.create({
    ...jobData,
    recruiter: recruiter._id,
    company: recruiter.company,
  });

  return job;
};
