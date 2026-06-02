
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Shield, Check, Loader } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUserSetup: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [rootExists, setRootExists] = useState(false);

  const ROOT_EMAIL = "admin@aciesc.com.br";
  const ROOT_PASSWORD = "FavorDeDeus@2025";
  
  // Check if ROOT user already exists
  useEffect(() => {
    const checkRootUser = async () => {
      try {
        // Check for admin user in user table
        const { data, error } = await supabase
          .from('user')
          .select('email')
          .eq('email', ROOT_EMAIL)
          .maybeSingle();
          
        if (data && data.email === ROOT_EMAIL) {
          console.log("Found ROOT user in user table");
          setRootExists(true);
          return;
        }

        // If no direct match in user table, try to query by role
        if (!data) {
          const { data: adminUsers, error: roleError } = await supabase
            .from('user')
            .select('email, role')
            .eq('role', 'admin')
            .limit(1);
            
          if (adminUsers && adminUsers.length > 0) {
            console.log("Found admin user:", adminUsers[0]);
            setRootExists(true);
            return;
          }
        }

        console.log("No ROOT user found");
      } catch (error) {
        console.error("Error checking root user:", error);
      }
    };
    
    checkRootUser();
  }, []);

  const createRootUser = async () => {
    setLoading(true);
    
    try {
      console.log("Creating ROOT user...");
      
      // Step 1: Create auth user using signUp instead of admin.createUser
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: ROOT_EMAIL,
        password: ROOT_PASSWORD,
        options: {
          data: {
            name: "Administrator ROOT",
            role: "admin"
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData?.user) {
        console.log("Auth user created:", authData.user.id);
        
        // Step 2: Update the user with admin role and tags
        const { error: profileError } = await supabase
          .from('user')
          .upsert({
            id: authData.user.id,
            name: "Administrator ROOT",
            email: ROOT_EMAIL,
            role: "admin",
            tags: ["administrador", "financeiro"],
            active: true
          });

        if (profileError) {
          console.error("Profile update error:", profileError);
          throw profileError;
        }

        // Attempt to confirm the email directly if possible
        try {
          console.log("Confirming user email...");
          await supabase.auth.admin.updateUserById(
            authData.user.id,
            { email_confirm: true }
          );
        } catch (confirmErr) {
          console.warn("Email confirmation is not available:", confirmErr);
        }

        toast({
          title: "Usuário ROOT criado",
          description: "O usuário ROOT foi criado com sucesso com a senha fornecida.",
          variant: "default"
        });
        
        setCreated(true);
        setRootExists(true);
      }
    } catch (error: any) {
      console.error("Error creating ROOT user:", error);
      toast({
        title: "Erro ao criar usuário ROOT",
        description: error.message || "Ocorreu um erro ao criar o usuário ROOT.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Configuração de Usuário ROOT
        </CardTitle>
        <CardDescription>
          Crie um usuário administrador com acesso total ao sistema
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {rootExists ? (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span>Usuário ROOT já existe no sistema</span>
          </div>
        ) : created ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span>Usuário ROOT criado com sucesso</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-md space-y-2">
              <div>
                <strong>Email:</strong> {ROOT_EMAIL}
              </div>
              <div className="flex items-center">
                <strong>Senha:</strong> 
                <div className="ml-2 bg-gray-100 px-2 py-1 rounded font-mono">
                  {ROOT_PASSWORD}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p>
              Isso criará um usuário administrador com acesso total a todos os menus e configurações do sistema.
            </p>
            <div className="p-4 bg-gray-50 rounded-md space-y-2">
              <div>
                <strong>Email:</strong> {ROOT_EMAIL}
              </div>
              <div className="flex items-center">
                <strong>Senha:</strong> 
                <div className="ml-2 bg-gray-100 px-2 py-1 rounded font-mono flex items-center">
                  {ROOT_PASSWORD}
                  <Lock className="h-4 w-4 ml-2" />
                </div>
              </div>
              <div>
                <strong>Função:</strong> Administrador
              </div>
              <div>
                <strong>Tags:</strong> administrador, financeiro
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {!rootExists && !created && (
          <Button 
            onClick={createRootUser} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Criando usuário...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Criar Usuário ROOT
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AdminUserSetup;
