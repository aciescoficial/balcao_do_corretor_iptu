
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { extendedSupabase } from '@/integrations/supabase/extendedClient';
import { EmailTemplate, defaultTemplates } from './types';
import { sendTestEmail, getTemplateTestData } from '../services/emailService';

export const useEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [testEmailTo, setTestEmailTo] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [currentTemplateForTest, setCurrentTemplateForTest] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await extendedSupabase
        .from('email_templates')
        .select('*')
        .order('nome');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTemplates(data);
        setActiveTab(data[0].codigo);
      } else {
        // Nenhum template encontrado, criar os padrões
        await initializeDefaultTemplates();
      }
    } catch (error: any) {
      console.error('Erro ao buscar templates:', error);
      toast({
        title: 'Erro ao carregar templates',
        description: error.message || 'Ocorreu um erro ao buscar os templates de email',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const initializeDefaultTemplates = async () => {
    try {
      // Inserir templates padrão
      const { data, error } = await extendedSupabase
        .from('email_templates')
        .insert(defaultTemplates)
        .select();
        
      if (error) throw error;
      
      if (data) {
        setTemplates(data);
        setActiveTab(data[0].codigo);
      }
    } catch (error: any) {
      console.error('Erro ao inicializar templates:', error);
      toast({
        title: 'Erro ao criar templates padrão',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  const handleSave = async (template: EmailTemplate) => {
    setSaving(template.id);
    try {
      const { error } = await extendedSupabase
        .from('email_templates')
        .update({
          assunto: template.assunto,
          corpo: template.corpo
        })
        .eq('id', template.id);
        
      if (error) throw error;
      
      toast({
        title: 'Template salvo',
        description: 'O template de email foi atualizado com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: 'Erro ao salvar template',
        description: error.message || 'Ocorreu um erro ao salvar o template',
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };
  
  const updateTemplateField = (id: string, field: keyof EmailTemplate, value: string) => {
    setTemplates(currentTemplates => 
      currentTemplates.map(template => 
        template.id === id ? { ...template, [field]: value } : template
      )
    );
  };

  const openTestEmailDialog = (templateCode: string) => {
    setCurrentTemplateForTest(templateCode);
    setIsTestDialogOpen(true);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailTo) {
      toast({
        title: 'Email obrigatório',
        description: 'Por favor, informe um email para envio do teste.',
        variant: 'destructive'
      });
      return;
    }

    setIsSendingTest(true);
    try {
      // Get test data for the specific template
      const testData = currentTemplateForTest ? getTemplateTestData(currentTemplateForTest) : undefined;
      
      await sendTestEmail({
        to: testEmailTo,
        template_id: currentTemplateForTest || undefined,
        test_data: testData
      });
      
      toast({
        title: 'Email de teste enviado',
        description: `Um email de teste foi enviado para ${testEmailTo}`
      });
      
      setIsTestDialogOpen(false);
      setTestEmailTo('');
    } catch (error: any) {
      console.error('Erro ao enviar email de teste:', error);
      toast({
        title: 'Erro ao enviar email de teste',
        description: error.message || 'Ocorreu um erro ao enviar o email de teste',
        variant: 'destructive'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return {
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
  };
};
