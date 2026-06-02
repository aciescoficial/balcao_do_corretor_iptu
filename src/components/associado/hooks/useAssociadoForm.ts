
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { AssociadoFormData } from '../types';
import { saveAssociado } from '../associadoService';

export const useAssociadoForm = () => {
  const [activeTab, setActiveTab] = useState("dados-pessoais");
  const [submitting, setSubmitting] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Schema for form validation
  const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
    cpf: z.string().min(11, "CPF inválido"),
    creci: z.string().optional(),
    dataNascimento: z.string().optional(),
    email: z.string().email("Email inválido"),
    celular: z.string().min(1, "Telefone é obrigatório"),
    rua: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    estado: z.string().optional(),
    cep: z.string().optional(),
    placaPrincipal: z.string().optional(),
    placaSecundaria: z.string().optional(),
    tipoVeiculoPrincipal: z.enum(["Moto", "Carro"]).optional(),
    tipoVeiculoSecundario: z.enum(["Moto", "Carro"]).optional(),
    modeloVeiculoPrincipal: z.string().optional(),
    modeloVeiculoSecundario: z.string().optional(),
    corVeiculoPrincipal: z.string().optional(),
    corVeiculoSecundario: z.string().optional(),
    valorPago: z.string().optional(),
    dataUltimoPagamento: z.string().optional(),
    valorDevido: z.string().optional(),
    tipoPagamento: z.string().optional(),
    tipoAssociado: z.string().optional(),
    validade: z.string().optional(),
    foto: z
      .instanceof(FileList)
      .optional()
      .refine((files) => {
        if (!files) return true;
        return files.length === 0 || 
          (files[0] && (files[0].type === "image/jpeg" || files[0].type === "image/png"));
      }, "Arquivo deve ser uma imagem (JPEG ou PNG)"),
    comprovantePagamento: z.instanceof(FileList).optional(),
    criarUsuario: z.boolean().optional(),
  });
  
  const form = useForm<AssociadoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      cpf: "",
      creci: "",
      email: "",
      celular: "",
      cidade: "",
    },
  });
  
  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFotoRemove = () => {
    setFotoPreview(null);
    // Reset the file input
    form.setValue('foto', undefined);
  };
  
  const handleFormSubmit = async (data: AssociadoFormData) => {
    setSubmitting(true);
    
    try {
      const savedAssociado = await saveAssociado(data);
      
      toast({
        title: "Associado cadastrado com sucesso!",
        description: "O associado foi adicionado como pendente e aguarda aprovação.",
      });
      
      // Reset form
      form.reset();
      setActiveTab("dados-pessoais");
      setFotoPreview(null);
      
    } catch (error) {
      console.error("Erro ao cadastrar associado:", error);
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar o associado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    submitting,
    fotoPreview,
    form,
    handleFotoUpload,
    handleFotoRemove,
    handleFormSubmit
  };
};
