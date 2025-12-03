import dotenev from  "dotenv";
dotenev.config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_MONGODB_URI
    : process.env.MONGODB_URI;

const FRONTEND_URL = process.env.NODE_ENV === "development"
  ? process.env.DEV_FRONTEND_URL
  : process.env.FRONTEND_URL;

export default {
  MONGODB_URI,
  PORT,
  FRONTEND_URL,
};
