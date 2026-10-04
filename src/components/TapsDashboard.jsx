import { useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { LuWallet } from "react-icons/lu";
import { BiGroup } from "react-icons/bi";

export default function TapsDashboard() {
  const [summary] = useState(null);
  const [loading] = useState(false);

  const cards = [
    {
      title: "WALLET BALANCE",
      value: "0.00EGP",
      note: "No data yet",
      icon: LuWallet,
      iconStyle: "bg-blue-50 text-[#11255C]",
      topUp: true,
    },
    {
      title: "TOTAL STUDENTS",
      value: summary?.memberships_summary?.students_count ?? 0,
      note: "No data yet",
      icon: BiGroup,
      iconStyle: "bg-fuchsia-50 text-fuchsia-400",
    },
    {
      title: "ACTIVE EXAMS",
      value: 0,
      note: "No data yet",
      icon: HiOutlineDocumentText,
      iconStyle: "bg-emerald-50 text-emerald-500",
    },
    {
      title: "TOTAL GROUPS",
      value: summary?.memberships_summary?.groups_count ?? 0,
      note: "No data yet",
      icon: HiOutlineUserGroup,
      iconStyle: "bg-amber-50 text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map(({ title, value, note, icon: Icon, iconStyle, topUp }) => (
        <div
          key={title}
          className="min-w-0 rounded-xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
            >
              <Icon className="h-4 w-4" />
            </div>

            {topUp && (
              <button
                type="button"
                className="rounded-md bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500"
              >
                Top Up +
              </button>
            )}
          </div>

          <p className="mb-1 text-[10px] font-bold tracking-wide text-slate-400">
            {title}
          </p>

          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-text-secondary sm:text-2xl">
              {loading ? "..." : value}
            </h3>

            <span className="text-[10px] text-slate-400">{note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}