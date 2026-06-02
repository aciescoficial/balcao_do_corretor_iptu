
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SolicitacoesSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export const SolicitacoesSearch: React.FC<SolicitacoesSearchProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  handleSearch,
}) => {
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pendente_pagamento', label: 'Pendente Pagamento' },
    { value: 'pagamento_aprovado', label: 'Pagamento Aprovado' },
    { value: 'em_producao', label: 'Em Produção' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-xl font-semibold">Solicitações de Carteirinha</h2>
      
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="w-full md:w-1/3">
          <Label htmlFor="statusFilter" className="sr-only">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative flex-1">
          <Input
            id="search"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button type="submit" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </form>
    </div>
  );
};
