import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  photo: { type: String, required: true },
  caption: { type: String, required: true },
});

const routeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    firstBuilding: { type: String, required: true },
    secondBuilding: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    steps: {
      type: [stepSchema],
      required: true,
    },

    starsCount: {
      type: Number,
      default: 0,
    },
    status:{
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

export default Route;
