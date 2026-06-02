
import { NichoType } from '../../types';
import { Database } from "@/integrations/supabase/types";

// Get the StatusType from the Database types
export type StatusType = Database['public']['Enums']['status_type'];

export interface EmpresaResponse {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  cidade: string;
  nicho: NichoType;
  status: StatusType; // Update to use the correct StatusType
  endereco: string;
  cep: string;
  logo_url?: string;
  capa_url?: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  desconto?: string;
  produtos?: string;
  video_url?: string;
  created_at?: string;
  updated_at?: string;
  latitude?: number;
  longitude?: number;
}

// Export the EmpresaData interface which is imported in coordinateUtils.ts
export type EmpresaData = EmpresaResponse;
