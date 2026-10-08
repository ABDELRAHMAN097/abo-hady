import { FaCarSide } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

const DriverInformation = () => {
    const driver = {
        driverId: "DRV-00124",
        licenseNumber: "123456789",
        licenseType: "Private",
        licenseExpiry: "2028-08-12",
        experience: "6 Years",
        emergencyContact: "Mohamed Ahmed",
        emergencyPhone: "+20 101 000 0000",
        status: "Available",
    };

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                            <FaCarSide size={21} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-[#F9FAFB]">
                                Driver Information
                            </h3>

                            <p className="text-sm text-[#9CA3AF]">
                                Your professional driver information.
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1.5 text-xs font-medium text-[#10B981]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                        {driver.status}
                    </span>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Info label="Driver ID" value={driver.driverId} />
                    <Info
                        label="Driving License Number"
                        value={driver.licenseNumber}
                    />
                    <Info label="License Type" value={driver.licenseType} />
                    <Info
                        label="License Expiry"
                        value={driver.licenseExpiry}
                    />
                    <Info
                        label="Years of Experience"
                        value={driver.experience}
                    />
                </div>
            </section>

            <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#9CA3AF]">
                        <FiPhone size={19} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-[#F9FAFB]">
                            Emergency Contact
                        </h3>

                        <p className="text-sm text-[#9CA3AF]">
                            Contact information in case of emergency.
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Info
                        label="Contact Name"
                        value={driver.emergencyContact}
                    />

                    <Info
                        label="Phone Number"
                        value={driver.emergencyPhone}
                    />
                </div>
            </section>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div className="rounded-xl bg-[#0B0C10]/60 p-4">
        <p className="text-xs text-[#9CA3AF]">
            {label}
        </p>

        <p className="mt-1 text-sm font-medium text-[#F9FAFB]">
            {value}
        </p>
    </div>
);

export default DriverInformation;