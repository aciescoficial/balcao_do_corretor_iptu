
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserLinkTabsProps {
  isDiretoria: boolean;
  associadoId: string | undefined;
  empresaId: string | undefined;
  associados: Array<{id: string, cpf: string, nome: string, sobrenome: string}>;
  empresas: Array<{id: string, cnpj: string, nome_fantasia: string}>;
  loadingAssociados: boolean;
  loadingEmpresas: boolean;
  onDiretoriaSelect: (isDiretoria: boolean) => void;
  onAssociadoSelect: (associadoId: string) => void;
  onEmpresaSelect: (empresaId: string) => void;
}

export const UserLinkTabs: React.FC<UserLinkTabsProps> = ({
  isDiretoria,
  associadoId,
  empresaId,
  associados,
  empresas,
  loadingAssociados,
  loadingEmpresas,
  onDiretoriaSelect,
  onAssociadoSelect,
  onEmpresaSelect
}) => {
  // Determine the default tab based on user data
  const defaultTab = isDiretoria ? "diretoria" : (associadoId ? "associado" : "empresa");
  
  return (
    <div className="space-y-2 border-t pt-4">
      <Label>Vínculo do Usuário</Label>
      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger 
            value="associado"
            onClick={() => onDiretoriaSelect(false)}
          >
            Associado
          </TabsTrigger>
          <TabsTrigger 
            value="empresa"
            onClick={() => onDiretoriaSelect(false)}
          >
            Empresa
          </TabsTrigger>
          <TabsTrigger 
            value="diretoria"
            onClick={() => onDiretoriaSelect(true)}
          >
            Diretoria
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="associado" className="space-y-4 mt-4">
          {loadingAssociados ? (
            <div className="text-center py-4">Carregando associados...</div>
          ) : (
            <Select
              value={associadoId}
              onValueChange={onAssociadoSelect}
              disabled={isDiretoria}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um associado" />
              </SelectTrigger>
              <SelectContent>
                {associados.map((associado) => (
                  <SelectItem key={associado.id} value={associado.id}>
                    {associado.nome} {associado.sobrenome} - CPF: {associado.cpf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </TabsContent>
        
        <TabsContent value="empresa" className="space-y-4 mt-4">
          {loadingEmpresas ? (
            <div className="text-center py-4">Carregando empresas...</div>
          ) : (
            <Select
              value={empresaId}
              onValueChange={onEmpresaSelect}
              disabled={isDiretoria}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nome_fantasia} - CNPJ: {empresa.cnpj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </TabsContent>
        
        <TabsContent value="diretoria" className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground">
            Este usuário será marcado como membro da Diretoria ACIESC.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
