import { supabase } from "@/integrations/supabase/client";
import { ConveniadoFormData, ImportConveniadoData, StatusType } from './types';
import { logOperation } from '../audit/auditLogService';

export const saveConveniado = async (data: ConveniadoFormData) => {
  const conveniadoData = {
    nome: data.nome,
    sobrenome: data.sobrenome,
    telefone: data.celular,
    email: data.email,
    cidade: data.cidade,
    cpf: data.cpf,
    creci: data.creci || null,
    data_nascimento: data.dataNascimento || null,
    rua: data.rua || null,
    numero: data.numero || null,
    complemento: data.complemento || null,
    bairro: data.bairro || null,
    estado: data.estado || null,
    cep: data.cep || null,
    placa_principal: data.placaPrincipal || null,
    placa_secundaria: data.placaSecundaria || null,
    valor_pago: data.valorPago || null,
    data_ultimo_pagamento: data.dataUltimoPagamento || null,
    valor_devido: data.valorDevido || null,
    tipo_pagamento: data.tipoPagamento || null,
    tipo_associado: data.tipoAssociado || null,
    validade: data.validade || null,
    status: 'pendente' as StatusType
  };
  
  const { data: conveniadoResult, error } = await supabase
    .from('associados')
    .insert(conveniadoData)
    .select('id')
    .single();
    
  if (error) {
    console.error("Supabase error details:", error);
    throw error;
  }
  
  return conveniadoResult;
};

export const uploadFoto = async (id: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${id}.${fileExt}`;
  
  const { error } = await supabase
    .storage
    .from('associados')
    .upload(fileName, file);
    
  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const importConveniados = async (data: ImportConveniadoData[]) => {
  const conveniados = data.map(item => ({
    nome: item.nome,
    sobrenome: item.sobrenome,
    cpf: item.cpf,
    creci: item.creci || null,
    email: item.email,
    telefone: item.celular,
    cidade: item.cidade || '',
    placa_principal: item.placaPrincipal || null,
    placa_secundaria: item.placaSecundaria || null,
    data_nascimento: item.dataNascimento || null,
    validade: item.validade || null,
    rua: item.rua || null,
    numero: item.numero || null,
    complemento: item.complemento || null,
    bairro: item.bairro || null,
    estado: item.estado || null,
    cep: item.cep || null,
    valor_pago: item.valorPago || null,
    data_ultimo_pagamento: item.dataUltimoPagamento || null,
    valor_devido: item.valorDevido || null,
    tipo_pagamento: item.tipoPagamento || null,
    tipo_associado: item.tipoAssociado || null,
    status: 'pendente' as StatusType
  }));
  
  const { error } = await supabase
    .from('associados')
    .insert(conveniados);
    
  if (error) {
    throw error;
  }
  
  await logOperation({
    eventType: 'import',
    entityType: 'conveniado',
    format: 'csv',
    recordCount: conveniados.length,
    details: `Importação de ${conveniados.length} conveniados`
  });
  
  return conveniados.length;
};

export const exportConveniados = async () => {
  const { data: conveniados, error } = await supabase
    .from('associados')
    .select('*');
    
  if (error) throw error;
  
  await logOperation({
    eventType: 'export',
    entityType: 'conveniado',
    format: 'csv',
    recordCount: conveniados.length,
    details: `Exportação de ${conveniados.length} conveniados`
  });
  
  return conveniados;
};
