
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Send } from 'lucide-react';
import { useEmailTemplates } from './useEmailTemplates';
import TemplateForm from './TemplateForm';
import TestEmailDialog from './TestEmailDialog';

const EmailTemplatesConfig: React.FC = () => {
  const {
    templates,
    loading,
    saving,
    activeTab,
    setActiveTab,
    isTestDialogOpen,
    setIsTestDialogOpen,
    testEmailTo,
    setTestEmailTo,
    isSendingTest,
    currentTemplateForTest,
    handleSave,
    updateTemplateField,
    openTestEmailDialog,
    handleSendTestEmail
  } = useEmailTemplates();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Templates de Email</h2>
        <Button 
          variant="outline" 
          onClick={() => openTestEmailDialog('')}
          className="flex items-center gap-2"
        >
          <Send size={16} />
          Enviar Email Teste
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 size={30} className="animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <div className="wp-notice-warning">
          <p>Nenhum template configurado. Inicializando templates padrão...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {templates.map(template => (
              <TabsTrigger key={template.codigo} value={template.codigo}>
                {template.nome}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {templates.map(template => (
            <TabsContent key={template.codigo} value={template.codigo} className="space-y-4">
              <TemplateForm 
                template={template}
                updateTemplateField={updateTemplateField}
                handleSave={handleSave}
                saving={saving}
                openTestEmailDialog={openTestEmailDialog}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <TestEmailDialog
        isOpen={isTestDialogOpen}
        setIsOpen={setIsTestDialogOpen}
        testEmailTo={testEmailTo}
        setTestEmailTo={setTestEmailTo}
        currentTemplateForTest={currentTemplateForTest}
        isSendingTest={isSendingTest}
        handleSendTestEmail={handleSendTestEmail}
        templates={templates}
      />
    </div>
  );
};

export default EmailTemplatesConfig;
