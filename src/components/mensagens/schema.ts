
import { z } from 'zod';

// Schema para validação do formulário
export const mensagemSchema = z.object({
  assunto: z.string().min(3, { message: 'O assunto deve ter pelo menos 3 caracteres' }),
  mensagem: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres' }),
  tipoEnvio: z.enum(['email', 'notificacao', 'push', 'ambos']),
  destinatario: z.enum(['usuario', 'grupo']),
  emailDestinatario: z.string().email().optional(),
  grupoDestinatarios: z.enum(['associados', 'conveniados', 'diretoria', 'admin', 'todos']).optional(),
  enviarCopia: z.boolean().default(false),
});

export type MensagemFormValues = z.infer<typeof mensagemSchema>;
