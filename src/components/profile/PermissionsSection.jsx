import {
    FiCheckCircle,
    FiLock,
    FiXCircle,
} from "react-icons/fi";
import { useI18n } from "@/i18n/i18n/context";

const permissionsMap = {
    admin: [
        { en: "User Management", ar: "إدارة المستخدمين والأدوار", enabled: true },
        { en: "Car Fleet Management", ar: "إدارة أسطول السيارات", enabled: true },
        { en: "Booking Management", ar: "إدارة الحجوزات والطلبات", enabled: true },
        { en: "Driver Assignment", ar: "إسناد ومتابعة السائقين", enabled: true },
        { en: "Landing Page Management", ar: "تعديل محتوى الصفحة الرئيسية", enabled: true },
        { en: "System Settings", ar: "إعدادات النظام العامة", enabled: false },
    ],
    super_admin: [
        { en: "User Management", ar: "إدارة المستخدمين والأدوار", enabled: true },
        { en: "Car Fleet Management", ar: "إدارة أسطول السيارات", enabled: true },
        { en: "Booking Management", ar: "إدارة الحجوزات والطلبات", enabled: true },
        { en: "Driver Assignment", ar: "إسناد ومتابعة السائقين", enabled: true },
        { en: "Landing Page Management", ar: "تعديل محتوى الصفحة الرئيسية", enabled: true },
        { en: "System Settings", ar: "إعدادات النظام العامة", enabled: true },
        { en: "Admin & Roles Management", ar: "إدارة المشرفين والصلاحيات", enabled: true },
    ],
};

const PermissionsSection = ({ role }) => {
    const { locale } = useI18n();
    const isArabic = locale === "ar";

    const currentPermissions =
        permissionsMap[role] || permissionsMap.admin;

    const isSuperAdmin = role === "super_admin";

    return (
        <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                    <FiLock size={19} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#F9FAFB]">
                        {isSuperAdmin
                            ? isArabic
                                ? "صلاحيات الوصول للنظام"
                                : "System Access"
                            : isArabic
                            ? "الصلاحيات الممنوحة"
                            : "Permissions"}
                    </h3>

                    <p className="mt-1 text-sm text-[#9CA3AF]">
                        {isSuperAdmin
                            ? isArabic
                                ? "حسابك يتمتع بصلاحيات الإدارة الكاملة لجميع موديولات النظام."
                                : "Your account has full access to all system modules."
                            : isArabic
                            ? "عرض الصلاحيات المفعلة والمعطلة المسندة إلى رتبتك."
                            : "View the permissions assigned to your role."}
                    </p>
                </div>
            </div>

            {isSuperAdmin && (
                <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
                    <p className="text-sm font-semibold text-[#D4AF37]">
                        {isArabic ? "وصول كامل للنظام (Full Admin Access)" : "Full System Access"}
                    </p>

                    <p className="mt-1 text-xs text-[#9CA3AF]">
                        {isArabic
                            ? "بصفتك مدير عام (Super Admin)، تملك حق الوصول والتحكم في كافة العمليات والبيانات."
                            : "Super Admin accounts have full permissions across all dashboard modules."}
                    </p>
                </div>
            )}

            <div className="mt-6 divide-y divide-white/5 rounded-2xl border border-white/5">
                {currentPermissions.map((perm) => {
                    const label = isArabic ? perm.ar : perm.en;
                    return (
                        <div
                            key={perm.en}
                            className="flex items-center justify-between gap-4 px-4 py-3.5"
                        >
                            <span className="text-sm text-[#F9FAFB]">
                                {label}
                            </span>

                            {perm.enabled ? (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                                    <FiCheckCircle size={15} />
                                    {isArabic ? "مفعل" : "Enabled"}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF]">
                                    <FiXCircle size={15} />
                                    {isArabic ? "معطل" : "Disabled"}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default PermissionsSection;