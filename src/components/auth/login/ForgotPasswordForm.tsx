
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { success, error } = await resetPassword(email);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Erro ao recuperar senha",
          description: error,
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao recuperar senha",
        description: error.message || "Ocorreu um erro durante a recuperação de senha",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Button 
          variant="ghost" 
          className="p-0 h-auto mb-2 font-normal" 
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o login
        </Button>
        <CardTitle>Recuperar Senha</CardTitle>
        <CardDescription>
          {isSubmitted ? 
            "Link de recuperação enviado. Verifique seu email." : 
            "Digite seu email e enviaremos um link para recuperar sua senha."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isSubmitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-recover">Email</Label>
              <Input 
                id="email-recover" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar link de recuperação"
              )}
            </Button>
          </form>
        )}
        
        {isSubmitted && (
          <div className="text-center py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Verifique sua caixa de entrada e siga as instruções para recuperar sua senha.
            </p>
            <Button 
              className="w-full"
              onClick={onBack}
            >
              Voltar para o login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
