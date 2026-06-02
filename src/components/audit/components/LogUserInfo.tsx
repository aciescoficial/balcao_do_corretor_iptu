
import React from 'react';

interface LogUserInfoProps {
  userName: string | null;
  userId: string | null;
}

export const LogUserInfo: React.FC<LogUserInfoProps> = ({ userName, userId }) => {
  return (
    <div className="flex flex-col">
      <span className="font-medium text-sm">{userName || 'Unknown'}</span>
      {userId && <span className="text-xs text-gray-500">{userId.substring(0, 8)}...</span>}
    </div>
  );
};
