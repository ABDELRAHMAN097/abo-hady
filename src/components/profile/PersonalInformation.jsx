import { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiLoader, FiUser, FiPhone, FiCalendar, FiMapPin } from "react-icons/fi";
import { updateUserProfileData } from "@/services/profileService";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n/i18n/context";

const PersonalInformation = ({ user, onProfileUpdated }) => {
    const { locale } = useI18n();
    const isArabic = locale === "ar";

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        dateOfBirth: "",
        city: "",
        address: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth || "",
                city: user.city || "",
                address: user.address || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error(
                isArabic
                    ? "الاسم الكامل مطلوب"
                    : "Full Name is required"
            );
            return;
        }

        try {
            setSaving(true);
            const targetUid = user?.uid || user?.id;
            if (!targetUid) {
                throw new Error(isArabic ? "لم يتم العثور على حساب المستخدم" : "User identifier not found");
            }

            await updateUserProfileData(targetUid, {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                dateOfBirth: formData.dateOfBirth || "",
                city: formData.city.trim(),
                address: formData.address.trim(),
                email: user?.email || "",
            });

            if (onProfileUpdated) {
                await onProfileUpdated();
            }

            toast.success(
                isArabic
                    ? "تم حفظ البيانات الشخصية بنجاح!"
                    : "Personal information updated successfully!"
            );
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update personal info:", error);
            toast.error(
                error.message ||
                    (isArabic
                        ? "فشل حفظ البيانات الشخصية"
                        : "Failed to update information")
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth || "",
                city: user.city || "",
                address: user.address || "",
            });
        }
        setIsEditing(false);
    };

    return (
        <Section
            title={isArabic ? "البيانات الشخصية" : "Personal Information"}
            description={
                isArabic
                    ? "عرض وتعديل معلومات حسابك الشخصية وبيانات التواصل."
                    : "Manage your personal account and contact information."
            }
        >
            {!isEditing ? (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InfoField
                            label={isArabic ? "الاسم الكامل" : "Full Name"}
                            value={user?.name}
                            icon={FiUser}
                        />

                        <InfoField
                            label={isArabic ? "البريد الإلكتروني" : "Email Address"}
                            value={user?.email}
                            subtext={
                                isArabic
                                    ? "(معرف الحساب الأساسي)"
                                    : "(Account primary identity)"
                            }
                        />

                        <InfoField
                            label={isArabic ? "رقم الهاتف" : "Phone Number"}
                            value={user?.phone}
                            icon={FiPhone}
                        />

                        <InfoField
                            label={isArabic ? "تاريخ الميلاد" : "Date of Birth"}
                            value={user?.dateOfBirth}
                            icon={FiCalendar}
                        />

                        <InfoField
                            label={isArabic ? "المدينة" : "City"}
                            value={user?.city}
                            icon={FiMapPin}
                        />

                        <InfoField
                            label={isArabic ? "العنوان" : "Address"}
                            value={user?.address}
                            icon={FiMapPin}
                        />
                    </div>

                    <div className="mt-6 flex justify-end border-t border-white/5 pt-5">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669] cursor-pointer shadow-sm"
                        >
                            <FaEdit size={15} />
                            {isArabic ? "تعديل البيانات" : "Edit Information"}
                        </button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                {isArabic ? "الاسم الكامل" : "Full Name"} *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-gray-500 focus:border-[#10B981] focus:outline-none transition"
                                placeholder={isArabic ? "أدخل الاسم الكامل" : "Enter your full name"}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                {isArabic ? "البريد الإلكتروني" : "Email Address"}
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full rounded-xl border border-white/5 bg-[#1F2937]/50 px-4 py-2.5 text-sm text-[#9CA3AF] cursor-not-allowed"
                            />
                            <p className="mt-1 text-[11px] text-[#9CA3AF]">
                                {isArabic
                                    ? "لا يمكن تعديل البريد الإلكتروني مباشرة"
                                    : "Email cannot be changed directly"}
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                {isArabic ? "رقم الهاتف" : "Phone Number"}
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-gray-500 focus:border-[#10B981] focus:outline-none transition"
                                placeholder="+20 100 000 0000"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                {isArabic ? "تاريخ الميلاد" : "Date of Birth"}
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] focus:border-[#10B981] focus:outline-none transition [color-scheme:dark]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                {isArabic ? "المدينة" : "City"}
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-gray-500 focus:border-[#10B981] focus:outline-none transition"
                                placeholder={isArabic ? "مثال: القاهرة" : "e.g. Cairo"}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                {isArabic ? "العنوان بالتفصيل" : "Address"}
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-gray-500 focus:border-[#10B981] focus:outline-none transition"
                                placeholder={isArabic ? "الشارع، الحي، المبنى" : "Street, district, building"}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/5 pt-5">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 transition cursor-pointer"
                        >
                            <FaTimes size={14} />
                            {isArabic ? "إلغاء" : "Cancel"}
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#059669] transition cursor-pointer disabled:opacity-75 shadow-sm"
                        >
                            {saving ? (
                                <FiLoader size={16} className="animate-spin" />
                            ) : (
                                <FaSave size={15} />
                            )}
                            {saving
                                ? isArabic
                                    ? "جاري الحفظ..."
                                    : "Saving..."
                                : isArabic
                                ? "حفظ التعديلات"
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            )}
        </Section>
    );
};

const Section = ({ title, description, children }) => (
    <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#F9FAFB]">
                {title}
            </h3>

            <p className="mt-1 text-sm text-[#9CA3AF]">
                {description}
            </p>
        </div>

        {children}
    </section>
);

const InfoField = ({ label, value, subtext, icon: Icon }) => (
    <div>
        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF]">
            {Icon && <Icon size={13} className="text-[#10B981]" />}
            {label}
            {subtext && <span className="text-[10px] text-gray-500 font-normal">{subtext}</span>}
        </label>

        <div className="rounded-xl border border-white/5 bg-[#0B0C10]/60 px-4 py-3 text-sm text-[#F9FAFB] min-h-[44px] flex items-center">
            {value ? value : <span className="text-gray-500">-</span>}
        </div>
    </div>
);

export default PersonalInformation;