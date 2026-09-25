import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    updateProfile,
    getAuth,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";

import app, { db } from "../config/firebase";
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

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
        console.warn(
            "Could not send email verification:",
            error
        );
    }

    try {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: name || "",
            email: email || "",
            phone: phone || "",
            role: "customer",
            status: "active",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        console.log(
            "✅ Firestore user document created:",
            user.uid
        );
    } catch (firestoreError) {
        console.error(
            "❌ Firestore user creation error:",
            firestoreError
        );
        throw firestoreError;
    }

    return user;
};

export const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid,
                name: user.displayName || "مستخدم Google",
                email: user.email || "",
                phone: user.phoneNumber || "",
                role: "customer",
                status: "active",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }
    } catch (err) {
        console.error("Firestore Google sign in doc error:", err);
    }

    return result;
};

export const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
};

export const logout = async () => {
    return await signOut(auth);
};

// --- إدارة المستخدمين والأدوار ---

export const getUserProfile = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

export const getAllUsers = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        querySnapshot.forEach((d) => {
            users.push({ id: d.id, ...d.data() });
        });
        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

export const updateUserRole = async (userId, newRole) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            role: newRole,
            updatedAt: serverTimestamp(),
        });
        return true;
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
};

export { auth, db };