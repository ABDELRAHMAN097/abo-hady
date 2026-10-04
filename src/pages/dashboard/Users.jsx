import UsersHeader from "@/components/users/UsersHeader";
import UserStats from "@/components/users/UserStats";
import UserFilters from "@/components/users/UserFilters";
import UsersTable from "@/components/users/UsersTable";
import UsersPagination from "@/components/users/UsersPagination";
import ChangeRoleModal from "@/components/users/ChangeRoleModal";

import { useUsers } from "@/hooks/useUsers";

const Users = () => {
    const {
        filteredUsers,

        loading,
        statsLoading,

        searchQuery,
        setSearchQuery,

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
    } = useUsers();

    return (
        <div
            dir="rtl"
            className="space-y-6"
        >
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
                onSearchChange={
                    setSearchQuery
                }
                selectedRoleFilter={
                    selectedRoleFilter
                }
                onRoleFilterChange={
                    handleRoleFilterChange
                }
                selectedStatusFilter={
                    selectedStatusFilter
                }
                onStatusFilterChange={
                    handleStatusFilterChange
                }
            />

            <UsersTable
                users={filteredUsers}
                loading={loading}
                onEditRole={
                    openRoleModal
                }
            />

            <UsersPagination
                currentPage={currentPage}
                hasNextPage={hasNextPage}
                loading={loading}
                onNext={handleNextPage}
                onPrevious={
                    handlePreviousPage
                }
            />

            <ChangeRoleModal
                user={
                    selectedUserForRole
                }
                selectedRole={
                    newTargetRole
                }
                onRoleChange={
                    setNewTargetRole
                }
                onClose={closeRoleModal}
                onConfirm={
                    confirmRoleUpdate
                }
                loading={
                    isUpdatingRole
                }
            />
        </div>
    );
};

export default Users;