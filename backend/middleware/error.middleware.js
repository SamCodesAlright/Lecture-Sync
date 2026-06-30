const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field} already exists. Please choose another value.`;
    statusCode = 400;
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors || {})
      .map((value) => value.message)
      .join(", ");
    statusCode = 400;
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    message = "File size is too large. Please upload a smaller file.";
    statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    message = "Invalid token.";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Your token has expired.";
    statusCode = 401;
  }

  console.error("Error:", err.message);

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
