
import { z } from 'zod';
import { EmpresaData, ImportError } from './types';

// Define allowed values for nicho with proper string literals
export const nichoOptions = [
  'Alimentação',
  'Saúde',
  'Educação',
  'Serviços',
  'Comércio',
  'Lazer',
  'Tecnologia',
  'Outro'
] as const;

// Define schema for empresa data
export const empresaSchema = z.object({
  razao_social: z.string().min(1, 'Razão Social é obrigatória'),
  nome_fantasia: z.string().min(1, 'Nome Fantasia é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  cep: z.string().regex(/^\d{5}-\d{3}$|^\d{8}$/, 'CEP inválido'),
  nicho: z.enum(nichoOptions),
  desconto: z.string().min(1, 'Desconto é obrigatório'),
  produtos: z.string().min(1, 'Produtos são obrigatórios'),
  site: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  status: z.enum(['ativo', 'pendente', 'inativo']).default('pendente')
});

export const validateEmpresaData = (data: Record<string, string>[]): { processedData: EmpresaData[], errors: ImportError[] } => {
  const processedData: EmpresaData[] = [];
  const errors: ImportError[] = [];

  data.forEach((item, index) => {
    try {
      // Transform field names to match our schema
      const transformedData = {
        razao_social: item.razao_social || '',
        nome_fantasia: item.nome_fantasia || '',
        cnpj: item.cnpj || '',
        responsavel: item.responsavel || '',
        telefone: item.telefone || '',
        email: item.email || '',
        endereco: item.endereco || '',
        cidade: item.cidade || '',
        cep: item.cep || '',
        nicho: item.nicho as any || 'Outro',
        desconto: item.desconto || '',
        produtos: item.produtos || '',
        site: item.site || undefined,
        instagram: item.instagram || undefined,
        whatsapp: item.whatsapp || undefined,
        status: (item.status as 'ativo' | 'pendente' | 'inativo') || 'pendente'
      };

      // Validate the data with zod
      const result = empresaSchema.safeParse(transformedData);
      
      if (result.success) {
        processedData.push(result.data as EmpresaData);
      } else {
        result.error.issues.forEach(issue => {
          errors.push({
            row: index + 1,
            field: issue.path.join('.'),
            message: issue.message,
            data: item
          });
        });
      }
    } catch (error) {
      errors.push({
        row: index + 1,
        field: 'general',
        message: 'Erro ao processar linha',
        data: item
      });
    }
  });

  return { processedData, errors };
};
