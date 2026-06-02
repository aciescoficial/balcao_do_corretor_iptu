
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AssociationType, PaymentMethod } from './types';
import { RefreshCw, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatCurrency } from './utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AssociationTypesListProps {
  onEdit: (associationType: AssociationType) => void;
}

const AssociationTypesList: React.FC<AssociationTypesListProps> = ({ onEdit }) => {
  const [associationTypes, setAssociationTypes] = useState<AssociationType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssociationTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('association_types')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAssociationTypes(data as AssociationType[]);
    } catch (error) {
      console.error('Error fetching association types:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os tipos de associação.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociationTypes();
  }, []);

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('association_types')
        .update({ active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      setAssociationTypes(prev => 
        prev.map(item => 
          item.id === id ? { ...item, active: !currentStatus } : item
        )
      );
      
      toast({
        title: 'Status atualizado',
        description: `Tipo de associação ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tipo de associação? Esta ação não pode ser desfeita.')) {
      try {
        const { error } = await supabase
          .from('association_types')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setAssociationTypes(prev => prev.filter(item => item.id !== id));
        
        toast({
          title: 'Removido com sucesso',
          description: 'Tipo de associação removido com sucesso.',
        });
      } catch (error) {
        console.error('Error deleting association type:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível remover o tipo de associação.',
          variant: 'destructive',
        });
      }
    }
  };

  const getPaymentMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'cartao':
        return <Badge variant="outline" className="mr-1 bg-blue-100">Cartão</Badge>;
      case 'pix':
        return <Badge variant="outline" className="mr-1 bg-green-100">PIX</Badge>;
      case 'boleto':
        return <Badge variant="outline" className="mr-1 bg-yellow-100">Boleto</Badge>;
      default:
        return <Badge variant="outline" className="mr-1">{method}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => fetchAssociationTypes()}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Formas de Pagamento</TableHead>
              <TableHead>Parcelas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : associationTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum tipo de associação encontrado.
                </TableCell>
              </TableRow>
            ) : (
              associationTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">
                    {type.title}
                    {type.description && (
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(type.value)}</TableCell>
                  <TableCell>
                    {type.payment_methods.map((method, i) => (
                      <span key={i}>{getPaymentMethodBadge(method)}</span>
                    ))}
                  </TableCell>
                  <TableCell>
                    {type.payment_methods.includes('cartao') ? (
                      <>
                        {type.max_installments || 1}x
                        <p className="text-xs text-muted-foreground">
                          Juros: {type.interest_payment_by === 'associacao' ? 'Associação' : 'Associado'}
                        </p>
                      </>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {type.active ? (
                      <Badge className="bg-green-500">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleActiveStatus(type.id, type.active)}
                        title={type.active ? 'Desativar' : 'Ativar'}
                      >
                        {type.active ? (
                          <ToggleRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(type)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(type.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssociationTypesList;
