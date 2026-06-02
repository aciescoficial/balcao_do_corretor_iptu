
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Send } from 'lucide-react';
import { EmailTemplate } from './types';

interface TemplateFormProps {
  template: EmailTemplate;
  updateTemplateField: (id: string, field: keyof EmailTemplate, value: string) => void;
  handleSave: (template: EmailTemplate) => Promise<void>;
  saving: string | null;
  openTestEmailDialog: (templateCode: string) => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  updateTemplateField,
  handleSave,
  saving,
  openTestEmailDialog
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`subject-${template.id}`}>Assunto</Label>
        <input
          id={`subject-${template.id}`}
          className="w-full px-3 py-2 border rounded mt-1"
          value={template.assunto}
          onChange={(e) => updateTemplateField(template.id, 'assunto', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor={`body-${template.id}`}>Corpo do Email</Label>
        <Textarea
          id={`body-${template.id}`}
          className="min-h-[300px] font-mono text-sm mt-1"
          value={template.corpo}
          onChange={(e) => updateTemplateField(template.id, 'corpo', e.target.value)}
        />
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm font-medium mb-1">Variáveis disponíveis:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li><code>{'{nome}'}</code> - Nome do destinatário</li>
          <li><code>{'{email}'}</code> - Email do destinatário</li>
          {template.codigo === 'aprovacao_interesse' && (
            <li><code>{'{link_pagamento}'}</code> - Link para pagamento</li>
          )}
          {template.codigo === 'confirmacao_pagamento' && (
            <li><code>{'{link_cadastro}'}</code> - Link para finalizar cadastro</li>
          )}
        </ul>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={() => handleSave(template)}
          disabled={saving === template.id}
          className="flex items-center gap-2"
        >
          {saving === template.id ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={16} />
              Salvar alterações
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => openTestEmailDialog(template.codigo)}
          className="flex items-center gap-2"
        >
          <Send size={16} />
          Testar Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateForm;
