import {
    FaUsers,
    FaUser,
    FaCar,
    FaUserShield,
} from "react-icons/fa";

const UserStats = ({
    stats,
    loading,
}) => {
    const cards = [
        {
            title: "إجمالي المستخدمين",
            value: stats.total,
            icon: FaUsers,
        },
        {
            title: "العملاء",
            value: stats.customers,
            icon: FaUser,
        },
        {
            title: "السائقين",
            value: stats.drivers,
            icon: FaCar,
        },
        {
            title: "الإدارة",
            value: stats.management,
            icon: FaUserShield,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-primary-color/40"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary">
                                    {card.title}
                                </p>

                                <p className="mt-2 flex h-8 items-center text-2xl font-bold text-text-primary">
                                    <span className={loading ? "abu-pulse text-text-muted" : ""}>
                                        {loading ? "..." : card.value}
                                    </span>
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-color/10 text-primary-color">
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UserStats;