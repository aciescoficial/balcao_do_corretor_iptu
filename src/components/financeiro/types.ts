
import type { Database } from '@/integrations/supabase/types';

export type PaymentMethod = Database['public']['Enums']['payment_method'];
export type InterestPaymentBy = Database['public']['Enums']['interest_payment_by'];

export type AssociationType = {
  id: string;
  title: string;
  description: string | null;
  value: number;
  payment_methods: PaymentMethod[];
  max_installments: number | null;
  interest_payment_by: InterestPaymentBy | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type MemberSubscription = {
  id: string;
  conveniado_id: string;
  association_type_id: string;
  payment_method: PaymentMethod;
  installments: number | null;
  asaas_subscription_id: string | null;
  asaas_customer_id: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentMethodOption = {
  value: PaymentMethod;
  label: string;
  description?: string;
};

export type InterestPaymentByOption = {
  value: InterestPaymentBy;
  label: string;
};

export type FinancialSummary = {
  clients: {
    total: number;
    defaulters: number;
  };
  bills: {
    expected: number;
    overdue: number;
    received: number;
  };
  revenue: {
    expected: number;
    confirmed: number;
    received: number;
  };
};

export type ChartData = {
  date: string;
  expected: number;
  received: number;
};

// Adicionar o tipo para o relatório financeiro
export type FinancialReport = {
  id: string;
  nome: string;
  valor: number;
  descricao: string;
  formaPagamento: string;
  dataVencimento: Date;
  status: 'pago' | 'pendente' | 'atrasado' | 'cancelado';
};
