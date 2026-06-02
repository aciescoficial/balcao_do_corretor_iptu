
import { empresaCrudService } from './empresaCrudService';
import { empresaImportService } from './empresaImportService';
import { empresaStatusService } from './empresaStatusService';
import { StatusType } from '../types';

// Create a unified service that combines all empresa services
export const empresaService = {
  // CRUD operations
  getAllEmpresas: empresaCrudService.getLatestCompanies,
  getEmpresaById: empresaCrudService.getEmpresaById,
  saveEmpresa: empresaCrudService.saveEmpresa,
  updateEmpresa: empresaCrudService.updateEmpresa,
  deleteEmpresa: async (id: string) => {
    try {
      await empresaStatusService.updateEmpresaStatus(id, 'inativo');
      return true;
    } catch (error) {
      console.error("Error deleting empresa:", error);
      throw error;
    }
  },
  getLatestCompanies: empresaCrudService.getLatestCompanies,
  getCompaniesPaginated: empresaCrudService.getCompaniesPaginated,
  
  // Import/Export operations
  ...empresaImportService,
  
  // Status operations
  fetchPendingEmpresas: empresaStatusService.fetchPendingEmpresas,
  updateEmpresaStatus: empresaStatusService.updateEmpresaStatus
};

// Re-export the individual services for components that need direct access
export { empresaCrudService, empresaImportService, empresaStatusService };

// Re-export types
export type { ImportEmpresaData } from './empresaImportService';
