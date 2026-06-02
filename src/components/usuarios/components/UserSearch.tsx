
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UserSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loading: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({ searchTerm, setSearchTerm, loading }) => {
  return (
    <div className="flex items-center space-x-2">
      <Search className="h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Pesquisar por nome, email, CPF ou CNPJ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm transition-all duration-200 focus:max-w-md"
        disabled={loading}
      />
    </div>
  );
};

export default UserSearch;
