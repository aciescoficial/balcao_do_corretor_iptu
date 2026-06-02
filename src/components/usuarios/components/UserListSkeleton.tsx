
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const UserListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full md:col-span-2" />
          <Skeleton className="h-8 w-full hidden md:block" />
          <Skeleton className="h-8 w-full hidden lg:block" />
          <Skeleton className="h-8 w-16 hidden lg:block" />
        </div>
      ))}
    </div>
  );
};

export default UserListSkeleton;
