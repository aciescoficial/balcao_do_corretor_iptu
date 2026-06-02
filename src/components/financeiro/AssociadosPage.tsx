
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AssociationTypeForm from './AssociationTypeForm';
import AssociationTypesList from './AssociationTypesList';
import { AssociationType } from './types';

const AssociadosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingAssociationType, setEditingAssociationType] = useState<AssociationType | null>(null);
  
  const handleEditAssociationType = (associationType: AssociationType) => {
    setEditingAssociationType(associationType);
    setActiveTab('form');
  };
  
  const handleFormSuccess = () => {
    setEditingAssociationType(null);
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="wp-header">Associados</h1>
        
        {activeTab === 'list' && (
          <Button onClick={() => setActiveTab('form')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Tipo de Associado
          </Button>
        )}
      </div>
      
      <div className="wp-card">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Listar Tipos de Associação</TabsTrigger>
            <TabsTrigger value="form">
              {editingAssociationType ? 'Editar Tipo de Associação' : 'Cadastrar Novo Tipo'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-6">
            <AssociationTypesList onEdit={handleEditAssociationType} />
          </TabsContent>
          
          <TabsContent value="form" className="mt-6">
            <AssociationTypeForm
              onSuccess={handleFormSuccess}
              initialData={editingAssociationType ? {
                title: editingAssociationType.title,
                description: editingAssociationType.description || '',
                value: editingAssociationType.value,
                payment_methods: editingAssociationType.payment_methods,
                max_installments: editingAssociationType.max_installments || 1,
                interest_payment_by: editingAssociationType.interest_payment_by || 'associado',
                active: editingAssociationType.active
              } : undefined}
              id={editingAssociationType?.id}
            />
            
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingAssociationType(null);
                  setActiveTab('list');
                }}
              >
                Cancelar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssociadosPage;
