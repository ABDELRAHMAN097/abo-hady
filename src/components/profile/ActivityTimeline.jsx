import {
    FiActivity,
    FiCalendar,
    FiCheckCircle,
    FiLogIn,
    FiUser,
} from "react-icons/fi";

const ActivityTimeline = ({ role }) => {
    const activities =
        role === "customer"
            ? [
                  {
                      title: "Booked a Toyota Corolla",
                      date: "Today at 05:42 PM",
                      icon: FiCalendar,
                  },
                  {
                      title: "Updated phone number",
                      date: "Yesterday at 02:18 PM",
                      icon: FiUser,
                  },
                  {
                      title: "Logged in",
                      date: "Yesterday at 09:10 AM",
                      icon: FiLogIn,
                  },
              ]
            : [
                  {
                      title: "Updated profile information",
                      date: "Today at 05:42 PM",
                      icon: FiUser,
                  },
                  {
                      title: "Completed a trip",
                      date: "Yesterday at 06:20 PM",
                      icon: FiCheckCircle,
                  },
                  {
                      title: "Logged in",
                      date: "Yesterday at 09:10 AM",
                      icon: FiLogIn,
                  },
              ];

    return (
        <section className="rounded-2xl border border-white/5 bg-[#111827] p-5 sm:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                    <FiActivity size={19} />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#F9FAFB]">
                        Recent Activity
                    </h3>

                    <p className="text-sm text-[#9CA3AF]">
                        Recent actions related to your account.
                    </p>
                </div>
            </div>

            <div className="mt-7">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    const last = index === activities.length - 1;

                    return (
                        <div
                            key={`${activity.title}-${index}`}
                            className="relative flex gap-4"
                        >
                            {!last && (
                                <div className="absolute left-[17px] top-9 h-[calc(100%-8px)] w-px bg-white/10" />
                            )}

                            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981]">
                                <Icon size={16} />
                            </div>

                            <div className="pb-7">
                                <p className="text-sm font-medium text-[#F9FAFB]">
                                    {activity.title}
                                </p>

                                <p className="mt-1 text-xs text-[#9CA3AF]">
                                    {activity.date}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ActivityTimeline;