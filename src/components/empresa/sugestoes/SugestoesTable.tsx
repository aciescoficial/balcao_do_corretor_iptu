
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { ExternalLink, Mail, MoreHorizontal, Phone, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SugestaoEmpresa } from './types';
import { formatDate, getStatusBadge } from './utils';

interface SugestoesTableProps {
  currentItems: SugestaoEmpresa[];
}

const SugestoesTable: React.FC<SugestoesTableProps> = ({ currentItems }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]">
            <input type="checkbox" className="rounded" />
          </TableHead>
          <TableHead className="font-semibold">NOME</TableHead>
          <TableHead className="font-semibold">
            <div className="flex items-center gap-1">
              <Mail size={16} />
              EMAIL
            </div>
          </TableHead>
          <TableHead className="font-semibold">
            <div className="flex items-center gap-1">
              <Phone size={16} />
              TELEFONE
            </div>
          </TableHead>
          <TableHead className="font-semibold">
            <div className="flex items-center gap-1">
              <User size={16} />
              CONTATO
            </div>
          </TableHead>
          <TableHead className="font-semibold">
            <div className="flex items-center gap-1">
              <Building size={16} />
              EMPRESA
            </div>
          </TableHead>
          <TableHead className="font-semibold">DATA DE CRIAÇÃO</TableHead>
          <TableHead className="w-[60px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentItems.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              Nenhuma sugestão de empresa encontrada.
            </TableCell>
          </TableRow>
        ) : (
          currentItems.map((sugestao) => (
            <TableRow key={sugestao.id} className="hover:bg-gray-50">
              <TableCell>
                <input type="checkbox" className="rounded" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 font-semibold">
                      {sugestao.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-blue-600">{sugestao.nome}</div>
                    <div>{getStatusBadge(sugestao.status)}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{sugestao.email}</TableCell>
              <TableCell>{sugestao.telefone}</TableCell>
              <TableCell>{sugestao.contato}</TableCell>
              <TableCell>{sugestao.empresa}</TableCell>
              <TableCell>{formatDate(sugestao.data_criacao)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Opções">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar email
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <span className="mr-2">🗑️</span>
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SugestoesTable;
