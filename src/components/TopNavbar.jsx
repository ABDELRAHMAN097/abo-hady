import { HiOutlineSearch, HiOutlineMenu } from "react-icons/hi";
import { GrLanguage } from "react-icons/gr";
import { FiUser } from "react-icons/fi";
import DropdownNotificat from "./shared/DropdownNotificat";
import { useI18n } from "@/i18n/i18n/context";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function TopNavbar({ onMenuClick }) {
  const { switchLocale, locale } = useI18n();
  const { user, profile, role } = useAuth();

  const handleSwitchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    switchLocale(newLocale);
  };

  const displayName = profile?.name || user?.displayName || (locale === "ar" ? "مستخدم" : "User");
  const avatarUrl = profile?.imageUrl || profile?.avatar || user?.photoURL;
  const roleDisplay = role ? role.replace("_", " ") : "Member";

  return (
    <header className="w-full px-2 py-2 flex items-center justify-between gap-4 border-b border-border">

      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-primary-color transition cursor-pointer"
          aria-label="Toggle Menu"
        >
          <HiOutlineMenu className="w-6 h-6" />
        </button>

        <div className="relative flex-1 max-w-sm md:max-w-xl">
          <HiOutlineSearch className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary" />

          <input
            type="text"
            placeholder={locale === "ar" ? "بحث..." : "Search..."}
            className="w-full bg-[#1F2937] border border-[#374151] rounded-xl ps-10 pe-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        <button onClick={handleSwitchLocale} className="bg-[#F8F8F8] p-2.5 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
          <GrLanguage className="text-[#94A3B8] w-3.5 h-3.5 md:w-5 md:h-5" />
        </button>

        <DropdownNotificat />

        <div className="flex items-center gap-3">
          <Link to={"/" + locale + "/profile"} className="flex items-center gap-2.5 hover:opacity-90 transition">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400 capitalize">
                {roleDisplay}
              </p>
              <p className="font-semibold text-primary-color text-sm truncate max-w-[140px]">
                {displayName}
              </p>
            </div>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center font-bold text-sm">
                {displayName?.charAt(0)?.toUpperCase() || <FiUser size={18} />}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}