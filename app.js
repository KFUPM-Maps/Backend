import dotenv from  "dotenv";
dotenv.config();
import express from "express";
import config from "./utils/config.js";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./controllers/auth.js";
import testRouter from "./controllers/test.js";
import accountRouter from "./controllers/account.js";
import leaderboardRouter from "./controllers/leaderboard.js";
import { requestLogger } from "./utils/logger.js";
import routeRouter from "./controllers/routes/route.js";
import routesRouter from "./controllers/routes/routes.js";
import routeLikeRouter from "./controllers/routes/routeLike.js";
import manageRouteRouter from "./controllers/routes/manageRoute.js";

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
app.use(requestLogger);

app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);
app.use("/api/account", accountRouter);
app.use("/api/leaderboard", leaderboardRouter);

//routes

app.use("/api/routes", routesRouter);
app.use("/api/routes", routeRouter);
app.use("/api/routes", routeLikeRouter);
app.use("/api/routes", manageRouteRouter);

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
