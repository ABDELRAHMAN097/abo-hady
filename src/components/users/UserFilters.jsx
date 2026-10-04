import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const ROLE_FILTERS = [
    { value: "all", label: "كل الأدوار" },
    { value: "customer", label: "العملاء" },
    { value: "driver", label: "السائقين" },
    { value: "admin", label: "الأدمن" },
    { value: "super_admin", label: "السوبر أدمن" },
];

const STATUS_FILTERS = [
    { value: "all", label: "كل الحالات" },
    { value: "active", label: "نشط" },
    { value: "inactive", label: "غير نشط" },
];

const UserFilters = ({
    searchQuery,
    onSearchChange,
    selectedRoleFilter,
    onRoleFilterChange,
    selectedStatusFilter,
    onStatusFilterChange,
}) => {
    const hasFilters =
        searchQuery.trim() ||
        selectedRoleFilter !== "all" ||
        selectedStatusFilter !== "all";

    const handleClearFilters = () => {
        onSearchChange("");
        onRoleFilterChange("all");
        onStatusFilterChange("all");
    };

    return (
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-color/10 text-primary-color">
                        <FaFilter size={14} />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-text-primary">
                            البحث والتصفية
                        </h3>

                        <p className="mt-0.5 text-xs text-text-muted">
                            ابحث أو اختر فلتر
                        </p>
                    </div>
                </div>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="flex items-center gap-1.5 text-xs font-semibold text-text-muted transition hover:text-error"
                    >
                        <FaTimes size={11} />
                        مسح
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <FaSearch
                    size={14}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    placeholder="ابحث بالاسم أو البريد أو الهاتف"
                    className="h-11 w-full rounded-xl border border-border bg-background py-2 pl-4 pr-10 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-color"
                />
            </div>

            {/* Filters */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Role */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                        الدور
                    </label>

                    <select
                        value={selectedRoleFilter}
                        onChange={(event) =>
                            onRoleFilterChange(
                                event.target.value
                            )
                        }
                        className="h-11 w-full cursor-pointer rounded-xl border border-border bg-background px-3 text-sm text-text-primary outline-none transition focus:border-primary-color"
                    >
                        {ROLE_FILTERS.map((filter) => (
                            <option
                                key={filter.value}
                                value={filter.value}
                            >
                                {filter.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-text-secondary">
                        الحالة
                    </label>

                    <select
                        value={selectedStatusFilter}
                        onChange={(event) =>
                            onStatusFilterChange(
                                event.target.value
                            )
                        }
                        className="h-11 w-full cursor-pointer rounded-xl border border-border bg-background px-3 text-sm text-text-primary outline-none transition focus:border-primary-color"
                    >
                        {STATUS_FILTERS.map((filter) => (
                            <option
                                key={filter.value}
                                value={filter.value}
                            >
                                {filter.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default UserFilters;