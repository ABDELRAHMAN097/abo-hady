import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserProfile } from "@/services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async (uid) => {
        const targetUid = uid || user?.uid;
        if (!targetUid) return null;

        try {
            const data = await getUserProfile(targetUid);
            if (data) {
                setProfile(data);
                return data;
            }
        } catch (error) {
            console.error("Error refreshing profile:", error);
        }
        return null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const userProfile = await getUserProfile(firebaseUser.uid);
                    if (userProfile) {
                        setProfile(userProfile);
                    } else {
                        // في حال كان المستخدم مسجلاً قديماً بدون مستند Firestore
                        setProfile({
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName || "مستخدم",
                            email: firebaseUser.email,
                            role: "customer",
                            status: "active",
                        });
                    }
                } catch (err) {
                    console.error("Error loading user profile:", err);
                    setProfile({
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || "مستخدم",
                        email: firebaseUser.email,
                        role: "customer",
                        status: "active",
                    });
                }
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const role = profile?.role || "customer";

    const isSuperAdmin = role === "super_admin";
    const isAdmin = role === "admin" || isSuperAdmin;
    const isDriver = role === "driver";
    const isCustomer = role === "customer";
    const canAccessDashboard = !isCustomer;

    const hasRole = (allowedRoles = []) => {
        if (!allowedRoles || allowedRoles.length === 0) return true;
        return allowedRoles.includes(role);
    };

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
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
