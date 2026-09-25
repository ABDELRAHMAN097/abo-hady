import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function RoleGuard({ allowedRoles = [], redirectPath = "" }) {
    const { user, role, isCustomer, loading } = useAuth();
    const { locale = "ar" } = useParams();
    const location = useLocation();
    const hasWarnedRef = useRef(false);

    useEffect(() => {
        if (!loading && user && isCustomer && !hasWarnedRef.current) {
            toast.warn("عذراً، لوحة التحكم مخصصة للإدارة والسائقين فقط. حسابك مسجل كعميل.");
            hasWarnedRef.current = true;
        }
    }, [loading, user, isCustomer]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center gap-3 text-white">
                <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#9CA3AF] text-sm">جاري التحقق من الصلاحيات والأمان...</p>
            </div>
        );
    }

    // إذا لم يكن مسجلاً الدخول
    if (!user) {
        return <Navigate to={`/${locale}/login`} state={{ from: location }} replace />;
    }

    // إذا كان عميلاً وحاول الوصول لأي صفحة في الداشبورد
    if (isCustomer) {
        return <Navigate to={redirectPath || `/${locale}`} replace />;
    }

    // إذا تم تحديد أدوار معينة ولا يملكها المستخدم الحالي
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl shadow-sm my-6 mx-2">
                <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 mb-4">
                    <span className="text-3xl font-bold">🚫</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    غير مصرح لك بالوصول (403)
                </h2>
                <p className="text-gray-500 max-w-md mb-6 text-sm">
                    رتبتك الحالية ({role === "driver" ? "سائق" : role === "admin" ? "أدمن" : role}) لا تملك صلاحية الوصول إلى هذه الصفحة أو تعديل هذه المعلومات.
                </p>
                <a
                    href={`/${locale}/dashboard`}
                    className="px-6 py-2.5 bg-primary-color hover:bg-primary-hover text-white rounded-xl font-medium transition shadow-sm"
                >
                    العودة للصفحة الرئيسية للداشبورد
                </a>
            </div>
        );
    }

    return <Outlet />;
}
