import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
    auth,
    getUserProfile,
} from "@/services/auth";

const AuthContext = createContext(null);

const DASHBOARD_ROLES = [
    "admin",
    "super_admin",
    "driver",
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async (uid) => {
        const targetUid = uid || user?.uid;

        if (!targetUid) return null;

        try {
            const data = await getUserProfile(
                targetUid
            );

            if (data) {
                setProfile(data);
                return data;
            }
        } catch (error) {
            console.error(
                "Error refreshing profile:",
                error
            );
        }

        return null;
    };

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (firebaseUser) => {
                    if (!firebaseUser) {
                        setUser(null);
                        setProfile(null);
                        setLoading(false);
                        return;
                    }

                    setUser(firebaseUser);

                    try {
                        const userProfile =
                            await getUserProfile(
                                firebaseUser.uid
                            );

                        setProfile(
                            userProfile || {
                                uid: firebaseUser.uid,
                                name:
                                    firebaseUser.displayName ||
                                    "مستخدم",
                                email:
                                    firebaseUser.email,
                                role: "customer",
                                status: "active",
                            }
                        );
                    } catch (error) {
                        console.error(
                            "Error loading user profile:",
                            error
                        );

                        setProfile({
                            uid: firebaseUser.uid,
                            name:
                                firebaseUser.displayName ||
                                "مستخدم",
                            email:
                                firebaseUser.email,
                            role: "customer",
                            status: "active",
                        });
                    }

                    setLoading(false);
                }
            );

        return unsubscribe;
    }, []);

    const role =
        profile?.role || "customer";

    const isSuperAdmin =
        role === "super_admin";

    const isAdmin =
        role === "admin" ||
        isSuperAdmin;

    const isDriver =
        role === "driver";

    const isCustomer =
        role === "customer";

    const canAccessDashboard =
        DASHBOARD_ROLES.includes(role);

    const hasRole = (allowedRoles = []) =>
        !allowedRoles.length ||
        allowedRoles.includes(role);

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                role,
                loading,
                isSuperAdmin,
                isAdmin,
                isDriver,
                isCustomer,
                canAccessDashboard,
                hasRole,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }

    return context;
};

