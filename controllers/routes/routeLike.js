import Route from "../../models/Route.js";
import RouteLike from "../../models/RouteLike.js";
import { checkAuth } from "../../utils/auth.js";

const router = express.Router();

router.put("/:id", checkAuth, async (req, res) => {
  try {
    const routeId = req.params.id;
    const userId = req.user._id;
    const existingLike = await RouteLike.findOne({ routeId, userId });

    if (existingLike) {
      await RouteLike.deleteOne({ _id: existingLike._id });
      await Route.findByIdAndUpdate(routeId, { $inc: { starsCount: -1 } });
      return res.json({ message: "Route unliked" });
    } else {
      const newLike = new RouteLike({ routeId, userId });
      await newLike.save();
      await Route.findByIdAndUpdate(routeId, { $inc: { starsCount: 1 } });
      return res.json({ message: "Route liked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
