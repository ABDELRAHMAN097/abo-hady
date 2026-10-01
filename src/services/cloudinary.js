/* =========================================================
   CLOUDINARY CONFIG
========================================================= */

const CLOUD_NAME =
    import.meta?.env?.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
    import.meta?.env?.VITE_CLOUDINARY_UPLOAD_PRESET;

/* =========================================================
   EXTRACT PUBLIC ID FROM CLOUDINARY URL
========================================================= */

export const getPublicIdFromUrl = (url) => {
    if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
        return "";
    }

    try {
        const splitUpload = url.split("/upload/");
        if (splitUpload.length < 2) return "";
        let rest = splitUpload[1];

        // Handle version prefix like /v123456789/
        const vMatch = rest.match(/(?:^|\/)v\d+\/(.+)$/);
        if (vMatch) {
            rest = vMatch[1];
        } else {
            // Remove transformation segment if present
            const parts = rest.split("/");
            if (parts.length > 1 && (parts[0].includes(",") || parts[0].includes("_"))) {
                parts.shift();
                rest = parts.join("/");
            }
        }

        // Remove query parameters
        rest = rest.split("?")[0];

        // Remove file extension
        const dotIdx = rest.lastIndexOf(".");
        if (dotIdx !== -1) {
            rest = rest.substring(0, dotIdx);
        }

        return rest;
    } catch {
        return "";
    }
};

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
   Accepts either a publicId or a Cloudinary URL
========================================================= */

export const deleteFromCloudinary = async (
    publicIdOrUrl
) => {
    if (!publicIdOrUrl) {
        return {
            success: true,
            skipped: true,
        };
    }

    let publicId = publicIdOrUrl;
    if (
        typeof publicIdOrUrl === "string" &&
        (publicIdOrUrl.startsWith("http://") ||
            publicIdOrUrl.startsWith("https://"))
    ) {
        publicId = getPublicIdFromUrl(publicIdOrUrl);
        if (!publicId) {
            return {
                success: true,
                skipped: true,
            };
        }
    }

    try {
        const response = await fetch(
            "/api/delete-image",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    publicId,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message ||
                    "Failed to delete Cloudinary image"
            );
        }

        return data;
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