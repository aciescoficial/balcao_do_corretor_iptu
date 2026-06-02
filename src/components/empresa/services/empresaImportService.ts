
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from '@/services/baseService';
import { NichoType } from '../types';

export interface ImportEmpresaData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  nicho: NichoType;
  desconto: string;
  produtos: string;
  logoUrl?: string;
  capaUrl?: string;
  videoUrl?: string;
}

class EmpresaImportService extends BaseService {
  async importEmpresas(data: ImportEmpresaData[]) {
    const empresas = data.map(item => ({
      razao_social: item.razaoSocial,
      nome_fantasia: item.nomeFantasia,
      cnpj: item.cnpj,
      responsavel: item.responsavel,
      telefone: item.telefone,
      email: item.email,
      endereco: item.endereco,
      cidade: item.cidade,
      cep: item.cep,
      site: item.site || null,
      instagram: item.instagram || null,
      whatsapp: item.whatsapp || null,
      nicho: item.nicho,
      desconto: item.desconto,
      produtos: item.produtos,
      logo_url: item.logoUrl || null,
      capa_url: item.capaUrl || null,
      video_url: item.videoUrl || null,
      status: 'pendente' as const
    }));
    
    const { error } = await supabase
      .from('empresas')
      .insert(empresas);
      
    if (error) {
      this.handleError(error, "Error importing empresas");
    }
    
    return empresas.length;
  }

  async exportEmpresas() {
    const { data, error } = await supabase
      .from('empresas')
      .select('*');
      
    if (error) throw error;
    
    return data;
  }
}

export const empresaImportService = new EmpresaImportService();
