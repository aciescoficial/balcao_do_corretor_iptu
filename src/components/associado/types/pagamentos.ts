
export interface Pagamento {
  id: string;
  valor: number;
  data_pagamento: string;
  status: 'pago' | 'pendente' | 'atrasado' | 'cancelado';
  metodo: string;
  origem: 'manual' | 'asaas' | 'stripe';
  comprovante_url?: string;
  descricao?: string;
  ano_referencia: number;
  associado_id: string;
}

export interface SituacaoPagamento {
  emDia: boolean;
  ultimoPagamento?: Pagamento;
  proximoVencimento?: string;
  diasRestantes?: number;
}
