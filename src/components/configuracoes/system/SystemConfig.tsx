
import React from 'react';
import { Settings } from 'lucide-react';
import { SystemConfigForm } from './SystemConfigForm';

const SystemConfig: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Settings size={20} /> Configurações Gerais
      </h2>
      <div className="mt-6">
        <SystemConfigForm />
      </div>
    </div>
  );
};

export default SystemConfig;
