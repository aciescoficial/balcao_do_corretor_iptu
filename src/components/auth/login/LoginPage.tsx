
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useToast } from "@/hooks/use-toast";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for registration success query param
    const params = new URLSearchParams(location.search);
    const registered = params.get('registered');
    const error = params.get('error');
    
    if (registered === 'true') {
      toast({
        title: "Registro concluído",
        description: "Sua conta foi criada com sucesso. Agora você pode fazer login.",
      });
    }
    
    if (error) {
      setLoginError(decodeURIComponent(error));
    }
    
    // Check if we should show the register tab
    if (location.pathname === '/cadastro') {
      setActiveTab('register');
    }
  }, [location, toast]);

  // Don't show anything while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    // Get the intended destination from location state or default to dashboard
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ACIESC</h1>
          <p className="text-muted-foreground">Gestão de Associados</p>
        </div>

        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        {showForgotPassword ? (
          <ForgotPasswordForm 
            onBack={() => setShowForgotPassword(false)} 
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Registrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                onForgotPassword={() => setShowForgotPassword(true)} 
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
