import { supabase } from '@/integrations/supabase/client';
import { BaseService } from '@/services/baseService';
import { EmpresaFormData } from '../types/formTypes';
import { EmpresaData } from '../types';
import { mapToEmpresaData } from '../utils/dataTransformers';

class EmpresaCrudService extends BaseService {
  async getLatestCompanies(limit: number = 3): Promise<EmpresaData[]> {
    console.log("Fetching latest companies");
    
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data ? data.map(mapToEmpresaData) : [];
    } catch (error) {
      this.handleError(error, "Error fetching latest companies");
      return [];
    }
  }

  async getCompaniesPaginated(
    page: number = 1,
    pageSize: number = 10,
    filters: { searchTerm?: string } = {}
  ) {
    try {
      let query = supabase
        .from('empresas')
        .select('*', { count: 'exact' });
      
      if (filters.searchTerm) {
        query = query.or(
          `nome_fantasia.ilike.%${filters.searchTerm}%,` +
          `razao_social.ilike.%${filters.searchTerm}%,` +
          `cnpj.ilike.%${filters.searchTerm}%`
        );
      }
      
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        data: data || [],
        count: count || 0
      };
    } catch (error) {
      console.error("Error fetching paginated companies:", error);
      throw error;
    }
  }

  async getEmpresaById(id: string) {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      this.handleError(error, "Error fetching company details");
      throw error;
    }
  }

  async saveEmpresa(data: EmpresaFormData) {
    const empresaData = {
      razao_social: data.razaoSocial,
      nome_fantasia: data.nomeFantasia,
      cnpj: data.cnpj,
      responsavel: data.responsavel,
      telefone: data.telefone,
      email: data.email,
      endereco: data.endereco,
      cidade: data.cidade,
      cep: data.cep,
      site: data.site || null,
      instagram: data.instagram || null,
      whatsapp: data.whatsapp || null,
      nicho: data.nicho,
      desconto: data.desconto,
      produtos: data.produtos,
      logo_url: data.logoUrl || null,
      capa_url: data.capaUrl || null,
      video_url: data.videoUrl || null,
      status: 'pendente' as const
    };
    
    const { data: empresaResult, error } = await supabase
      .from('empresas')
      .insert(empresaData)
      .select('id')
      .single();
      
    if (error) {
      this.handleError(error, "Error saving empresa");
    }
    
    return empresaResult;
  }

  async updateEmpresa(id: string, data: Partial<EmpresaFormData>) {
    const updateData: any = {};
    
    if (data.razaoSocial !== undefined) updateData.razao_social = data.razaoSocial;
    if (data.nomeFantasia !== undefined) updateData.nome_fantasia = data.nomeFantasia;
    if (data.cnpj !== undefined) updateData.cnpj = data.cnpj;
    if (data.responsavel !== undefined) updateData.responsavel = data.responsavel;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.endereco !== undefined) updateData.endereco = data.endereco;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;
    if (data.cep !== undefined) updateData.cep = data.cep;
    if (data.site !== undefined) updateData.site = data.site || null;
    if (data.instagram !== undefined) updateData.instagram = data.instagram || null;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp || null;
    if (data.nicho !== undefined) updateData.nicho = data.nicho;
    if (data.desconto !== undefined) updateData.desconto = data.desconto;
    if (data.produtos !== undefined) updateData.produtos = data.produtos;
    if (data.logoUrl !== undefined) updateData.logo_url = data.logoUrl || null;
    if (data.capaUrl !== undefined) updateData.capa_url = data.capaUrl || null;
    if (data.videoUrl !== undefined) updateData.video_url = data.videoUrl || null;
    
    const { data: result, error } = await supabase
      .from('empresas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return result;
  }
}

export const empresaCrudService = new EmpresaCrudService();
