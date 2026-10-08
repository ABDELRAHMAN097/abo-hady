import { useState } from "react";
import {
    FiCheckCircle,
    FiKey,
    FiShield,
    FiMail,
    FiLoader,
    FiAlertCircle,
    FiLock,
} from "react-icons/fi";
import { changeCurrentUserPassword, resendVerificationEmail, resetPassword } from "@/services/auth";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n/i18n/context";

const SecuritySection = ({ user }) => {
    const { locale } = useI18n();
    const isArabic = locale === "ar";

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [sendingVerification, setSendingVerification] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [sendingResetLink, setSendingResetLink] = useState(false);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSendVerification = async () => {
        try {
            setSendingVerification(true);
            await resendVerificationEmail();
            toast.success(
                isArabic
                    ? "تم إرسال رابط تأكيد البريد الإلكتروني إلى بريدك!"
                    : "Verification email sent to your inbox!"
            );
        } catch (error) {
            console.error("Verification email failed:", error);
            toast.error(
                error.message ||
                    (isArabic
                        ? "فشل إرسال رابط التحقق"
                        : "Failed to send verification email")
            );
        } finally {
            setSendingVerification(false);
        }
    };

    const handleSendResetEmail = async () => {
        if (!user?.email) return;
        try {
            setSendingResetLink(true);
            await resetPassword(user.email);
            toast.success(
                isArabic
                    ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني!"
                    : "Password reset link sent to your email!"
            );
        } catch (error) {
            console.error("Password reset email error:", error);
            toast.error(
                error.message ||
                    (isArabic
                        ? "فشل إرسال رابط التعيين"
                        : "Failed to send reset link")
            );
        } finally {
            setSendingResetLink(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwords.newPassword.length < 6) {
            toast.error(
                isArabic
                    ? "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"
                    : "New password must be at least 6 characters"
            );
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error(
                isArabic
                    ? "كلمتا المرور غير متطابقتين"
                    : "Passwords do not match"
            );
            return;
        }

        try {
            setChangingPassword(true);
            await changeCurrentUserPassword(
                passwords.currentPassword,
                passwords.newPassword
            );

            toast.success(
                isArabic
                    ? "تم تغيير كلمة المرور بنجاح!"
                    : "Password updated successfully!"
            );

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setIsPasswordModalOpen(false);
        } catch (error) {
            console.error("Password change failed:", error);
            let msg = error.message;
            if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                msg = isArabic ? "كلمة المرور الحالية غير صحيحة" : "Current password is incorrect";
            }
            toast.error(msg || (isArabic ? "فشل تغيير كلمة المرور" : "Failed to change password"));
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Account Security */}
            <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                        <FiShield size={20} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-[#F9FAFB]">
                            {isArabic ? "أمان الحساب" : "Account Security"}
                        </h3>

                        <p className="text-sm text-[#9CA3AF]">
                            {isArabic
                                ? "حافظ على أمان حسابك وتحقق من صلاحيات الدخول."
                                : "Keep your account secure and up to date."}
                        </p>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    {/* Email Verification Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[#0B0C10]/60 p-4 border border-white/5">
                        <div className="flex items-start gap-3">
                            <FiMail className="mt-1 text-[#10B981] shrink-0" size={17} />
                            <div>
                                <p className="text-sm font-medium text-[#F9FAFB]">
                                    {isArabic ? "البريد الإلكتروني الموثق" : "Email Verification"}
                                </p>
                                <p className="mt-0.5 text-xs text-[#9CA3AF]">
                                    {user?.email || "-"}
                                </p>
                            </div>
                        </div>

                        <div>
                            {user?.emailVerified ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#10B981]/10 px-3 py-1.5 text-xs font-medium text-[#10B981] border border-[#10B981]/20">
                                    <FiCheckCircle size={14} />
                                    {isArabic ? "مفعل وموثق" : "Verified"}
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSendVerification}
                                    disabled={sendingVerification}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20 transition cursor-pointer disabled:opacity-75"
                                >
                                    {sendingVerification ? (
                                        <FiLoader className="animate-spin" size={13} />
                                    ) : (
                                        <FiAlertCircle size={13} />
                                    )}
                                    {sendingVerification
                                        ? isArabic
                                            ? "جاري الإرسال..."
                                            : "Sending..."
                                        : isArabic
                                        ? "إرسال رابط التفعيل"
                                        : "Send Verification Link"}
                                </button>
                            )}
                        </div>
                    </div>

                    <SecurityRow
                        title={isArabic ? "آخر تسجيل دخول" : "Last Login"}
                        description={user?.lastLogin || (isArabic ? "الآن" : "Just now")}
                    />

                    <SecurityRow
                        title={isArabic ? "تاريخ إنشاء الحساب" : "Account Created"}
                        description={user?.createdAt || "-"}
                    />
                </div>
            </section>

            {/* Password Section */}
            <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#10B981]">
                            <FiKey size={19} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-[#F9FAFB]">
                                {isArabic ? "كلمة المرور" : "Password"}
                            </h3>

                            <p className="text-sm text-[#9CA3AF]">
                                {isArabic
                                    ? "تحديث كلمة مرور حسابك لتأمين تسجيل الدخول."
                                    : "Update your account password."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="rounded-xl bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669] cursor-pointer shadow-sm"
                    >
                        {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                    </button>

                    <button
                        type="button"
                        onClick={handleSendResetEmail}
                        disabled={sendingResetLink}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 transition cursor-pointer disabled:opacity-75"
                    >
                        {sendingResetLink
                            ? isArabic
                                ? "جاري إرسال الرابط..."
                                : "Sending link..."
                            : isArabic
                            ? "إرسال رابط إعادة التعيين للإيميل"
                            : "Send Reset Link to Email"}
                    </button>
                </div>
            </section>

            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                                <FiLock size={19} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base">
                                    {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {isArabic
                                        ? "أدخل كلمة المرور الحالية ثم الجديدة"
                                        : "Enter current and new password"}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                                    {isArabic ? "كلمة المرور الحالية" : "Current Password"} *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.currentPassword}
                                    onChange={(e) =>
                                        setPasswords((p) => ({
                                            ...p,
                                            currentPassword: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-white focus:border-[#10B981] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                                    {isArabic ? "كلمة المرور الجديدة" : "New Password"} *
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwords.newPassword}
                                    onChange={(e) =>
                                        setPasswords((p) => ({
                                            ...p,
                                            newPassword: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-white focus:border-[#10B981] focus:outline-none"
                                    placeholder={isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-gray-300">
                                    {isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"} *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.confirmPassword}
                                    onChange={(e) =>
                                        setPasswords((p) => ({
                                            ...p,
                                            confirmPassword: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-sm text-white focus:border-[#10B981] focus:outline-none"
                                />
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    disabled={changingPassword}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition cursor-pointer"
                                >
                                    {isArabic ? "إلغاء" : "Cancel"}
                                </button>

                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#059669] transition cursor-pointer disabled:opacity-75 shadow-sm"
                                >
                                    {changingPassword && (
                                        <FiLoader size={15} className="animate-spin" />
                                    )}
                                    {changingPassword
                                        ? isArabic
                                            ? "جاري الحفظ..."
                                            : "Updating..."
                                        : isArabic
                                        ? "تأكيد التغيير"
                                        : "Confirm Change"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SecurityRow = ({ title, description }) => (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#0B0C10]/60 p-4 border border-white/5">
        <div>
            <p className="text-sm font-medium text-[#F9FAFB]">{title}</p>
            <p className="mt-0.5 text-xs text-[#9CA3AF]">{description}</p>
        </div>
    </div>
);

export default SecuritySection;