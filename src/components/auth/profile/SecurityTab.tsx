
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from "@/components/ui/separator";
// Import is kept but the component won't be used temporarily
// import { TwoFactorAuth } from '../two-factor';

interface SecurityTabProps {
  userId: string;
}

export const SecurityTab = ({ userId }: SecurityTabProps) => {
  const { toast } = useToast();

  // Password reset form schema
  const passwordSchema = z.object({
    currentPassword: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação deve ter pelo menos 6 caracteres")
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      passwordForm.reset();
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: error.message,
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Segurança
        </CardTitle>
        <CardDescription>
          Gerencie as configurações de segurança da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Password Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5" />
              <h3 className="text-lg font-medium">Alteração de Senha</h3>
            </div>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha atual</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={passwordForm.formState.isSubmitting}
                >
                  {passwordForm.formState.isSubmitting ? "Processando..." : "Atualizar Senha"}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Two-Factor Authentication Section - Temporarily disabled */}
          {/* Uncomment this section to re-enable 2FA
          <Separator />
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Autenticação de Dois Fatores</h3>
            </div>
            
            <TwoFactorAuth userId={userId} />
          </div>
          */}
        </div>
      </CardContent>
    </Card>
  );
};
