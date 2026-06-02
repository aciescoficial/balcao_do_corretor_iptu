
import React from 'react';
import { OperationLogs } from '../audit/OperationLogs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList } from 'lucide-react';

export const AuditLogSettings: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Logs de Operações
        </CardTitle>
        <CardDescription>
          Registros de importação e exportação de dados do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <OperationLogs />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
