import { memo, useCallback, useState } from "react";
import { FiShield, FiUser, FiMail, FiPhone, FiEdit2 } from "react-icons/fi";
import ChangeRoleModal from "./ChangeRoleModal";

const ROLE_LABELS = {
    admin: "مدير",
    user: "مستخدم",
    customer: "عميل",
    staff: "موظف",
    manager: "مشرف",
};

const STATUS_LABELS = {
    active: "نشط",
    inactive: "غير نشط",
    blocked: "محظور",
    pending: "قيد المراجعة",
};

const HEADERS = [
    "المستخدم",
    "البريد الإلكتروني",
    "رقم الهاتف",
    "الدور",
    "الحالة",
    "الإجراء",
];

const SKELETON_ROWS = [0, 1, 2, 3, 4];

const label = (map, key) => (key ? map[String(key).toLowerCase()] || key : "—");
const getName = (u) => u.name || u.displayName || "—";
const getPhone = (u) => u.phone || u.phoneNumber || "—";
const getInitial = (u) =>
    (u.name || u.displayName || u.email || "?").trim().charAt(0).toUpperCase();

const Avatar = ({ user }) => (
    <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary-color/30 bg-linear-to-br from-primary-color/25 to-primary-color/5 text-base font-bold text-primary-color">
            {getInitial(user)}
        </div>
        {user.status === "active" && (
            <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-surface bg-success" />
        )}
    </div>
);

const RoleBadge = ({ role }) => {
    const isAdmin = typeof role === "string" && role.toLowerCase().includes("admin");
    const Icon = isAdmin ? FiShield : FiUser;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                isAdmin
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-border bg-card text-text-secondary"
            }`}
        >
            <Icon className="h-3.5 w-3.5" />
            {label(ROLE_LABELS, role)}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const active = status === "active";

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                active ? "bg-success/10 text-success" : "bg-card text-text-muted"
            }`}
        >
            <span
                className={`h-2 w-2 rounded-full ${
                    active ? "abu-pulse bg-success" : "bg-text-muted"
                }`}
            />
            {label(STATUS_LABELS, status)}
        </span>
    );
};

const ChangeRoleButton = ({ onClick, fullWidth }) => (
    <button
        type="button"
        onClick={onClick}
        className={`group/btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-color px-4 py-2.5 text-xs font-bold text-background shadow-lg shadow-primary-color/10 transition-all duration-300 hover:bg-primary-hover hover:shadow-primary-color/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-95 ${
            fullWidth ? "w-full" : ""
        }`}
    >
        <FiEdit2 className="transition-transform duration-300 group-hover/btn:-rotate-12" />
        تغيير الدور
    </button>
);

const SkeletonBar = ({ className = "" }) => (
    <div className={`relative overflow-hidden rounded-lg bg-card ${className}`}>
        <div className="abu-shimmer absolute inset-y-0 start-0 w-1/3 bg-linear-to-r from-transparent via-text-primary/10 to-transparent" />
    </div>
);

const Info = ({ icon: Icon, gap, children }) => (
    <div className={`flex items-center ${gap} text-sm text-text-secondary`}>
        <Icon className="h-4 w-4 shrink-0 text-text-muted" />
        {children}
    </div>
);

const Identity = ({ user, className, idClass }) => (
    <>
        <Avatar user={user} />
        <div className={className}>
            <p className="truncate font-bold text-text-primary">{getName(user)}</p>
            <p dir="ltr" className={`mt-0.5 truncate text-right text-xs text-text-muted ${idClass}`}>
                {user.id}
            </p>
        </div>
    </>
);

const UserRow = memo(({ user, onChangeRole }) => (
    <tr className="group relative transition-colors duration-300 hover:bg-card/60">
        <td className="relative px-6 py-4">
            <span className="absolute inset-y-3 end-0 w-1 origin-center scale-y-0 rounded-full bg-primary-color transition-transform duration-300 group-hover:scale-y-100" />
            <div className="flex items-center gap-3">
                <Identity user={user} className="min-w-0" idClass="max-w-[170px]" />
            </div>
        </td>
        <td className="px-6 py-4">
            <Info icon={FiMail} gap="gap-2">
                <span>{user.email || "—"}</span>
            </Info>
        </td>
        <td className="px-6 py-4">
            <Info icon={FiPhone} gap="gap-2">
                <span dir="ltr">{getPhone(user)}</span>
            </Info>
        </td>
        <td className="px-6 py-4">
            <RoleBadge role={user.role} />
        </td>
        <td className="px-6 py-4">
            <StatusBadge status={user.status} />
        </td>
        <td className="px-6 py-4">
            <ChangeRoleButton onClick={() => onChangeRole(user)} />
        </td>
    </tr>
));

const UserCard = memo(({ user, onChangeRole }) => (
    <div className="abu-card rounded-2xl border border-border bg-card/50 p-4">
        <div className="flex items-center gap-3">
            <Identity user={user} className="min-w-0 flex-1" idClass="" />
            <StatusBadge status={user.status} />
        </div>

        <div className="mt-4 space-y-3 border-t border-border pt-4 text-sm">
            <Info icon={FiMail} gap="gap-3">
                <span className="truncate">{user.email || "—"}</span>
            </Info>
            <Info icon={FiPhone} gap="gap-3">
                <span dir="ltr">{getPhone(user)}</span>
            </Info>
            <div className="flex items-center justify-between gap-3">
                <span className="text-text-muted">الدور</span>
                <RoleBadge role={user.role} />
            </div>
        </div>

        <div className="mt-4">
            <ChangeRoleButton fullWidth onClick={() => onChangeRole(user)} />
        </div>
    </div>
));

const TableSkeleton = () => (
    <div dir="rtl" className="space-y-6">
        <div className="min-h-[460px] overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl shadow-black/30">
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-right">
                    <thead className="bg-background/50">
                        <tr className="border-b border-border">
                            {HEADERS.map((h) => (
                                <th key={h} className="px-6 py-4 text-sm font-semibold text-text-muted">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {SKELETON_ROWS.map((i) => (
                            <tr key={i} className="h-[73px]">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <SkeletonBar className="h-11 w-11 shrink-0 rounded-2xl" />
                                        <div className="space-y-2">
                                            <SkeletonBar className="h-4 w-32" />
                                            <SkeletonBar className="h-3 w-20" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <SkeletonBar className="h-4 w-40" />
                                </td>
                                <td className="px-6 py-4">
                                    <SkeletonBar className="h-4 w-28" />
                                </td>
                                <td className="px-6 py-4">
                                    <SkeletonBar className="h-7 w-20 rounded-xl" />
                                </td>
                                <td className="px-6 py-4">
                                    <SkeletonBar className="h-7 w-20 rounded-xl" />
                                </td>
                                <td className="px-6 py-4">
                                    <SkeletonBar className="h-9 w-28 rounded-xl" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid gap-4 p-4 md:hidden">
                {SKELETON_ROWS.map((i) => (
                    <div key={i} className="abu-card rounded-2xl border border-border bg-card/50 p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <SkeletonBar className="h-11 w-11 shrink-0 rounded-2xl" />
                            <div className="flex-1 space-y-2">
                                <SkeletonBar className="h-4 w-32" />
                                <SkeletonBar className="h-3 w-24" />
                            </div>
                            <SkeletonBar className="h-7 w-16 rounded-xl" />
                        </div>
                        <div className="space-y-3 border-t border-border pt-4">
                            <SkeletonBar className="h-4 w-48" />
                            <SkeletonBar className="h-4 w-32" />
                        </div>
                        <SkeletonBar className="h-10 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const UsersTable = ({ users, loading, onRoleUpdate }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleLoading, setRoleLoading] = useState(false);

    const closeRoleModal = useCallback(() => {
        if (!roleLoading) setSelectedUser(null);
    }, [roleLoading]);

    const handleRoleUpdate = useCallback(
        async (userId, role) => {
            setRoleLoading(true);
            try {
                await onRoleUpdate(userId, role);
                setSelectedUser(null);
            } finally {
                setRoleLoading(false);
            }
        },
        [onRoleUpdate]
    );

    if (loading) return <TableSkeleton />;

    const hasUsers = users && users.length > 0;

    return (
        <>
            <div dir="rtl" className="space-y-6">
                <div className="min-h-[460px] overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl shadow-black/30">
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[900px] text-right">
                            <thead className="bg-background/50">
                                <tr className="border-b border-border">
                                    {HEADERS.map((h) => (
                                        <th key={h} className="px-6 py-4 text-sm font-semibold text-text-muted">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {hasUsers ? (
                                    users.map((u) => (
                                        <UserRow key={u.id} user={u} onChangeRole={setSelectedUser} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={HEADERS.length} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-text-muted">
                                                    <FiUser className="h-6 w-6" />
                                                </div>
                                                <p className="text-base font-bold text-text-primary">
                                                    لا توجد نتائج مطابقة للبحث
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    جرب تعديل كلمات البحث أو مسح الفلاتر للوصول للمستخدمين
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid gap-4 p-4 md:hidden">
                        {hasUsers ? (
                            users.map((u) => (
                                <UserCard key={u.id} user={u} onChangeRole={setSelectedUser} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-text-muted">
                                    <FiUser className="h-6 w-6" />
                                </div>
                                <p className="text-base font-bold text-text-primary">
                                    لا توجد نتائج مطابقة للبحث
                                </p>
                                <p className="text-xs text-text-muted">
                                    جرب تعديل كلمات البحث أو مسح الفلاتر للوصول للمستخدمين
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ChangeRoleModal
                isOpen={!!selectedUser}
                user={selectedUser}
                onClose={closeRoleModal}
                onConfirm={handleRoleUpdate}
                loading={roleLoading}
            />
        </>
    );
};

export default UsersTable;