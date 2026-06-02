import React, { useState } from 'react';
import { CarteirinhaSolicitacao } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil } from 'lucide-react';

interface SolicitacaoEditDialogProps {
  solicitacao: CarteirinhaSolicitacao;
  onUpdate: (id: string, data: Partial<CarteirinhaSolicitacao>) => Promise<boolean>;
  onSuccess: () => void;
}

export const SolicitacaoEditDialog: React.FC<SolicitacaoEditDialogProps> = ({
  solicitacao,
  onUpdate,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    status: solicitacao.status,
    codigo_rastreio: solicitacao.codigo_rastreio || '',
    observacoes: solicitacao.observacoes || '',
  });

  const statusOptions = [
    { value: 'pendente_pagamento', label: 'Pendente Pagamento' },
    { value: 'pagamento_aprovado', label: 'Pagamento Aprovado' },
    { value: 'em_producao', label: 'Em Produção' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onUpdate(solicitacao.id, {
        status: formData.status,
        codigo_rastreio: formData.codigo_rastreio || null,
        observacoes: formData.observacoes || null,
      });
      
      if (success) {
        setIsOpen(false);
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao atualizar solicitação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar Solicitação</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Atualizar Solicitação</DialogTitle>
          <DialogDescription>
            Edite as informações da solicitação de carteirinha
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="codigo_rastreio">Código de Rastreio</Label>
              <Input
                id="codigo_rastreio"
                name="codigo_rastreio"
                value={formData.codigo_rastreio}
                onChange={handleChange}
                placeholder="Digite o código de rastreio"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Digite observações adicionais"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
