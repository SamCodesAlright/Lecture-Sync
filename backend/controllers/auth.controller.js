import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
  console.log("===== LOGIN ENDPOINT HIT =====");
  console.log("Request Body:", req.body);
  try {
    const { email, password } = req.body;
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const normalizedEmail = trimmedEmail.toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        statusCode: 400,
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );
    console.log("User found:", user?.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    const token = generateToken(user);
    console.log("Login successful");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
      statusCode: 500,
    });
  }
};

export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get logged-in user error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the user",
      statusCode: 500,
    });
  }
};

export default {
  loginUser,
  getLoggedInUser,
};
