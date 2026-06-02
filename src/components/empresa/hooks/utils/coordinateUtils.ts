
import { EmpresaData, EmpresaResponse } from '../types/empresaSearchTypes';

const ITAPEMA_COORDINATES = {
  latitude: -27.0861,
  longitude: -48.6161
};

export const addCoordinatesToCompany = (company: EmpresaResponse): EmpresaData => {
  if (typeof company.latitude === 'number' && typeof company.longitude === 'number') {
    return {
      ...company,
      latitude: company.latitude,
      longitude: company.longitude
    } as EmpresaData;
  }
  
  return {
    ...company,
    latitude: ITAPEMA_COORDINATES.latitude + (Math.random() - 0.5) * 0.05,
    longitude: ITAPEMA_COORDINATES.longitude + (Math.random() - 0.5) * 0.05
  } as EmpresaData;
};
