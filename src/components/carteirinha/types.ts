
export interface CarteirinhaSolicitacao {
  id: string;
  associado_id: string;
  nome: string;
  sobrenome: string;
  endereco_entrega: string;
  complemento?: string;
  valor: number;
  status: string;
  pagamento_id?: string;
  email?: string;
  created_at: string;
  updated_at: string;
  codigo_rastreio?: string;
  observacoes?: string;
  tipo_entrega?: 'entrega' | 'retirada_grafica' | 'retirada_aciesc';
}

export type CarteirinhaStatus = 
  | 'pendente_pagamento' 
  | 'aguardando_producao'
  | 'em_producao'
  | 'pronta_entrega'
  | 'concluida';

// Card personalization types
export interface CardSettings {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoPosition: 'top' | 'bottom';
  photoPosition: { x: number; y: number };
  textPosition: { x: number; y: number };
  backgroundImage: string | null;
  frontBackgroundImage?: string;
  backBackgroundImage?: string;
  defaultBackImage?: string;
  backgroundOpacity: number;
  showQrCode: boolean;
  showCPF: boolean;
  showCreci: boolean;
  showLogo: boolean;
  fontFamily: string;
  cardLayout: 'horizontal' | 'vertical';
  roundedCorners: boolean;
  textSize: 'small' | 'medium' | 'large';
}

// Conveniado data types
export interface ConveniadoData {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  telefone: string;
  status: string;
  foto_url?: string;
  foto?: string;
  creci?: string;
  validade?: string;
  tipo_associado?: string;
  data_associacao?: string;
}

export const ACIESC_COLORS = {
  primary: '#0056b3',
  secondary: '#4a90e2',
  accent: '#f5a623',
  light: '#ffffff',
  dark: '#333333',
  primaryGreen: '#00E676',
  darkGreen: '#009688',
  white: '#FFFFFF',
};
