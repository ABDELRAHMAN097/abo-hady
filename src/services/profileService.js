import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../config/firebase";
import {
    USERS_COLLECTION,
    getSearchFields,
} from "./userUtils";

/**
 * Fetches user profile document by UID from Firestore.
 */
export const getUserProfile = async (uid) => {
    try {
        if (!uid) return null;
        const docRef = doc(db, USERS_COLLECTION, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

/**
 * Updates or creates user profile data in Firestore and syncs displayName/photoURL with Firebase Auth if current user matches.
 * Uses setDoc with merge: true to avoid "No document to update" errors and strips undefined values.
 */
export const updateUserProfileData = async (userId, data = {}) => {
    try {
        const targetId = userId || auth.currentUser?.uid;
        if (!targetId) {
            throw new Error("User ID is required to update profile data.");
        }

        const userRef = doc(db, USERS_COLLECTION, targetId);

        // Fetch existing data if present to preserve search indexing fields accurately
        let existingData = {};
        try {
            const existingSnap = await getDoc(userRef);
            if (existingSnap.exists()) {
                existingData = existingSnap.data() || {};
            }
        } catch (fetchErr) {
            console.warn("Could not retrieve existing user doc before update:", fetchErr);
        }

        // Clean out any undefined values to avoid Firestore rejection
        const cleanData = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                cleanData[key] = value;
            }
        }

        const updates = {
            ...cleanData,
            updatedAt: serverTimestamp(),
        };

        // If the document does not exist yet, ensure baseline attributes are set
        if (!existingData.uid && !existingData.id) {
            updates.uid = targetId;
            if (!updates.role) updates.role = existingData.role || "customer";
            if (!updates.status) updates.status = existingData.status || "active";
            if (!updates.createdAt) updates.createdAt = serverTimestamp();
        }

        // Handle search fields normalization safely without overriding missing fields with empty strings
        if (
            cleanData.name !== undefined ||
            cleanData.phone !== undefined ||
            cleanData.email !== undefined
        ) {
            const name =
                cleanData.name !== undefined
                    ? cleanData.name
                    : (existingData.name || auth.currentUser?.displayName || "");
            const email =
                cleanData.email !== undefined
                    ? cleanData.email
                    : (existingData.email || auth.currentUser?.email || "");
            const phone =
                cleanData.phone !== undefined
                    ? cleanData.phone
                    : (existingData.phone || auth.currentUser?.phoneNumber || "");

            const searchFields = getSearchFields({ name, email, phone });
            Object.assign(updates, searchFields);
        }

        // Merge updates into the user document safely
        await setDoc(userRef, updates, { merge: true });

        // Sync displayName and photoURL with Firebase Auth if this is the currently authenticated user
        if (auth.currentUser && auth.currentUser.uid === targetId) {
            const authProfileUpdates = {};
            if (cleanData.name && cleanData.name !== auth.currentUser.displayName) {
                authProfileUpdates.displayName = cleanData.name;
            }
            if (cleanData.imageUrl && cleanData.imageUrl !== auth.currentUser.photoURL) {
                authProfileUpdates.photoURL = cleanData.imageUrl;
            }
            if (Object.keys(authProfileUpdates).length > 0) {
                await updateProfile(auth.currentUser, authProfileUpdates).catch((err) =>
                    console.warn("Could not sync with Firebase Auth profile:", err)
                );
            }
        }

        return true;
    } catch (error) {
        console.error("Error updating user profile data:", error);
        throw error;
    }
};
