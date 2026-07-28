import Job from "./job.model.js";
import RecruiterProfile from "../recruiters/recruiterProfile.model.js";
import { JOB_STATUS } from "../../shared/constants/index.js";
import { SORT_OPTIONS } from "../../shared/constants/index.js";
import { ROLES } from "../../shared/constants/index.js";
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

const getMyJobs = async (userId, query) => {
  const recruiter = await RecruiterProfile.findOne({
    user: userId,
  });

  if (!recruiter) {
    throw new ApiError(404, "Recruiter profile not found.");
  }

  const { page, limit, search, status, sort } = query;

  const filter = {
    recruiter: recruiter._id,
    isDeleted: false,
  };

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const queryBuilder = Job.find(filter)
    .populate({
      path: "company",
      select: "name logo",
    })
    .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest)
    .skip(skip)
    .limit(limit);

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
      totalItems: totalJobs,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(totalJobs / limit),
      hasNextPage: page < Math.ceil(totalJobs / limit),
      hasPreviousPage: page > 1,
    },
  };
};

const getJobById = async (jobId, user) => {
  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  })
    .populate({
      path: "company",
      select: "name logo website industry location",
    })
    .populate({
      path: "recruiter",
      select: "designation",
      populate: {
        path: "user",
        select: "firstName lastName",
      },
    });

  if (!job) {
    throw new ApiError(404, "Job not found.");
  }

  // Public/Candidate
  if (!user || user.role === ROLES.CANDIDATE) {
    if (job.status !== JOB_STATUS.OPEN) {
      throw new ApiError(404, "Job not found.");
    }

    await Job.findByIdAndUpdate(job._id, {
      $inc: {
        views: 1,
      },
    });

    return job;
  }

  // Recruiter
  if (user.role === ROLES.RECRUITER) {
    const recruiter = await RecruiterProfile.findOne({
      user: user._id,
    });

    if (!recruiter) {
      throw new ApiError(404, "Recruiter profile not found.");
    }

    if (!job.recruiter.equals(recruiter._id)) {
      throw new ApiError(403, "You are not authorized to view this job.");
    }

    return job;
  }

  return job;
};

const updateJob = async (userId, jobId, payload) => {
  const recruiter = await RecruiterProfile.findOne({
    user: userId,
  });

  if (!recruiter) {
    throw new ApiError(404, "Recruiter profile not found.");
  }

  const job = await Job.findOne({
    _id: jobId,
    isDeleted: false,
  });

  if (!job) {
    throw new ApiError(404, "Job not found.");
  }

  if (!job.recruiter.equals(recruiter._id)) {
    throw new ApiError(403, "You are not authorized to update this job.");
  }

  Object.assign(job, payload);

  await job.save();

  return job;
};

export default { createJob, getJobs, getMyJobs, getJobById, updateJob };
