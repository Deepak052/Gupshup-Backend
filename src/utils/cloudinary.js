import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// ✅ Cloudinary configuration from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload file to Cloudinary and delete local copy
const uploadOnCloudinary = async (localFilePath, folder = "") => {
  try {
    if (!localFilePath) return null;

    const uploadOptions = {
      resource_type: "auto", // auto-detect image/video/file
    };

    if (folder) {
      uploadOptions.folder = folder; // optional folder like 'users/avatars'
    }

    const response = await cloudinary.uploader.upload(
      localFilePath,
      uploadOptions
    );

    // ✅ Clean up local temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);

    // ✅ Still delete local file if exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

// ✅ Delete file from Cloudinary using its URL
const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return;

    // Safer public_id extraction using path
    const publicId = path.basename(fileUrl, path.extname(fileUrl));

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto", // for images, PDFs, videos etc.
    });

    return result;
  } catch (error) {
    console.error("❌ Error deleting file from Cloudinary:", error.message);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
