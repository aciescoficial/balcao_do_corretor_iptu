
import React, { useState } from 'react';
import { Search, Building, MapPin, PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { nichoOptions } from './import/validationUtils';
import EmpresaSugestaoDialog from './EmpresaSugestaoDialog';

interface EmpresaSearchFieldsProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchType: 'nome' | 'cnpj' | 'nicho' | 'cidade' | 'cidade_nicho' | 'mapa';
  setSearchType: React.Dispatch<React.SetStateAction<'nome' | 'cnpj' | 'nicho' | 'cidade' | 'cidade_nicho' | 'mapa'>>;
  cidadeFilter: string;
  setCidadeFilter: React.Dispatch<React.SetStateAction<string>>;
  nichoFilter: string;
  setNichoFilter: React.Dispatch<React.SetStateAction<string>>;
  cidades: string[];
}

const EmpresaSearchFields: React.FC<EmpresaSearchFieldsProps> = ({
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
  cidadeFilter,
  setCidadeFilter,
  nichoFilter,
  setNichoFilter,
  cidades,
}) => {
  const [sugestaoDialogOpen, setSugestaoDialogOpen] = useState(false);

  return (
    <>
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
      
      <div className="flex justify-between items-center mt-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => setSugestaoDialogOpen(true)}
        >
          <PlusCircle size={16} />
          Sugerir Empresa
        </Button>
      </div>
      
      <EmpresaSugestaoDialog 
        open={sugestaoDialogOpen}
        onOpenChange={setSugestaoDialogOpen} 
      />
    </>
  );
};

export default EmpresaSearchFields;
