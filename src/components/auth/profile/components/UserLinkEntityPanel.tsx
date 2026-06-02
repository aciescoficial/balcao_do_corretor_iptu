
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { UserRole } from '@/components/usuarios/types';
import { logUserActivity } from '@/components/audit/services/userActivityService';
import { useAuth } from '@/components/auth';
import { AlertCircle } from 'lucide-react';

interface UserLinkEntityPanelProps {
  role: string;
  associadoId: string | undefined;
  empresaId: string | undefined;
  onAssociadoChange: (id: string | undefined) => void;
  onEmpresaChange: (id: string | undefined) => void;
  userId: string;
}

export const UserLinkEntityPanel = ({ 
  role, 
  associadoId, 
  empresaId, 
  onAssociadoChange, 
  onEmpresaChange,
  userId 
}: UserLinkEntityPanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [associados, setAssociados] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [selectedAssociadoId, setSelectedAssociadoId] = useState<string | undefined>(associadoId);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string | undefined>(empresaId);
  
  const { toast } = useToast();
  const { userRole, isAdmin } = useAuth();
  
  // Check if the current user is admin to allow associado linking
  const canLinkAssociado = isAdmin || userRole === 'admin' || userRole === 'diretoria';
  
  useEffect(() => {
    const fetchEntities = async () => {
      setIsLoading(true);
      
      try {
        // Fetch associados if user is "user" role
        if (role === 'user') {
          const { data: associadosData, error: associadosError } = await supabase
            .from('associados')
            .select('id, nome, sobrenome, cpf')
            .eq('status', 'ativo')
            .order('nome', { ascending: true });
            
          if (associadosError) throw associadosError;
          setAssociados(associadosData || []);
        }
        
        // Fetch empresas if user is "empresa" role
        if (role === 'empresa') {
          const { data: empresasData, error: empresasError } = await supabase
            .from('empresas')
            .select('id, nome_fantasia, cnpj')
            .eq('status', 'ativo')
            .order('nome_fantasia', { ascending: true });
            
          if (empresasError) throw empresasError;
          setEmpresas(empresasData || []);
        }
      } catch (error: any) {
        console.error('Error fetching entities:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar entidades",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntities();
  }, [role, toast]);
  
  const handleSaveLink = async () => {
    setIsSaving(true);
    
    try {
      const updateData: any = {};
      
      if (role === 'user') {
        updateData.associado_id = selectedAssociadoId;
        updateData.empresa_id = null; // Clear empresa_id if user is associado
      } else if (role === 'empresa') {
        updateData.empresa_id = selectedEmpresaId;
        updateData.associado_id = null; // Clear associado_id if user is empresa
      }
      
      const { error } = await supabase
        .from('user')
        .update(updateData)
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      if (role === 'user') {
        onAssociadoChange(selectedAssociadoId);
      } else if (role === 'empresa') {
        onEmpresaChange(selectedEmpresaId);
      }
      
      // Log the activity
      await logUserActivity(userId, `Vinculação de ${role === 'user' ? 'associado' : 'empresa'}`);
      
      toast({
        title: "Vínculo atualizado",
        description: `O vínculo com ${role === 'user' ? 'associado' : 'empresa'} foi atualizado com sucesso.`
      });
    } catch (error: any) {
      console.error('Error updating entity link:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar vínculo",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {role === 'user' ? 'Vínculo com Associado' : 'Vínculo com Empresa'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingSpinner size="small" text="Carregando..." />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {role === 'user' ? 'Vínculo com Associado' : 'Vínculo com Empresa'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {role === 'user' && !canLinkAssociado ? (
          <div className="flex flex-col gap-3 text-center items-center p-4 text-muted-foreground border rounded-md bg-gray-50">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <div>
              <p className="font-medium text-foreground">Acesso restrito</p>
              <p className="text-sm">A vinculação de associados só pode ser realizada por administradores do sistema.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {role === 'user' && (
              <Select
                value={selectedAssociadoId}
                onValueChange={setSelectedAssociadoId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um associado" />
                </SelectTrigger>
                <SelectContent>
                  {associados.map(associado => (
                    <SelectItem key={associado.id} value={associado.id}>
                      {associado.nome} {associado.sobrenome} - CPF: {associado.cpf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {role === 'empresa' && (
              <Select
                value={selectedEmpresaId}
                onValueChange={setSelectedEmpresaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map(empresa => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nome_fantasia} - CNPJ: {empresa.cnpj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button 
              className="w-full" 
              onClick={handleSaveLink}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar Vínculo"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
