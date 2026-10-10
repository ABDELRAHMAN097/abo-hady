import { useState, useEffect } from "react";
import { FaCarSide, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { FiPhone, FiLoader } from "react-icons/fi";
import { updateUserProfileData } from "@/services/profileService";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n/i18n/context";

const DriverInformation = ({ user, onProfileUpdated }) => {
    const { locale } = useI18n();
    const isArabic = locale === "ar";

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const initialDriver = user?.driverInfo || {};

    const [formData, setFormData] = useState({
        driverId: initialDriver.driverId || user?.uid?.slice(0, 8)?.toUpperCase() || "DRV-001",
        licenseNumber: initialDriver.licenseNumber || "",
        licenseType: initialDriver.licenseType || (isArabic ? "خاصة" : "Private"),
        licenseExpiry: initialDriver.licenseExpiry || "",
        experience: initialDriver.experience || "",
        emergencyContact: initialDriver.emergencyContact || "",
        emergencyPhone: initialDriver.emergencyPhone || "",
        status: initialDriver.status || (isArabic ? "متاح" : "Available"),
    });

    useEffect(() => {
        if (user?.driverInfo) {
            setFormData((prev) => ({
                ...prev,
                ...user.driverInfo,
            }));
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

        try {
            setSaving(true);
            const targetUid = user?.uid || user?.id;
            if (targetUid) {
                await updateUserProfileData(targetUid, {
                    driverInfo: formData,
                });
            }

            if (onProfileUpdated) {
                await onProfileUpdated();
            }

            toast.success(
                isArabic
                    ? "تم حفظ بيانات السائق بنجاح!"
                    : "Driver information updated successfully!"
            );
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update driver info:", error);
            toast.error(
                error.message ||
                    (isArabic ? "فشل حفظ بيانات السائق" : "Failed to update driver info")
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                            <FaCarSide size={21} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-[#F9FAFB]">
                                {isArabic ? "بيانات السائق المهنية" : "Driver Information"}
                            </h3>

                            <p className="text-sm text-[#9CA3AF]">
                                {isArabic
                                    ? "بيانات رخصة القيادة والجاهزية للعمل."
                                    : "Your professional driver and license credentials."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1.5 text-xs font-medium text-[#10B981] border border-[#10B981]/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                            {formData.status}
                        </span>

                        {!isEditing && (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition cursor-pointer"
                            >
                                <FaEdit size={12} />
                                {isArabic ? "تعديل" : "Edit"}
                            </button>
                        )}
                    </div>
                </div>

                {!isEditing ? (
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Info
                            label={isArabic ? "معرف السائق" : "Driver ID"}
                            value={formData.driverId}
                        />
                        <Info
                            label={isArabic ? "رقم رخصة القيادة" : "Driving License Number"}
                            value={formData.licenseNumber}
                        />
                        <Info
                            label={isArabic ? "نوع الرخصة" : "License Type"}
                            value={formData.licenseType}
                        />
                        <Info
                            label={isArabic ? "تاريخ انتهاء الرخصة" : "License Expiry"}
                            value={formData.licenseExpiry}
                        />
                        <Info
                            label={isArabic ? "سنوات الخبرة" : "Years of Experience"}
                            value={formData.experience}
                        />
                        <Info
                            label={isArabic ? "الحالة الحالية" : "Availability Status"}
                            value={formData.status}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                    {isArabic ? "رقم رخصة القيادة" : "License Number"}
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] focus:border-[#10B981] focus:outline-none"
                                    placeholder="123456789"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                    {isArabic ? "نوع الرخصة" : "License Type"}
                                </label>
                                <input
                                    type="text"
                                    name="licenseType"
                                    value={formData.licenseType}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] focus:border-[#10B981] focus:outline-none"
                                    placeholder={isArabic ? "خاصة / مهنية" : "Private / Commercial"}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                    {isArabic ? "تاريخ انتهاء الرخصة" : "License Expiry"}
                                </label>
                                <input
                                    type="date"
                                    name="licenseExpiry"
                                    value={formData.licenseExpiry}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] focus:border-[#10B981] focus:outline-none [color-scheme:dark]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                    {isArabic ? "سنوات الخبرة" : "Years of Experience"}
                                </label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] focus:border-[#10B981] focus:outline-none"
                                    placeholder={isArabic ? "مثال: 5 سنوات" : "e.g. 5 Years"}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
                                    {isArabic ? "الحالة" : "Status"}
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-[#F9FAFB] focus:border-[#10B981] focus:outline-none"
                                >
                                    <option value="Available">{isArabic ? "متاح للعمل (Available)" : "Available"}</option>
                                    <option value="On Trip">{isArabic ? "في رحلة (On Trip)" : "On Trip"}</option>
                                    <option value="Off Duty">{isArabic ? "غير متاح (Off Duty)" : "Off Duty"}</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition cursor-pointer"
                            >
                                <FaTimes size={13} />
                                {isArabic ? "إلغاء" : "Cancel"}
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2 text-sm font-semibold text-white hover:bg-[#059669] transition cursor-pointer disabled:opacity-75 shadow-sm"
                            >
                                {saving ? (
                                    <FiLoader size={14} className="animate-spin" />
                                ) : (
                                    <FaSave size={13} />
                                )}
                                {saving
                                    ? isArabic
                                        ? "جاري الحفظ..."
                                        : "Saving..."
                                    : isArabic
                                    ? "حفظ البيانات"
                                    : "Save"}
                            </button>
                        </div>
                    </form>
                )}
            </section>

            {/* Emergency Contact */}
            <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#9CA3AF]">
                        <FiPhone size={19} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[#F9FAFB]">
                            {isArabic ? "جهة اتصال للطوارئ" : "Emergency Contact"}
                        </h3>

                        <p className="text-sm text-[#9CA3AF]">
                            {isArabic
                                ? "معلومات التواصل في الحالات الطارئة أثناء الرحلات."
                                : "Contact information in case of emergency."}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Info
                        label={isArabic ? "اسم جهة الاتصال" : "Contact Name"}
                        value={formData.emergencyContact}
                    />

                    <Info
                        label={isArabic ? "رقم هاتف الطوارئ" : "Phone Number"}
                        value={formData.emergencyPhone}
                    />
                </div>
            </section>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div className="rounded-xl bg-[#0B0C10]/60 p-4 border border-white/5 min-h-[64px]">
        <p className="text-xs text-[#9CA3AF]">{label}</p>
        <p className="mt-1 text-sm font-medium text-[#F9FAFB]">
            {value || <span className="text-gray-500">-</span>}
        </p>
    </div>
);

export default DriverInformation;