import { FaUser } from "react-icons/fa";

const ProfileNavigation = ({
    tabs = [],
    activeSection,
    onChange,
}) => {
    return (
        <aside className="w-full lg:w-[240px] lg:shrink-0">
            <div className="sticky top-6 rounded-2xl border border-white/5 bg-[#111827] p-2">
                <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                    {tabs.map((tab) => {
                        const Icon = tab.icon || FaUser;
                        const active = activeSection === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onChange(tab.id)}
                                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                                    active
                                        ? "bg-[#10B981]/10 text-[#10B981]"
                                        : "text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]"
                                }`}
                            >
                                <Icon
                                    size={18}
                                    className="shrink-0"
                                />

                                <span className="whitespace-nowrap">
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default ProfileNavigation;