import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select('firstName lastName picture score')
      .sort({ score: -1 });

    return res.json(users);
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
