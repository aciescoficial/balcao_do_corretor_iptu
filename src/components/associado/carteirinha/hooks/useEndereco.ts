
export const useEndereco = (userData: any) => {
  const getDefaultValues = () => {
    return {
      nome: userData?.nome || '',
      sobrenome: userData?.sobrenome || '',
      cep: userData?.cep || '',
      endereco: userData?.rua || '',
      numero: userData?.numero || '',
      complemento: userData?.complemento || '',
      bairro: userData?.bairro || '',
      cidade: userData?.cidade || '',
      estado: userData?.estado || '',
      confirmarEndereco: false,
    };
  };

  return {
    getDefaultValues
  };
};
