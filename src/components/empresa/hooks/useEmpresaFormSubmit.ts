
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { EmpresaFormData } from '../types/formTypes';
import { UseFormReset } from 'react-hook-form';

export const useEmpresaFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    data: EmpresaFormData, 
    reset: UseFormReset<EmpresaFormData>,
    latitude?: number,
    longitude?: number
  ) => {
    setIsSubmitting(true);
    
    try {
      const empresaData = {
        razao_social: data.razaoSocial,
        nome_fantasia: data.nomeFantasia,
        cnpj: data.cnpj,
        responsavel: data.responsavel,
        telefone: data.telefone,
        email: data.email,
        endereco: data.endereco,
        cidade: data.cidade,
        cep: data.cep,
        site: data.site || null,
        instagram: data.instagram || null,
        whatsapp: data.whatsapp || null,
        nicho: data.nicho,
        desconto: data.desconto,
        produtos: data.produtos,
        logo_url: data.logoUrl || null,
        capa_url: data.capaUrl || null,
        video_url: data.videoUrl || null,
        latitude,
        longitude,
        status: 'pendente' as const
      };
      
      const { error } = await supabase
        .from('empresas')
        .insert(empresaData);
        
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "A empresa foi cadastrada e está aguardando aprovação por um administrador.",
      });
      
      reset();
    } catch (error: any) {
      console.error("Error inserting data:", error);
      
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao cadastrar a empresa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
