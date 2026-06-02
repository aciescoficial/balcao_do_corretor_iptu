
import * as z from 'zod';

export const companySearchSchema = z.object({
  searchTerm: z.string().optional(),
  searchType: z.enum(['nome', 'cnpj', 'nicho']).default('nome'),
  status: z.enum(['ativo', 'inativo', 'todos']).default('todos')
}).superRefine((data, ctx) => {
  if (data.searchTerm === undefined || data.searchTerm.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Digite um termo para busca",
      path: ["searchTerm"]
    });
  }
});

export type CompanySearchFormValues = z.infer<typeof companySearchSchema>;
