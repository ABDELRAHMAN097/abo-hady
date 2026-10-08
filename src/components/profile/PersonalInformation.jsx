import { FaEdit } from "react-icons/fa";
const PersonalInformation = ({ user }) => {
    return (
        <Section
            title="Personal Information"
            description="Manage your personal account information."
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoField
                    label="Full Name"
                    value={user?.name}
                />

                <InfoField
                    label="Email Address"
                    value={user?.email}
                />

                <InfoField
                    label="Phone Number"
                    value={user?.phone}
                />

                <InfoField
                    label="Date of Birth"
                    value={user?.dateOfBirth}
                />

                <InfoField
                    label="City"
                    value={user?.city}
                />

                <InfoField
                    label="Address"
                    value={user?.address}
                />
            </div>

            <div className="mt-6 flex justify-end border-t border-white/5 pt-5">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#059669]"
                >
                    <FaEdit  size={16} />
                    Edit Information
                </button>
            </div>
        </Section>
    );
};

const Section = ({ title, description, children }) => (
    <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#F9FAFB]">
                {title}
            </h3>

            <p className="mt-1 text-sm text-[#9CA3AF]">
                {description}
            </p>
        </div>

        {children}
    </section>
);

const InfoField = ({ label, value }) => (
    <div>
        <label className="mb-2 block text-xs font-medium text-[#9CA3AF]">
            {label}
        </label>

        <div className="rounded-xl border border-white/5 bg-[#0B0C10]/60 px-4 py-3 text-sm text-[#F9FAFB]">
            {value || "-"}
        </div>
    </div>
);

export default PersonalInformation;