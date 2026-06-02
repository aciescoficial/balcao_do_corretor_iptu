
/**
 * Main associado service file - exports all associado-related functions
 */

export { 
  saveAssociado, 
} from './services/associadoCrudService';

export {
  uploadFoto
} from './services/associadoStorageService';

export {
  importAssociados,
  exportAssociados
} from './services/associadoImportExportService';

export {
  getAssociadoById
} from './services/baseAssociadoService';
