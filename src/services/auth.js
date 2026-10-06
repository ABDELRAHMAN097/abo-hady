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
const MAX_PAGE_SIZE = 50;
const MAX_SEARCH_VALUES = 30;

export const convertArabicNumerals = (value) => {
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return String(value ?? "")
        .replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d))
        .replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
};

export const normalizeArabic = (value) => {
    return convertArabicNumerals(value)
        .replace(/[\u064B-\u065F\u0670]/g, "") // Tashkeel / diacritics
        .replace(/\u0640/g, "") // Tatweel
        .replace(/[أإآٱ]/g, "ا") // Alef variants
        .replace(/ة/g, "ه") // Ta marbuta
        .replace(/ى/g, "ي") // Ya / Alef maqsura
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
};

export const normalizeText = (value) => normalizeArabic(value);

export const normalizePhone = (value) => {
    return convertArabicNumerals(value).replace(/\D/g, "");
};

const getSearchFields = ({
    name = "",
    displayName = "",
    email = "",
    phone = "",
    phoneNumber = "",
}) => ({
    nameNormalized: normalizeArabic(
        name || displayName
    ),
    emailNormalized: String(email ?? "").toLowerCase().trim(),
    phoneNormalized: normalizePhone(
        phone || phoneNumber
    ),
});

const saveUserSearchFields = async (
    userId,
    userData
) => {
    if (!userId || !userData) {
        return;
    }

    const searchFields =
        getSearchFields(userData);

    const hasSearchFields =
        userData.nameNormalized ===
            searchFields.nameNormalized &&
        userData.emailNormalized ===
            searchFields.emailNormalized &&
        userData.phoneNormalized ===
            searchFields.phoneNormalized;

    if (hasSearchFields) {
        return;
    }

    await updateDoc(
        doc(
            db,
            USERS_COLLECTION,
            userId
        ),
        searchFields
    );
};

const chunkArray = (
    array,
    size
) => {
    const chunks = [];

    for (
        let index = 0;
        index < array.length;
        index += size
    ) {
        chunks.push(
            array.slice(
                index,
                index + size
            )
        );
    }

    return chunks;
};

const mapUser = (docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
});

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
            const searchFields =
                getSearchFields({
                    name,
                    email,
                    phone,
                });

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
                    ...searchFields,
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
        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        try {
            const userDocRef =
                doc(
                    db,
                    USERS_COLLECTION,
                    result.user.uid
                );

            const userDoc =
                await getDoc(
                    userDocRef
                );

            if (userDoc.exists()) {
                await saveUserSearchFields(
                    result.user.uid,
                    userDoc.data()
                );
            }
        } catch (error) {
            console.error(
                "User search fields update error:",
                error
            );
        }

        return result;
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
                const searchFields =
                    getSearchFields({
                        name:
                            user.displayName ||
                            "مستخدم Google",
                        email:
                            user.email || "",
                        phone:
                            user.phoneNumber || "",
                    });

                await setDoc(
                    userDocRef,
                    {
                        uid: user.uid,
                        name:
                            user.displayName ||
                            "مستخدم Google",
                        email:
                            user.email || "",
                        phone:
                            user.phoneNumber || "",
                        role: "customer",
                        status: "active",
                        ...searchFields,
                        createdAt:
                            serverTimestamp(),
                        updatedAt:
                            serverTimestamp(),
                    }
                );
            } else {
                await saveUserSearchFields(
                    user.uid,
                    userDoc.data()
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

export const getAllUsers =
    async ({
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

            const safePageSize =
                Math.min(
                    Math.max(
                        Number(pageSize) || DEFAULT_PAGE_SIZE,
                        1
                    ),
                    MAX_PAGE_SIZE
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
                    safePageSize + 1
                )
            );

            let querySnapshot;
            try {
                const usersQuery =
                    query(
                        usersRef,
                        ...constraints
                    );

                querySnapshot =
                    await getDocs(
                        usersQuery
                    );
            } catch (queryErr) {
                console.warn(
                    "Firestore query requires index or failed, falling back to base query:",
                    queryErr
                );

                const fallbackQuery = query(
                    usersRef,
                    limit(safePageSize + 1)
                );
                querySnapshot = await getDocs(fallbackQuery);
            }

            const documents =
                querySnapshot.docs;

            const hasNextPage =
                documents.length >
                safePageSize;

            const pageDocuments =
                hasNextPage
                    ? documents.slice(
                          0,
                          safePageSize
                      )
                    : documents;

            const users =
                pageDocuments.map(
                    mapUser
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

/**
 * Splits query string into separate search targets.
 * Supports delimiters: commas (English and Arabic), semicolons, pipes, newlines.
 * If no delimiters are present, checks if multiple emails or phones are space-separated.
 * Otherwise treats string as a unified search phrase.
 */
export const parseSearchTargets = (queryStr) => {
    if (!queryStr) return [];

    const hasDelimiter = /[,،;|\n]/.test(queryStr);
    if (hasDelimiter) {
        return queryStr
            .split(/[,،;|\n]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }

    const trimmed = queryStr.trim();
    const spaceTokens = trimmed.split(/\s+/).filter(Boolean);
    if (spaceTokens.length > 1) {
        const areAllPhonesOrEmails = spaceTokens.every(
            (token) => token.includes("@") || /^\d{6,}$/.test(normalizePhone(token))
        );
        if (areAllPhonesOrEmails) {
            return spaceTokens;
        }
    }

    return [trimmed];
};

/**
 * Searches users across fields with support for:
 * - Multiple users simultaneously (comma / Arabic comma separated)
 * - Compound names with spaces (e.g. "محمد أحمد")
 * - Arabic text normalization (alef, hamza, ta marbuta, etc.)
 * - Partial phone numbers & Arabic/Persian digits
 * - Partial & exact email matches
 * - User ID matching
 * - Combined role and status filtering
 * - Resilient fallback against Firestore missing composite index errors
 */
export const searchUsers = async ({
    searchQuery = "",
    searchBy = "all",
    role = "all",
    status = "all",
    limitResults = 100,
} = {}) => {
    try {
        const targets = parseSearchTargets(searchQuery);
        if (!targets.length) {
            return [];
        }

        const usersRef = collection(db, USERS_COLLECTION);
        let snapshot;

        try {
            const constraints = [];
            if (role && role !== "all") {
                constraints.push(where("role", "==", role));
            }
            if (status && status !== "all") {
                constraints.push(where("status", "==", status));
            }
            const q = constraints.length > 0 ? query(usersRef, ...constraints) : query(usersRef);
            snapshot = await getDocs(q);
        } catch (indexError) {
            console.warn("Firestore indexed query error, falling back to all users scan:", indexError);
            snapshot = await getDocs(usersRef);
        }

        const allUsers = snapshot.docs.map(mapUser);

        const parsedTargets = targets.map((t) => {
            const normText = normalizeArabic(t);
            const normPhone = normalizePhone(t);
            const normEmail = String(t).toLowerCase().trim();
            const words = normText.split(/\s+/).filter(Boolean);
            return {
                raw: t,
                normText,
                normPhone,
                normEmail,
                words,
            };
        });

        const scoredUsers = [];

        for (const user of allUsers) {
            const userRole = String(user.role || "").toLowerCase();
            const userStatus = String(user.status || "").toLowerCase();

            if (role && role !== "all" && userRole !== role.toLowerCase()) {
                continue;
            }

            if (status && status !== "all" && userStatus !== status.toLowerCase()) {
                continue;
            }

            const userName = normalizeArabic(user.name || user.displayName || "");
            const userEmail = String(user.email || "").toLowerCase().trim();
            const userPhone = normalizePhone(user.phone || user.phoneNumber || "");
            const userId = String(user.id || user.uid || "").toLowerCase().trim();

            let bestScore = 0;

            for (const target of parsedTargets) {
                let matchScore = 0;

                const checkName = () => {
                    if (!target.normText) return 0;
                    if (userName === target.normText) return 100;
                    if (userName.startsWith(target.normText)) return 60;
                    if (userName.includes(target.normText)) return 40;
                    if (target.words.length > 1 && target.words.every((w) => userName.includes(w))) {
                        return 35;
                    }
                    return 0;
                };

                const checkEmail = () => {
                    if (!target.normEmail) return 0;
                    if (userEmail === target.normEmail) return 100;
                    if (userEmail.startsWith(target.normEmail)) return 60;
                    if (userEmail.includes(target.normEmail)) return 30;
                    return 0;
                };

                const checkPhone = () => {
                    if (!target.normPhone || target.normPhone.length < 2) return 0;
                    if (userPhone === target.normPhone) return 100;
                    if (userPhone.endsWith(target.normPhone) || userPhone.startsWith(target.normPhone)) return 60;
                    if (userPhone.includes(target.normPhone)) return 40;
                    return 0;
                };

                const checkId = () => {
                    if (!target.normEmail) return 0;
                    if (userId === target.normEmail) return 100;
                    if (userId.includes(target.normEmail)) return 40;
                    return 0;
                };

                if (searchBy === "name") {
                    matchScore = checkName();
                } else if (searchBy === "email") {
                    matchScore = checkEmail();
                } else if (searchBy === "phone") {
                    matchScore = checkPhone();
                } else {
                    matchScore = Math.max(checkName(), checkEmail(), checkPhone(), checkId());
                }

                if (matchScore > bestScore) {
                    bestScore = matchScore;
                }
            }

            if (bestScore > 0) {
                scoredUsers.push({ user, score: bestScore });
            }
        }

        scoredUsers.sort((a, b) => b.score - a.score);

        return scoredUsers.slice(0, limitResults).map((item) => item.user);
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
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

export const updateUserStatus =
    async (
        userId,
        newStatus
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
                    status: newStatus,
                    updatedAt:
                        serverTimestamp(),
                }
            );

            return true;
        } catch (error) {
            console.error(
                "Error updating user status:",
                error
            );

            throw error;
        }
    };

export const updateUserAccount =
    async (
        userId,
        { role, status } = {}
    ) => {
        try {
            const userRef =
                doc(
                    db,
                    USERS_COLLECTION,
                    userId
                );

            const updates = {
                updatedAt:
                    serverTimestamp(),
            };

            if (role !== undefined) {
                updates.role = role;
            }

            if (status !== undefined) {
                updates.status = status;
            }

            await updateDoc(
                userRef,
                updates
            );

            return true;
        } catch (error) {
            console.error(
                "Error updating user account:",
                error
            );

            throw error;
        }
    };

export {
    auth,
    db,
};