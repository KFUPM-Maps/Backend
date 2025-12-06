import Route from "../../models/Route.js";
import { checkAuth, checkAdmin } from "../../utils/auth.js";
import User from "../../models/User.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { firstBuilding, secondBuilding } = req.query;

    if (!firstBuilding || !secondBuilding) {
      return res.status(400).json({
        message: "firstBuilding and secondBuilding are required",
      });
    }

    const routes = await Route.find({
      firstBuilding,
      secondBuilding,
      status: "approved",
    }).lean();

    const formattedRoutes = [];

    for (const route of routes) {
      const routeUser = await User.findById(route.userId).select(
        "firstName lastName picture"
      );
      formattedRoutes.push({
        id: route._id,
        title: route.title,
        user: routeUser,
        firstBuilding: route.firstBuilding,
        secondBuilding: route.secondBuilding,
        lastUpdated: route.updatedAt,
        starsCount: route.starsCount,
        status: route.status,
      });
    }

    return res.json(formattedRoutes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/myroutes", checkAuth, async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res
        .status(400)
        .json({ message: "status query parameter is required" });
    }

    const routes = await Route.find({
      userId: req.user._id,
      status: status,
    }).lean();

    let currentUser = User.findById(req.user._id).select(
      "firstName lastName picture"
    );

    const formattedRoutes = [];

    for (const route of routes) {
      const routeUser = await User.findById(route.userId).select(
        "firstName lastName picture"
      );
      formattedRoutes.push({
        id: route._id,
        title: route.title,
        user: routeUser,
        firstBuilding: route.firstBuilding,
        secondBuilding: route.secondBuilding,
        lastUpdated: route.updatedAt,
        starsCount: route.starsCount,
        status: route.status,
      });
    }

    return res.json(formattedRoutes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/manageroutes", checkAuth, checkAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res
        .status(400)
        .json({ message: "status query parameter is required" });
    }

    const routes = await Route.find({
      status: status,
    }).lean();

    const formattedRoutes = [];

    for (const route of routes) {
      const routeUser = await User.findById(route.userId).select(
        "firstName lastName picture"
      );
      formattedRoutes.push({
        id: route._id,
        title: route.title,
        user: routeUser,
        firstBuilding: route.firstBuilding,
        secondBuilding: route.secondBuilding,
        lastUpdated: route.updatedAt,
        starsCount: route.starsCount,
        status: route.status,
      });
    }

    return res.json(formattedRoutes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
