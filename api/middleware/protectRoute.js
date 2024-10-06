import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-netflix"];
    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "Not authorized, no token provided" });
    }
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    if (!decoded) {
      res
        .status(401)
        .json({ success: false, message: "Not authorized, invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "Not authorized, no user found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, message: "Internal server error" });
  }
};
