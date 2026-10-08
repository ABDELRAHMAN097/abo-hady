import { useState, useMemo } from "react";
import {
    FiGrid,
    FiUser,
    FiShield,
    FiFileText,
    FiActivity,
    FiKey,
    FiTruck,
} from "react-icons/fi";

import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/i18n/i18n/context";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileNavigation from "@/components/profile/ProfileNavigation";

import ProfileOverview from "@/components/profile/ProfileOverview";
import PersonalInformation from "@/components/profile/PersonalInformation";
import DriverInformation from "@/components/profile/DriverInformation";
import DocumentsSection from "@/components/profile/DocumentsSection";
import PermissionsSection from "@/components/profile/PermissionsSection";
import SecuritySection from "@/components/profile/SecuritySection";
import ActivityTimeline from "@/components/profile/ActivityTimeline";

const formatDate = (dateVal, locale) => {
    if (!dateVal) return "-";
    try {
        let dateObj;
        if (typeof dateVal?.toDate === "function") {
            dateObj = dateVal.toDate();
        } else if (dateVal?.seconds) {
            dateObj = new Date(dateVal.seconds * 1000);
        } else {
            dateObj = new Date(dateVal);
        }

        if (isNaN(dateObj.getTime())) return String(dateVal);

        return dateObj.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return String(dateVal);
    }
};

export default function Profile({ isCustomerView = false }) {
    const { user: authUser, profile, role: authRole, refreshProfile, loading } = useAuth();
    const { locale } = useI18n();
    const isArabic = locale === "ar";

    const [activeSection, setActiveSection] = useState("overview");

    const role = profile?.role || authRole || "customer";

    const currentUser = useMemo(() => {
        return {
            uid: authUser?.uid || profile?.uid || "",
            name: profile?.name || authUser?.displayName || (isArabic ? "مستخدم" : "User"),
            email: profile?.email || authUser?.email || "",
            phone: profile?.phone || profile?.phoneNumber || authUser?.phoneNumber || "",
            role: role,
            status: profile?.status || "active",
            imageUrl: profile?.imageUrl || profile?.avatar || authUser?.photoURL || "",
            avatar: profile?.imageUrl || profile?.avatar || authUser?.photoURL || "",
            dateOfBirth: profile?.dateOfBirth || "",
            city: profile?.city || "",
            address: profile?.address || "",
            driverInfo: profile?.driverInfo || {},
            documents: profile?.documents || {},
            createdAt: formatDate(profile?.createdAt || authUser?.metadata?.creationTime, locale),
            lastLogin: formatDate(profile?.lastLogin || authUser?.metadata?.lastSignInTime, locale),
            emailVerified: authUser?.emailVerified || false,
        };
    }, [authUser, profile, role, locale, isArabic]);

    const tabs = useMemo(() => {
        const commonOverview = {
            id: "overview",
            label: isArabic ? "نظرة عامة" : "Overview",
            icon: FiGrid,
        };

        const personalTab = {
            id: "personal",
            label: isArabic ? "البيانات الشخصية" : "Personal Information",
            icon: FiUser,
        };

        const documentsTab = {
            id: "documents",
            label: isArabic ? "المستندات والوثائق" : "Documents",
            icon: FiFileText,
        };

        const securityTab = {
            id: "security",
            label: isArabic ? "الأمان والحساب" : "Security",
            icon: FiShield,
        };

        const activityTab = {
            id: "activity",
            label: isArabic ? "النشاط الأخير" : "Activity",
            icon: FiActivity,
        };

        if (role === "driver") {
            return [
                commonOverview,
                personalTab,
                {
                    id: "driver",
                    label: isArabic ? "بيانات السائق" : "Driver Information",
                    icon: FiTruck,
                },
                documentsTab,
                securityTab,
                activityTab,
            ];
        }

        if (role === "admin" || role === "super_admin") {
            return [
                commonOverview,
                personalTab,
                {
                    id: "permissions",
                    label:
                        role === "super_admin"
                            ? isArabic
                                ? "صلاحيات النظام"
                                : "System Access"
                            : isArabic
                            ? "الصلاحيات"
                            : "Permissions",
                    icon: FiKey,
                },
                securityTab,
                activityTab,
            ];
        }

        // Customer
        return [
            commonOverview,
            personalTab,
            documentsTab,
            securityTab,
            activityTab,
        ];
    }, [role, isArabic]);

    // If active section is not in available tabs, fallback to overview
    const currentActiveSection = tabs.some((t) => t.id === activeSection)
        ? activeSection
        : "overview";

    const renderSection = () => {
        switch (currentActiveSection) {
            case "overview":
                return <ProfileOverview user={currentUser} role={role} />;

            case "personal":
                return (
                    <PersonalInformation
                        user={currentUser}
                        onProfileUpdated={refreshProfile}
                    />
                );

            case "driver":
                return (
                    <DriverInformation
                        user={currentUser}
                        onProfileUpdated={refreshProfile}
                    />
                );

            case "documents":
                return (
                    <DocumentsSection
                        user={currentUser}
                        role={role}
                        onProfileUpdated={refreshProfile}
                    />
                );

            case "permissions":
                return (
                    <PermissionsSection
                        user={currentUser}
                        role={role}
                    />
                );

            case "security":
                return <SecuritySection user={currentUser} />;

            case "activity":
                return (
                    <ActivityTimeline
                        user={currentUser}
                        role={role}
                    />
                );

            default:
                return <ProfileOverview user={currentUser} role={role} />;
        }
    };

    if (loading && !profile && !authUser) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400">
                    {isArabic ? "جاري تحميل بيانات الملف الشخصي..." : "Loading profile data..."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header description for customer portal view */}
            {isCustomerView && (
                <div>
                    <h1 className="text-2xl font-bold text-[#F9FAFB]">
                        {isArabic ? "الملف الشخصي" : "Profile"}
                    </h1>

                    <p className="mt-1 text-sm text-[#9CA3AF]">
                        {isArabic
                            ? "إدارة معلوماتك الشخصية ومستنداتك وإعدادات الحساب"
                            : "Manage your personal information, documents, and account settings"}
                    </p>
                </div>
            )}

            <ProfileHeader
                user={currentUser}
                role={role}
                onProfileUpdated={refreshProfile}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                <ProfileNavigation
                    tabs={tabs}
                    activeSection={currentActiveSection}
                    onChange={setActiveSection}
                />

                <main className="min-w-0">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
}
