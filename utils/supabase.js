import { createClient } from "@supabase/supabase-js";
import config from "./config.js";
import dotenv from "dotenv";

dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const getSignedUrl = async (filePath) => {
  const { data, error } = await supabase.storage
    .from(config.PROFILE_PIC_BUCKET)
    .createSignedUploadUrl(filePath, {upsert: true});

  if (error) throw new Error(error.message);
  return data.signedUrl;
};

