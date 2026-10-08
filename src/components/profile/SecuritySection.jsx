import {
    FiCheckCircle,
    FiKey,
    FiShield,
} from "react-icons/fi";

const SecuritySection = ({ user }) => {
    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                        <FiShield size={20} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-[#F9FAFB]">
                            Account Security
                        </h3>

                        <p className="text-sm text-[#9CA3AF]">
                            Keep your account secure and up to date.
                        </p>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <SecurityRow
                        title="Email Verification"
                        description={user?.email}
                        verified
                    />

                    <SecurityRow
                        title="Last Login"
                        description={user?.lastLogin || "-"}
                    />

                    <SecurityRow
                        title="Account Created"
                        description={user?.createdAt || "-"}
                    />
                </div>
            </section>

            <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#9CA3AF]">
                        <FiKey size={19} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[#F9FAFB]">
                            Password
                        </h3>

                        <p className="text-sm text-[#9CA3AF]">
                            Update your account password.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-5 rounded-xl bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669]"
                >
                    Change Password
                </button>
            </section>
        </div>
    );
};

const SecurityRow = ({
    title,
    description,
    verified,
}) => (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#0B0C10]/60 p-4">
        <div>
            <p className="text-sm font-medium text-[#F9FAFB]">
                {title}
            </p>

            <p className="mt-1 text-xs text-[#9CA3AF]">
                {description}
            </p>
        </div>

        {verified && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                <FiCheckCircle size={15} />
                Verified
            </span>
        )}
    </div>
);

export default SecuritySection;