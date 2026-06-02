

export interface EmailTemplate {
  id: string;
  nome: string;
  assunto: string;
  corpo: string;
  codigo: string;
}

export const defaultTemplates = [
  {
    nome: 'Aprovação de Interesse',
    assunto: 'Sua solicitação de associação à ACIESC foi aprovada',
    corpo: `Olá {nome},

Temos o prazer de informar que sua solicitação de associação à ACIESC foi aprovada!

Para finalizar seu cadastro, clique no link abaixo para realizar o pagamento:
{link_pagamento}

Após a confirmação do pagamento, você receberá um email para criar sua senha e acessar nossa plataforma.

Atenciosamente,
Equipe ACIESC`,
    codigo: 'aprovacao_interesse'
  },
  {
    nome: 'Confirmação de Pagamento',
    assunto: 'Pagamento confirmado - Finalize seu cadastro na ACIESC',
    corpo: `Olá {nome},

Seu pagamento foi confirmado com sucesso!

Para finalizar seu cadastro e criar sua senha, clique no link abaixo:
{link_cadastro}

Este link é válido por 24 horas.

Atenciosamente,
Equipe ACIESC`,
    codigo: 'confirmacao_pagamento'
  },
  {
    nome: 'Usuário Criado',
    assunto: 'Sua conta na ACIESC foi criada',
    corpo: `Olá {nome},

Uma conta de usuário foi criada para você na plataforma da ACIESC.

Para acessar sua conta, clique no link abaixo:
{link_login}

Na primeira vez que você acessar, será solicitado que você complete seu cadastro.

Atenciosamente,
Equipe ACIESC`,
    codigo: 'usuario_criado'
  },
  {
    nome: 'Convite para Cadastro',
    assunto: 'Complete seu cadastro na ACIESC',
    corpo: `Olá {nome},

Você foi registrado como associado na ACIESC.

Para completar seu cadastro e criar sua conta de usuário, clique no link abaixo:
{link_cadastro}

Após criar sua conta, você terá acesso a todos os benefícios e serviços disponíveis para associados.

Atenciosamente,
Equipe ACIESC`,
    codigo: 'convite_cadastro'
  }
];
