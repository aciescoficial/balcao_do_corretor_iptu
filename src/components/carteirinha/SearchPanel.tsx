
import React from 'react';
import { Search } from 'lucide-react';

interface SearchPanelProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  isSearching: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  isSearching
}) => {
  return (
    <div className="wp-card">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Buscar conveniado</label>
            <div className="relative">
              <input
                type="text"
                className="wp-input w-full pl-10"
                placeholder="Digite o nome ou CPF do conveniado"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-end">
            <button 
              type="submit" 
              className="wp-button w-full"
              disabled={isSearching}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
