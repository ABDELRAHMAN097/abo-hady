import {
    FaUsers,
    FaSyncAlt,
} from "react-icons/fa";

const UsersHeader = ({
    onRefresh,
    loading,
}) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-color/10 text-primary-color">
                        <FaUsers size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            المستخدمين
                        </h1>

                        <p className="mt-1 text-sm text-text-secondary">
                            إدارة المستخدمين والصلاحيات والحسابات
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-primary-color hover:text-primary-color disabled:cursor-not-allowed disabled:opacity-50"
            >
                <FaSyncAlt
                    className={
                        loading
                            ? "animate-spin"
                            : ""
                    }
                />

                تحديث
            </button>
        </div>
    );
};

export default UsersHeader;