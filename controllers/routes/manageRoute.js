import Route from "../../models/Route.js";
import { checkAuth, checkAdmin } from "../../utils/auth.js";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.put("/manage/:id", checkAuth, checkAdmin, async (req, res) => {
  try {
    const routeId = req.params.id;
    const {status} = req.body;

    if(!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({ message: "Invalid route ID" });
    }

    if(!status || !['pending', 'approved', 'rejected'].includes(status)) return res.status(400).json({ message: "status should only be one of these options:['pending', 'approved', 'rejected']" }) 
    const route = await Route.findByIdAndUpdate(routeId, {status})
    if(!route) return res.status(404).json({ message: "Route not found" });

    return res.json({
        message:`Route ${status}`
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
