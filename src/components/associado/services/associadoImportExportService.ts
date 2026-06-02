
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { ImportAssociadoData, StatusType } from '../types';
import { logOperation } from '@/components/audit/auditLogService';

/**
 * Import/export operations for associados
 */

export const importAssociados = async (data: ImportAssociadoData[]) => {
  try {
    const associados = data.map(item => ({
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
    
    // Inserir em lotes de 100 para evitar problemas com limites de tamanho
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < associados.length; i += batchSize) {
      const batch = associados.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('associados')
        .insert(batch);
        
      if (error) {
        throw error;
      }
      
      insertedCount += batch.length;
    }
    
    return insertedCount;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao importar associados:", errorMsg);
    throw error;
  }
};

export const exportAssociados = async () => {
  try {
    const { data: associados, error } = await supabase
      .from('associados')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return associados;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao exportar associados:", errorMsg);
    throw error;
  }
};
