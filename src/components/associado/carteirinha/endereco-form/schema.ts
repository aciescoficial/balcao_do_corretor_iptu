
import * as z from 'zod';

export const enderecoSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  sobrenome: z.string().min(2, "Sobrenome é obrigatório"),
  cep: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
  endereco: z.string().min(3, "Endereço é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  confirmarEndereco: z.boolean().refine(val => val === true, {
    message: "Você precisa confirmar que o endereço está correto"
  })
});

export type EnderecoFormValues = z.infer<typeof enderecoSchema>;
