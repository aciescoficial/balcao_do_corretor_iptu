
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmpresaData } from '../../types';
import { useToast } from '@/hooks/use-toast';

interface CompanyListItemProps {
  company: EmpresaData;
  onLocate?: (empresa: EmpresaData) => void;
}

export const CompanyListItem = ({ company, onLocate }: CompanyListItemProps) => {
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleLocate = () => {
    if (!onLocate) return;
    
    if (!company.latitude || !company.longitude) {
      toast({
        title: "Coordenadas indisponíveis",
        description: "Esta empresa não possui coordenadas de localização",
        variant: "destructive"
      });
      return;
    }
    
    onLocate(company);
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={company.logo_url || ''} alt={company.nome_fantasia} />
        <AvatarFallback className="bg-primary/10">
          {getInitials(company.nome_fantasia)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{company.nome_fantasia}</p>
        <p className="text-sm text-muted-foreground truncate">
          {company.cidade} • {company.nicho}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {onLocate && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleLocate}
            className="flex items-center gap-1"
          >
            <MapPin size={14} />
            <span>Localizar</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          asChild
          className="flex items-center gap-1"
        >
          <Link to={`/empresas/detalhes/${company.id}`}>
            <Info size={14} />
            <span>Ver mais</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
