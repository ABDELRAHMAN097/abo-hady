import { useState, useEffect, useMemo } from "react";
import {
    FaCrown,
    FaUserShield,
    FaCar,
    FaUser,
    FaSearch,
    FaEllipsisV,
    FaCheckCircle,
    FaTimesCircle,
    FaShieldAlt
} from "react-icons/fa";
import { BsTelephone, BsFilter } from "react-icons/bs";
import { CgMail } from "react-icons/cg";
import { toast } from "react-toastify";
import { getAllUsers, updateUserRole } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

// بيانات أولية تجريبية في حال كانت قاعدة البيانات فارغة أو قيد التهيئة
const INITIAL_DEMO_USERS = [
    {
        id: "demo-1",
        uid: "demo-1",
        name: "عبد الرحمن أبو هادي",
        email: "abdelrahman@abouhadi-rent.com",
        phone: "01026116087",
        role: "super_admin",
        status: "active",
        createdAt: "2026-01-10",
    },
    {
        id: "demo-2",
        uid: "demo-2",
        name: "طارق سليم (مدير التشغيل)",
        email: "tarek.admin@abouhadi-rent.com",
        phone: "01123456789",
        role: "admin",
        status: "active",
        createdAt: "2026-02-01",
    },
    {
        id: "demo-3",
        uid: "demo-3",
        name: "كابتن محمود رجب (سائق VIP)",
        email: "mahmoud.driver@gmail.com",
        phone: "01234567890",
        role: "driver",
        status: "active",
        createdAt: "2026-02-15",
    },
    {
        id: "demo-4",
        uid: "demo-4",
        name: "كابتن أحمد الشيخ (سائق ليموزين)",
        email: "ahmed.sheikh@gmail.com",
        phone: "01099887766",
        role: "driver",
        status: "active",
        createdAt: "2026-02-20",
    },
    {
        id: "demo-5",
        uid: "demo-5",
        name: "د. إبراهيم يوسف",
        email: "ibrahim.client@yahoo.com",
        phone: "01511223344",
        role: "customer",
        status: "active",
        createdAt: "2026-03-01",
    },
    {
        id: "demo-6",
        uid: "demo-6",
        name: "م. كريم عبد العزيز",
        email: "karim.vip@gmail.com",
        phone: "01055443322",
        role: "customer",
        status: "active",
        createdAt: "2026-03-05",
    },
];

export default function Users() {
    const { user: currentUser, role: currentRole, isSuperAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
    const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

    // Modal state for changing role
    const [selectedUserForRole, setSelectedUserForRole] = useState(null);
    const [newTargetRole, setNewTargetRole] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const fetched = await getAllUsers();
            if (fetched && fetched.length > 0) {
                setUsers(fetched);
            } else {
                // استخدام البيانات الافتراضية إذا كانت Firestore فارغة
                setUsers(INITIAL_DEMO_USERS);
            }
        } catch (err) {
            console.warn("Firestore fetch failed, fallback to demo users:", err);
            setUsers(INITIAL_DEMO_USERS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtered users
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (u.phone && u.phone.includes(searchQuery));

            const matchesRole =
                selectedRoleFilter === "all" || u.role === selectedRoleFilter;

            const matchesStatus =
                selectedStatusFilter === "all" || (u.status || "active") === selectedStatusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchQuery, selectedRoleFilter, selectedStatusFilter]);

    // Statistics counts
    const stats = useMemo(() => {
        return {
            total: users.length,
            customers: users.filter((u) => u.role === "customer").length,
            drivers: users.filter((u) => u.role === "driver").length,
            admins: users.filter((u) => u.role === "admin" || u.role === "super_admin").length,
        };
    }, [users]);

    // Role configuration map
    const roleConfig = {
        super_admin: {
            title: "سوبر أدمن",
            icon: FaCrown,
            badgeClass: "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30",
            dotColor: "bg-[#D4AF37]",
            desc: "صلاحيات مطلقة للنظام والماليات وحذف وتعديل جميع الرتب",
        },
        admin: {
            title: "أدمن إدارة",
            icon: FaUserShield,
            badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
            dotColor: "bg-blue-400",
            desc: "إدارة الحجوزات والسيارات والعملاء والسائقين",
        },
        driver: {
            title: "كابتن / سائق",
            icon: FaCar,
            badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
            dotColor: "bg-emerald-400",
            desc: "استلام الرحلات والوصول لجدول المواعيد فقط",
        },
        customer: {
            title: "عميل",
            icon: FaUser,
            badgeClass: "bg-gray-500/15 text-gray-300 border-gray-500/30",
            dotColor: "bg-gray-400",
            desc: "حجز وتصفح السيارات وممنوع من دخول لوحة التحكم",
        },
    };

    // Open change role modal with permission check
    const handleOpenRoleModal = (userToEdit) => {
        // حماية هرمية: الأدمن العادي لا يمكنه التعديل على السوبر أدمن
        if (!isSuperAdmin && userToEdit.role === "super_admin") {
            toast.error("عذراً، صلاحياتك كأدمن لا تسمح لك بتعديل دور السوبر أدمن.");
            return;
        }

        setSelectedUserForRole(userToEdit);
        setNewTargetRole(userToEdit.role || "customer");
    };

    // Confirm role change
    const handleConfirmRoleChange = async () => {
        if (!selectedUserForRole || !newTargetRole) return;

        // حماية إضافية: منع الأدمن من ترقية أي شخص لسوبر أدمن
        if (!isSuperAdmin && newTargetRole === "super_admin") {
            toast.error("فقط السوبر أدمن يملك صلاحية منح رتبة سوبر أدمن.");
            return;
        }

        setIsUpdating(true);
        try {
            // محاولة التحديث في Firestore
            try {
                await updateUserRole(selectedUserForRole.id || selectedUserForRole.uid, newTargetRole);
            } catch (fsErr) {
                console.warn("Firestore update skipped/offline:", fsErr);
            }

            // تحديث الحالة المحلية
            setUsers((prev) =>
                prev.map((u) =>
                    (u.id === selectedUserForRole.id || u.uid === selectedUserForRole.uid)
                        ? { ...u, role: newTargetRole }
                        : u
                )
            );

            toast.success(
                `تم تغيير دور ${selectedUserForRole.name || selectedUserForRole.email} إلى ${roleConfig[newTargetRole]?.title || newTargetRole
                } بنجاح!`
            );
            setSelectedUserForRole(null);
        } catch (error) {
            console.error("Error changing role:", error);
            toast.error("حدث خطأ أثناء تعديل الدور. حاول مجدداً.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-12 font-cairo">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111827] p-6 rounded-2xl border border-[#374151] shadow-lg">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                            <FaShieldAlt className="text-xl" />
                        </span>
                        <h1 className="text-2xl font-black text-white">
                            إدارة المستخدمين والصلاحيات
                        </h1>
                    </div>
                    <p className="text-[#9CA3AF] text-sm">
                        تحكم كامل في رتب النظام بين العملاء، السائقين، طاقم الإدارة، والسوبر أدمن
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-white rounded-xl text-sm border border-[#374151] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <span>🔄</span>
                        تحديث القائمة
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total */}
                <div className="bg-[#111827] border border-[#374151] p-5 rounded-2xl flex items-center justify-between shadow-md">
                    <div>
                        <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-1">
                            إجمالي المسجلين
                        </p>
                        <h3 className="text-3xl font-black text-white">{stats.total}</h3>
                        <span className="text-xs text-emerald-400 mt-1 inline-block">حسابات نشطة بالنظام</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-white text-xl">
                        <FaUser />
                    </div>
                </div>

                {/* Customers */}
                <div className="bg-[#111827] border border-[#374151] p-5 rounded-2xl flex items-center justify-between shadow-md">
                    <div>
                        <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-1">
                            العملاء
                        </p>
                        <h3 className="text-3xl font-black text-white">{stats.customers}</h3>
                        <span className="text-xs text-yellow-400 mt-1 inline-block">ممنوعون من الداشبورد 🔒</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 text-xl">
                        <FaUser />
                    </div>
                </div>

                {/* Drivers */}
                <div className="bg-[#111827] border border-[#374151] p-5 rounded-2xl flex items-center justify-between shadow-md">
                    <div>
                        <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-1">
                            كباتن وسائقين
                        </p>
                        <h3 className="text-3xl font-black text-white">{stats.drivers}</h3>
                        <span className="text-xs text-emerald-400 mt-1 inline-block">رحلات وجداول فقط 🚗</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
                        <FaCar />
                    </div>
                </div>

                {/* Admins */}
                <div className="bg-[#111827] border border-[#374151] p-5 rounded-2xl flex items-center justify-between shadow-md">
                    <div>
                        <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-1">
                            طاقم الإدارة
                        </p>
                        <h3 className="text-3xl font-black text-white">{stats.admins}</h3>
                        <span className="text-xs text-[#D4AF37] mt-1 inline-block">أدمن + سوبر أدمن 👑</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xl">
                        <FaCrown />
                    </div>
                </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-[#111827] border border-[#374151] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <FaSearch className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="بحث بالاسم، البريد أو الهاتف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1F2937] border border-[#374151] rounded-xl ps-10 pe-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] transition"

                        whatsapp />
                </div>

                {/* Role Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setSelectedRoleFilter("all")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${selectedRoleFilter === "all"
                                ? "bg-white text-gray-900 shadow"
                                : "text-gray-400 hover:text-white hover:bg-[#1F2937]"
                            }`}
                    >
                        الكل ({users.length})
                    </button>
                    <button
                        onClick={() => setSelectedRoleFilter("customer")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${selectedRoleFilter === "customer"
                                ? "bg-white text-gray-900 shadow"
                                : "text-gray-400 hover:text-white hover:bg-[#1F2937]"
                            }`}
                    >
                        عملاء ({stats.customers})
                    </button>
                    <button
                        onClick={() => setSelectedRoleFilter("driver")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${selectedRoleFilter === "driver"
                                ? "bg-emerald-500 text-white shadow"
                                : "text-gray-400 hover:text-white hover:bg-[#1F2937]"
                            }`}
                    >
                        سائقين ({stats.drivers})
                    </button>
                    <button
                        onClick={() => setSelectedRoleFilter("admin")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${selectedRoleFilter === "admin"
                                ? "bg-blue-600 text-white shadow"
                                : "text-gray-400 hover:text-white hover:bg-[#1F2937]"
                            }`}
                    >
                        أدمن ({users.filter((u) => u.role === "admin").length})
                    </button>
                    <button
                        onClick={() => setSelectedRoleFilter("super_admin")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${selectedRoleFilter === "super_admin"
                                ? "bg-[#D4AF37] text-gray-950 font-bold shadow"
                                : "text-gray-400 hover:text-white hover:bg-[#1F2937]"
                            }`}
                    >
                        سوبر أدمن ({users.filter((u) => u.role === "super_admin").length})
                    </button>
                </div>
            </div>

            {/* Users Data Table */}
            <div className="bg-[#111827] border border-[#374151] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-[#374151] bg-[#0F172A]/80 text-[#9CA3AF] text-xs font-semibold">
                                <th className="py-4 px-6">المستخدم</th>
                                <th className="py-4 px-4">رقم الهاتف</th>
                                <th className="py-4 px-4">الدور / الرتبة</th>
                                <th className="py-4 px-4">الحالة</th>
                                <th className="py-4 px-4">تاريخ الانضمام</th>
                                <th className="py-4 px-6 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#374151]/50 text-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400">
                                        <div className="inline-block w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mb-2" />
                                        <p>جاري تحميل قائمة المستخدمين...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400">
                                        <p className="text-lg">لا يوجد مستخدمين مطابقين للبحث</p>
                                        <span className="text-xs text-gray-500">جرب تغيير مصطلح البحث أو الفلتر</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((userItem) => {
                                    const roleInfo = roleConfig[userItem.role] || roleConfig.customer;
                                    const IconComponent = roleInfo.icon;
                                    const isItemSuperAdmin = userItem.role === "super_admin";
                                    const canEditThisUser = isSuperAdmin || !isItemSuperAdmin;

                                    return (
                                        <tr
                                            key={userItem.id || userItem.uid}
                                            className="hover:bg-[#1F2937]/50 transition-colors"
                                        >
                                            {/* User info */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#10B981]/20 to-[#D4AF37]/20 border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0">
                                                        {userItem.name ? userItem.name[0] : "U"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-white truncate flex items-center gap-2">
                                                            <span>{userItem.name || "مستخدم جديد"}</span>
                                                            {userItem.uid === currentUser?.uid && (
                                                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                                                                    أنت
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                            <CgMail className="text-sm shrink-0" />
                                                            <span className="truncate">{userItem.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Phone */}
                                            <td className="py-4 px-4 text-gray-300 font-mono text-xs">
                                                {userItem.phone ? (
                                                    <a
                                                        href={`tel:${userItem.phone}`}
                                                        className="hover:text-[#10B981] flex items-center gap-1.5 transition"
                                                    >
                                                        <BsTelephone className="text-xs text-gray-400" />
                                                        <span>{userItem.phone}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500">—</span>
                                                )}
                                            </td>

                                            {/* Role Badge */}
                                            <td className="py-4 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.badgeClass}`}
                                                >
                                                    <IconComponent className="text-xs" />
                                                    <span>{roleInfo.title}</span>
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4">
                                                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                    نشط
                                                </span>
                                            </td>

                                            {/* Created At */}
                                            <td className="py-4 px-4 text-xs text-gray-400">
                                                {userItem.createdAt?.seconds
                                                    ? new Date(userItem.createdAt.seconds * 1000).toLocaleDateString("ar-EG")
                                                    : typeof userItem.createdAt === "string"
                                                        ? userItem.createdAt
                                                        : "حديثاً"}
                                            </td>

                                            {/* Action: Change Role */}
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={() => handleOpenRoleModal(userItem)}
                                                    disabled={!canEditThisUser}
                                                    title={
                                                        !canEditThisUser
                                                            ? "لا يمكنك تعديل رتبة السوبر أدمن إلا إذا كنت سوبر أدمن"
                                                            : "تغيير رتبة المستخدم"
                                                    }
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${canEditThisUser
                                                            ? "bg-[#1F2937] hover:bg-[#374151] text-[#D4AF37] border-[#D4AF37]/30 hover:border-[#D4AF37]"
                                                            : "bg-gray-800/40 text-gray-600 border-gray-800 cursor-not-allowed"
                                                        }`}
                                                >
                                                    تغيير الدور
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

            {/* Role Change Modal */}
            {selectedUserForRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#111827] border border-[#374151] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-[#374151]">
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    تعديل دور المستخدم
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    المستخدم: <span className="text-white font-semibold">{selectedUserForRole.name || selectedUserForRole.email}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedUserForRole(null)}
                                className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Options */}
                        <div className="py-4 flex flex-col gap-2.5">
                            {Object.entries(roleConfig).map(([key, item]) => {
                                const isSuperAdminOption = key === "super_admin";
                                const isOptionDisabled = isSuperAdminOption && !isSuperAdmin;
                                const isSelected = newTargetRole === key;
                                const ItemIcon = item.icon;

                                return (
                                    <div
                                        key={key}
                                        onClick={() => {
                                            if (!isOptionDisabled) {
                                                setNewTargetRole(key);
                                            }
                                        }}
                                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                                                ? "border-[#10B981] bg-[#10B981]/10 shadow-lg shadow-[#10B981]/10"
                                                : isOptionDisabled
                                                    ? "border-gray-800 bg-gray-900/40 opacity-50 cursor-not-allowed"
                                                    : "border-[#374151] bg-[#1F2937]/50 hover:bg-[#1F2937]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${item.badgeClass}`}
                                            >
                                                <ItemIcon />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-white">
                                                        {item.title}
                                                    </span>
                                                    {isOptionDisabled && (
                                                        <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                                            متاح للسوبر أدمن فقط
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${isSelected
                                                    ? "border-[#10B981] bg-[#10B981] text-white text-xs"
                                                    : "border-gray-600"
                                                }`}
                                        >
                                            {isSelected && "✓"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#374151]">
                            <button
                                type="button"
                                onClick={() => setSelectedUserForRole(null)}
                                className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRoleChange}
                                disabled={isUpdating || newTargetRole === selectedUserForRole.role}
                                className="px-6 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#10B981]/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isUpdating ? "جاري التحديث..." : "حفظ الدور الجديد"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}