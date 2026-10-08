import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();
    const { locale = "ar" } = useParams();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center gap-3 text-white">
                <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#9CA3AF] text-sm">
                    {locale === "ar" ? "جاري التحقق من تسجيل الدخول..." : "Verifying session..."}
                </p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={`/${locale}/login`} state={{ from: location }} replace />;
    }

    return children || <Outlet />;
}
