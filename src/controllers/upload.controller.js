import httpStatus from "http-status";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(new ApiResponse(httpStatus.BAD_REQUEST, null, "No file uploaded"));
  }

  // File is uploaded to public/uploads
  // Create the URL to access it
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { url }, "File uploaded successfully"));
});
