
import React from 'react';
import { Search, Map, MapPin, Building } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchType: 'nome' | 'cnpj' | 'nicho' | 'mapa';
  setSearchType: (value: 'nome' | 'cnpj' | 'nicho' | 'mapa') => void;
  isSearching: boolean;
  handleSearch: (e: React.FormEvent) => void;
  getCurrentLocation: () => void;
  apiKey?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  searchType, 
  setSearchType, 
  isSearching, 
  handleSearch,
  getCurrentLocation,
  apiKey
}) => {
  return (
    <form onSubmit={handleSearch}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tipo de busca</label>
          <Select 
            value={searchType} 
            onValueChange={(value) => setSearchType(value as 'nome' | 'cnpj' | 'nicho' | 'mapa')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de busca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mapa">
                <div className="flex items-center gap-2">
                  <Map size={16} />
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
            </SelectContent>
          </Select>
        </div>
        
        {searchType !== 'mapa' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Termo de busca</label>
            <div className="relative">
              <input
                type="text"
                className="wp-input w-full pl-10"
                placeholder={`Buscar por ${searchType === 'nome' ? 'nome' : searchType === 'cnpj' ? 'CNPJ' : 'nicho'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}
        
        <div className={searchType === 'mapa' ? "md:col-span-2" : "md:col-span-1"}>
          {searchType === 'mapa' && (
            <div className="flex flex-col h-full">
              <label className="block text-sm font-medium mb-1">Localização</label>
              <button 
                type="button" 
                onClick={getCurrentLocation}
                className="wp-button-secondary flex items-center gap-2 h-10"
              >
                <MapPin size={16} />
                Usar minha localização
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-end">
          <button 
            type="submit" 
            className="wp-button w-full flex items-center justify-center gap-2"
            disabled={isSearching}
          >
            {searchType === 'mapa' ? (
              <>
                <MapPin size={16} />
                {isSearching ? 'Buscando...' : 'Buscar empresas próximas'}
              </>
            ) : (
              <>{isSearching ? 'Buscando...' : 'Buscar'}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
