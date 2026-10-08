import { useState } from "react";
import {
    FiGrid,
    FiUser,
    FiShield,
    FiFileText,
    FiActivity,
    FiKey,
    FiTruck,
} from "react-icons/fi";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileNavigation from "@/components/profile/ProfileNavigation";

import ProfileOverview from "@/components/profile/ProfileOverview";
import PersonalInformation from "@/components/profile/PersonalInformation";
import DriverInformation from "@/components/profile/DriverInformation";
import DocumentsSection from "@/components/profile/DocumentsSection";
import PermissionsSection from "@/components/profile/PermissionsSection";
import SecuritySection from "@/components/profile/SecuritySection";
import ActivityTimeline from "@/components/profile/ActivityTimeline";

const mockUser = {
    id: "user-001",
    name: "Ahmed Mohamed",
    email: "ahmed@example.com",
    phone: "+20 100 000 0000",
    role: "customer",
    status: "active",
    avatar: "",
    dateOfBirth: "1998-05-12",
    address: "6th of October City",
    city: "Giza",
    createdAt: "2026-09-15",
    lastLogin: "2026-10-06 18:42",
};

const roleTabs = {
    customer: [
        {
            id: "overview",
            label: "Overview",
            icon: FiGrid,
        },
        {
            id: "personal",
            label: "Personal Information",
            icon: FiUser,
        },
        {
            id: "documents",
            label: "Documents",
            icon: FiFileText,
        },
        {
            id: "security",
            label: "Security",
            icon: FiShield,
        },
        {
            id: "activity",
            label: "Activity",
            icon: FiActivity,
        },
    ],

    driver: [
        {
            id: "overview",
            label: "Overview",
            icon: FiGrid,
        },
        {
            id: "personal",
            label: "Personal Information",
            icon: FiUser,
        },
        {
            id: "driver",
            label: "Driver Information",
            icon: FiTruck,
        },
        {
            id: "documents",
            label: "Documents",
            icon: FiFileText,
        },
        {
            id: "security",
            label: "Security",
            icon: FiShield,
        },
        {
            id: "activity",
            label: "Activity",
            icon: FiActivity,
        },
    ],

    admin: [
        {
            id: "overview",
            label: "Overview",
            icon: FiGrid,
        },
        {
            id: "personal",
            label: "Personal Information",
            icon: FiUser,
        },
        {
            id: "permissions",
            label: "Permissions",
            icon: FiKey,
        },
        {
            id: "security",
            label: "Security",
            icon: FiShield,
        },
        {
            id: "activity",
            label: "Activity",
            icon: FiActivity,
        },
    ],

    super_admin: [
        {
            id: "overview",
            label: "Overview",
            icon: FiGrid,
        },
        {
            id: "personal",
            label: "Personal Information",
            icon: FiUser,
        },
        {
            id: "permissions",
            label: "System Access",
            icon: FiKey,
        },
        {
            id: "security",
            label: "Security",
            icon: FiShield,
        },
        {
            id: "activity",
            label: "Activity",
            icon: FiActivity,
        },
    ],
};

export default function Profile() {
    const [activeSection, setActiveSection] = useState("overview");

    const user = mockUser;

    const role = user?.role || "customer";

    const tabs = roleTabs[role] || roleTabs.customer;

    const renderSection = () => {
        switch (activeSection) {
            case "overview":
                return <ProfileOverview user={user} role={role} />;

            case "personal":
                return <PersonalInformation user={user} />;

            case "driver":
                return <DriverInformation user={user} />;

            case "documents":
                return (
                    <DocumentsSection
                        user={user}
                        role={role}
                    />
                );

            case "permissions":
                return (
                    <PermissionsSection
                        user={user}
                        role={role}
                    />
                );

            case "security":
                return <SecuritySection user={user} />;

            case "activity":
                return (
                    <ActivityTimeline
                        user={user}
                        role={role}
                    />
                );

            default:
                return <ProfileOverview user={user} role={role} />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#F9FAFB]">
                    Profile
                </h1>

                <p className="mt-1 text-sm text-[#9CA3AF]">
                    Manage your personal information and account settings
                </p>
            </div>

            <ProfileHeader
                user={user}
                role={role}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                <ProfileNavigation
                    tabs={tabs}
                    activeSection={activeSection}
                    onChange={setActiveSection}
                />

                <main className="min-w-0">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

