import {
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiShield,
    FiStar,
    FiUsers,
    FiXCircle,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import { useI18n } from "@/i18n/i18n/context";

const roleLabels = {
    customer: { en: "Customer", ar: "عميل" },
    driver: { en: "Driver", ar: "سائق" },
    admin: { en: "Admin", ar: "مشرف" },
    super_admin: { en: "Super Admin", ar: "مدير عام" },
};

const ProfileOverview = ({ user, role }) => {
    const { locale } = useI18n();
    const isArabic = locale === "ar";

    const stats = {
        customer: [
            {
                label: isArabic ? "إجمالي الحجوزات" : "Total Bookings",
                value: user?.bookingsCount ?? "0",
                icon: FiCalendar,
            },
            {
                label: isArabic ? "الحجوزات المكتملة" : "Completed",
                value: user?.completedBookings ?? "0",
                icon: FiCheckCircle,
            },
            {
                label: isArabic ? "حجز نشط حالياً" : "Active",
                value: user?.activeBookings ?? "0",
                icon: FiClock,
            },
            {
                label: isArabic ? "الحساب" : "Account Status",
                value: user?.status === "active" ? (isArabic ? "نشط" : "Active") : (isArabic ? "معطل" : "Inactive"),
                icon: FiShield,
            },
        ],

        driver: [
            {
                label: isArabic ? "إجمالي الرحلات" : "Total Trips",
                value: user?.driverInfo?.tripsCount ?? "0",
                icon: FaCarSide,
            },
            {
                label: isArabic ? "رحلات مكتملة" : "Completed Trips",
                value: user?.driverInfo?.completedTrips ?? "0",
                icon: FiCheckCircle,
            },
            {
                label: isArabic ? "تقييم السائق" : "Rating",
                value: user?.driverInfo?.rating ?? "5.0",
                icon: FiStar,
            },
            {
                label: isArabic ? "جاهزية العمل" : "Status",
                value: user?.driverInfo?.status ?? (isArabic ? "متاح" : "Available"),
                icon: FiClock,
            },
        ],

        admin: [
            {
                label: isArabic ? "الرتبة الإدارية" : "Role",
                value: isArabic ? "مشرف" : "Admin",
                icon: FiShield,
            },
            {
                label: isArabic ? "حالة الحساب" : "Status",
                value: isArabic ? "نشط ومفعل" : "Active",
                icon: FiCheckCircle,
            },
            {
                label: isArabic ? "مستوى الصلاحية" : "Access Level",
                value: isArabic ? "إدارة العمليات" : "Operations",
                icon: FiUsers,
            },
            {
                label: isArabic ? "نشاط الجلسة" : "Session Activity",
                value: isArabic ? "متصل الآن" : "Online",
                icon: FiClock,
            },
        ],

        super_admin: [
            {
                label: isArabic ? "مستوى الوصول" : "Access Level",
                value: isArabic ? "تحكم كامل" : "Full Control",
                icon: FiShield,
            },
            {
                label: isArabic ? "حالة النظام" : "System Status",
                value: isArabic ? "جاهز ونشط" : "Online",
                icon: FiCheckCircle,
            },
            {
                label: isArabic ? "الرتبة" : "Role",
                value: isArabic ? "مدير عام" : "Super Admin",
                icon: FiUsers,
            },
            {
                label: isArabic ? "أمان المنظومة" : "Security Check",
                value: isArabic ? "مؤمن بالكامل" : "Secured",
                icon: FiClock,
            },
        ],
    };

    const currentStats = stats[role] || stats.customer;
    const roleText = roleLabels[role]?.[locale] || roleLabels[role]?.en || role;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#F9FAFB]">
                    {isArabic ? "نظرة عامة على الحساب" : "Overview"}
                </h3>

                <p className="mt-1 text-sm text-[#9CA3AF]">
                    {isArabic
                        ? "ملخص سريع لبياناتك الأساسية وحالة حسابك ونشاطك الأخير."
                        : "A quick overview of your account, metrics, and recent activity."}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {currentStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-white/5 bg-[#111827] p-4 flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                                    <Icon size={19} />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-xl sm:text-2xl font-bold text-[#F9FAFB] truncate">
                                    {stat.value}
                                </p>

                                <p className="mt-1 text-xs text-[#9CA3AF] truncate">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#111827] p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                        <FiShield size={20} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-[#F9FAFB]">
                            {isArabic ? "ملف الحساب الشخصي" : "Account Overview"}
                        </h4>

                        <p className="text-sm text-[#9CA3AF]">
                            {isArabic
                                ? "الحساب مفعل وجاهز للاستخدام."
                                : "Your account is currently active and authenticated."}
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoRow
                        label={isArabic ? "الاسم" : "Name"}
                        value={user?.name}
                    />

                    <InfoRow
                        label={isArabic ? "الرتبة في النظام" : "Role"}
                        value={roleText}
                    />

                    <InfoRow
                        label={isArabic ? "آخر تسجيل دخول" : "Last Login"}
                        value={user?.lastLogin}
                    />

                    <InfoRow
                        label={isArabic ? "تاريخ الانضمام" : "Member Since"}
                        value={user?.createdAt}
                    />
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="rounded-xl bg-[#0B0C10]/60 p-4 border border-white/5">
        <p className="text-xs text-[#9CA3AF]">
            {label}
        </p>

        <p className="mt-1 text-sm font-medium text-[#F9FAFB]">
            {value || <span className="text-gray-500">-</span>}
        </p>
    </div>
);

export default ProfileOverview;