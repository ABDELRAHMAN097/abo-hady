import UsersHeader from "@/components/users/UsersHeader";
import UserStats from "@/components/users/UserStats";
import UserFilters from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import UsersPagination from "@/components/users/UsersPagination";

import useUsers from "@/hooks/useUsers";

const Users = () => {
    const {
        filteredUsers,
        loading,
        statsLoading,
        searchLoading,
        isDebouncing,

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

        handleRoleUpdate,
    } = useUsers();

    return (
        <div className="space-y-6 mb-4">
            <UsersHeader
                onRefresh={refreshUsers}
                loading={loading}
            />

            <UserStats
                stats={stats}
                loading={statsLoading}
            />

            <UserFilters
                searchQuery={searchQuery}
                searchBy={searchBy}
                roleFilter={roleFilter}
                statusFilter={statusFilter}
                onSearchChange={handleSearch}
                onSearchByChange={handleSearchByChange}
                onRoleFilterChange={handleRoleFilterChange}
                onStatusFilterChange={handleStatusFilterChange}
                isDebouncing={isDebouncing}
                searchLoading={searchLoading}
            />

            <UsersTable
                users={filteredUsers}
                loading={loading}
                onRoleUpdate={handleRoleUpdate}
            />

            <div className="min-h-[56px]">
                <UsersPagination
                    currentPage={currentPage}
                    hasNextPage={hasNextPage}
                    onNext={handleNextPage}
                    onPrevious={handlePreviousPage}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Users;