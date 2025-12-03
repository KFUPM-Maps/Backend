import jwt from "jsonwebtoken";
import User from "../models/user.js";

const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid auth header" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};

export { checkAuth, checkAdmin };
