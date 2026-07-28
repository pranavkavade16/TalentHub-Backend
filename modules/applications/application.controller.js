import ApiResponse from "../../shared/utils/ApiResponse.js";

import applicationService from "./application.service.js";

export const applyJob = async (req, res) => {
  try {
    const application = await applicationService.applyJob({
      userId: req.user.userId,
      ...req.body,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          true,
          "Application submitted successfully.",
          application,
        ),
      );
  } catch (error) {
    next(error);
  }
};
