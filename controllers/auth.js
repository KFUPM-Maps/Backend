import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      type: "user",
      picture: null,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        picture: user.picture,
        score: user.score
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        picture: user.picture,
        score: user.score
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  console.log("Refresh token cookie:", req.cookies.refreshToken);

  if (!token) return res.status(401).json({ message: "Missing refresh token" });

  jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    res.json({ accessToken: newAccessToken });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", cookieOptions);
  res.json({ message: "Logged out successfully" });
});

export default router;
