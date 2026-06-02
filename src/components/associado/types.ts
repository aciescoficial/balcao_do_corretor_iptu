
import { Database } from '@/integrations/supabase/types';

export type StatusType = Database['public']['Enums']['status_type'];

export type AssociadoStatus = 'pendente' | 'ativo' | 'inativo';

export interface AssociadoFormData {
  nome: string;
  sobrenome: string;
  cpf: string;
  creci?: string;
  dataNascimento?: string;
  email: string;
  celular: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado?: string;
  cep?: string;
  placaPrincipal?: string;
  placaSecundaria?: string;
  tipoVeiculoPrincipal?: 'Moto' | 'Carro';
  tipoVeiculoSecundario?: 'Moto' | 'Carro';
  modeloVeiculoPrincipal?: string;
  modeloVeiculoSecundario?: string;
  corVeiculoPrincipal?: string;
  corVeiculoSecundario?: string;
  valorPago?: string;
  dataUltimoPagamento?: string;
  valorDevido?: string;
  tipoPagamento?: string;
  validade?: string;
  foto?: FileList;
  comprovantePagamento?: FileList;
  criarUsuario?: boolean;
}

export interface ImportAssociadoData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  creci?: string;
  dataNascimento?: string;
  email: string;
  celular: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado?: string;
  cep?: string;
  status: 'pendente';
  placaPrincipal?: string;
  placaSecundaria?: string;
  valorPago?: string;
  dataUltimoPagamento?: string;
  valorDevido?: string;
  tipoPagamento?: string;
  tipoAssociado?: string;
  validade?: string;
}

export interface ImportValidationData {
  fieldName: string;
  targetField: string;
  isValid: boolean;
}

export const estados = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
];

export const tiposPagamento = [
  'Boleto',
  'Cartão de Crédito',
  'Pix',
  'Dinheiro',
  'Transferência'
];

export const tiposVeiculos = [
  'Moto',
  'Carro'
];

export interface Associado {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  cidade: string;
  creci?: string;
  status: AssociadoStatus;
  avatar_url?: string;
}
