
export interface Empresa {
  id: string;
  nome_fantasia: string;
  razao_social: string;
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
  desconto: string;
  produtos: string;
  logo_url?: string;
  capa_url?: string;
  video_url?: string;
  nicho: string;
  status: 'ativo' | 'inativo' | 'pendente';
  created_at: string;
  updated_at: string;
}
