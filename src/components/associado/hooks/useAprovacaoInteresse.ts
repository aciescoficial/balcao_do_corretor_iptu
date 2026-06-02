
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth';
import { AssociadoInteresse } from '../types/associadoInteresse';
import { getAssociadoInteresses, updateInterestStatus } from '../services/associadoInteressesService';
import { createUserForAssociado } from '../services/associadoUserService';
import { generateAssociadoPayment } from '../services/associadoPaymentService';

export const useAprovacaoInteresse = () => {
  const [interesses, setInteresses] = useState<AssociadoInteresse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pendente');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchField, setSearchField] = useState<'nome' | 'email'>('nome');
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);
  const [selectedInterestForApproval, setSelectedInterestForApproval] = useState<AssociadoInteresse | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchPendingInterests = async () => {
    try {
      setIsLoading(true);
      const data = await getAssociadoInteresses({
        status: statusFilter,
        searchTerm: searchTerm.trim() || undefined,
        searchField: searchTerm.trim() ? searchField : undefined
      });
      setInteresses(data);
    } catch (error) {
      console.error('Error fetching interests:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os interesses.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingInterests();
    }
  }, [isAdmin, statusFilter]);

  // Search function that will be triggered by the search button
  const handleSearch = async () => {
    await fetchPendingInterests();
  };

  const sendApprovalEmail = async (email: string, nome: string, sobrenome: string, token: string, paymentUrl: string) => {
    try {
      // Generate payment link with token
      const paymentLink = `${paymentUrl}&token=${token}`;
      
      console.log('Sending approval email to:', email, 'with payment link:', paymentLink);
      
      // Send email using email template
      const { error } = await supabase.functions.invoke('send-email', {
        body: { 
          to: email,
          template_id: 'aprovacao_interesse',
          template_data: {
            nome: `${nome} ${sobrenome}`,
            email: email,
            link_pagamento: paymentLink
          }
        },
      });
      
      if (error) {
        console.error('Error sending approval email:', error);
        throw new Error(`Erro ao enviar email: ${error.message}`);
      }
      
      console.log('Approval email sent successfully');
      return true;
    } catch (error: any) {
      console.error('Error in sendApprovalEmail:', error);
      toast({
        title: 'Erro ao enviar email',
        description: error.message || 'Ocorreu um erro ao enviar o email de aprovação.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Open approval dialog for an interest
  const openApprovalDialog = (interesse: AssociadoInteresse) => {
    setSelectedInterestForApproval(interesse);
    setIsApprovalDialogOpen(true);
    setApprovalError(null);
  };
  
  // Close approval dialog
  const closeApprovalDialog = () => {
    setIsApprovalDialogOpen(false);
    setSelectedInterestForApproval(null);
    setApprovalError(null);
  };

  const handleApprove = async (associationTypeId: string) => {
    if (!selectedInterestForApproval) return;
    
    const interesse = selectedInterestForApproval;
    
    try {
      setApprovalError(null);
      setIsProcessingApproval(true);
      
      console.log('Starting approval process for:', interesse);
      
      // Generate a signup token valid for 7 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      const token = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      
      // Save the token to database
      const { error: tokenError } = await supabase
        .from('signup_tokens')
        .insert({
          associado_interesse_id: interesse.id,
          token,
          expires_at: expiresAt.toISOString(),
          used: false
        });
      
      if (tokenError) {
        console.error('Error creating signup token:', tokenError);
        throw new Error(`Erro ao gerar token: ${tokenError.message}`);
      }
      
      // Generate payment for the associate
      try {
        console.log('Generating payment with association type:', associationTypeId);
        const { paymentUrl, paymentId } = await generateAssociadoPayment({
          associadoInteresseId: interesse.id,
          associationTypeId,
          email: interesse.email,
          nome: interesse.nome,
          sobrenome: interesse.sobrenome,
          cpf: interesse.cpf
        });
        
        console.log('Payment generated successfully:', { paymentUrl, paymentId });
        
        // Create a user account for the approved associate
        try {
          await createUserForAssociado({
            id: interesse.id,
            email: interesse.email,
            nome: interesse.nome,
            sobrenome: interesse.sobrenome,
            cpf: interesse.cpf
          });
          
          console.log('User created successfully for associate interest:', interesse.id);
        } catch (userError: any) {
          console.error('Failed to create user for associate:', userError);
          toast({
            title: 'Alerta',
            description: 'O interesse foi aprovado, mas houve um problema ao criar o usuário. Verifique os logs.',
            variant: 'default',
          });
        }
        
        // Send approval email with payment link
        const emailSent = await sendApprovalEmail(
          interesse.email, 
          interesse.nome, 
          interesse.sobrenome, 
          token, 
          paymentUrl
        );
        
        // Update local state
        setInteresses(prev => prev.filter(item => item.id !== interesse.id));
        
        toast({
          title: 'Interesse aprovado',
          description: emailSent 
            ? `Uma notificação foi enviada para ${interesse.nome} ${interesse.sobrenome} com instruções para pagamento.`
            : `Interesse aprovado, mas não foi possível enviar o email para ${interesse.email}.`,
          variant: emailSent ? 'default' : 'destructive',
        });
        
        closeApprovalDialog();
      } catch (paymentError: any) {
        console.error('Payment generation error:', paymentError);
        setApprovalError(`Erro ao gerar pagamento: ${paymentError.message}`);
        throw new Error(`Erro ao gerar pagamento: ${paymentError.message}`);
      }
    } catch (error: any) {
      console.error('Error approving interest:', error);
      setApprovalError(error.message || 'Ocorreu um erro desconhecido ao aprovar o interesse');
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao aprovar o interesse. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingApproval(false);
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      await updateInterestStatus(id, 'rejeitado');
      
      // Update local state
      setInteresses(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Interesse rejeitado',
        description: 'O interesse foi rejeitado com sucesso.',
      });
    } catch (error) {
      console.error('Error rejecting interest:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao rejeitar o interesse. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return {
    interesses,
    isLoading,
    isAdmin,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    searchField,
    setSearchField,
    fetchPendingInterests,
    handleSearch,
    openApprovalDialog,
    closeApprovalDialog,
    handleApprove,
    handleReject,
    isApprovalDialogOpen,
    isProcessingApproval,
    selectedInterestForApproval,
    approvalError
  };
};
