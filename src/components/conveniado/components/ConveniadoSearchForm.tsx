
import React from 'react';
import { Search, RefreshCw, Filter, Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { ConveniadoStatus } from '../hooks/useConveniadoSearch';
import { Label } from '@/components/ui/label';

interface ConveniadoSearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchType?: 'nome' | 'cpf' | 'creci' | 'placa';
  setSearchType?: (type: 'nome' | 'cpf' | 'creci' | 'placa') => void;
  statusFilter: ConveniadoStatus | 'todos';
  setStatusFilter: (status: ConveniadoStatus | 'todos') => void;
  cidadeFilter: string;
  setCidadeFilter: (cidade: string) => void;
  cidades: string[];
  itemsPerPage: number;
  setItemsPerPage: (perPage: number) => void;
  handleSearch: (e: React.FormEvent) => void;
  fetchConveniados: () => void;
  loading: boolean;
}

const ConveniadoSearchForm: React.FC<ConveniadoSearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  searchType = 'nome',
  setSearchType,
  statusFilter,
  setStatusFilter,
  cidadeFilter,
  setCidadeFilter,
  cidades,
  itemsPerPage,
  setItemsPerPage,
  handleSearch,
  fetchConveniados,
  loading
}) => {
  // Check if search term looks like a license plate format
  const isLicensePlateSearch = /^[A-Za-z0-9]{3,8}$/.test(searchTerm);
  
  // Helper function to get the appropriate search icon
  const getSearchIcon = () => {
    if (searchType === 'placa' || (isLicensePlateSearch && searchType === 'nome')) {
      return <Car className="h-5 w-5 text-gray-400" />;
    }
    return <Search className="h-5 w-5 text-gray-400" />;
  };

  // Helper function to get placeholder text based on search type
  const getPlaceholderText = () => {
    switch(searchType) {
      case 'nome': return "Buscar por nome ou sobrenome...";
      case 'cpf': return "Buscar por CPF...";
      case 'creci': return "Buscar por número CRECI...";
      case 'placa': return "Buscar por placa do veículo...";
      default: return "Buscar conveniado...";
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <form onSubmit={handleSearch} className="flex flex-1 gap-2">
        <div className="relative flex-1">
          <Input
            placeholder={getPlaceholderText()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {getSearchIcon()}
          </div>
        </div>
        
        {setSearchType && (
          <Select
            value={searchType}
            onValueChange={(value) => setSearchType(value as 'nome' | 'cpf' | 'creci' | 'placa')}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Buscar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Nome</SelectItem>
              <SelectItem value="cpf">CPF</SelectItem>
              <SelectItem value="creci">CRECI</SelectItem>
              <SelectItem value="placa">Placa</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </form>
      
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
          onValueChange={(value) => setStatusFilter(value as ConveniadoStatus | 'todos')}
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
            <SelectItem value="50">50 por página</SelectItem>
            <SelectItem value="100">100 por página</SelectItem>
            <SelectItem value="200">200 por página</SelectItem>
            <SelectItem value="500">500 por página</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={fetchConveniados}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default ConveniadoSearchForm;
