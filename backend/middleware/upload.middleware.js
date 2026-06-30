// ── Store image locally (required — used for POST /courses) ──
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Course image is required",
    });
  }

  console.log("Image stored locally:", req.file.path);
  
  // Construct the URL to access the image
  const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  
  req.cloudinaryImage = {
    url: imageUrl,
    public_id: req.file.filename,
  };

  next();
};

// ── Store image locally (optional — used for PUT /courses/:id) ─
// If no file is attached the middleware simply calls next() without setting
// req.cloudinaryImage, and the controller will keep the existing image.
const uploadToCloudinaryOptional = async (req, res, next) => {
  if (!req.file) {
    return next(); // no new image — proceed without touching req.cloudinaryImage
  }

  console.log("Image stored locally:", req.file.path);
  
  // Construct the URL to access the image
  const baseUrl = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  
  req.cloudinaryImage = {
    url: imageUrl,
    public_id: req.file.filename,
  };

  next();
};

export default uploadToCloudinary;
export { uploadToCloudinaryOptional };
