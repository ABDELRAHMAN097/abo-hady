
import {
    getFunctions,
    httpsCallable,
} from "firebase/functions";

import app from "@/config/firebase";

/* =========================================================
   CLOUDINARY CONFIG
========================================================= */

const CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/* =========================================================
   UPLOAD IMAGE
========================================================= */

export const uploadToCloudinary = async (file) => {
    if (!file) {
        throw new Error("No file selected");
    }

    if (!CLOUD_NAME) {
        throw new Error(
            "Cloudinary cloud name is missing"
        );
    }

    if (!UPLOAD_PRESET) {
        throw new Error(
            "Cloudinary upload preset is missing"
        );
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "upload_preset",
        UPLOAD_PRESET
    );

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error(
            "Cloudinary upload error:",
            data
        );

        throw new Error(
            data?.error?.message ||
                "Cloudinary upload failed"
        );
    }

    return {
        imageUrl: data.secure_url,
        publicId: data.public_id,
    };
};

/* =========================================================
   DELETE IMAGE
========================================================= */

export const deleteFromCloudinary = async (
    publicId
) => {
    if (!publicId) {
        return {
            success: true,
            skipped: true,
        };
    }

    try {
        const functions = getFunctions(
            app,
            "us-central1"
        );

        const deleteImage = httpsCallable(
            functions,
            "deleteCloudinaryImage"
        );

        const result = await deleteImage({
            publicId,
        });

        return result.data;
    } catch (error) {
        console.error(
            "Cloudinary delete error:",
            error
        );

        throw new Error(
            error?.message ||
                "Failed to delete Cloudinary image"
        );
    }
};