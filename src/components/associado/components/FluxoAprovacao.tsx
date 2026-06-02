
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, UserPlus, Send, FileText, ArrowRight } from 'lucide-react';

const FluxoAprovacao = () => {
  return (
    <div className="space-y-6">
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Arrow indicators between steps (hidden on mobile) */}
        <div className="hidden md:block absolute top-1/2 left-1/4 -translate-y-1/2 translate-x-1/2 z-10">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 z-10">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="hidden md:block absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 z-10">
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </div>

        <Card className="relative">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-medium">1. Cadastro</h3>
              <p className="text-sm text-muted-foreground">
                Interessado preenche o formulário de interesse na associação
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                <Send className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-medium">2. Análise</h3>
              <p className="text-sm text-muted-foreground">
                Administrador analisa a documentação e dados do interessado
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <UserPlus className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-medium">3. Aprovação</h3>
              <p className="text-sm text-muted-foreground">
                Administrador aprova ou rejeita a solicitação de associação
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-medium">4. Conclusão</h3>
              <p className="text-sm text-muted-foreground">
                Associado recebe confirmação e completa seu cadastro
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Este é o fluxo padrão do processo de aprovação de novos associados. 
          Cada etapa é importante para garantir a qualidade e integridade da associação.
          O processo foi desenhado para ser eficiente e transparente para todos os envolvidos.
        </p>
      </div>
    </div>
  );
};

export default FluxoAprovacao;
