
import { Database } from '@/integrations/supabase/types';

export type NichoType = Database['public']['Enums']['nicho_type'];
export type StatusType = Database['public']['Enums']['status_type'];

export interface EmpresaData {
  id: string;
  nome_fantasia: string;
  cnpj: string;
  created_at: string;
  email: string;
  telefone: string;
  nicho: NichoType;
  status: StatusType;
}
