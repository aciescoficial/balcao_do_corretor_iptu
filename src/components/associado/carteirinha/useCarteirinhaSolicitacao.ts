
import { useState, useEffect } from 'react';
import { useCarteirinhaData } from './hooks/useCarteirinhaData';
import { useCarteirinhaSubmit } from './hooks/useCarteirinhaSubmit';

interface UseCarteirinhaSolicitacaoProps {
  navigateToPayment: (url: string) => void;
  entregaMethod: 'retirada' | 'entrega';
  retiradaLocation: 'grafica' | 'aciesc';
}

export const useCarteirinhaSolicitacao = ({
  navigateToPayment,
  entregaMethod,
  retiradaLocation
}: UseCarteirinhaSolicitacaoProps) => {
  const [error, setError] = useState<string | null>(null);
  
  // Use separate hooks for data fetching and submission
  const {
    userData,
    taxaEntrega,
    isLoading,
    paymentGateway,
    setIsLoading
  } = useCarteirinhaData();
  
  // Use the submission hook
  const { handleSubmit } = useCarteirinhaSubmit({
    userData,
    taxaEntrega,
    entregaMethod,
    retiradaLocation,
    paymentGateway,
    navigateToPayment,
    setIsLoading
  });

  // Provide default form values based on user data
  const getDefaultValues = () => {
    if (!userData) {
      return {
        nome: '',
        sobrenome: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        confirmarEndereco: false
      };
    }

    return {
      nome: userData.nome || '',
      sobrenome: userData.sobrenome || '',
      endereco: userData.rua || '',
      numero: userData.numero || '',
      complemento: userData.complemento || '',
      bairro: userData.bairro || '',
      cidade: userData.cidade || '',
      estado: userData.estado || '',
      cep: userData.cep || '',
      confirmarEndereco: false
    };
  };

  return {
    userData,
    taxaEntrega,
    isLoading,
    error,
    handleSubmit,
    getDefaultValues
  };
};
