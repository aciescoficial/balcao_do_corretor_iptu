
import { 
  createCarteirinhaSolicitacao, 
  getCarteirinhaSolicitacoes, 
  updateCarteirinhaSolicitacao 
} from './carteirinhaSolicitacaoService';
import { 
  getCarteirinhaConfig, 
  updateCarteirinhaConfig, 
  type CarteirinhaConfig 
} from './carteirinhaConfigService';
import { verifyCarteirinhaPayment } from './carteirinhaPaymentService';

// Re-export all functions to maintain backward compatibility
export {
  // Solicitacao functions
  createCarteirinhaSolicitacao,
  getCarteirinhaSolicitacoes,
  updateCarteirinhaSolicitacao,
  
  // Config functions
  getCarteirinhaConfig,
  updateCarteirinhaConfig,
  type CarteirinhaConfig,
  
  // Payment functions
  verifyCarteirinhaPayment
};
