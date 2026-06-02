
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  testConnection, 
  syncContacts, 
  syncCompanies 
} from '@/integrations/gohighlevel/gohighlevelService';

const GoHighLevelIntegracao: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<{
    contacts: 'idle' | 'loading' | 'success' | 'error';
    companies: 'idle' | 'loading' | 'success' | 'error';
  }>({
    contacts: 'idle',
    companies: 'idle'
  });

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testConnection();
      setIsConnected(result.success);
      
      if (result.success) {
        toast.success('Conexão bem-sucedida com o Go High Level');
      } else {
        toast.error('Falha na conexão com o Go High Level');
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setIsConnected(false);
      toast.error('Erro ao testar conexão com o Go High Level');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncContacts = async () => {
    setSyncState(prev => ({ ...prev, contacts: 'loading' }));
    try {
      const result = await syncContacts();
      if (result.success) {
        setSyncState(prev => ({ ...prev, contacts: 'success' }));
        toast.success(`${result.count || 0} conveniados sincronizados com sucesso`);
      } else {
        setSyncState(prev => ({ ...prev, contacts: 'error' }));
        toast.error('Erro ao sincronizar conveniados');
      }
    } catch (error) {
      console.error('Erro ao sincronizar conveniados:', error);
      setSyncState(prev => ({ ...prev, contacts: 'error' }));
      toast.error('Erro ao sincronizar conveniados');
    }
  };

  const handleSyncCompanies = async () => {
    setSyncState(prev => ({ ...prev, companies: 'loading' }));
    try {
      const result = await syncCompanies();
      if (result.success) {
        setSyncState(prev => ({ ...prev, companies: 'success' }));
        toast.success(`${result.count || 0} empresas sincronizadas com sucesso`);
      } else {
        setSyncState(prev => ({ ...prev, companies: 'error' }));
        toast.error('Erro ao sincronizar empresas');
      }
    } catch (error) {
      console.error('Erro ao sincronizar empresas:', error);
      setSyncState(prev => ({ ...prev, companies: 'error' }));
      toast.error('Erro ao sincronizar empresas');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Integração Go High Level</h2>
      <p className="text-muted-foreground mb-6">
        A integração com o Go High Level permite sincronizar conveniados e empresas entre os sistemas.
      </p>

      <div className="space-y-6">
        {/* Status da conexão */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Status da conexão</h3>
              <p className="text-sm text-muted-foreground">
                Verifique se a conexão com o Go High Level está funcionando
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Testar Conexão'
              )}
            </Button>
          </div>

          {isConnected !== null && (
            <div className={`p-4 rounded-md flex items-center ${isConnected ? 'bg-green-50' : 'bg-red-50'}`}>
              {isConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700">Conexão estabelecida com sucesso</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">Falha na conexão. Verifique suas credenciais.</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sincronização automática */}
        <div className="border-t pt-6 flex items-center justify-between">
          <div>
            <h3 className="font-medium">Sincronização automática</h3>
            <p className="text-sm text-muted-foreground">
              Ative para sincronizar automaticamente novos registros
            </p>
          </div>
          <Switch />
        </div>

        {/* Sincronização manual */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Sincronização manual</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Conveniados</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Sincroniza todos os conveniados com o Go High Level como contatos
              </p>
              
              <Button
                onClick={handleSyncContacts}
                disabled={syncState.contacts === 'loading'}
                className="w-full"
              >
                {syncState.contacts === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sincronizando...
                  </>
                ) : 'Sincronizar Conveniados'}
              </Button>
              
              {syncState.contacts === 'success' && (
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Sincronização concluída
                </p>
              )}
              
              {syncState.contacts === 'error' && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  Falha na sincronização
                </p>
              )}
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Empresas</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Sincroniza todas as empresas com o Go High Level como empresas/contas
              </p>
              
              <Button
                onClick={handleSyncCompanies}
                disabled={syncState.companies === 'loading'}
                className="w-full"
              >
                {syncState.companies === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sincronizando...
                  </>
                ) : 'Sincronizar Empresas'}
              </Button>
              
              {syncState.companies === 'success' && (
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Sincronização concluída
                </p>
              )}
              
              {syncState.companies === 'error' && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  Falha na sincronização
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Opções avançadas */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Opções avançadas</h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Configurações avançadas
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Redefinir sincronização</DropdownMenuItem>
              <DropdownMenuItem>Logs de sincronização</DropdownMenuItem>
              <DropdownMenuItem>Mapeamento de campos</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default GoHighLevelIntegracao;
