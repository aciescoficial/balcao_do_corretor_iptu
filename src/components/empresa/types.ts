
import { Database } from '@/integrations/supabase/types';

export type NichoType = Database['public']['Enums']['nicho_type'];
export type StatusType = Database['public']['Enums']['status_type'];

export interface EmpresaData {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: NichoType;
  status: StatusType;
  latitude?: number;
  longitude?: number;
  endereco: string;
  cep: string;
  logo_url?: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  desconto?: string;
  produtos?: string;
}
