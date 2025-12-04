import Route from "../../models/Route.js";
import mongoose from "mongoose";
import RouteLike from "../../models/RouteLike.js";
import { checkAuth, checkAuthOptional } from "../../utils/auth.js";
import { supabase } from "../../utils/supabase.js";
import express from "express";
import User from "../../models/user.js";

const router = express.Router();

router.get("/:id", checkAuthOptional, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    let route = await Route.findById(id).lean();

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    let isLikedBycurrentUser = false;
    if (req.user) {
      isLikedBycurrentUser = (await RouteLike.findOne({
        routeId: route._id,
        userId: req.user._id,
      }))
        ? true
        : false;
    }

    const routeUser = await User.findById(route.userId).select(
      "firstName lastName picture"
    );

    return res.json({
      id: route._id,
      title: route.title,
      user: routeUser,
      firstBuilding: route.firstBuilding,
      secondBuilding: route.secondBuilding,
      steps: route.steps,
      lastUpdated: route.updatedAt,
      starsCount: route.starsCount,
      isLikedByUser: isLikedBycurrentUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", checkAuth, async (req, res) => {
  try {
    const { title, firstBuilding, secondBuilding, steps } = req.body;
    const userId = req.user._id;

    if (!title || !firstBuilding || !secondBuilding || !steps) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (
      !Array.isArray(steps) ||
      steps.length === 0 ||
      steps.some((s) => s.index == null || !s.caption)
    ) {
      return res.status(400).json({ message: "Invalid steps array" });
    }

    const route = await Route.create({
      title,
      firstBuilding,
      secondBuilding,
      userId,
      steps: steps.map((s) => ({
        index: s.index,
        caption: s.caption,
        photo: "pending",
      })),
    });

    // Clear all existing step photos in Supabase
    const folderPath = `${route._id}/steps`;
    const { data: existingFiles, error: listError } = await supabase.storage
      .from("routes")
      .list(folderPath, { recursive: true });

    if (listError) {
      console.error("Error listing files:", listError);
      return res.status(500).json({ message: "Failed to list existing files" });
    }

    if (existingFiles.length > 0) {
      const filePaths = existingFiles.map(
        (file) => `${folderPath}/${file.name}`
      );
      const { error: deleteError } = await supabase.storage
        .from("routes")
        .remove(filePaths);

      if (deleteError) {
        console.error("Error deleting files:", deleteError);
        return res
          .status(500)
          .json({ message: "Failed to delete existing photos" });
      }
    }

    const uploads = [];

    for (const step of route.steps) {
      const filePath = `${route._id}/steps/${step._id}.jpg`;

      const { data, error } = await supabase.storage
        .from("routes")
        .createSignedUploadUrl(filePath);

      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create upload URL" });
      }

      uploads.push({
        stepId: step._id,
        index: step.index,
        uploadUrl: data.signedUrl,
        filePath,
      });
    }

    return res.status(201).json({
      message: "Route created. Upload images using the provided URLs.",
      routeId: route._id,
      uploads,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:routeId/photos", checkAuth, async (req, res) => {
  try {
    const { routeId } = req.params;
    const { photos } = req.body; // [{ stepId, key }]

    if (!photos || !Array.isArray(photos)) {
      return res.status(400).json({ message: "Photos array is required" });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (route.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    for (const { stepId, Key } of photos) {
      const step = route.steps.id(stepId);
      if (step) {
        const { data } = supabase.storage
          .from("routes")
          .getPublicUrl(Key.slice(7));
        step.photo = data.publicUrl;
      }
    }

    await route.save();

    return res.json({
      message: "All step photos updated successfully",
      updated: photos.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const routeId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (route.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized delete request" });
    }

    const folderPath = `${routeId}/steps`;

    const { data: files, error: listError } = await supabase.storage
      .from("routes")
      .list(folderPath, { recursive: true });

    if (listError) {
      console.error("Error listing route photos:", listError);
      return res.status(500).json({ message: "Failed to list route photos" });
    }

    // Delete files if any exist
    if (files.length > 0) {
      const filePaths = files.map((file) => `${folderPath}/${file.name}`);

      const { error: deleteError } = await supabase.storage
        .from("routes")
        .remove(filePaths);

      if (deleteError) {
        console.error("Error deleting route photos:", deleteError);
        return res
          .status(500)
          .json({ message: "Failed to delete route photos" });
      }
    }

    await route.deleteOne();
    const result = await RouteLike.deleteMany({ routeId });
    await User.findByIdAndUpdate(userId, {
      $inc: { score: -10 - result.deletedCount },
    });

    return res.json({ message: "Route deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
