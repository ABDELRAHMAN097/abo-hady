import { NavLink, Link, useNavigate, useParams } from "react-router-dom";
import { HiOutlineChevronDown } from "react-icons/hi";
import { RiLogoutBoxRLine } from "react-icons/ri";

import AuthHeader from "./shared/AuthHeader";
import { menuItems } from "../components/sidebarData";
import { logout as firebaseLogout } from "@/services/auth";
import { useI18n } from "../i18n/i18n/context";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { locale } = useParams();
  const { t } = useI18n();
  const { user, profile, role } = useAuth();
  const isArabic = locale === "ar";

  const handleLogout = async () => {
    try {
      await firebaseLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("talep_user");
      navigate(`/${locale}/login`);
    }
  };

  const userName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "المستخدم";

  const roleTitles = {
    super_admin: "سوبر أدمن",
    admin: "أدمن",
    driver: "سائق",
    customer: "عميل",
  };

  const roleSubtitle = roleTitles[role] || "مستخدم";

  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // فلترة عناصر القائمة وفقاً لرتبة وصلاحيات المستخدم الحالي
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
    return item.allowedRoles.includes(role);
  });

  return (
    <aside
      className={`
        fixed
        top-0
        bottom-0
        z-50
        w-[270px]
        bg-card
        border-white/10
        transition-[width,transform]
        duration-300
        ease-in-out

        ${isArabic ? "right-0 border-s" : "left-0 border-e"}

        /* Mobile */
        ${
          isOpen
            ? "translate-x-0"
            : isArabic
              ? "translate-x-full"
              : "-translate-x-full"
        }

        /* Desktop */
        lg:translate-x-0
        ${isOpen ? "lg:w-[270px]" : "lg:w-[20px]"}
      `}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          absolute
          top-1/2
          -translate-y-1/2
          end-[-7px]
          z-50
          hidden
          lg:flex
          w-3
          h-16
          items-center
          justify-center
          border
          border-border
          rounded-md
          shadow-sm
          cursor-pointer
          hover:bg-border

          transition-colors
          duration-200
        "
      >
        <span className="w-1 h-10 rounded-full bg-gray-700" />
      </button>

      {/* Sidebar Content */}
      <div
        className={`
          h-full
          flex
          flex-col
          overflow-hidden

          transition-opacity
          duration-200

          ${
            isOpen
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Top */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {/* Logo */}
          <div className="mb-5">
            <Link to={`/${locale}`}>
              <AuthHeader
                title="أبو هادي"
                titleClass="text-hover-color text-3xl font-bold"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={`/${locale}${item.path}`}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    rounded-xl
                    transition-colors
                    duration-200

                    ${
                      isActive
                        ? "bg-hover-color text-primary-color font-bold shadow-sm"
                        : "text-hover-color hover:bg-white/10 hover:text-white"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`
                            w-5
                            h-5
                            shrink-0
                            ${
                              isActive
                                ? "text-primary-color"
                                : "text-hover-color"
                            }
                          `}
                        />

                        <span className="text-sm truncate font-medium">
                          {item.name === "Users" ? "المستخدمين والأدوار" : t(item.name)}
                        </span>
                      </div>

                      {item.hasSubmenu && (
                        <HiOutlineChevronDown className="w-4 h-4 shrink-0" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="shrink-0">
          {/* Logout */}
          <div className="px-2">
            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl

                text-hover-color

                hover:bg-red-500/20
                hover:text-red-300

                transition-colors
                duration-200
                cursor-pointer
              "
            >
              <RiLogoutBoxRLine className="w-5 h-5 shrink-0" />

              <span className="text-sm font-medium">تسجيل الخروج</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4">
            <div className="w-full border-t border-white/10 mb-4" />

            <div className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-black/20 border border-white/10">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[#D4AF37] flex items-center justify-center text-gray-950 font-bold text-sm shadow-md">
                {initials || "أ"}
              </div>

              <div className="min-w-0 flex flex-col flex-1">
                <span className="text-sm font-bold text-white truncate">
                  {userName}
                </span>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    role === "super_admin" ? "bg-amber-400" :
                    role === "admin" ? "bg-blue-400" :
                    role === "driver" ? "bg-emerald-400" : "bg-gray-400"
                  }`} />
                  <span className="text-xs text-white/80 font-medium truncate">
                    {roleSubtitle}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
