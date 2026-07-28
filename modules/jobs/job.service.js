import Job from "./job.model.js";
import RecruiterProfile from "../recruiters/recruiterProfile.model.js";
import { JOB_STATUS } from "../../shared/constants/job/jobStatus.js";
import { SORT_OPTIONS } from "../../shared/constants/common/sortOptions.js";
import ApiError from "../../shared/utils/ApiError.js";

const createJob = async (userId, jobData) => {
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

const getJobs = async (query) => {
  const {
    page,
    limit,
    search,
    employmentType,
    workplaceType,
    experienceLevel,
    city,
    skills,
    sort,
  } = query;

  const filter = {
    status: JOB_STATUS.OPEN,
    isDeleted: false,
  };

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  if (employmentType) {
    filter.employmentType = employmentType;
  }

  if (workplaceType) {
    filter.workplaceType = workplaceType;
  }

  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }

  if (city) {
    filter["location.city"] = city;
  }

  if (skills) {
    filter.skills = {
      $in: skills.split(",").map((skill) => skill.trim().toLowerCase()),
    };
  }

  const skip = (page - 1) * limit;

  const sortOption = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;

  const queryBuilder = Job.find(filter)
    .populate("company")
    .populate({
      path: "recruiter",
      select: "designation",
      populate: {
        path: "user",
        select: "firstName lastName profilePicture",
      },
    })
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  // Add text score only when using text search
  if (search) {
    queryBuilder.select({
      score: {
        $meta: "textScore",
      },
    });

    queryBuilder.sort({
      score: {
        $meta: "textScore",
      },
    });
  }

  const [jobs, totalJobs] = await Promise.all([
    queryBuilder,
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: {
      total: totalJobs,
      page,
      limit,
      totalPages: Math.ceil(totalJobs / limit),
    },
  };
};

export default { createJob, getJobs };
