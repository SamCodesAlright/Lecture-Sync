import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

console.log("Cloudinary config check:");
console.log("Cloud Name:", CLOUDINARY_CLOUD_NAME ? "Set" : "Missing");
console.log("API Key:", CLOUDINARY_API_KEY ? "Set" : "Missing");
console.log("API Secret:", CLOUDINARY_API_SECRET ? "Set" : "Missing");

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    "Missing Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.",
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

console.log("Cloudinary configured with:");
console.log("Cloud name:", CLOUDINARY_CLOUD_NAME);
console.log("API Key:", CLOUDINARY_API_KEY.substring(0, 8) + "...");
console.log("API Secret:", CLOUDINARY_API_SECRET.substring(0, 8) + "...");

export default cloudinary;
