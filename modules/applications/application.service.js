import mongoose from "mongoose";

import ApiError from "../../shared/utils/ApiError.js";

import Job from "../jobs/job.model.js";
import Resume from "../";
import Application from "./application.model.js";
import CandidateProfile from "../candidates/candidateProfile.model.js";

const applyJob = async ({ userId, jobId, resumeId, coverLetter }) => {
  const candidate = await CandidateProfile.findOne({
    user: userId,
  });

  if (!candidate) {
    throw new ApiError(404, "Candidate profile not found.");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found.");
  }

  if (!job.isActive) {
    throw new ApiError(400, "This job is no longer accepting applications.");
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Resume not found.");
  }

  if (!resume.candidate.equals(candidate._id)) {
    throw new ApiError(403, "You can only apply using your own resume.");
  }

  const existingApplication = await Application.findOne({
    candidate: candidate._id,
    job: job._id,
  });

  if (existingApplication) {
    throw new ApiError(409, "You have already applied for this job.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const application = await Application.create(
      [
        {
          candidate: candidate._id,
          recruiter: job.recruiter,
          job: job._id,
          resume: resume._id,
          coverLetter,
        },
      ],
      { session },
    );

    await Job.findByIdAndUpdate(
      job._id,
      {
        $inc: {
          applicationCount: 1,
        },
      },
      {
        session,
      },
    );

    await session.commitTransaction();

    return application[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export default {
  applyJob,
};
