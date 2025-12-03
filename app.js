import dotenv from  "dotenv";
dotenv.config();
import express from "express";
import config from "./utils/config.js";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./controllers/auth.js";
import testRouter from "./controllers/test.js";

const app = express();

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.info("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
