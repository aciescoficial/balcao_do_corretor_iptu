
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const associadoSchema = z.object({
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  cep: z.string().min(8, 'CEP deve ter 8 dígitos'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório'),
});

type AssociadoFormData = z.infer<typeof associadoSchema>;

export const AssociadoFirstLoginPopup = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [associadoId, setAssociadoId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<AssociadoFormData>({
    resolver: zodResolver(associadoSchema),
  });
  
  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        
        // Check if user has associado_id
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('associado_id')
          .eq('id', session.user.id)
          .single();
          
        if (userError) {
          console.error('Error fetching user data:', userError);
          return;
        }

        // If user has associado_id, check if it's their first login
        // We'll handle this with a separate RPC call or application logic
        if (userData?.associado_id) {
          setAssociadoId(userData.associado_id);
          
          // Check for first login status using custom application logic
          // Since we can't modify the types, we'll use a workaround
          const { data: firstLoginData } = await supabase
            .from('user')
            .select('id')
            .eq('id', session.user.id)
            .eq('tags', ['associado', 'first_login'])
            .maybeSingle();
          
          // If user has the 'first_login' tag, open the dialog
          if (firstLoginData) {
            setOpen(true);
          }
        }
      }
    };
    
    checkUserStatus();
  }, []);
  
  const onSubmit = async (data: AssociadoFormData) => {
    if (!associadoId) return;
    
    setIsLoading(true);
    try {
      // Update associado data
      const { error: associadoError } = await supabase
        .from('associados')
        .update({
          telefone: data.telefone,
          cep: data.cep,
          cidade: data.cidade,
          estado: data.estado,
        })
        .eq('id', associadoId);
        
      if (associadoError) throw associadoError;
      
      // Remove 'first_login' tag from user's tags
      if (userId) {
        const { data: currentUser } = await supabase
          .from('user')
          .select('tags')
          .eq('id', userId)
          .single();
          
        const updatedTags = (currentUser?.tags || []).filter(tag => tag !== 'first_login');
        
        const { error: userError } = await supabase
          .from('user')
          .update({ 
            tags: updatedTags
          })
          .eq('id', userId);
          
        if (userError) throw userError;
      }
      
      toast({
        title: "Dados atualizados com sucesso!",
        description: "Obrigado por completar seu cadastro.",
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error updating associado data:', error);
      toast({
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      // Prevent closing by clicking outside
      if (!open && associadoId) return;
      setOpen(open);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete seu cadastro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && (
                <p className="text-sm text-red-500">{errors.telefone.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  {...register('cep')}
                  placeholder="00000-000"
                />
                {errors.cep && (
                  <p className="text-sm text-red-500">{errors.cep.message}</p>
                )}
              </div>
              
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  {...register('cidade')}
                  placeholder="Sua cidade"
                />
                {errors.cidade && (
                  <p className="text-sm text-red-500">{errors.cidade.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                {...register('estado')}
                placeholder="UF"
                maxLength={2}
              />
              {errors.estado && (
                <p className="text-sm text-red-500">{errors.estado.message}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Completar cadastro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssociadoFirstLoginPopup;
