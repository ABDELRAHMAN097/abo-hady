import {
    FaCrown,
    FaUserShield,
    FaCar,
    FaUser,
    FaEdit,
} from "react-icons/fa";

import { BsTelephone } from "react-icons/bs";
import { CgMail } from "react-icons/cg";

const ROLE_CONFIG = {
    super_admin: {
        label: "سوبر أدمن",
        icon: FaCrown,
        className:
            "bg-accent/10 text-accent border-accent/20",
    },

    admin: {
        label: "أدمن",
        icon: FaUserShield,
        className:
            "bg-primary-color/10 text-primary-color border-primary-color/20",
    },

    driver: {
        label: "سائق",
        icon: FaCar,
        className:
            "bg-primary-color/10 text-primary-color border-primary-color/20",
    },

    customer: {
        label: "عميل",
        icon: FaUser,
        className:
            "bg-card text-text-secondary border-border",
    },
};

const formatCreatedAt = (createdAt) => {
    if (!createdAt) {
        return "غير معروف";
    }

    try {
        const date = createdAt?.toDate
            ? createdAt.toDate()
            : new Date(createdAt);

        if (Number.isNaN(date.getTime())) {
            return "غير معروف";
        }

        return new Intl.DateTimeFormat(
            "ar-EG",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        ).format(date);
    } catch {
        return "غير معروف";
    }
};

const getInitials = (name) => {
    if (!name) {
        return "؟";
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
};

const UsersTable = ({
    users,
    loading,
    onEditRole,
}) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-right">
                    <thead>
                        <tr className="border-b border-border bg-card">
                            <th className="px-5 py-4 text-xs font-bold text-text-secondary">
                                المستخدم
                            </th>

                            <th className="px-5 py-4 text-xs font-bold text-text-secondary">
                                الهاتف
                            </th>

                            <th className="px-5 py-4 text-xs font-bold text-text-secondary">
                                الدور
                            </th>

                            <th className="px-5 py-4 text-xs font-bold text-text-secondary">
                                الحالة
                            </th>

                            <th className="px-5 py-4 text-xs font-bold text-text-secondary">
                                تاريخ التسجيل
                            </th>

                            <th className="px-5 py-4 text-xs font-bold text-text-secondary">
                                إجراء
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-5 py-16 text-center text-text-secondary"
                                >
                                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary-color" />

                                    <p className="mt-3 text-sm">
                                        جاري تحميل المستخدمين...
                                    </p>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-5 py-16 text-center text-text-secondary"
                                >
                                    لا يوجد مستخدمون مطابقون للبحث
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                const role =
                                    ROLE_CONFIG[
                                        user.role
                                    ] ||
                                    ROLE_CONFIG.customer;

                                const Icon =
                                    role.icon;

                                const isActive =
                                    user.status !==
                                    "inactive";

                                return (
                                    <tr
                                        key={
                                            user.id ||
                                            user.uid
                                        }
                                        className="border-b border-border last:border-b-0 transition hover:bg-card/60"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-color/10 font-bold text-primary-color">
                                                    {getInitials(
                                                        user.name
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-text-primary">
                                                        {user.name ||
                                                            "بدون اسم"}
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                                                        <CgMail />

                                                        <span className="max-w-[230px] truncate">
                                                            {user.email ||
                                                                "بدون بريد"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                <BsTelephone className="text-primary-color" />

                                                <span dir="ltr">
                                                    {user.phone ||
                                                        "غير متوفر"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold ${role.className}`}
                                            >
                                                <Icon />

                                                {
                                                    role.label
                                                }
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold ${
                                                    isActive
                                                        ? "bg-success/10 text-success"
                                                        : "bg-error/10 text-error"
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        isActive
                                                            ? "bg-success"
                                                            : "bg-error"
                                                    }`}
                                                />

                                                {isActive
                                                    ? "نشط"
                                                    : "غير نشط"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-text-secondary">
                                            {formatCreatedAt(
                                                user.createdAt
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEditRole(
                                                        user
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-text-secondary transition hover:border-primary-color hover:text-primary-color"
                                            >
                                                <FaEdit />

                                                تعديل الدور
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;