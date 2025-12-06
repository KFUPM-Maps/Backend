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

const PROFILE_PIC_BUCKET = process.env.NODE_ENV === "development"
  ? process.env.PROFILE_PIC_BUCKET_DEV
  : process.env.PROFILE_PIC_BUCKET;

const ROUTE_PHOTO_BUCKET = process.env.NODE_ENV === "development"
  ? process.env.ROUTE_PHOTO_BUCKET_DEV
  : process.env.ROUTE_PHOTO_BUCKET;

export default {
  MONGODB_URI,
  PORT,
  FRONTEND_URL,
  PROFILE_PIC_BUCKET,
  ROUTE_PHOTO_BUCKET
};
