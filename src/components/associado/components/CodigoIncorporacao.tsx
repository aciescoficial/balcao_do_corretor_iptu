
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CodigoIncorporacao = () => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  
  const formUrl = 'https://preview--aciesc-gestao-associados.lovable.app/formulario-interesse';
  const embedCode = `<iframe src="${formUrl}" width="100%" height="650" frameborder="0" title="Formulário de Interesse"></iframe>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copiado!",
      description: "O código foi copiado para sua área de transferência.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="wp-card">
        <h3 className="wp-subheader">Link direto para o formulário</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Compartilhe este link para que interessados possam preencher o formulário diretamente:
        </p>
        <div className="flex gap-2">
          <Input value={formUrl} readOnly />
          <Button 
            onClick={() => handleCopy(formUrl)}
            variant="outline"
          >
            {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="wp-card">
        <h3 className="wp-subheader">Código para incorporação</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use este código HTML para incorporar o formulário em seu site:
        </p>
        <div className="bg-muted p-4 rounded-md mb-4">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
        </div>
        <Button 
          onClick={() => handleCopy(embedCode)}
          variant="outline"
          className="w-full"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 mr-2" />
              Código copiado!
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4 mr-2" />
              Copiar código de incorporação
            </>
          )}
        </Button>
      </div>

      <div className="wp-card">
        <h3 className="wp-subheader">Prévia do formulário</h3>
        <iframe
          src={formUrl}
          width="100%"
          height="650"
          frameBorder="0"
          title="Formulário de Interesse"
          className="border rounded"
        />
      </div>
    </div>
  );
};

export default CodigoIncorporacao;
