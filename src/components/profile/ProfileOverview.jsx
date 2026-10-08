import {
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiShield,
    FiTruck,
    FiStar,
    FiUsers,
    FiXCircle,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";

const roleLabels = {
    customer: "Customer",
    driver: "Driver",
    admin: "Admin",
    super_admin: "Super Admin",
};

const ProfileOverview = ({ user, role }) => {
    const stats = {
        customer: [
            {
                label: "Total Bookings",
                value: "12",
                icon: FiCalendar,
            },
            {
                label: "Completed",
                value: "9",
                icon: FiCheckCircle,
            },
            {
                label: "Active",
                value: "1",
                icon: FiClock,
            },
            {
                label: "Cancelled",
                value: "2",
                icon: FiXCircle,
            },
        ],

        driver: [
            {
                label: "Total Trips",
                value: "148",
                icon: FaCarSide,
            },
            {
                label: "Completed",
                value: "142",
                icon: FiCheckCircle,
            },
            {
                label: "Active Trip",
                value: "1",
                icon: FiClock,
            },
            {
                label: "Rating",
                value: "4.8",
                icon: FiStar,
            },
        ],

        admin: [
            {
                label: "Role",
                value: "Admin",
                icon: FiShield,
            },
            {
                label: "Status",
                value: "Active",
                icon: FiCheckCircle,
            },
            {
                label: "Users Managed",
                value: "248",
                icon: FiUsers,
            },
            {
                label: "Activity",
                value: "32",
                icon: FiClock,
            },
        ],

        super_admin: [
            {
                label: "Access Level",
                value: "Full",
                icon: FiShield,
            },
            {
                label: "System Status",
                value: "Active",
                icon: FiCheckCircle,
            },
            {
                label: "Admins",
                value: "8",
                icon: FiUsers,
            },
            {
                label: "Recent Actions",
                value: "64",
                icon: FiClock,
            },
        ],
    };

    const currentStats = stats[role] || stats.customer;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-[#F9FAFB]">
                    Overview
                </h3>

                <p className="mt-1 text-sm text-[#9CA3AF]">
                    A quick overview of your account and recent information.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {currentStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-white/5 bg-[#111827] p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                                    <Icon size={19} />
                                </div>
                            </div>

                            <p className="mt-4 text-2xl font-bold text-[#F9FAFB]">
                                {stat.value}
                            </p>

                            <p className="mt-1 text-xs text-[#9CA3AF]">
                                {stat.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#111827] p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                        <FiShield size={20} />
                    </div>

                    <div>
                        <h4 className="font-semibold text-[#F9FAFB]">
                            Account Overview
                        </h4>

                        <p className="text-sm text-[#9CA3AF]">
                            Your account is currently active.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoRow
                        label="Name"
                        value={user?.name}
                    />

                    <InfoRow
                        label="Role"
                        value={roleLabels[role]}
                    />

                    <InfoRow
                        label="Last Login"
                        value={user?.lastLogin}
                    />

                    <InfoRow
                        label="Member Since"
                        value={user?.createdAt}
                    />
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="rounded-xl bg-[#0B0C10]/60 p-4">
        <p className="text-xs text-[#9CA3AF]">
            {label}
        </p>

        <p className="mt-1 text-sm font-medium text-[#F9FAFB]">
            {value || "-"}
        </p>
    </div>
);

export default ProfileOverview;