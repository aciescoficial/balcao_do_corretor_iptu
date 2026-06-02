
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserRole } from '@/components/usuarios/types';
import { logProfileUpdate } from '@/components/audit/services/userActivityService';

interface ProfileFormProps {
  user: any;
  name: string;
  phone: string;
  role: string;
  city: string;
  state: string;
  cpf: string;
  creci: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onCityChange: (city: string) => void;
  onStateChange: (state: string) => void;
  onCpfChange: (cpf: string) => void;
  onCreciChange: (creci: string) => void;
}

export const ProfileForm = ({ 
  user, 
  name, 
  phone, 
  role,
  city,
  state,
  cpf,
  creci,
  onNameChange,
  onPhoneChange,
  onCityChange,
  onStateChange,
  onCpfChange,
  onCreciChange
}: ProfileFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('user')
        .update({ 
          name, 
          phone,
          city,
          state,
          cpf,
          creci,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Log profile update
      await logProfileUpdate(user.id);
      
      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram atualizados com sucesso.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get user role label
  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'user': return 'Associado';
      case 'empresa': return 'Empresa';
      case 'diretoria': return 'Diretoria';
      default: return 'Usuário';
    }
  };

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            value={user.email || ''}
            disabled
          />
          <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-1">
            <span>Telefone</span>
          </Label>
          <Input 
            id="phone" 
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(00) 00000-0000" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="flex items-center gap-1">
            <span>Nível do Usuário</span>
          </Label>
          <div className="p-2 bg-muted rounded-md border">
            {getRoleLabel(role)}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input 
            id="city" 
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Sua cidade" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input 
            id="state" 
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            placeholder="UF" 
            maxLength={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input 
            id="cpf" 
            value={cpf}
            onChange={(e) => onCpfChange(e.target.value)}
            placeholder="000.000.000-00" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="creci">CRECI</Label>
          <Input 
            id="creci" 
            value={creci}
            onChange={(e) => onCreciChange(e.target.value)}
            placeholder="Número CRECI (se aplicável)" 
          />
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
};
