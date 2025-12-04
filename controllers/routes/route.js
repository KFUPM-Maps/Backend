import Route from "../../models/Route.js";
import RouteLike from "../../models/RouteLike.js";
import { checkAuth, checkAuthOptional } from "../../utils/auth.js";

const router = express.Router();

router.get("/:id", checkAuthOptional, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).lean();
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    let isLikedBycurrentUser = false;
    if (req.user) {
      isLikedBycurrentUser = await RouteLike.findOne({
        routeId: route._id,
        userId: req.user._id,
      });
    }

    return res.json({
      id: route._id,
      title: route.title,
      user: User.findById(route.userId).select("firstName lastName picture"),
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

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const routeId = req.params.id;
    const userId = req.user._id;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (route.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized delete request" });
    }

    await route.deleteOne();
    await RouteLike.deleteMany({ routeId });
    await User.findByIdAndUpdate(userId, { $inc: { score: -10 } });

    return res.json({ message: "Route deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
