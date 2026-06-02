
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, ExternalLink, Navigation, Home, Info } from 'lucide-react';
import { EmpresaData } from '../../types';
import { getBadgeColors, formatPhoneNumber } from '../../utils/helpers';
import { Link } from 'react-router-dom';

interface CompanyCardProps {
  company: EmpresaData;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const [badgeColor, badgeBgColor] = getBadgeColors(company.nicho);
  
  const handleGetDirections = () => {
    // Check if we have coordinates
    if (!company.latitude || !company.longitude) {
      console.warn('Missing coordinates for company:', company.nome_fantasia);
      return;
    }
    
    // Create Google Maps direction URL
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${company.latitude},${company.longitude}&destination_place_id=${company.nome_fantasia}`;
    window.open(mapsUrl, '_blank');
  };
  
  return (
    <div className="w-64 p-1">
      <h3 className="font-medium text-lg">{company.nome_fantasia}</h3>
      <Badge 
        className="my-1" 
        style={{ 
          backgroundColor: badgeBgColor, 
          color: badgeColor
        }}
      >
        {company.nicho}
      </Badge>
      
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <Home className="h-4 w-4 mt-1 text-gray-500" />
          <span>{company.endereco}, {company.cidade}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <a href={`tel:${company.telefone}`} className="hover:underline">
            {formatPhoneNumber(company.telefone)}
          </a>
        </div>
        
        {company.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <a href={`mailto:${company.email}`} className="hover:underline">
              {company.email}
            </a>
          </div>
        )}
        
        <div className="pt-2 flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full flex items-center gap-1"
            onClick={handleGetDirections}
          >
            <Navigation className="h-4 w-4" />
            <span>Como chegar</span>
          </Button>
        </div>
        
        <div className="pt-1 flex gap-2">
          {company.id && (
            <Button
              size="sm"
              variant="outline"
              asChild
              className="w-full flex items-center gap-1"
            >
              <Link to={`/empresas/detalhes/${company.id}`}>
                <Info className="h-4 w-4" />
                <span>Ver mais</span>
              </Link>
            </Button>
          )}
          
          {company.site && (
            <a 
              href={company.site.startsWith('http') ? company.site : `https://${company.site}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Site</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
