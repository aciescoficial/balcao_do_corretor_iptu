
import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { EmpresaData } from '../../types';
import { selectedIcon, defaultIcon } from '../icons/mapIcons';
import CompanyCard from './CompanyCard';

interface CompanyMarkersProps {
  companies: EmpresaData[];
  selectedCompany: EmpresaData | null;
  setSelectedCompany: (company: EmpresaData | null) => void;
  mapInitialized: boolean;
}

export const CompanyMarkers: React.FC<CompanyMarkersProps> = ({
  companies,
  selectedCompany,
  setSelectedCompany,
  mapInitialized
}) => {
  const markers = useMemo(() => {
    if (!mapInitialized) return null;
    
    return companies.map((company, index) => {
      // Use actual coordinates if available, otherwise generate random positions for demo
      const lat = company.latitude ?? -15.7801 + (Math.random() - 0.5) * 10;
      const lng = company.longitude ?? -47.9292 + (Math.random() - 0.5) * 10;
      const position: [number, number] = [lat, lng];
      
      const isSelected = selectedCompany?.id === company.id;
      
      return (
        <Marker 
          key={company.id || index}
          position={position}
          // Using the Leaflet icons but applying them differently for react-leaflet
          // @ts-ignore - We need to force the icon prop usage for Leaflet
          icon={isSelected ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => {
              setSelectedCompany(company);
            }
          }}
        >
          <Popup>
            <CompanyCard company={company} />
          </Popup>
        </Marker>
      );
    });
  }, [companies, selectedCompany, setSelectedCompany, mapInitialized]);

  return <>{markers}</>;
};

export default CompanyMarkers;
