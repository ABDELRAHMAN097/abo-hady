import {
    FiActivity,
    FiCheckCircle,
    FiLogIn,
    FiUser,
    FiCalendar,
} from "react-icons/fi";
import { useI18n } from "@/i18n/i18n/context";

const ActivityTimeline = ({ user, role }) => {
    const { locale } = useI18n();
    const isArabic = locale === "ar";

    const lastLoginText = user?.lastLogin || (isArabic ? "مؤخراً" : "Recently");
    const createdText = user?.createdAt || (isArabic ? "سابقاً" : "Earlier");

    const activities = [
        {
            title: isArabic ? "آخر تسجيل دخول للنظام" : "Last Account Login",
            date: lastLoginText,
            icon: FiLogIn,
        },
        ...(role === "driver"
            ? [
                  {
                      title: isArabic ? "تحديث حالة السائق والجاهزية" : "Driver status synced",
                      date: isArabic ? "اليوم" : "Today",
                      icon: FiCheckCircle,
                  },
              ]
            : role === "customer"
            ? [
                  {
                      title: isArabic ? "استعراض أسطول السيارات" : "Explored car fleet",
                      date: isArabic ? "مؤخراً" : "Recent",
                      icon: FiCalendar,
                  },
              ]
            : [
                  {
                      title: isArabic ? "مراجعة لوحة التحكم والإحصائيات" : "Reviewed dashboard management",
                      date: isArabic ? "اليوم" : "Today",
                      icon: FiActivity,
                  },
              ]),
        {
            title: isArabic ? "تم تحديث البيانات الشخصية" : "Profile details active",
            date: lastLoginText,
            icon: FiUser,
        },
        {
            title: isArabic ? "تم إنشاء الحساب والانضمام بنجاح" : "Account registered successfully",
            date: createdText,
            icon: FiCheckCircle,
        },
    ];

    return (
        <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                    <FiActivity size={19} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#F9FAFB]">
                        {isArabic ? "النشاط وسجل الأحداث" : "Recent Activity"}
                    </h3>

                    <p className="text-sm text-[#9CA3AF]">
                        {isArabic
                            ? "سجل أحدث الإجراءات والعمليات المرتبطة بحسابك."
                            : "Recent actions and events related to your account."}
                    </p>
                </div>
            </div>

            <div className="mt-7">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    const last = index === activities.length - 1;

                    return (
                        <div
                            key={`${activity.title}-${index}`}
                            className="relative flex gap-4"
                        >
                            {!last && (
                                <div className="absolute left-[17px] top-9 h-[calc(100%-8px)] w-px bg-white/10" />
                            )}

                            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981]">
                                <Icon size={16} />
                            </div>

                            <div className="pb-7">
                                <p className="text-sm font-medium text-[#F9FAFB]">
                                    {activity.title}
                                </p>

                                <p className="mt-1 text-xs text-[#9CA3AF]">
                                    {activity.date}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ActivityTimeline;