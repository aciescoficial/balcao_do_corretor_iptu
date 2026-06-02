
import React from 'react';
import { Search, Building, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { nichoOptions } from '../import/validationUtils';
import EmpresaSugestaoDialog from '../EmpresaSugestaoDialog';

interface EmpresaSearchFormProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchType: 'nome' | 'cnpj' | 'nicho' | 'cidade' | 'cidade_nicho' | 'mapa';
  setSearchType: React.Dispatch<React.SetStateAction<'nome' | 'cnpj' | 'nicho' | 'cidade' | 'cidade_nicho' | 'mapa'>>;
  cidadeFilter: string;
  setCidadeFilter: React.Dispatch<React.SetStateAction<string>>;
  nichoFilter: string;
  setNichoFilter: React.Dispatch<React.SetStateAction<string>>;
  cidades: string[];
  isSearching: boolean;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  getCurrentLocation: () => void;
  apiKey?: string;
}

const EmpresaSearchForm: React.FC<EmpresaSearchFormProps> = ({
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
  cidadeFilter,
  setCidadeFilter,
  nichoFilter,
  setNichoFilter,
  cidades,
  isSearching,
  handleSearch,
  getCurrentLocation,
  apiKey
}) => {
  const [sugestaoDialogOpen, setSugestaoDialogOpen] = React.useState(false);

  return (
    <div className="wp-card">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Tipo de busca</label>
            <Select 
              value={searchType} 
              onValueChange={(value) => setSearchType(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de busca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mapa">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>Mapa (GeoDirectório)</span>
                  </div>
                </SelectItem>
                <SelectItem value="nome">
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span>Nome da Empresa</span>
                  </div>
                </SelectItem>
                <SelectItem value="cnpj">CNPJ</SelectItem>
                <SelectItem value="nicho">Nicho de Atuação</SelectItem>
                <SelectItem value="cidade">Cidade</SelectItem>
                <SelectItem value="cidade_nicho">Cidade + Nicho</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {searchType !== 'mapa' && searchType !== 'cidade_nicho' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Termo de busca</label>
              <div className="relative">
                <Input
                  type="text"
                  className="pl-10"
                  placeholder={`Buscar por ${
                    searchType === 'nome' ? 'nome' : 
                    searchType === 'cnpj' ? 'CNPJ' : 
                    searchType === 'nicho' ? 'nicho' :
                    'cidade'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          
          {searchType === 'cidade_nicho' && (
            <>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <Select
                  value={cidadeFilter}
                  onValueChange={setCidadeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {cidades.map((cidade) => (
                      <SelectItem key={cidade} value={cidade}>{cidade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-1">Nicho</label>
                <Select
                  value={nichoFilter}
                  onValueChange={setNichoFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    {nichoOptions.map((nicho) => (
                      <SelectItem key={nicho} value={nicho}>{nicho}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-end justify-end mt-4">
          {searchType === 'mapa' && (
            <div className="flex flex-col h-full mr-auto">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="flex items-center gap-2 h-10"
                disabled={!apiKey}
              >
                Usar minha localização
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              type="button"
              onClick={() => setSugestaoDialogOpen(true)}
            >
              Sugerir Empresa
            </Button>
            
            <Button 
              type="submit"
              className="flex items-center justify-center gap-2"
              disabled={isSearching || (searchType === 'mapa' && !apiKey)}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </div>
      </form>
      
      <EmpresaSugestaoDialog 
        open={sugestaoDialogOpen}
        onOpenChange={setSugestaoDialogOpen} 
      />
    </div>
  );
};

export default EmpresaSearchForm;
