import { HiOutlineSearch, HiOutlineMenu } from "react-icons/hi";
import { GrLanguage } from "react-icons/gr";
import DropdownNotificat from "./shared/DropdownNotificat";
import { useI18n } from "@/i18n/i18n/context";

export default function TopNavbar({ onMenuClick }) {
  const { switchLocale, locale } = useI18n()

  const handleSwitchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    switchLocale(newLocale);
  }
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
            placeholder="Search"
            className="w-full bg-[#1F2937] border border-[#374151] rounded-xl ps-10 pe-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10B981] transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        <button onClick={handleSwitchLocale} className="bg-[#F8F8F8] p-2.5 border border-gray-200 rounded-xl">
          <GrLanguage className="text-[#94A3B8] w-3.5 h-3.5 md:w-5 md:h-5" />
        </button>

        <DropdownNotificat />

        <div className="flex items-center gap-3">

          <div className="text-right hidden sm:block">
            <p className="text-sm md:text-xs text-gray-400">
              Welcome, Center
            </p>

            <p className="font-semibold text-primary-color">
              Elnoor!
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
            alt=""
            className="w-10 h-10 rounded-xl"
          />

        </div>

      </div>
    </header>
  );
}