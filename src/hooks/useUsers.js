import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { toast } from "react-toastify";

import {
    getAllUsers,
    searchUsers,
    getUserStats,
    updateUserRole,
} from "@/services/auth";

const USERS_PER_PAGE = 5;
const SEARCH_DEBOUNCE = 500;

const INITIAL_STATS = {
    total: 0,
    customers: 0,
    drivers: 0,
    admins: 0,
    superAdmins: 0,
    management: 0,
};

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const [selectedRoleFilter, setSelectedRoleFilter] =
        useState("all");

    const [selectedStatusFilter, setSelectedStatusFilter] =
        useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    const [pageCursors, setPageCursors] = useState([null]);
    const [lastDoc, setLastDoc] = useState(null);

    const [stats, setStats] = useState(INITIAL_STATS);

    const [selectedUserForRole, setSelectedUserForRole] =
        useState(null);

    const [newTargetRole, setNewTargetRole] = useState("");

    const [isUpdatingRole, setIsUpdatingRole] =
        useState(false);

    const searchRequestId = useRef(0);
    const usersRequestId = useRef(0);

    const fetchUsersPage = useCallback(
        async ({
            cursor = null,
            role = selectedRoleFilter,
            status = selectedStatusFilter,
        } = {}) => {
            const requestId = ++usersRequestId.current;

            try {
                setLoading(true);

                const result = await getAllUsers({
                    pageSize: USERS_PER_PAGE,
                    role,
                    status,
                    cursor,
                });

                if (requestId !== usersRequestId.current) {
                    return null;
                }

                setUsers(result?.users || []);
                setLastDoc(result?.lastDoc || null);
                setHasNextPage(
                    Boolean(result?.hasNextPage)
                );

                return result;
            } catch (error) {
                if (requestId !== usersRequestId.current) {
                    return null;
                }

                console.error(
                    "Failed to fetch users:",
                    error
                );

                setUsers([]);
                setLastDoc(null);
                setHasNextPage(false);

                toast.error(
                    "حدث خطأ أثناء تحميل المستخدمين"
                );

                return null;
            } finally {
                if (requestId === usersRequestId.current) {
                    setLoading(false);
                }
            }
        },
        [
            selectedRoleFilter,
            selectedStatusFilter,
        ]
    );

    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);

            const result = await getUserStats();

            setStats({
                total: result?.total || 0,
                customers: result?.customers || 0,
                drivers: result?.drivers || 0,
                admins: result?.admins || 0,
                superAdmins:
                    result?.superAdmins || 0,
                management:
                    result?.management || 0,
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

    const handleSearch = useCallback((value) => {
        setSearchQuery(value);
    }, []);

    useEffect(() => {
        const queryText = searchQuery.trim();

        if (!queryText) {
            searchRequestId.current += 1;
            setSearchResults(null);
            setSearchLoading(false);

            return;
        }

        const timer = setTimeout(async () => {
            const requestId = ++searchRequestId.current;

            try {
                setSearchLoading(true);

                const results = await searchUsers({
                    searchQuery: queryText,
                    role: selectedRoleFilter,
                    status: selectedStatusFilter,
                });

                if (
                    requestId !==
                    searchRequestId.current
                ) {
                    return;
                }

                setSearchResults(results);
            } catch (error) {
                if (
                    requestId !==
                    searchRequestId.current
                ) {
                    return;
                }

                console.error(
                    "Failed to search users:",
                    error
                );

                setSearchResults([]);

                toast.error(
                    "حدث خطأ أثناء البحث عن المستخدمين"
                );
            } finally {
                if (
                    requestId ===
                    searchRequestId.current
                ) {
                    setSearchLoading(false);
                }
            }
        }, SEARCH_DEBOUNCE);

        return () => {
            clearTimeout(timer);
        };
    }, [
        searchQuery,
        selectedRoleFilter,
        selectedStatusFilter,
    ]);

    useEffect(() => {
        setCurrentPage(1);
        setPageCursors([null]);
        setLastDoc(null);

        if (searchQuery.trim()) {
            return;
        }

        fetchUsersPage({
            cursor: null,
            role: selectedRoleFilter,
            status: selectedStatusFilter,
        });
    }, [
        selectedRoleFilter,
        selectedStatusFilter,
        fetchUsersPage,
    ]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const filteredUsers =
        searchQuery.trim().length > 0
            ? searchResults || []
            : users;

    const handleRoleFilterChange = useCallback(
        (newRole) => {
            if (newRole === selectedRoleFilter) {
                return;
            }

            searchRequestId.current += 1;

            setSearchQuery("");
            setSearchResults(null);
            setSearchLoading(false);

            setCurrentPage(1);
            setPageCursors([null]);
            setLastDoc(null);

            setSelectedRoleFilter(newRole);
        },
        [selectedRoleFilter]
    );

    const handleStatusFilterChange = useCallback(
        (newStatus) => {
            if (
                newStatus ===
                selectedStatusFilter
            ) {
                return;
            }

            searchRequestId.current += 1;

            setSearchQuery("");
            setSearchResults(null);
            setSearchLoading(false);

            setCurrentPage(1);
            setPageCursors([null]);
            setLastDoc(null);

            setSelectedStatusFilter(newStatus);
        },
        [selectedStatusFilter]
    );

    const handleNextPage = useCallback(
        async () => {
            if (
                loading ||
                searchQuery.trim() ||
                !hasNextPage ||
                !lastDoc
            ) {
                return;
            }

            const nextPage =
                currentPage + 1;

            const currentLastDoc =
                lastDoc;

            const result =
                await fetchUsersPage({
                    cursor:
                        currentLastDoc,
                    role:
                        selectedRoleFilter,
                    status:
                        selectedStatusFilter,
                });

            if (!result) {
                return;
            }

            setPageCursors(
                (previous) => {
                    const updated = [
                        ...previous,
                    ];

                    updated[nextPage - 1] =
                        currentLastDoc;

                    return updated;
                }
            );

            setCurrentPage(nextPage);
        },
        [
            loading,
            searchQuery,
            hasNextPage,
            lastDoc,
            currentPage,
            fetchUsersPage,
            selectedRoleFilter,
            selectedStatusFilter,
        ]
    );

    const handlePreviousPage =
        useCallback(async () => {
            if (
                loading ||
                searchQuery.trim() ||
                currentPage <= 1
            ) {
                return;
            }

            const previousPage =
                currentPage - 1;

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
        }, [
            loading,
            searchQuery,
            currentPage,
            pageCursors,
            fetchUsersPage,
            selectedRoleFilter,
            selectedStatusFilter,
        ]);

    const refreshUsers =
        useCallback(async () => {
            searchRequestId.current += 1;

            setSearchQuery("");
            setSearchResults(null);
            setSearchLoading(false);

            setCurrentPage(1);
            setPageCursors([null]);
            setLastDoc(null);

            await fetchUsersPage({
                cursor: null,
                role: selectedRoleFilter,
                status: selectedStatusFilter,
            });

            await fetchStats();
        }, [
            fetchUsersPage,
            fetchStats,
            selectedRoleFilter,
            selectedStatusFilter,
        ]);

    const openRoleModal = useCallback(
        (user) => {
            setSelectedUserForRole(user);
            setNewTargetRole(
                user?.role || "customer"
            );
        },
        []
    );

    const closeRoleModal = useCallback(() => {
        if (isUpdatingRole) {
            return;
        }

        setSelectedUserForRole(null);
        setNewTargetRole("");
    }, [isUpdatingRole]);

    const confirmRoleUpdate =
        useCallback(async () => {
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
                setIsUpdatingRole(true);

                await updateUserRole(
                    userId,
                    newTargetRole
                );

                toast.success(
                    "تم تحديث صلاحيات المستخدم بنجاح"
                );

                setSelectedUserForRole(null);
                setNewTargetRole("");

                if (searchQuery.trim()) {
                    const results =
                        await searchUsers({
                            searchQuery:
                                searchQuery.trim(),
                            role:
                                selectedRoleFilter,
                            status:
                                selectedStatusFilter,
                        });

                    setSearchResults(
                        results
                    );
                } else {
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
                }

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
                setIsUpdatingRole(false);
            }
        }, [
            selectedUserForRole,
            newTargetRole,
            searchQuery,
            selectedRoleFilter,
            selectedStatusFilter,
            pageCursors,
            currentPage,
            fetchUsersPage,
            fetchStats,
        ]);

    return {
        users,
        filteredUsers,

        loading:
            loading || searchLoading,

        searchLoading,

        searchQuery,
        setSearchQuery,
        handleSearch,

        selectedRoleFilter,
        selectedStatusFilter,

        handleRoleFilterChange,
        handleStatusFilterChange,

        stats,
        currentPage,
        hasNextPage,

        handleNextPage,
        handlePreviousPage,
        refreshUsers,

        selectedUserForRole,
        newTargetRole,
        setNewTargetRole,

        openRoleModal,
        closeRoleModal,

        confirmRoleUpdate,
        isUpdatingRole,
    };
};