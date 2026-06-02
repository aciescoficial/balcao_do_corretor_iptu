
import React from 'react';
import { Plus, Download, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SugestoesSearchControlsProps {
  searchTerm: string;
  selectedDate: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedDate: (date: string) => void;
}

const SugestoesSearchControls: React.FC<SugestoesSearchControlsProps> = ({
  searchTerm,
  selectedDate,
  handleSearch,
  setSelectedDate
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
      <div className="flex space-x-3">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Criar Sugestão
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
      
      <div className="flex w-full lg:w-auto space-x-3">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome, email, empresa..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="relative w-full lg:w-64">
          <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="date"
            className="pl-8"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SugestoesSearchControls;
