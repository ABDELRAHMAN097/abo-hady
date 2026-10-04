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
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getCountFromServer,
    documentId,
} from "firebase/firestore";

import app, {
    db,
} from "../config/firebase";

const auth = getAuth(app);

const googleProvider =
    new GoogleAuthProvider();

const USERS_COLLECTION =
    "users";

const DEFAULT_PAGE_SIZE = 5;

// ======================================================
// Authentication
// ======================================================

export const registerWithEmail =
    async ({
        email,
        password,
        name,
        phone = "",
    }) => {
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user =
            userCredential.user;

        await updateProfile(user, {
            displayName: name,
        });

        try {
            await sendEmailVerification(
                user
            );
        } catch (error) {
            console.warn(
                "Could not send email verification:",
                error
            );
        }

        try {
            await setDoc(
                doc(
                    db,
                    USERS_COLLECTION,
                    user.uid
                ),
                {
                    uid: user.uid,
                    name: name || "",
                    email: email || "",
                    phone: phone || "",
                    role: "customer",
                    status: "active",
                    createdAt:
                        serverTimestamp(),
                    updatedAt:
                        serverTimestamp(),
                }
            );

            console.log(
                "✅ Firestore user document created:",
                user.uid
            );
        } catch (
        firestoreError
        ) {
            console.error(
                "❌ Firestore user creation error:",
                firestoreError
            );

            throw firestoreError;
        }

        return user;
    };

export const loginWithEmail =
    async (
        email,
        password
    ) => {
        return await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
    };

export const signInWithGoogle =
    async () => {
        const result =
            await signInWithPopup(
                auth,
                googleProvider
            );

        const user =
            result.user;

        try {
            const userDocRef =
                doc(
                    db,
                    USERS_COLLECTION,
                    user.uid
                );

            const userDoc =
                await getDoc(
                    userDocRef
                );

            if (!userDoc.exists()) {
                await setDoc(
                    userDocRef,
                    {
                        uid: user.uid,
                        name:
                            user.displayName ||
                            "مستخدم Google",
                        email:
                            user.email ||
                            "",
                        phone:
                            user.phoneNumber ||
                            "",
                        role: "customer",
                        status: "active",
                        createdAt:
                            serverTimestamp(),
                        updatedAt:
                            serverTimestamp(),
                    }
                );
            }
        } catch (err) {
            console.error(
                "Firestore Google sign in doc error:",
                err
            );
        }

        return result;
    };

export const resetPassword =
    async (email) => {
        return await sendPasswordResetEmail(
            auth,
            email
        );
    };

export const logout =
    async () => {
        return await signOut(auth);
    };

// ======================================================
// User Profile
// ======================================================

export const getUserProfile =
    async (uid) => {
        try {
            const docRef =
                doc(
                    db,
                    USERS_COLLECTION,
                    uid
                );

            const docSnap =
                await getDoc(
                    docRef
                );

            if (
                docSnap.exists()
            ) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                };
            }

            return null;
        } catch (error) {
            console.error(
                "Error fetching user profile:",
                error
            );

            return null;
        }
    };

// ======================================================
// Users Pagination
// ======================================================

/**
 * Get users page-by-page from Firestore.
 *
 * IMPORTANT:
 * This does NOT download all users.
 *
 * Example:
 *
 * const result = await getAllUsers({
 *     pageSize: 5,
 *     role: "customer",
 *     status: "active",
 *     cursor: lastDocument,
 * });
 *
 * Returns:
 *
 * {
 *     users,
 *     lastDoc,
 *     hasNextPage
 * }
 */

// ======================================================
// Users Pagination
// ======================================================

export const getAllUsers = async ({
    pageSize = DEFAULT_PAGE_SIZE,
    role = "all",
    status = "all",
    cursor = null,
} = {}) => {
    try {
        const usersRef = collection(
            db,
            USERS_COLLECTION
        );

        const constraints = [];

        // ==================================================
        // Filters
        // ==================================================

        if (role && role !== "all") {
            constraints.push(
                where("role", "==", role)
            );
        }

        if (status && status !== "all") {
            constraints.push(
                where("status", "==", status)
            );
        }

        // ==================================================
        // Stable Pagination Order
        // ==================================================
        /*
         * We intentionally use documentId()
         * instead of createdAt.
         *
         * Why?
         *
         * Some old users don't have createdAt.
         * Firestore orderBy(createdAt) excludes
         * those documents completely.
         *
         * documentId() exists for every Firestore
         * document, so all users will appear.
         */

        constraints.push(
            orderBy(
                documentId(),
                "asc"
            )
        );

        // ==================================================
        // Pagination Cursor
        // ==================================================

        if (cursor) {
            constraints.push(
                startAfter(cursor)
            );
        }

        // ==================================================
        // Fetch One Extra Document
        // ==================================================

        constraints.push(
            limit(pageSize + 1)
        );

        // ==================================================
        // Build Query
        // ==================================================

        const usersQuery = query(
            usersRef,
            ...constraints
        );

        const querySnapshot =
            await getDocs(usersQuery);
            

        const documents =
            querySnapshot.docs;

        // ==================================================
        // Check Next Page
        // ==================================================

        const hasNextPage =
            documents.length >
            pageSize;

        // ==================================================
        // Current Page Documents
        // ==================================================

        const pageDocuments =
            hasNextPage
                ? documents.slice(
                    0,
                    pageSize
                )
                : documents;

        // ==================================================
        // Convert Documents
        // ==================================================

        const users =
            pageDocuments.map(
                (docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                })
            );

        // ==================================================
        // Last Document
        // ==================================================

        const lastDoc =
            pageDocuments.length > 0
                ? pageDocuments[
                pageDocuments.length - 1
                ]
                : null;

        return {
            users,
            lastDoc,
            hasNextPage,
        };
    } catch (error) {
        console.error(
            "Error fetching paginated users:",
            error
        );

        throw error;
    }
};


export const getUserStats =
    async () => {
        try {
            const usersRef =
                collection(
                    db,
                    USERS_COLLECTION
                );

            const totalQuery =
                query(usersRef);

            const customersQuery =
                query(
                    usersRef,
                    where(
                        "role",
                        "==",
                        "customer"
                    )
                );

            const driversQuery =
                query(
                    usersRef,
                    where(
                        "role",
                        "==",
                        "driver"
                    )
                );

            const adminsQuery =
                query(
                    usersRef,
                    where(
                        "role",
                        "==",
                        "admin"
                    )
                );

            const superAdminsQuery =
                query(
                    usersRef,
                    where(
                        "role",
                        "==",
                        "super_admin"
                    )
                );

            const [
                totalSnapshot,
                customersSnapshot,
                driversSnapshot,
                adminsSnapshot,
                superAdminsSnapshot,
            ] =
                await Promise.all([
                    getCountFromServer(
                        totalQuery
                    ),

                    getCountFromServer(
                        customersQuery
                    ),

                    getCountFromServer(
                        driversQuery
                    ),

                    getCountFromServer(
                        adminsQuery
                    ),

                    getCountFromServer(
                        superAdminsQuery
                    ),
                ]);

            const total =
                totalSnapshot.data()
                    .count;

            const customers =
                customersSnapshot.data()
                    .count;

            const drivers =
                driversSnapshot.data()
                    .count;

            const admins =
                adminsSnapshot.data()
                    .count;

            const superAdmins =
                superAdminsSnapshot.data()
                    .count;

            return {
                total,
                customers,
                drivers,
                admins,
                superAdmins,

                management:
                    admins +
                    superAdmins,
            };
        } catch (error) {
            console.error(
                "Error fetching user statistics:",
                error
            );

            throw error;
        }
    };

// ======================================================
// Role Statistics
// ======================================================

/**
 * Get count for a specific role.
 *
 * Useful for filter tabs.
 */
export const getUsersCountByRole =
    async (
        role = "all"
    ) => {
        try {
            const usersRef =
                collection(
                    db,
                    USERS_COLLECTION
                );

            let usersQuery;

            if (
                role === "all"
            ) {
                usersQuery =
                    query(usersRef);
            } else {
                usersQuery =
                    query(
                        usersRef,
                        where(
                            "role",
                            "==",
                            role
                        )
                    );
            }

            const snapshot =
                await getCountFromServer(
                    usersQuery
                );

            return snapshot
                .data()
                .count;
        } catch (error) {
            console.error(
                "Error fetching users count:",
                error
            );

            throw error;
        }
    };

// ======================================================
// Update User Role
// ======================================================

export const updateUserRole =
    async (
        userId,
        newRole
    ) => {
        try {
            const userRef =
                doc(
                    db,
                    USERS_COLLECTION,
                    userId
                );

            await updateDoc(
                userRef,
                {
                    role: newRole,
                    updatedAt:
                        serverTimestamp(),
                }
            );

            return true;
        } catch (error) {
            console.error(
                "Error updating user role:",
                error
            );

            throw error;
        }
    };

// ======================================================
// Exports
// ======================================================

export {
    auth,
    db,
};