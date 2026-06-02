
import React from 'react';
import { Wallet, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SystemStatusProps {
  systemStatus: {
    asaas: { active: boolean; message: string };
    stripe: { active: boolean; message: string };
    emails: { active: boolean; message: string };
  };
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ systemStatus }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Estado do Sistema</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 border-b">
          <span className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Pagamentos
          </span>
          <Badge className={systemStatus.asaas.active || systemStatus.stripe.active ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
            {systemStatus.asaas.active || systemStatus.stripe.active ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>
        <div className="flex justify-between items-center p-2 border-b">
          <span>API Asaas</span>
          <Badge className={systemStatus.asaas.active ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
            {systemStatus.asaas.message}
          </Badge>
        </div>
        <div className="flex justify-between items-center p-2 border-b">
          <span>API Stripe</span>
          <Badge className={systemStatus.stripe.active ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
            {systemStatus.stripe.message}
          </Badge>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Emails
          </span>
          <Badge className={systemStatus.emails.active ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
            {systemStatus.emails.message}
          </Badge>
        </div>
      </div>
    </div>
  );
};
