/* =========================================================
   CLOUDINARY CONFIG
========================================================= */

const CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


/* =========================================================
   EXTRACT PUBLIC ID FROM CLOUDINARY URL
========================================================= */

export const getPublicIdFromUrl = (url) => {
    if (
        !url ||
        typeof url !== "string" ||
        !url.includes("cloudinary.com")
    ) {
        return "";
    }

    try {
        const splitUpload = url.split("/upload/");

        if (splitUpload.length < 2) {
            return "";
        }

        let rest = splitUpload[1];

        // Remove version
        const versionMatch =
            rest.match(/(?:^|\/)v\d+\/(.+)$/);

        if (versionMatch) {
            rest = versionMatch[1];
        }

        // Remove query string
        rest = rest.split("?")[0];

        // Remove extension
        rest = rest.replace(
            /\.[^/.]+$/,
            ""
        );

        return decodeURIComponent(rest);
    } catch (error) {
        console.error(
            "Failed to extract Cloudinary public ID:",
            error
        );

        return "";
    }
};


/* =========================================================
   UPLOAD IMAGE
========================================================= */

export const uploadToCloudinary = async (file) => {
    if (!file) {
        throw new Error(
            "No file selected."
        );
    }

    if (!CLOUD_NAME) {
        throw new Error(
            "Cloudinary cloud name is missing."
        );
    }

    if (!UPLOAD_PRESET) {
        throw new Error(
            "Cloudinary upload preset is missing."
        );
    }

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "upload_preset",
        UPLOAD_PRESET
    );

    console.log(
        "Uploading image to Cloudinary..."
    );

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        console.error(
            "Cloudinary upload error:",
            data
        );

        throw new Error(
            data?.error?.message ||
            "Cloudinary upload failed."
        );
    }

    if (!data?.secure_url) {
        throw new Error(
            "Cloudinary did not return an image URL."
        );
    }

    console.log(
        "Cloudinary upload successful:",
        data.secure_url
    );

    return {
        imageUrl: data.secure_url,
        publicId: data.public_id || "",
    };
};


/* =========================================================
   DELETE IMAGE
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

    let publicId =
        publicIdOrUrl;

    // If URL was passed, extract public ID
    if (
        typeof publicIdOrUrl === "string" &&
        (
            publicIdOrUrl.startsWith("http://") ||
            publicIdOrUrl.startsWith("https://")
        )
    ) {
        publicId =
            getPublicIdFromUrl(
                publicIdOrUrl
            );
    }

    if (!publicId) {
        return {
            success: true,
            skipped: true,
        };
    }

    publicId = String(publicId)
        .trim()
        .replace(/\.[^/.]+$/, "");

    console.log(
        "Requesting Cloudinary delete:",
        publicId
    );

    const response = await fetch(
        "/api/delete-image",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                publicId,
            }),
        }
    );

    const text =
        await response.text();

    let data = {};

    try {
        data = text
            ? JSON.parse(text)
            : {};
    } catch {
        throw new Error(
            `Delete API returned invalid response (${response.status}).`
        );
    }

    if (!response.ok || data?.success === false) {
        throw new Error(
            data?.message ||
            `Failed to delete Cloudinary image (${response.status}).`
        );
    }

    return data;
};