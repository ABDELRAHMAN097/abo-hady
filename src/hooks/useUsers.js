import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { toast } from "react-toastify";

import {
    getAllUsers,
    getUserStats,
    updateUserRole,
} from "@/services/auth";

const USERS_PER_PAGE = 5;

const INITIAL_STATS = {
    total: 0,
    customers: 0,
    drivers: 0,
    admins: 0,
    superAdmins: 0,
    management: 0,
};

export const useUsers = () => {
    // ======================================================
    // Users
    // ======================================================

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [statsLoading, setStatsLoading] =
        useState(true);

    // ======================================================
    // Search
    // ======================================================

    const [searchQuery, setSearchQuery] =
        useState("");

    // ======================================================
    // Filters
    // ======================================================

    const [selectedRoleFilter, setSelectedRoleFilter] =
        useState("all");

    const [selectedStatusFilter, setSelectedStatusFilter] =
        useState("all");

    // ======================================================
    // Pagination
    // ======================================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const [hasNextPage, setHasNextPage] =
        useState(false);

    /*
     * Cursor of every page.
     *
     * pageCursors[0] = cursor for page 1
     * pageCursors[1] = cursor for page 2
     * pageCursors[2] = cursor for page 3
     *
     * Page 1 always starts with null.
     */

    const [pageCursors, setPageCursors] =
        useState([null]);

    /*
     * Last Firestore document
     * of the currently loaded page.
     */

    const [lastDoc, setLastDoc] =
        useState(null);

    // ======================================================
    // Statistics
    // ======================================================

    const [stats, setStats] =
        useState(INITIAL_STATS);

    // ======================================================
    // Role Modal
    // ======================================================

    const [selectedUserForRole, setSelectedUserForRole] =
        useState(null);

    const [newTargetRole, setNewTargetRole] =
        useState("");

    const [isUpdatingRole, setIsUpdatingRole] =
        useState(false);

    // ======================================================
    // Fetch Users
    // ======================================================

    const fetchUsersPage = useCallback(
        async ({
            cursor = null,
            role = selectedRoleFilter,
            status = selectedStatusFilter,
        } = {}) => {
            try {
                setLoading(true);

                const result =
                    await getAllUsers({
                        pageSize:
                            USERS_PER_PAGE,

                        role,

                        status,

                        cursor,
                    });

                setUsers(
                    result?.users || []
                );

                setLastDoc(
                    result?.lastDoc || null
                );

                setHasNextPage(
                    Boolean(
                        result?.hasNextPage
                    )
                );

                return result;
            } catch (error) {
                console.error(
                    "Failed to fetch users:",
                    error
                );

                setUsers([]);

                setLastDoc(null);

                setHasNextPage(false);

                /*
                 * Don't hide the actual Firestore
                 * error from us during development.
                 */

                console.error(
                    "Firestore error details:",
                    error?.code,
                    error?.message
                );

                toast.error(
                    "حدث خطأ أثناء تحميل المستخدمين"
                );

                return null;
            } finally {
                setLoading(false);
            }
        },
        [
            selectedRoleFilter,
            selectedStatusFilter,
        ]
    );

    // ======================================================
    // Fetch Stats
    // ======================================================

    const fetchStats =
        useCallback(async () => {
            try {
                setStatsLoading(true);

                const result =
                    await getUserStats();

                setStats({
                    total:
                        result?.total || 0,

                    customers:
                        result?.customers ||
                        0,

                    drivers:
                        result?.drivers ||
                        0,

                    admins:
                        result?.admins ||
                        0,

                    superAdmins:
                        result?.superAdmins ||
                        0,

                    management:
                        result?.management ||
                        0,
                });
            } catch (error) {
                console.error(
                    "Failed to fetch user stats:",
                    error
                );

                toast.error(
                    "حدث خطأ أثناء تحميل الإحصائيات"
                );
            } finally {
                setStatsLoading(false);
            }
        }, []);

    // ======================================================
    // Initial Load + Filter Changes
    // ======================================================

    useEffect(() => {
        let cancelled = false;

        const loadPageOne =
            async () => {
                /*
                 * Every time role/status changes,
                 * completely reset pagination.
                 */

                setCurrentPage(1);

                setPageCursors([
                    null,
                ]);

                setLastDoc(null);

                if (cancelled) {
                    return;
                }

                await fetchUsersPage({
                    cursor: null,

                    role:
                        selectedRoleFilter,

                    status:
                        selectedStatusFilter,
                });
            };

        loadPageOne();

        return () => {
            cancelled = true;
        };
    }, [
        selectedRoleFilter,
        selectedStatusFilter,
        fetchUsersPage,
    ]);

    // ======================================================
    // Initial Statistics
    // ======================================================

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // ======================================================
    // Search
    // ======================================================

    /*
     * Search currently works on the loaded page only.
     *
     * It does NOT download all users.
     */

    const filteredUsers =
        users.filter((user) => {
            const query =
                searchQuery
                    .trim()
                    .toLowerCase();

            if (!query) {
                return true;
            }

            const name =
                user.name
                    ?.toLowerCase() || "";

            const email =
                user.email
                    ?.toLowerCase() || "";

            const phone =
                user.phone
                    ?.toLowerCase() || "";

            return (
                name.includes(query) ||
                email.includes(query) ||
                phone.includes(query)
            );
        });

    // ======================================================
    // Role Filter
    // ======================================================

    const handleRoleFilterChange =
        (newRole) => {
            if (
                newRole ===
                selectedRoleFilter
            ) {
                return;
            }

            /*
             * Clear search when changing
             * the dataset.
             */

            setSearchQuery("");

            /*
             * Reset pagination immediately.
             */

            setCurrentPage(1);

            setPageCursors([
                null,
            ]);

            setLastDoc(null);

            /*
             * Changing this state triggers
             * the useEffect above which
             * fetches page 1.
             */

            setSelectedRoleFilter(
                newRole
            );
        };

    // ======================================================
    // Status Filter
    // ======================================================

    const handleStatusFilterChange =
        (newStatus) => {
            if (
                newStatus ===
                selectedStatusFilter
            ) {
                return;
            }

            setSearchQuery("");

            setCurrentPage(1);

            setPageCursors([
                null,
            ]);

            setLastDoc(null);

            setSelectedStatusFilter(
                newStatus
            );
        };

    // ======================================================
    // Next Page
    // ======================================================

    const handleNextPage = async () => {
        if (
            loading ||
            !hasNextPage ||
            !lastDoc
        ) {
            return;
        }

        const nextPage =
            currentPage + 1;

        const result =
            await fetchUsersPage({
                cursor: lastDoc,

                role:
                    selectedRoleFilter,

                status:
                    selectedStatusFilter,
            });

        if (!result) {
            return;
        }

        // Save the cursor only after
        // successfully loading the next page.

        setPageCursors(
            (previous) => {
                const updated = [
                    ...previous,
                ];

                updated[nextPage - 1] =
                    lastDoc;

                return updated;
            }
        );

        setCurrentPage(
            nextPage
        );
    };

    // ======================================================
    // Previous Page
    // ======================================================

    const handlePreviousPage =
        async () => {
            if (
                loading ||
                currentPage <= 1
            ) {
                return;
            }

            const previousPage =
                currentPage - 1;

            /*
             * Get the cursor that starts
             * the previous page.
             *
             * Page 1 => null
             * Page 2 => pageCursors[1]
             * Page 3 => pageCursors[2]
             */

            const previousCursor =
                pageCursors[
                previousPage - 1
                ] || null;

            const result =
                await fetchUsersPage({
                    cursor:
                        previousCursor,

                    role:
                        selectedRoleFilter,

                    status:
                        selectedStatusFilter,
                });

            if (result) {
                setCurrentPage(
                    previousPage
                );
            }
        };

    // ======================================================
    // Refresh
    // ======================================================

    const refreshUsers =
        async () => {
            setSearchQuery("");

            setCurrentPage(1);

            setPageCursors([
                null,
            ]);

            setLastDoc(null);

            await fetchUsersPage({
                cursor: null,

                role:
                    selectedRoleFilter,

                status:
                    selectedStatusFilter,
            });

            await fetchStats();
        };

    // ======================================================
    // Open Role Modal
    // ======================================================

    const openRoleModal =
        (user) => {
            setSelectedUserForRole(
                user
            );

            setNewTargetRole(
                user?.role ||
                "customer"
            );
        };

    // ======================================================
    // Close Role Modal
    // ======================================================

    const closeRoleModal =
        () => {
            if (
                isUpdatingRole
            ) {
                return;
            }

            setSelectedUserForRole(
                null
            );

            setNewTargetRole("");
        };

    // ======================================================
    // Confirm Role Update
    // ======================================================

    const confirmRoleUpdate =
        async () => {
            if (
                !selectedUserForRole ||
                !newTargetRole
            ) {
                return;
            }

            const userId =
                selectedUserForRole.id ||
                selectedUserForRole.uid;

            if (!userId) {
                toast.error(
                    "لم يتم العثور على معرف المستخدم"
                );

                return;
            }

            if (
                selectedUserForRole.role ===
                newTargetRole
            ) {
                toast.info(
                    "المستخدم بالفعل لديه هذا الدور"
                );

                return;
            }

            try {
                setIsUpdatingRole(
                    true
                );

                await updateUserRole(
                    userId,
                    newTargetRole
                );

                toast.success(
                    "تم تحديث صلاحيات المستخدم بنجاح"
                );

                setSelectedUserForRole(
                    null
                );

                setNewTargetRole("");

                /*
                 * Reload the current page.
                 */

                const currentCursor =
                    pageCursors[
                    currentPage - 1
                    ] || null;

                await fetchUsersPage({
                    cursor:
                        currentCursor,

                    role:
                        selectedRoleFilter,

                    status:
                        selectedStatusFilter,
                });

                await fetchStats();
            } catch (error) {
                console.error(
                    "Failed to update user role:",
                    error
                );

                toast.error(
                    "حدث خطأ أثناء تحديث صلاحيات المستخدم"
                );
            } finally {
                setIsUpdatingRole(
                    false
                );
            }
        };

    // ======================================================
    // Return
    // ======================================================

    return {
        // Users
        users,
        filteredUsers,

        // Loading
        loading,
        statsLoading,

        // Search
        searchQuery,
        setSearchQuery,

        // Filters
        selectedRoleFilter,
        selectedStatusFilter,

        handleRoleFilterChange,
        handleStatusFilterChange,

        // Stats
        stats,

        // Pagination
        currentPage,
        hasNextPage,

        handleNextPage,
        handlePreviousPage,

        // Refresh
        refreshUsers,

        // Role Modal
        selectedUserForRole,
        newTargetRole,

        setNewTargetRole,

        openRoleModal,
        closeRoleModal,
        confirmRoleUpdate,

        isUpdatingRole,
    };
};