import {
    FiCamera,
    FiMail,
    FiPhone,
    FiShield,
    FiUser,
} from "react-icons/fi";

const roleLabels = {
    customer: "Customer",
    driver: "Driver",
    admin: "Admin",
    super_admin: "Super Admin",
};

const ProfileHeader = ({ user, role }) => {
    const roleLabel = roleLabels[role] || role;

    const initials = user?.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#111827]">
            <div className="relative h-28 bg-linear-to-r from-[#0F172A] via-[#111827] to-[#0B0C10]">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-[#10B981] blur-3xl" />
                </div>
            </div>

            <div className="relative px-5 pb-5 sm:px-6">
                <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                        {/* Avatar */}
                        <div className="relative h-24 w-24 shrink-0 rounded-2xl border-4 border-[#111827] bg-[#1F2937]">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-full w-full rounded-xl object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-xl text-2xl font-bold text-[#10B981]">
                                    {initials || <UserRound size={32} />}
                                </div>
                            )}

                            <button
                                type="button"
                                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111827] bg-[#10B981] text-white transition hover:bg-[#059669]"
                                aria-label="Change profile picture"
                            >
                                <FiCamera size={15} />
                            </button>
                        </div>

                        <div className="pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-bold text-[#F9FAFB]">
                                    {user?.name || "User"}
                                </h2>

                                <span className="rounded-full bg-[#10B981]/10 px-2.5 py-1 text-xs font-medium text-[#10B981]">
                                    {roleLabel}
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#9CA3AF]">
                                <span className="inline-flex items-center gap-2">
                                    <FiMail size={15} />
                                    {user?.email || "-"}
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <FiPhone size={15} />
                                    {user?.phone || "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pb-1">
                        <span className="flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-3 py-1.5 text-xs font-medium text-[#10B981]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                            {user?.status === "active"
                                ? "Active"
                                : "Inactive"}
                        </span>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/5 pt-5 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl bg-[#0B0C10]/50 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F2937] text-[#9CA3AF]">
                            <FiShield size={18} />
                        </div>

                        <div>
                            <p className="text-xs text-[#9CA3AF]">
                                Account Status
                            </p>
                            <p className="text-sm font-medium text-[#F9FAFB]">
                                Verified Account
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#0B0C10]/50 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F2937] text-[#9CA3AF]">
                            <FiUser size={18} />
                        </div>

                        <div>
                            <p className="text-xs text-[#9CA3AF]">
                                Member Since
                            </p>
                            <p className="text-sm font-medium text-[#F9FAFB]">
                                {user?.createdAt || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileHeader;