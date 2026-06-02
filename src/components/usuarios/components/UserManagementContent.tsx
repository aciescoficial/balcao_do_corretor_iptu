
import React from 'react';
import { User } from '../types';
import UserSearch from './UserSearch';
import ConnectionAlert from './ConnectionAlert';
import UserListSkeleton from './UserListSkeleton';
import EmptyUserState from './EmptyUserState';
import UserList from './UserList';
import { UserRole } from '../types';

interface UserManagementContentProps {
  loading: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredUsers: User[];
  connectionStatus: boolean | null;
  handleRefresh: () => void;
  handleEdit: (user: User) => void;
  handleToggleActive: (userId: string, active: boolean) => void;
  getRoleBadgeColor: (role: UserRole) => string;
  getRoleLabel: (role: UserRole) => string;
  isMobile: boolean;
}

const UserManagementContent: React.FC<UserManagementContentProps> = ({
  loading,
  error,
  searchTerm,
  setSearchTerm,
  filteredUsers,
  connectionStatus,
  handleRefresh,
  handleEdit,
  handleToggleActive,
  getRoleBadgeColor,
  getRoleLabel,
  isMobile,
}) => {
  return (
    <div className="wp-card space-y-4">
      <ConnectionAlert 
        connectionStatus={connectionStatus} 
        error={error} 
        handleRefresh={handleRefresh} 
      />

      <UserSearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        loading={loading}
      />

      {loading && filteredUsers.length === 0 ? (
        <UserListSkeleton />
      ) : (
        <>
          {!loading && filteredUsers.length === 0 ? (
            <EmptyUserState searchTerm={searchTerm} />
          ) : (
            <UserList 
              loading={loading}
              filteredUsers={filteredUsers}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              getRoleBadgeColor={getRoleBadgeColor}
              getRoleLabel={getRoleLabel}
              isMobile={isMobile}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserManagementContent;
