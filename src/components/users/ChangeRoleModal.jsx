import {
    useEffect,
    useState,
} from "react";

const ChangeRoleModal = ({
    isOpen,
    user,
    onClose,
    onConfirm,
    loading,
}) => {
    const [role, setRole] =
        useState("customer");

    useEffect(() => {
        if (user) {
            setRole(
                user.role ||
                    "customer"
            );
        }
    }, [user]);

    if (
        !isOpen ||
        !user
    ) {
        return null;
    }

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            if (
                !role ||
                role === user.role
            ) {
                onClose();
                return;
            }

            await onConfirm(
                user.id,
                role
            );
        };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        Change User Role
                    </h2>

                    <p className="mt-2 text-sm text-gray-400">
                        {user.name ||
                            user.email}
                    </p>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >
                    <select
                        value={role}
                        onChange={(
                            event
                        ) =>
                            setRole(
                                event.target
                                    .value
                            )
                        }
                        className="h-12 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 text-sm text-white outline-none focus:border-emerald-500"
                    >
                        <option value="customer">
                            Customer
                        </option>

                        <option value="driver">
                            Driver
                        </option>

                        <option value="admin">
                            Admin
                        </option>

                        <option value="super_admin">
                            Super Admin
                        </option>
                    </select>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                loading
                            }
                            className="flex-1 rounded-xl bg-gray-800 px-4 py-3 text-sm text-white transition hover:bg-gray-700 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm text-white transition hover:bg-emerald-600 disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeRoleModal;