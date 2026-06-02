
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SignupPasswordData, signupPasswordSchema } from '../hooks/useSignupCompletion';

interface SignupPasswordFormProps {
  signupUserName: string;
  submitting: boolean;
  onSubmit: (data: SignupPasswordData) => void;
}

const SignupPasswordForm: React.FC<SignupPasswordFormProps> = ({
  signupUserName,
  submitting,
  onSubmit
}) => {
  const form = useForm<SignupPasswordData>({
    resolver: zodResolver(signupPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-6 text-center">Finalizar Cadastro</h2>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="font-medium">Bem-vindo(a), {signupUserName}!</p>
        <p className="text-sm text-gray-700">Para finalizar seu cadastro como associado, crie uma senha para sua conta.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirme sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full mt-4" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finalizando...
              </>
            ) : "Finalizar Cadastro"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignupPasswordForm;
