import express from "express";
import {checkAuth, checkAdmin} from "../utils/auth.js";

const router = express.Router();

router.get("/auth", checkAuth, (req, res) => {
  res.json({
    message: "Auth middleware is working!",
    user: req.user,
  });
});

router.get("/admin", checkAuth, checkAdmin, (req, res) => {
  res.json({
    message: "Admin middleware is working!",
    user: req.user,
  });
});

export default router;
