import {
    HiOutlineChartSquareBar,
    HiOutlineClipboardList,
    HiOutlineCreditCard,
    HiOutlineUsers,
} from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { TbFileText, TbSettings } from "react-icons/tb";

export const menuItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: HiOutlineChartSquareBar,
        allowedRoles: ["driver", "admin", "super_admin"],
    },
    {
        name: "Profile",
        path: "/profile",
        icon: FiUser,
        allowedRoles: ["driver", "admin", "super_admin"],
    },
    {
        name: "Users",
        path: "/users",
        icon: HiOutlineUsers,
        allowedRoles: ["admin", "super_admin"],
    },
    {
        name: "EditLanding",
        path: "/EditLanding",
        icon: HiOutlineUsers,
        allowedRoles: ["admin", "super_admin"],
    },
    {
        name: "LandingPage",
        path: "/LandingPage",
        icon: HiOutlineClipboardList,
        hasSubmenu: true,
        allowedRoles: ["admin", "super_admin"],
    },
    {
        name: "Wallet",
        path: "/wallet",
        icon: HiOutlineCreditCard,
        hasSubmenu: true,
        allowedRoles: ["admin", "super_admin"],
    },
    {
        name: "Reports",
        path: "/reports",
        icon: TbFileText,
        allowedRoles: ["admin", "super_admin"],
    },
    {
        name: "Settings",
        path: "/setting",
        icon: TbSettings,
        hasSubmenu: true,
        allowedRoles: ["super_admin"],
    },
];

export const pageTitles = {
    "/dashboard": {
        en: "Dashboard",
        ar: "لوحة التحكم",
    },
    "/profile": {
        en: "Profile",
        ar: "الملف الشخصي",
    },
    "/users": {
        en: "Users & Roles",
        ar: "المستخدمون والأدوار",
    },
    "/EditLanding": {
        en: "Create Car",
        ar: "إنشاء سيارة",
    },
    "/LandingPage": {
        en: "Landing Page",
        ar: "الصفحة الرئيسية",
    },
    "/wallet": {
        en: "Wallet",
        ar: "المحفظة",
    },
    "/reports": {
        en: "Reports",
        ar: "التقارير",
    },
    "/setting": {
        en: "Settings",
        ar: "الإعدادات",
    },
};

