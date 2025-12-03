import jwt from "jsonwebtoken";

export function generateAccessToken(id) {
  return jwt.sign({ id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(id) {
  return jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
}
