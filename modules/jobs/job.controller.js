import httpStatus from "http-status";

import ApiResponse from "../../shared/utils/ApiResponse.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import jobService from "./jobs.service.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user._id, req.body);

  return res
    .status(httpStatus.CREATED)
    .json(
      new ApiResponse(httpStatus.CREATED, "Job created successfully.", job),
    );
});

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobs(req.query);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, "Jobs fetched successfully.", jobs));
});
