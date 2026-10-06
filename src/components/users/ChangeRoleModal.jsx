import { useEffect, useState } from "react";
import {
    FiUser,
    FiShield,
    FiX,
    FiSlash,
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

const ROLES = [
    ["customer", "عميل"],
    ["driver", "سائق"],
    ["admin", "مدير"],
    ["super_admin", "سوبر ادمن"],
];

const STATUSES = [
    ["active", "نشط", "text-success border-success/30 bg-success/10"],
    ["pending", "قيد المراجعة", "text-warning border-warning/30 bg-warning/10"],
    ["inactive", "غير نشط", "text-text-muted border-border bg-card"],
    ["blocked", "محظور", "text-error border-error/30 bg-error/10"],
];

const ChangeRoleModal = ({
    isOpen,
    user,
    onClose,
    onConfirm,
    loading,
}) => {
    const [role, setRole] = useState("customer");
    const [status, setStatus] = useState("active");

    useEffect(() => {
        if (user) {
            setRole(user.role || "customer");
            setStatus(user.status || "active");
        }
    }, [user]);

    if (!isOpen || !user) {
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const roleChanged = role !== user.role;
        const statusChanged = status !== user.status;

        if (!roleChanged && !statusChanged) {
            onClose();
            return;
        }

        await onConfirm(user.id, {
            role,
            status,
        });
    };

    // Quick direct action (block, pending, activate)
    const handleQuickAction = async (newStatus) => {
        setStatus(newStatus);
        await onConfirm(user.id, {
            role,
            status: newStatus,
        });
    };

    const isBlocked = status === "blocked";
    const isPending = status === "pending";
    const isActive = status === "active";

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
            <div className="relative w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-2xl shadow-black/60">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary-color/30 bg-primary-color/10 text-primary-color">
                            <FiUser size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-primary">
                                إدارة حساب المستخدم
                            </h2>
                            <p className="mt-0.5 text-xs text-text-muted">
                                {user.name || user.displayName || user.email || "مستخدم"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="إغلاق"
                        className="rounded-xl p-2 text-text-muted transition hover:bg-card hover:text-text-primary disabled:opacity-50"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* User quick info summary */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card/40 p-3 text-xs">
                    <div className="space-y-0.5 text-text-secondary">
                        <p className="font-semibold text-text-primary">
                            {user.email || "—"}
                        </p>
                        <p dir="ltr" className="text-right text-[11px] text-text-muted">
                            {user.phone || user.phoneNumber || user.id}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                            الدور الحالي: {user.role || "عميل"}
                        </span>
                        <span
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
                                user.status === "active"
                                    ? "border-success/30 bg-success/10 text-success"
                                    : user.status === "blocked"
                                    ? "border-error/30 bg-error/10 text-error"
                                    : user.status === "pending"
                                    ? "border-warning/30 bg-warning/10 text-warning"
                                    : "border-border bg-surface text-text-muted"
                            }`}
                        >
                            الحالة: {user.status || "نشط"}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Role selector */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1.5 flex items-center gap-1.5">
                            <FiShield className="text-primary-color" size={14} />
                            تغيير الدور والصلاحية
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={loading}
                            className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm font-semibold text-text-primary outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                        >
                            {ROLES.map(([val, label]) => (
                                <option key={val} value={val}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status selector */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1.5 flex items-center gap-1.5">
                            <FiAlertCircle className="text-accent" size={14} />
                            تغيير حالة الحساب
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={loading}
                            className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm font-semibold text-text-primary outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                        >
                            {STATUSES.map(([val, label]) => (
                                <option key={val} value={val}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="pt-2 border-t border-border">
                        <label className="block text-xs font-bold text-text-muted mb-2">
                            إجراءات سريعة فورية:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {/* Block Action */}
                            <button
                                type="button"
                                onClick={() => handleQuickAction("blocked")}
                                disabled={loading}
                                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-2 text-xs font-bold transition duration-200 active:scale-95 ${
                                    isBlocked
                                        ? "border-error bg-error text-white shadow-lg shadow-error/25"
                                        : "border-error/40 bg-error/10 text-error hover:bg-error/20"
                                }`}
                            >
                                <FiSlash size={14} />
                                حظر المستخدم
                            </button>

                            {/* Pending Action */}
                            <button
                                type="button"
                                onClick={() => handleQuickAction("pending")}
                                disabled={loading}
                                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-2 text-xs font-bold transition duration-200 active:scale-95 ${
                                    isPending
                                        ? "border-warning bg-warning text-black shadow-lg shadow-warning/25"
                                        : "border-warning/40 bg-warning/10 text-warning hover:bg-warning/20"
                                }`}
                            >
                                <FiClock size={14} />
                                قيد المراجعة
                            </button>

                            {/* Activate Action */}
                            <button
                                type="button"
                                onClick={() => handleQuickAction("active")}
                                disabled={loading}
                                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 px-2 text-xs font-bold transition duration-200 active:scale-95 ${
                                    isActive
                                        ? "border-success bg-success text-black shadow-lg shadow-success/25"
                                        : "border-success/40 bg-success/10 text-success hover:bg-success/20"
                                }`}
                            >
                                <FiCheckCircle size={14} />
                                تفعيل الحساب
                            </button>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="mt-6 flex gap-3 pt-3 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-text-secondary transition hover:bg-card/80 hover:text-text-primary disabled:opacity-50"
                        >
                            إلغاء
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-xl bg-primary-color px-4 py-3 text-sm font-bold text-background shadow-lg shadow-primary-color/20 transition hover:bg-primary-hover active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeRoleModal;