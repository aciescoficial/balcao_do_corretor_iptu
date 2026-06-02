
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OperationLog } from '../services/operationLogTypes';
import { LogEventBadge } from './LogEventBadge';
import { LogFormatBadge } from './LogFormatBadge';
import { LogUserInfo } from './LogUserInfo';
import { getEntityLabel } from '../utils/logUtils';

interface OperationLogsTableProps {
  logs: OperationLog[];
}

export const OperationLogsTable: React.FC<OperationLogsTableProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="p-4 text-center border rounded-md">
        <p className="text-gray-500">Nenhum registro de operação encontrado.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Operação</TableHead>
          <TableHead>Entidade</TableHead>
          <TableHead>Formato</TableHead>
          <TableHead>Registros</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Detalhes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
            </TableCell>
            <TableCell>
              <LogEventBadge eventType={log.eventType} />
            </TableCell>
            <TableCell>{getEntityLabel(log.entityType)}</TableCell>
            <TableCell>
              <LogFormatBadge format={log.format} />
            </TableCell>
            <TableCell>{log.recordCount || '-'}</TableCell>
            <TableCell>
              <LogUserInfo userName={log.userName} userId={log.userId} />
            </TableCell>
            <TableCell>{log.details || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
