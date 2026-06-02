
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { extendedSupabase } from "@/integrations/supabase/extendedClient";
import { AssociadoFormData, StatusType } from '../types';
import { logOperation } from '@/components/audit/auditLogService';
import { uploadFoto } from './associadoStorageService';
import { createUserForAssociado, sendRegistrationEmail } from './associadoUserService';

export const saveAssociado = async (data: AssociadoFormData) => {
  try {
    // Validate required fields
    if (!data.nome || !data.sobrenome || !data.cpf || !data.email || !data.celular) {
      throw new Error("Campos obrigatórios não preenchidos: nome, sobrenome, CPF, email e celular");
    }
    
    // Validate CPF format
    const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(data.cpf)) {
      throw new Error("Formato de CPF inválido");
    }
    
    // Check for existing associate with same CPF - using extended client
    const { data: existingCpf } = await extendedSupabase
      .from('associados')
      .select('id, nome')
      .eq('cpf', data.cpf)
      .maybeSingle();
      
    if (existingCpf) {
      throw new Error(`CPF já cadastrado para o associado: ${existingCpf.nome}`);
    }
    
    // Check for existing associate with same email - using extended client
    const { data: existingEmail } = await extendedSupabase
      .from('associados')
      .select('id, nome')
      .eq('email', data.email)
      .maybeSingle();
      
    if (existingEmail) {
      throw new Error(`Email já cadastrado para o associado: ${existingEmail.nome}`);
    }
    
    const associadoData = {
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
      validade: data.validade || null,
      status: 'pendente' as StatusType
    };
    
    // Using extended client with service role key to bypass RLS
    const { data: associadoResult, error } = await extendedSupabase
      .from('associados')
      .insert(associadoData)
      .select('id')
      .single();
      
    if (error) {
      console.error("Supabase error details:", error);
      throw error;
    }
    
    // Log the manual creation of an associate
    await logOperation({
      eventType: 'create',
      entityType: 'associado',
      details: `Associado ${data.nome} ${data.sobrenome} (CPF: ${data.cpf}) cadastrado manualmente`,
      recordCount: 1
    });

    // Upload photo if it exists
    if (data.foto && data.foto.length > 0) {
      await uploadFoto(associadoResult.id, data.foto[0]);
    }
    
    // Create user if requested
    if (data.criarUsuario) {
      const userResult = await createUserForAssociado({
        id: associadoResult.id,
        email: data.email,
        nome: data.nome,
        sobrenome: data.sobrenome,
        cpf: data.cpf
      });
      
      if (!userResult.success) {
        console.warn("Couldn't create user account, but associate was saved:", userResult.error);
      }
    } else {
      // Send email with registration link
      const emailResult = await sendRegistrationEmail({
        email: data.email,
        nome: data.nome,
        sobrenome: data.sobrenome,
        associadoId: associadoResult.id
      });
      
      if (!emailResult.success) {
        console.warn("Couldn't send registration email, but associate was saved:", emailResult.error);
      }
    }
    
    return associadoResult;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao salvar associado:", errorMsg);
    throw error;
  }
};

