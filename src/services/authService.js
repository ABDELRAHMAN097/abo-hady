import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";
import {
    USERS_COLLECTION,
    getSearchFields,
    saveUserSearchFields,
} from "./userUtils";

export const googleProvider = new GoogleAuthProvider();

/**
 * Registers a new user with email and password and creates their Firestore record.
 */
export const registerWithEmail = async ({
    email,
    password,
    name,
    phone = "",
}) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    const user = userCredential.user;

    await updateProfile(user, {
        displayName: name,
    });

    try {
        await sendEmailVerification(user);
    } catch (error) {
        console.warn("Could not send email verification:", error);
    }

    try {
        const searchFields = getSearchFields({
            name,
            email,
            phone,
        });

        await setDoc(
            doc(db, USERS_COLLECTION, user.uid),
            {
                uid: user.uid,
                name: name || "",
                email: email || "",
                phone: phone || "",
                role: "customer",
                status: "active",
                ...searchFields,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }
        );
    } catch (firestoreError) {
        console.error("Firestore user creation error:", firestoreError);
        throw firestoreError;
    }

    return user;
};

/**
 * Signs in a user with email and password.
 */
export const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    try {
        const userDocRef = doc(db, USERS_COLLECTION, result.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            await saveUserSearchFields(result.user.uid, userDoc.data());
        }
    } catch (error) {
        console.error("User search fields update error:", error);
    }

    return result;
};

/**
 * Signs in or registers a user via Google popup.
 */
export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    try {
        const userDocRef = doc(db, USERS_COLLECTION, user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const searchFields = getSearchFields({
                name: user.displayName || "مستخدم Google",
                email: user.email || "",
                phone: user.phoneNumber || "",
            });

            await setDoc(userDocRef, {
                uid: user.uid,
                name: user.displayName || "مستخدم Google",
                email: user.email || "",
                phone: user.phoneNumber || "",
                role: "customer",
                status: "active",
                ...searchFields,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        } else {
            await saveUserSearchFields(user.uid, userDoc.data());
        }
    } catch (error) {
        console.error("Firestore Google sign in doc error:", error);
    }

    return result;
};

/**
 * Sends a password reset email.
 */
export const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
};

/**
 * Signs out the current user.
 */
export const logout = async () => {
    return await signOut(auth);
};

/**
 * Re-authenticates and updates current user password.
 */
export const changeCurrentUserPassword = async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    if (!user || !user.email) {
        throw new Error("No authenticated user found.");
    }

    try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        return true;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};

/**
 * Resends email verification to currently logged in user.
 */
export const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No authenticated user found.");
    }
    await sendEmailVerification(user);
    return true;
};

export { auth, db };
