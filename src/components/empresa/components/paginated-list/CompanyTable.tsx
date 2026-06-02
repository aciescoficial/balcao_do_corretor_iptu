
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmpresaData } from '../../types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CompanyTableProps {
  companies: EmpresaData[];
  onDelete: (id: string) => Promise<void>;
  onSelect?: (company: EmpresaData) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({ 
  companies, 
  onDelete,
  onSelect
}) => {
  if (companies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma empresa encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome Fantasia</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Nicho</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.nome_fantasia}</TableCell>
              <TableCell>{company.cnpj}</TableCell>
              <TableCell>{company.nicho}</TableCell>
              <TableCell>
                <StatusBadge status={company.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onSelect ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onSelect(company)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <Link to={`/empresas/detalhes/${company.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <Link to={`/empresas/editar/${company.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(company.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
