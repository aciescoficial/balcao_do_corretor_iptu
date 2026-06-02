
import React from 'react';
import { Database } from 'lucide-react';

interface EmptyUserStateProps {
  searchTerm: string;
}

const EmptyUserState: React.FC<EmptyUserStateProps> = ({ searchTerm }) => {
  return (
    <div className="text-center py-10">
      <Database className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
      <h3 className="font-medium text-lg">Nenhum usuário encontrado</h3>
      <p className="text-muted-foreground">
        {searchTerm ? 
          "Nenhum usuário corresponde à sua pesquisa." : 
          "Não foram encontrados usuários no sistema."}
      </p>
    </div>
  );
};

export default EmptyUserState;
