
import { EmpresaFormData } from '../types/formTypes';

/**
 * Transforms database empresa record to the EmpresaData interface
 */
export const mapToEmpresaData = (record: any): any => {
  return {
    id: record.id,
    razao_social: record.razao_social,
    nome_fantasia: record.nome_fantasia,
    cnpj: record.cnpj,
    responsavel: record.responsavel,
    telefone: record.telefone,
    email: record.email,
    cidade: record.cidade,
    nicho: record.nicho,
    status: record.status,
    latitude: record.latitude,
    longitude: record.longitude,
    endereco: record.endereco,
    cep: record.cep,
    logo_url: record.logo_url,
    site: record.site,
    instagram: record.instagram,
    whatsapp: record.whatsapp
  };
};

/**
 * Transforms database empresa record to the EmpresaFormData interface
 */
export const mapToEmpresaFormData = (record: any): EmpresaFormData => {
  return {
    razaoSocial: record.razao_social,
    nomeFantasia: record.nome_fantasia,
    cnpj: record.cnpj,
    responsavel: record.responsavel,
    telefone: record.telefone,
    email: record.email,
    cidade: record.cidade,
    nicho: record.nicho as any,
    endereco: record.endereco,
    cep: record.cep,
    site: record.site || '',
    instagram: record.instagram || '',
    whatsapp: record.whatsapp || '',
    desconto: record.desconto || '',
    produtos: record.produtos || '',
    logoUrl: record.logo_url || '',
    capaUrl: record.capa_url || '',
    videoUrl: record.video_url || ''
  };
};
