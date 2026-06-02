
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, Filter, Car } from 'lucide-react';
import { AssociadoStatus } from '@/components/associado/types';

interface AssociadoSearchFormProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchType: 'nome' | 'cpf' | 'creci' | 'placa';
  setSearchType: React.Dispatch<React.SetStateAction<'nome' | 'cpf' | 'creci' | 'placa'>>;
  statusFilter: AssociadoStatus | 'todos';
  setStatusFilter: React.Dispatch<React.SetStateAction<AssociadoStatus | 'todos'>>;
  cidadeFilter: string;
  setCidadeFilter: React.Dispatch<React.SetStateAction<string>>;
  cidades: string[];
  isSearching: boolean;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  fetchAssociados: () => Promise<void>;
}

const AssociadoSearchForm: React.FC<AssociadoSearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
  statusFilter,
  setStatusFilter,
  cidadeFilter,
  setCidadeFilter,
  cidades,
  isSearching,
  handleSearch,
  itemsPerPage,
  setItemsPerPage,
  fetchAssociados
}) => {
  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Buscar por {
              searchType === 'nome' ? 'nome' : 
              searchType === 'cpf' ? 'CPF' : 
              searchType === 'creci' ? 'CRECI' :
              'placa do veículo'
            }
          </label>
          <div className="relative">
            <Input 
              id="search"
              placeholder={`Digite o ${
                searchType === 'nome' ? 'nome' : 
                searchType === 'cpf' ? 'CPF' : 
                searchType === 'creci' ? 'CRECI' :
                'placa do veículo'
              } para buscar...`}
              className="pl-10 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {searchType === 'placa' ? (
                <Car className="h-5 w-5 text-gray-400" />
              ) : (
                <Search className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por</label>
          <Select 
            value={searchType}
            onValueChange={(value) => setSearchType(value as 'nome' | 'cpf' | 'creci' | 'placa')}
          >
            <SelectTrigger className="shadow-sm">
              <SelectValue placeholder="Nome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Nome</SelectItem>
              <SelectItem value="cpf">CPF</SelectItem>
              <SelectItem value="creci">CRECI</SelectItem>
              <SelectItem value="placa">Placa do Veículo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-auto">
          <Button 
            type="submit" 
            className="w-full shadow-sm"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Buscando...
              </>
            ) : 'Buscar'}
          </Button>
        </div>
      </form>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Cidade:</span>
            <Select
              value={cidadeFilter}
              onValueChange={setCidadeFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {cidades.map((cidade) => (
                  <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as AssociadoStatus | 'todos');
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(value === 'all' ? -1 : Number(value));
            }}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="20">20 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
              <SelectItem value="100">100 por página</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchAssociados()}
            disabled={isSearching}
          >
            <RefreshCw className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssociadoSearchForm;
