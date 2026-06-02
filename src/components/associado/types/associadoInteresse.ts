
export interface AssociadoInteresse {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  celular: string;
  cidade: string;
  estado: string;
  cpf: string;
  creci: string; // Changed from string | null to string
  motivo_interesse: string | null;
  status: string;
  created_at: string;
  pagamento_confirmado: boolean | null;
  pagamento_data: string | null;
  payment_proof_url: string | null;
}
