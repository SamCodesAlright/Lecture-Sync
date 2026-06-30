import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Course image is required",
    });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "course-images",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return res.status(500).json({
            success: false,
            message: "Failed to upload course image. Please try again.",
          });
        }

        req.cloudinaryImage = {
          url: result.secure_url,
          public_id: result.public_id,
        };

        next();
      },
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload course image. Please try again.",
    });
  }
};

export default uploadToCloudinary;
