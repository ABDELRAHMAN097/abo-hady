import {
    FiCheckCircle,
    FiLock,
    FiXCircle,
} from "react-icons/fi";

const permissions = {
    admin: [
        ["User Management", true],
        ["Car Management", true],
        ["Booking Management", true],
        ["Driver Management", true],
        ["Landing Page Management", true],
        ["System Settings", false],
    ],

    super_admin: [
        ["User Management", true],
        ["Car Management", true],
        ["Booking Management", true],
        ["Driver Management", true],
        ["Landing Page Management", true],
        ["System Settings", true],
        ["Admin Management", true],
    ],
};

const PermissionsSection = ({ role }) => {
    const currentPermissions =
        permissions[role] || permissions.admin;

    const isSuperAdmin = role === "super_admin";

    return (
        <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                    <FiLock size={19} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#F9FAFB]">
                        {isSuperAdmin
                            ? "System Access"
                            : "Permissions"}
                    </h3>

                    <p className="mt-1 text-sm text-[#9CA3AF]">
                        {isSuperAdmin
                            ? "Your account has full access to the system."
                            : "View the permissions assigned to your account."}
                    </p>
                </div>
            </div>

            {isSuperAdmin && (
                <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
                    <p className="text-sm font-semibold text-[#D4AF37]">
                        Full System Access
                    </p>

                    <p className="mt-1 text-xs text-[#9CA3AF]">
                        Super Admin accounts have access to all available
                        system modules.
                    </p>
                </div>
            )}

            <div className="mt-6 divide-y divide-white/5 rounded-2xl border border-white/5">
                {currentPermissions.map(([label, enabled]) => (
                    <div
                        key={label}
                        className="flex items-center justify-between gap-4 px-4 py-4"
                    >
                        <span className="text-sm text-[#F9FAFB]">
                            {label}
                        </span>

                        {enabled ? (
                            <span className="flex items-center gap-2 text-xs font-medium text-[#10B981]">
                                <FiCheckCircle size={16} />
                                Enabled
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-xs font-medium text-[#9CA3AF]">
                                <FiXCircle size={16} />
                                Disabled
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PermissionsSection;