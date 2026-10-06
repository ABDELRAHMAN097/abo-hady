import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    getAllUsers,
    getUserStats,
    searchUsers,
    updateUserRole,
    updateUserAccount,
} from "@/services/auth";

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE = 350;
const MIN_SEARCH_LENGTH = 2;

const useUsers = () => {
    // Normal paginated users state
    const [users, setUsers] = useState([]);
    const [regularLoading, setRegularLoading] = useState(true);
    const [regularCurrentPage, setRegularCurrentPage] = useState(1);
    const [regularHasNextPage, setRegularHasNextPage] = useState(false);
    const cursorsRef = useRef({});
    const usersRequestRef = useRef(0);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isDebouncing, setIsDebouncing] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchPage, setSearchPage] = useState(1);
    const searchTimerRef = useRef(null);
    const searchRequestRef = useRef(0);

    // Filter states
    const [searchBy, setSearchBy] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Stats state
    const [stats, setStats] = useState({
        total: 0,
        customers: 0,
        drivers: 0,
        management: 0,
        admins: 0,
        superAdmins: 0,
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const isSearching = debouncedQuery.trim().length >= MIN_SEARCH_LENGTH;

    // Fetch paginated users for normal browsing
    const fetchUsersPage = useCallback(
        async (page = 1) => {
            const requestId = ++usersRequestRef.current;
            setRegularLoading(true);

            try {
                const cursor =
                    page === 1
                        ? null
                        : cursorsRef.current[page - 1] || null;

                const result = await getAllUsers({
                    pageSize: PAGE_SIZE,
                    role: roleFilter,
                    status: statusFilter,
                    cursor,
                });

                if (requestId !== usersRequestRef.current) {
                    return;
                }

                setUsers(result.users);
                setRegularHasNextPage(result.hasNextPage);
                setRegularCurrentPage(page);

                if (result.lastDoc) {
                    cursorsRef.current[page] = result.lastDoc;
                }
            } catch (error) {
                if (requestId !== usersRequestRef.current) {
                    return;
                }
                setUsers([]);
                setRegularHasNextPage(false);
            } finally {
                if (requestId === usersRequestRef.current) {
                    setRegularLoading(false);
                }
            }
        },
        [roleFilter, statusFilter]
    );

    // Fetch statistics
    const fetchStats = useCallback(async () => {
        setStatsLoading(true);
        try {
            const result = await getUserStats();
            setStats(result);
        } catch (error) {
            setStats({
                total: 0,
                customers: 0,
                drivers: 0,
                management: 0,
                admins: 0,
                superAdmins: 0,
            });
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // Regular users browsing effect
    useEffect(() => {
        if (isSearching) {
            return;
        }

        cursorsRef.current = {};
        setRegularCurrentPage(1);
        fetchUsersPage(1);
    }, [roleFilter, statusFilter, isSearching, fetchUsersPage]);

    // Initial stats fetch
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    // Debounce handler on searchQuery changes
    useEffect(() => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        const trimmed = searchQuery.trim();

        if (trimmed.length < MIN_SEARCH_LENGTH) {
            searchRequestRef.current += 1;
            setIsDebouncing(false);
            setDebouncedQuery("");
            setSearchResults([]);
            setSearchLoading(false);
            setSearchPage(1);
            return;
        }

        // Active typing: mark debouncing as active
        setIsDebouncing(true);

        searchTimerRef.current = setTimeout(() => {
            setIsDebouncing(false);
            setDebouncedQuery(trimmed);
        }, SEARCH_DEBOUNCE);

        return () => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
        };
    }, [searchQuery]);

    // Execute search when debounced query or any filter changes
    useEffect(() => {
        if (!isSearching) {
            return;
        }

        const requestId = ++searchRequestRef.current;
        setSearchLoading(true);
        setSearchPage(1);

        const runSearch = async () => {
            try {
                const results = await searchUsers({
                    searchQuery: debouncedQuery,
                    searchBy,
                    role: roleFilter,
                    status: statusFilter,
                    limitResults: 100,
                });

                if (requestId !== searchRequestRef.current) {
                    return;
                }

                setSearchResults(results);
            } catch (error) {
                if (requestId !== searchRequestRef.current) {
                    return;
                }
                setSearchResults([]);
            } finally {
                if (requestId === searchRequestRef.current) {
                    setSearchLoading(false);
                }
            }
        };

        runSearch();
    }, [debouncedQuery, searchBy, roleFilter, statusFilter, isSearching]);

    // Search input handler
    const handleSearch = useCallback((value) => {
        setSearchQuery(value);
        if (!value.trim()) {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
            searchRequestRef.current += 1;
            setIsDebouncing(false);
            setDebouncedQuery("");
            setSearchResults([]);
            setSearchLoading(false);
            setSearchPage(1);
        }
    }, []);

    // Filter changes without wiping search query
    const handleSearchByChange = useCallback((value) => {
        setSearchBy(value);
        setSearchPage(1);
    }, []);

    const handleRoleFilterChange = useCallback((value) => {
        setRoleFilter(value);
        setSearchPage(1);
        cursorsRef.current = {};
        setRegularCurrentPage(1);
    }, []);

    const handleStatusFilterChange = useCallback((value) => {
        setStatusFilter(value);
        setSearchPage(1);
        cursorsRef.current = {};
        setRegularCurrentPage(1);
    }, []);

    // Pagination calculations
    const searchTotalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE));

    const pagedSearchResults = searchResults.slice(
        (searchPage - 1) * PAGE_SIZE,
        searchPage * PAGE_SIZE
    );

    const currentPage = isSearching ? searchPage : regularCurrentPage;
    const hasNextPage = isSearching ? searchPage < searchTotalPages : regularHasNextPage;

    const handleNextPage = useCallback(() => {
        if (isSearching) {
            if (searchPage < searchTotalPages && !searchLoading) {
                setSearchPage((prev) => prev + 1);
            }
        } else {
            if (regularHasNextPage && !regularLoading) {
                fetchUsersPage(regularCurrentPage + 1);
            }
        }
    }, [
        isSearching,
        searchPage,
        searchTotalPages,
        searchLoading,
        regularHasNextPage,
        regularLoading,
        regularCurrentPage,
        fetchUsersPage,
    ]);

    const handlePreviousPage = useCallback(() => {
        if (isSearching) {
            if (searchPage > 1 && !searchLoading) {
                setSearchPage((prev) => prev - 1);
            }
        } else {
            if (regularCurrentPage > 1 && !regularLoading) {
                fetchUsersPage(regularCurrentPage - 1);
            }
        }
    }, [
        isSearching,
        searchPage,
        searchLoading,
        regularCurrentPage,
        regularLoading,
        fetchUsersPage,
    ]);

    // Refresh everything
    const refreshUsers = useCallback(async () => {
        usersRequestRef.current += 1;
        searchRequestRef.current += 1;

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        setIsDebouncing(false);
        setSearchQuery("");
        setDebouncedQuery("");
        setSearchResults([]);
        setSearchLoading(false);
        setSearchPage(1);

        cursorsRef.current = {};
        setRegularCurrentPage(1);

        await Promise.all([
            fetchUsersPage(1),
            fetchStats(),
        ]);
    }, [fetchUsersPage, fetchStats]);

    // User account update (role and/or status)
    const handleUserUpdate = useCallback(
        async (userId, updates) => {
            if (typeof updates === "string") {
                await updateUserRole(userId, updates);
            } else {
                await updateUserAccount(userId, updates);
            }

            if (isSearching) {
                searchRequestRef.current += 1;
                const requestId = searchRequestRef.current;
                setSearchLoading(true);

                try {
                    const results = await searchUsers({
                        searchQuery: debouncedQuery,
                        searchBy,
                        role: roleFilter,
                        status: statusFilter,
                        limitResults: 100,
                    });

                    if (requestId === searchRequestRef.current) {
                        setSearchResults(results);
                    }
                } finally {
                    if (requestId === searchRequestRef.current) {
                        setSearchLoading(false);
                    }
                }
            } else {
                await fetchUsersPage(regularCurrentPage);
            }

            await fetchStats();
        },
        [
            isSearching,
            debouncedQuery,
            searchBy,
            roleFilter,
            statusFilter,
            regularCurrentPage,
            fetchUsersPage,
            fetchStats,
        ]
    );

    return {
        users,
        filteredUsers: isSearching ? pagedSearchResults : users,
        totalSearchResults: searchResults.length,

        loading: isSearching ? searchLoading : regularLoading,
        searchLoading,
        isDebouncing,
        statsLoading,

        searchQuery,
        searchBy,

        handleSearch,
        handleSearchByChange,

        roleFilter,
        statusFilter,

        handleRoleFilterChange,
        handleStatusFilterChange,

        stats,

        currentPage,
        hasNextPage,

        handleNextPage,
        handlePreviousPage,

        refreshUsers,
        handleRoleUpdate: handleUserUpdate,
        handleUserUpdate,

        isSearching,
    };
};

export default useUsers;