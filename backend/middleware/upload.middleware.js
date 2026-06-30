const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Course image is required",
    });
  }

  console.log("Image stored locally:", req.file.path);

  const baseUrl =
    process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  req.cloudinaryImage = {
    url: imageUrl,
    public_id: req.file.filename,
  };

  next();
};

const uploadToCloudinaryOptional = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  console.log("Image stored locally:", req.file.path);

  const baseUrl =
    process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  req.cloudinaryImage = {
    url: imageUrl,
    public_id: req.file.filename,
  };

  next();
};

export default uploadToCloudinary;
export { uploadToCloudinaryOptional };
