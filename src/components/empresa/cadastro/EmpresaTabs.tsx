
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmpresaForm from '../EmpresaForm';
import ImportExportEmpresas from '../ImportExportEmpresas';
import { useToast } from '@/hooks/use-toast';

const EmpresaTabs = () => {
  const [activeTab, setActiveTab] = useState("cadastro");
  const { toast } = useToast();

  const handleImportSuccess = () => {
    toast({
      title: "Importação concluída",
      description: "As empresas foram importadas com sucesso.",
    });
    setActiveTab("cadastro");
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="wp-card"
    >
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="cadastro">Cadastro Manual</TabsTrigger>
        <TabsTrigger value="importacao">Importação/Exportação</TabsTrigger>
      </TabsList>
      
      <TabsContent value="cadastro">
        <EmpresaForm />
      </TabsContent>
      
      <TabsContent value="importacao">
        <ImportExportEmpresas
          onImportSuccess={handleImportSuccess}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EmpresaTabs;
