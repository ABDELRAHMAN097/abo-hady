import {
    FaTimes,
    FaCrown,
    FaUserShield,
    FaCar,
    FaUser,
} from "react-icons/fa";

const ROLES = [
    {
        value: "customer",
        label: "عميل",
        description:
            "يمكنه تصفح السيارات وإرسال طلبات الحجز.",
        icon: FaUser,
    },
    {
        value: "driver",
        label: "سائق",
        description:
            "مسؤول عن الرحلات والجداول والمهام الخاصة بالسائقين.",
        icon: FaCar,
    },
    {
        value: "admin",
        label: "أدمن",
        description:
            "إدارة السيارات والعملاء والسائقين والحجوزات.",
        icon: FaUserShield,
    },
    {
        value: "super_admin",
        label: "سوبر أدمن",
        description:
            "صلاحيات كاملة لإدارة النظام والمستخدمين.",
        icon: FaCrown,
    },
];

const ChangeRoleModal = ({
    user,
    selectedRole,
    onRoleChange,
    onClose,
    onConfirm,
    loading,
}) => {
    if (!user) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">
                            تعديل دور المستخدم
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            {user.name ||
                                user.email}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-card hover:text-text-primary disabled:opacity-50"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="space-y-3 p-6">
                    {ROLES.map((role) => {
                        const Icon = role.icon;

                        const active =
                            selectedRole ===
                            role.value;

                        return (
                            <button
                                key={role.value}
                                type="button"
                                onClick={() =>
                                    onRoleChange(
                                        role.value
                                    )
                                }
                                disabled={loading}
                                className={`flex w-full items-start gap-4 rounded-xl border p-4 text-right transition ${
                                    active
                                        ? "border-primary-color bg-primary-color/10"
                                        : "border-border bg-card hover:border-primary-color/50"
                                }`}
                            >
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                        active
                                            ? "bg-primary-color text-secondary-color"
                                            : "bg-surface text-text-secondary"
                                    }`}
                                >
                                    <Icon />
                                </div>

                                <div className="flex-1">
                                    <p
                                        className={`font-bold ${
                                            active
                                                ? "text-primary-color"
                                                : "text-text-primary"
                                        }`}
                                    >
                                        {role.label}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                                        {
                                            role.description
                                        }
                                    </p>
                                </div>

                                <div
                                    className={`mt-1 h-4 w-4 rounded-full border-2 ${
                                        active
                                            ? "border-primary-color bg-primary-color"
                                            : "border-border"
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-text-secondary transition hover:text-text-primary disabled:opacity-50"
                    >
                        إلغاء
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={
                            loading ||
                            !selectedRole
                        }
                        className="rounded-xl bg-primary-color px-5 py-2.5 text-sm font-bold text-secondary-color transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "جاري الحفظ..."
                            : "حفظ التعديل"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeRoleModal;