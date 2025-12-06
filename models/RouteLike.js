import mongoose from "mongoose";

const routeLikeSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

routeLikeSchema.index({ routeId: 1, userId: 1 }, { unique: true });

const RouteLike = mongoose.model("RouteLike", routeLikeSchema);

export default RouteLike;
