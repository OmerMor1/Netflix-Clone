import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }
    const emailRgeex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRgeex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }
    const exsisitingUserByEmail = await User.findOne({ email: email });
    if (exsisitingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }
    const exsisitingUserByUsername = await User.findOne({ username: username });
    if (exsisitingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: "An account with this username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      image,
    });

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();
    //remove password from the response
    res
      .status(201)
      .json({ success: true, user: { ...newUser._doc, password: "" } });
  } catch (err) {
    console.error("Error in signup: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    //remove password from the response
    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: "" } });
  } catch (err) {
    console.error("Error in login: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Error in logout: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function authCheck(req, res) {
  try {
    console.log("req.user:", req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("Error in authCheck controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
