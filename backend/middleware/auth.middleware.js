import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
        statusCode: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error(
        "JWT_SECRET is not set. Protect middleware cannot verify tokens.",
      );
      return res.status(500).json({
        success: false,
        message: "Server configuration error: JWT secret is missing",
        statusCode: 500,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        statusCode: 401,
      });
    }
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        statusCode: 401,
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
      statusCode: 401,
    });
  }
};

export default protect;
