import {
    FaChevronRight,
    FaChevronLeft,
} from "react-icons/fa";

const UsersPagination = ({
    currentPage,
    hasNextPage,
    loading,
    onNext,
    onPrevious,
}) => {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
            <p className="text-sm text-text-secondary">
                الصفحة{" "}
                <span className="font-bold text-text-primary">
                    {currentPage}
                </span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={
                        currentPage === 1 ||
                        loading
                    }
                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:border-primary-color hover:text-primary-color disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <FaChevronRight size={12} />

                    السابق
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    disabled={
                        !hasNextPage ||
                        loading
                    }
                    className="flex items-center gap-2 rounded-xl bg-primary-color px-4 py-2.5 text-sm font-bold text-secondary-color transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                    التالي

                    <FaChevronLeft size={12} />
                </button>
            </div>
        </div>
    );
};

export default UsersPagination;