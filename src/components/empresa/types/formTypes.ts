
import { Database } from '@/integrations/supabase/types';

export type NichoType = Database['public']['Enums']['nicho_type'];
export type StatusType = Database['public']['Enums']['status_type'];

export interface EmpresaFormData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  site: string;
  instagram: string;
  whatsapp: string;
  nicho: NichoType;
  desconto: string;
  produtos: string;
  logoUrl: string;
  capaUrl: string;
  videoUrl: string;
  latitude?: number;
  longitude?: number;
}
