import express from "express";
import { checkAuth } from "../utils/auth.js";
import User from "../models/user.js";
import { getSignedUrl, supabase } from "../utils/supabase.js";
import config from "../utils/config.js";

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
    const { firstName, lastName, Key } = req.body;
    let updateData = {};

    if(Key){
      const { data } = supabase.storage.from(config.PROFILE_PIC_BUCKET).getPublicUrl(Key.slice(config.PROFILE_PIC_BUCKET.length + 1));
      let newPictureUrl = data.publicUrl;
      updateData.picture = newPictureUrl;
    }

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
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
        score: user.score
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
