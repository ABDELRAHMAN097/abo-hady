import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "dtdpkfkw2").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "181285968731254").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "TJTUTGw2KkiFiwpGdC9duIOxIBs").trim(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { publicId } = body || {};

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "publicId is required",
      });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to delete image",
      error,
    });
  }
}