const {
    onCall,
    HttpsError,
} = require("firebase-functions/v2/https");

const {
    initializeApp,
} = require("firebase-admin/app");

const {
    getFirestore,
} = require("firebase-admin/firestore");

const cloudinary =
    require("cloudinary").v2;

/* =========================================================
   FIREBASE ADMIN
========================================================= */

initializeApp();

const db = getFirestore();

/* =========================================================
   CLOUDINARY CONFIG
========================================================= */

cloudinary.config({
    cloud_name: "dtdpkfkw2",

    api_key:
        process.env.CLOUDINARY_API_KEY,

    api_secret:
        process.env.CLOUDINARY_API_SECRET,
});

/* =========================================================
   DELETE HERO IMAGE
========================================================= */

exports.deleteHeroImage = onCall(
    {
        secrets: [
            "CLOUDINARY_API_KEY",
            "CLOUDINARY_API_SECRET",
        ],
    },

    async (request) => {
        try {
            /* =========================================
               CHECK LOGIN
            ========================================= */

            if (!request.auth) {
                throw new HttpsError(
                    "unauthenticated",
                    "You must be logged in."
                );
            }

            /* =========================================
               GET USER UID
            ========================================= */

            const uid =
                request.auth.uid;

            /* =========================================
               GET USER DOCUMENT
            ========================================= */

            const userRef = db
                .collection("users")
                .doc(uid);

            const userSnap =
                await userRef.get();

            if (!userSnap.exists) {
                throw new HttpsError(
                    "permission-denied",
                    "User profile not found."
                );
            }

            const userData =
                userSnap.data();

            /* =========================================
               CHECK SUPER ADMIN
            ========================================= */

            if (
                userData.role !== "super_admin" &&
                userData.role !== "admin"
            ) {
                throw new HttpsError(
                    "permission-denied",
                    "Only administrators can delete images."
                );
            }

            /* =========================================
               GET PUBLIC ID
            ========================================= */

            const {
                publicId,
            } = request.data || {};

            if (
                !publicId ||
                typeof publicId !== "string"
            ) {
                throw new HttpsError(
                    "invalid-argument",
                    "A valid Cloudinary publicId is required."
                );
            }

            /* =========================================
               SAFETY CHECK
               HERO / LANDING IMAGES PREFIX
            ========================================= */

            const isAllowedPrefix =
                publicId.startsWith("abu-hady/") ||
                publicId.startsWith("abu_hady/") ||
                publicId.startsWith("abu_hady_landing/") ||
                publicId.includes("landing");

            if (!isAllowedPrefix) {
                throw new HttpsError(
                    "invalid-argument",
                    "This image does not belong to the landing page."
                );
            }

            /* =========================================
               DELETE FROM CLOUDINARY
            ========================================= */

            const result =
                await cloudinary.uploader.destroy(
                    publicId,
                    {
                        resource_type:
                            "image",

                        type: "upload",
                    }
                );

            console.log(
                "Cloudinary hero delete result:",
                result
            );

            /* =========================================
               CLOUDINARY RESULTS
            ========================================= */

            if (
                result.result !== "ok" &&
                result.result !==
                    "not found"
            ) {
                throw new HttpsError(
                    "internal",
                    "Cloudinary could not delete the hero image."
                );
            }

            /* =========================================
               SUCCESS
            ========================================= */

            return {
                success: true,

                publicId,

                result:
                    result.result,
            };
        } catch (error) {
            console.error(
                "deleteHeroImage error:",
                error
            );

            /* =========================================
               PRESERVE FIREBASE ERRORS
            ========================================= */

            if (
                error instanceof
                HttpsError
            ) {
                throw error;
            }

            /* =========================================
               UNKNOWN ERROR
            ========================================= */

            throw new HttpsError(
                "internal",
                error.message ||
                    "Failed to delete hero image."
            );
        }
    }
);

exports.deleteCloudinaryImage = exports.deleteHeroImage;