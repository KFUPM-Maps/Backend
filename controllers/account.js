import express from "express";
import { checkAuth } from "../utils/auth.js";
import User from "../models/user.js";
import { getSignedUrl } from "../utils/supabase.js";

const router = express.Router();

router.get("/updateaccount", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "firstName lastName picture email type"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    let presignedUrl = await getSignedUrl(`${user._id}.png`);

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      presignedUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateaccount", checkAuth, async (req, res) => {
  try {
    const { firstName, lastName, picture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, picture },
      { new: true, runValidators: true }
    ).select("firstName lastName picture email type");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Account updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        picture: user.picture,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
