
export interface EmpresaData {
  id?: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  cep: string;
  nicho: 'Alimentação' | 'Saúde' | 'Educação' | 'Serviços' | 'Comércio' | 'Lazer' | 'Tecnologia' | 'Outro';
  desconto: string;
  produtos: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
  status?: 'ativo' | 'pendente' | 'inativo';
  logo_url?: string;
  capa_url?: string;
  video_url?: string;
  latitude?: number;
  longitude?: number;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  data: Record<string, any>;
}

export interface FieldMapping {
  [key: string]: string;
}
