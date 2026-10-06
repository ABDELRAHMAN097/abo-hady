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

const USERS_COLLECTION = "users";

const DEFAULT_PAGE_SIZE = 5;

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
        } catch (firestoreError) {
            console.error(
                "Firestore user creation error:",
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
        } catch (error) {
            console.error(
                "Firestore Google sign in doc error:",
                error
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
                await getDoc(docRef);

            if (docSnap.exists()) {
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

export const getAllUsers = async ({
    pageSize = DEFAULT_PAGE_SIZE,
    role = "all",
    status = "all",
    cursor = null,
} = {}) => {
    try {
        const usersRef =
            collection(
                db,
                USERS_COLLECTION
            );

        const constraints = [];

        if (
            role &&
            role !== "all"
        ) {
            constraints.push(
                where(
                    "role",
                    "==",
                    role
                )
            );
        }

        if (
            status &&
            status !== "all"
        ) {
            constraints.push(
                where(
                    "status",
                    "==",
                    status
                )
            );
        }

        constraints.push(
            orderBy(
                documentId(),
                "asc"
            )
        );

        if (cursor) {
            constraints.push(
                startAfter(cursor)
            );
        }

        constraints.push(
            limit(
                pageSize + 1
            )
        );

        const usersQuery =
            query(
                usersRef,
                ...constraints
            );

        const querySnapshot =
            await getDocs(
                usersQuery
            );

        const documents =
            querySnapshot.docs;

        const hasNextPage =
            documents.length >
            pageSize;

        const pageDocuments =
            hasNextPage
                ? documents.slice(
                    0,
                    pageSize
                )
                : documents;

        const users =
            pageDocuments.map(
                (docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                })
            );

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

export const searchUsers = async ({
    searchQuery = "",
    role = "all",
    status = "all",
} = {}) => {
    try {
        const normalizedQuery =
            String(searchQuery).trim();

        if (!normalizedQuery) {
            return [];
        }

        const usersRef =
            collection(
                db,
                USERS_COLLECTION
            );

        const snapshot =
            await getDocs(
                query(usersRef)
            );

        const searchTerms =
            normalizedQuery
                .split(/[,،\s\n]+/)
                .map((term) =>
                    term
                        .trim()
                        .toLowerCase()
                )
                .filter(Boolean);

        if (
            searchTerms.length === 0
        ) {
            return [];
        }

        const users =
            snapshot.docs.map(
                (docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                })
            );

        return users.filter(
            (user) => {
                if (
                    role &&
                    role !== "all" &&
                    user.role !== role
                ) {
                    return false;
                }

                if (
                    status &&
                    status !== "all" &&
                    user.status !== status
                ) {
                    return false;
                }

                const name =
                    String(
                        user.name ||
                        user.displayName ||
                        ""
                    )
                        .trim()
                        .toLowerCase();

                const email =
                    String(
                        user.email || ""
                    )
                        .trim()
                        .toLowerCase();

                const phone =
                    String(
                        user.phone ||
                        user.phoneNumber ||
                        ""
                    )
                        .replace(
                            /\s+/g,
                            ""
                        )
                        .trim()
                        .toLowerCase();

                const uid =
                    String(
                        user.uid ||
                        user.id ||
                        ""
                    )
                        .trim()
                        .toLowerCase();

                return searchTerms.some(
                    (term) => {
                        const normalizedTerm =
                            term
                                .replace(
                                    /\s+/g,
                                    ""
                                )
                                .toLowerCase();

                        return (
                            name.includes(
                                term
                            ) ||
                            email.includes(
                                term
                            ) ||
                            phone.includes(
                                normalizedTerm
                            ) ||
                            uid.includes(
                                term
                            )
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error(
            "Error searching users:",
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
            ] = await Promise.all([
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

            const usersQuery =
                role === "all"
                    ? query(usersRef)
                    : query(
                        usersRef,
                        where(
                            "role",
                            "==",
                            role
                        )
                    );

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

export {
    auth,
    db,
};