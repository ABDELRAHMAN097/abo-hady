import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed",
        });
    }

    try {
        const body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body;

        let { publicId } = body || {};

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: "publicId is required",
            });
        }

        publicId = String(publicId)
            .trim()
            .replace(/\.[^/.]+$/, "");

        console.log(
            "Deleting Cloudinary public ID:",
            publicId
        );

        const result =
            await cloudinary.uploader.destroy(
                publicId,
                {
                    resource_type: "image",
                    invalidate: true,
                }
            );

        console.log(
            "Cloudinary delete result:",
            result
        );

        if (result?.result !== "ok") {
            return res.status(400).json({
                success: false,
                message:
                    result?.result ||
                    "Cloudinary image was not deleted",
                result,
            });
        }

        return res.status(200).json({
            success: true,
            result,
        });
    } catch (error) {
        console.error(
            "Cloudinary delete error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error?.message ||
                "Failed to delete image",
        });
    }
}