import {
  HiOutlineChartSquareBar,
  HiOutlineClipboardList,
  HiOutlineCreditCard,
  HiOutlineUsers,
} from "react-icons/hi";
import { GoInbox } from "react-icons/go";
import { BiGroup } from "react-icons/bi";
import { TbFileText, TbSettings } from "react-icons/tb";

export const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: HiOutlineChartSquareBar,
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
    name: "Setting",
    path: "/setting",
    icon: TbSettings,
    hasSubmenu: true,
    allowedRoles: ["super_admin"],
  },
];

export const pageTitles = {
  "/dashboard": "لوحة التحكم",
  "/users": "إدارة المستخدمين والأدوار",
  "/assessments": "Assessments",
  "/exams": "Create New Exam",
  "/wallet": "Wallet",
  "/question-bank": "Question Bank",
  "/groups": "Groups",
  "/reports": "Reports",
  "/setting": "Setting",
  "/notifications": "Notifications",
};
