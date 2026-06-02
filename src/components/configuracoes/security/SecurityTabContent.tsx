
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TwoFactorSettings from './TwoFactorSettings';
import { AuditLogSettings } from '../AuditLogSettings';

const SecurityTabContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="security">Autenticação</TabsTrigger>
          <TabsTrigger value="logs">Logs de Operações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Configure as opções de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TwoFactorSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <AuditLogSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityTabContent;
