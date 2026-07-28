import ApiResponse from "../../shared/utils/ApiResponse.js";

import jobService from "./job.service.js";

export const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.user._id, req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, "Job created successfully.", job));
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getJobs(req.query);

    return res
      .status(200)
      .json(new ApiResponse(200, "Jobs fetched successfully.", jobs));
  } catch (error) {
    next(error);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.getMyJobs(req.user._id, req.query);

    return res
      .status(200)
      .json(new ApiResponse(200, "Recruiter jobs fetched successfully.", jobs));
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.jobId, req.user);

    return res
      .status(200)
      .json(new ApiResponse(200, "Job fetched successfully.", job));
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(
      req.user._id,
      req.params.jobId,
      req.body,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Job updated successfully.", job));
  } catch (error) {
    next(error);
  }
};
