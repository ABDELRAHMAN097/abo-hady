import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const base =
    "group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

const UsersPagination = ({ currentPage, hasNextPage, onNext, onPrevious, loading }) => (
    <nav
        dir="rtl"
        aria-label="التنقل بين الصفحات"
        aria-busy={loading}
        className="flex items-center justify-between gap-3 border-t border-border pt-5"
    >
        <button
            type="button"
            onClick={onPrevious}
            disabled={currentPage <= 1 || loading}
            className={`${base} border border-border bg-surface text-text-secondary hover:bg-card hover:text-text-primary disabled:hover:bg-surface disabled:hover:text-text-secondary`}
        >
            <FiChevronRight className="h-4 w-4 transition-transform duration-300 group-enabled:group-hover:translate-x-0.5" />
            السابق
        </button>

        <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-text-secondary">
            الصفحة
            <span className={`font-bold text-primary-color ${loading ? "abu-pulse" : ""}`}>
                {currentPage}
            </span>
        </span>

        <button
            type="button"
            onClick={onNext}
            disabled={!hasNextPage || loading}
            className={`${base} bg-primary-color text-background shadow-lg shadow-primary-color/10 hover:bg-primary-hover hover:shadow-primary-color/25 disabled:shadow-none disabled:hover:bg-primary-color`}
        >
            التالي
            <FiChevronLeft className="h-4 w-4 transition-transform duration-300 group-enabled:group-hover:-translate-x-0.5" />
        </button>
    </nav>
);

export default UsersPagination;