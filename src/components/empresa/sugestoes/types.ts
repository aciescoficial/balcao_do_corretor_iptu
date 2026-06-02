
export interface SugestaoEmpresa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  contato: string;
  empresa: string;
  status: string;
  data_criacao: string;
}

export type SugestaoStatus = 'novo' | 'em_progresso' | 'ganho' | 'cancelado' | 'frio';
