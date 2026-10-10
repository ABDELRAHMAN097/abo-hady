import { useRef, useState } from "react";
import {
    FiCamera,
    FiMail,
    FiPhone,
    FiShield,
    FiUser,
    FiLoader,
} from "react-icons/fi";
import { uploadToCloudinary } from "@/services/cloudinary";
import { updateUserProfileData } from "@/services/profileService";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n/i18n/context";

const roleLabels = {
    customer: { en: "Customer", ar: "عميل" },
    driver: { en: "Driver", ar: "سائق" },
    admin: { en: "Admin", ar: "مشرف" },
    super_admin: { en: "Super Admin", ar: "مدير عام" },
};

const ProfileHeader = ({ user, role, onProfileUpdated }) => {
    const { locale } = useI18n();
    const isArabic = locale === "ar";
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const roleLabel =
        roleLabels[role]?.[locale] ||
        roleLabels[role]?.en ||
        role?.replace("_", " ") ||
        "Member";

    const initials = user?.name
        ?.trim()
        ?.split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const avatarUrl = user?.imageUrl || user?.avatar || "";

    const handleAvatarClick = () => {
        if (isUploading) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input value so same file can be re-selected if needed
        e.target.value = "";

        if (!file.type.startsWith("image/")) {
            toast.error(
                isArabic
                    ? "يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)"
                    : "Please select a valid image file"
            );
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error(
                isArabic
                    ? "حجم الصورة كبير جداً، الحد الأقصى 5 ميجابايت"
                    : "Image size must be less than 5MB"
            );
            return;
        }

        try {
            setIsUploading(true);
            const uploadRes = await uploadToCloudinary(file);
            const newImageUrl = uploadRes.imageUrl;

            const targetUid = user?.uid || user?.id;
            if (targetUid) {
                await updateUserProfileData(targetUid, {
                    imageUrl: newImageUrl,
                });
            }

            if (onProfileUpdated) {
                await onProfileUpdated();
            }

            toast.success(
                isArabic
                    ? "تم تحديث الصورة الشخصية بنجاح!"
                    : "Profile picture updated successfully!"
            );
        } catch (error) {
            console.error("Avatar upload failed:", error);
            toast.error(
                error.message ||
                    (isArabic
                        ? "فشل رفع الصورة، يرجى المحاولة لاحقاً"
                        : "Failed to upload image")
            );
        } finally {
            setIsUploading(false);
        }
    };

    const isActive = user?.status === "active";

    return (
        <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#111827]">
            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="relative h-28 bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#0B0C10]">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-[#10B981] blur-3xl" />
                </div>
            </div>

            <div className="relative px-5 pb-5 sm:px-6">
                <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        {/* Avatar */}
                        <div className="relative h-24 w-24 shrink-0 rounded-2xl border-4 border-[#111827] bg-[#1F2937] shadow-xl">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={user?.name || "Profile"}
                                    className="h-full w-full rounded-xl object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-xl text-2xl font-bold text-[#10B981]">
                                    {initials || <FiUser size={32} />}
                                </div>
                            )}

                            {/* Camera / Upload Button */}
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                disabled={isUploading}
                                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111827] bg-[#10B981] text-white transition hover:bg-[#059669] disabled:opacity-75 cursor-pointer shadow-md"
                                title={
                                    isArabic
                                        ? "تغيير الصورة الشخصية"
                                        : "Change profile picture"
                                }
                                aria-label="Change profile picture"
                            >
                                {isUploading ? (
                                    <FiLoader
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <FiCamera size={14} />
                                )}
                            </button>
                        </div>

                        <div className="pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-bold text-[#F9FAFB]">
                                    {user?.name || (isArabic ? "مستخدم" : "User")}
                                </h2>

                                <span className="rounded-full bg-[#10B981]/10 px-2.5 py-1 text-xs font-medium text-[#10B981] border border-[#10B981]/20">
                                    {roleLabel}
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#9CA3AF]">
                                <span className="inline-flex items-center gap-2">
                                    <FiMail size={15} />
                                    {user?.email || "-"}
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <FiPhone size={15} />
                                    {user?.phone || "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pb-1">
                        <span
                            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                                isActive
                                    ? "border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981]"
                                    : "border-red-500/20 bg-red-500/10 text-red-400"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    isActive ? "bg-[#10B981]" : "bg-red-400"
                                }`}
                            />
                            {isActive
                                ? isArabic
                                    ? "نشط"
                                    : "Active"
                                : isArabic
                                ? "معطل / محظور"
                                : "Blocked"}
                        </span>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/5 pt-5 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl bg-[#0B0C10]/50 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F2937] text-[#9CA3AF]">
                            <FiShield size={18} />
                        </div>

                        <div>
                            <p className="text-xs text-[#9CA3AF]">
                                {isArabic ? "حالة الحساب" : "Account Status"}
                            </p>
                            <p className="text-sm font-medium text-[#F9FAFB]">
                                {user?.emailVerified
                                    ? isArabic
                                        ? "حساب موثق ومفعل"
                                        : "Verified Account"
                                    : isArabic
                                    ? "حساب نشط"
                                    : "Standard Account"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#0B0C10]/50 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F2937] text-[#9CA3AF]">
                            <FiUser size={18} />
                        </div>

                        <div>
                            <p className="text-xs text-[#9CA3AF]">
                                {isArabic ? "عضو منذ" : "Member Since"}
                            </p>
                            <p className="text-sm font-medium text-[#F9FAFB]">
                                {user?.createdAt || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileHeader;