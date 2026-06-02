
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DadosPessoaisForm } from "./DadosPessoaisForm";
import { EnderecoForm } from "./EnderecoForm";
import { ContatoForm } from "./ContatoForm";
import { FinanceiroForm } from "./FinanceiroForm";
import { VeiculoForm } from "./VeiculoForm";
import { useAssociadoForm } from './hooks/useAssociadoForm';
import { AssociadoFormNavigation } from './components/AssociadoFormNavigation';

const AssociadoForm: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    submitting,
    fotoPreview,
    form,
    handleFotoUpload,
    handleFotoRemove,
    handleFormSubmit
  } = useAssociadoForm();
  
  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="endereco">Endereço</TabsTrigger>
          <TabsTrigger value="veiculo">Veículo</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dados-pessoais">
          <DadosPessoaisForm 
            form={form} 
            fotoPreview={fotoPreview}
            onFotoUpload={handleFotoUpload}
            onFotoRemove={handleFotoRemove}
          />
          <AssociadoFormNavigation 
            activeTab={activeTab} 
            onChangeTab={setActiveTab} 
            isSubmitting={submitting}
            isLastTab={false}
          />
        </TabsContent>
        
        <TabsContent value="contato">
          <ContatoForm form={form} />
          <AssociadoFormNavigation 
            activeTab={activeTab} 
            onChangeTab={setActiveTab} 
            isSubmitting={submitting}
            isLastTab={false}
          />
        </TabsContent>
        
        <TabsContent value="endereco">
          <EnderecoForm form={form} />
          <AssociadoFormNavigation 
            activeTab={activeTab} 
            onChangeTab={setActiveTab} 
            isSubmitting={submitting}
            isLastTab={false}
          />
        </TabsContent>
        
        <TabsContent value="veiculo">
          <VeiculoForm form={form} />
          <AssociadoFormNavigation 
            activeTab={activeTab} 
            onChangeTab={setActiveTab} 
            isSubmitting={submitting}
            isLastTab={false}
          />
        </TabsContent>
        
        <TabsContent value="financeiro">
          <FinanceiroForm form={form} />
          <AssociadoFormNavigation 
            activeTab={activeTab} 
            onChangeTab={setActiveTab} 
            isSubmitting={submitting}
            isLastTab={true}
          />
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default AssociadoForm;
