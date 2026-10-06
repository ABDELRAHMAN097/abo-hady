import { FiSearch, FiChevronDown, FiX } from "react-icons/fi";

const SEARCH_BY = [
    ["all", "البحث في: الكل"],
    ["name", "الاسم"],
    ["email", "البريد الإلكتروني"],
    ["phone", "رقم الهاتف"],
];

const ROLES = [
    ["all", "كل الأدوار"],
    ["customer", "Customer"],
    ["driver", "Driver"],
    ["admin", "Admin"],
    ["super_admin", "Super Admin"],
];

const STATUSES = [
    ["all", "كل الحالات"],
    ["active", "Active"],
    ["inactive", "Inactive"],
];

const fieldClass =
    "h-11 w-full rounded-xl border border-border bg-surface text-sm text-text-primary outline-none transition-colors hover:border-text-muted focus:border-primary-color focus:ring-2 focus:ring-primary-color/20";

const Select = ({ value, options, onChange, label }) => (
    <div className="relative w-full lg:w-44 shrink-0">
        <select
            aria-label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${fieldClass} cursor-pointer appearance-none px-4 pl-10 ${
                value !== "all" ? "border-primary-color/50 text-primary-color" : ""
            }`}
        >
            {options.map(([key, text]) => (
                <option key={key} value={key}>
                    {text}
                </option>
            ))}
        </select>

        <FiChevronDown
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
    </div>
);

export default function UserFilters({
    searchQuery,
    searchBy,
    roleFilter,
    statusFilter,
    onSearchChange,
    onSearchByChange,
    onRoleFilterChange,
    onStatusFilterChange,
    isDebouncing = false,
    searchLoading = false,
}) {
    const hasFilters =
        Boolean(searchQuery) ||
        searchBy !== "all" ||
        roleFilter !== "all" ||
        statusFilter !== "all";

    const clearFilters = () => {
        onSearchChange("");
        onSearchByChange("all");
        onRoleFilterChange("all");
        onStatusFilterChange("all");
    };

    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1 min-w-[220px]">
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-text-muted">
                    {isDebouncing || searchLoading ? (
                        <span
                            aria-label="جاري البحث"
                            className="h-4 w-4 rounded-full border-2 border-primary-color border-t-transparent animate-spin"
                        />
                    ) : (
                        <FiSearch size={18} />
                    )}
                </div>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="ابحث عن مستخدم..."
                    className={`${fieldClass} px-11 placeholder:text-text-muted`}
                />

                {searchQuery && (
                    <button
                        type="button"
                        aria-label="مسح البحث"
                        onClick={() => onSearchChange("")}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
                    >
                        <FiX size={17} />
                    </button>
                )}
            </div>

            <Select label="البحث في" value={searchBy} options={SEARCH_BY} onChange={onSearchByChange} />
            <Select label="الدور" value={roleFilter} options={ROLES} onChange={onRoleFilterChange} />
            <Select label="الحالة" value={statusFilter} options={STATUSES} onChange={onStatusFilterChange} />

            {hasFilters && (
                <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-sm text-text-muted transition-colors hover:bg-card hover:text-text-primary"
                >
                    <FiX size={15} />
                    مسح الفلاتر
                </button>
            )}
        </div>
    );
}