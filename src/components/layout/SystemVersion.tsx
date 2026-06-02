
import React from 'react';

interface SystemVersionProps {
  version?: string;
}

const SystemVersion: React.FC<SystemVersionProps> = ({ 
  version = "v1.3.11" 
}) => {
  return (
    <span className="text-gray-500 text-xs ml-2">
      {version}
    </span>
  );
};

export default SystemVersion;
