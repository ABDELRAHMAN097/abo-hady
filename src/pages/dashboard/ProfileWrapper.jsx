import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import NavbarLanding from "@/components/NavparLanding";
import LandingFooter from "@/components/landing/LandingFooter";
import Profile from "./Profile";

export default function ProfileWrapper() {
    const { canAccessDashboard } = useAuth();
    const { locale = "ar" } = useParams();
    const isArabic = locale === "ar";

    // 1. Management and Driver: Render inside DashboardLayout
    if (canAccessDashboard) {
        return (
            <DashboardLayout>
                <Profile />
            </DashboardLayout>
        );
    }

    // 2. Customer: Render with Customer Portal Layout
    return (
        <div
            dir={isArabic ? "rtl" : "ltr"}
            className="min-h-screen bg-background text-white flex flex-col"
        >
            <NavbarLanding />

            <main className="flex-1 max-w-7xl w-full mx-auto pt-28 pb-14 px-4 sm:px-6 lg:px-8">
                <Profile isCustomerView />
            </main>

            <LandingFooter isArabic={isArabic} />
        </div>
    );
}
