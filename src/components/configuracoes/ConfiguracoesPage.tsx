
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Map, Users, ClipboardList, Mail, CreditCard, DollarSign, Shield } from 'lucide-react';
import GoogleMapsConfig from './GoogleMapsConfig';
import { AuditLogSettings } from './AuditLogSettings';
import EmailTemplatesConfig from './email-templates/EmailTemplatesConfig';
import CarteirinhaConfig from './CarteirinhaConfig';
import IntegracaoFinanceira from '../IntegracaoFinanceira';
import SecurityTabContent from './security/SecurityTabContent';
import SystemConfig from './system/SystemConfig';

const ConfiguracoesPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('geral');
  
  useEffect(() => {
    // Check URL for tab parameter
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    
    if (tabParam && ['geral', 'maps', 'carteirinha', 'seguranca', 'logs', 'emails', 'integracoes'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
  return (
    <div className="space-y-6">
      <h1 className="wp-header flex items-center gap-2">
        <Settings className="h-6 w-6" />
        Configurações do Sistema
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="wp-card">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <Settings size={16} />
            Geral
          </TabsTrigger>
          <TabsTrigger value="maps" className="flex items-center gap-2">
            <Map size={16} />
            Google Maps
          </TabsTrigger>
          <TabsTrigger value="carteirinha" className="flex items-center gap-2">
            <CreditCard size={16} />
            Carteirinha
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield size={16} />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <ClipboardList size={16} />
            Logs
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail size={16} />
            Emails
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="flex items-center gap-2">
            <DollarSign size={16} />
            Integrações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <SystemConfig />
        </TabsContent>
        
        <TabsContent value="maps">
          <GoogleMapsConfig />
        </TabsContent>
        
        <TabsContent value="carteirinha">
          <CarteirinhaConfig />
        </TabsContent>
        
        <TabsContent value="seguranca">
          <SecurityTabContent />
        </TabsContent>

        <TabsContent value="logs">
          <AuditLogSettings />
        </TabsContent>

        <TabsContent value="emails">
          <EmailTemplatesConfig />
        </TabsContent>
        
        <TabsContent value="integracoes">
          <IntegracaoFinanceira />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfiguracoesPage;
