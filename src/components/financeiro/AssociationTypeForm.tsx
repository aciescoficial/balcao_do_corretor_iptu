
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  PaymentMethodOption, 
  InterestPaymentByOption, 
  formatCurrency 
} from './utils';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { generatePaymentLink, generateSubscriptionLink } from './services/asaasService';
import { InterestPaymentBy, PaymentMethod } from './types';

const formSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  value: z.number().positive('O valor deve ser maior que zero'),
  payment_methods: z.array(z.enum(['cartao', 'boleto', 'pix'])).min(1, 'Selecione pelo menos um método de pagamento'),
  max_installments: z.number().int().min(1, 'Mínimo de 1 parcela').optional(),
  interest_payment_by: z.enum(['associado', 'associacao']).optional(),
  active: z.boolean().default(true),
});

const paymentMethods: PaymentMethodOption[] = [
  { value: 'cartao', label: 'Cartão de Crédito' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'pix', label: 'PIX' },
];

const interestPaymentOptions: InterestPaymentByOption[] = [
  { value: 'associado', label: 'Associado' },
  { value: 'associacao', label: 'Associação' },
];

interface AssociationTypeFormProps {
  onSuccess: () => void;
  initialData?: {
    title: string;
    description: string;
    value: number;
    payment_methods: PaymentMethod[];
    max_installments: number;
    interest_payment_by: InterestPaymentBy;
    active: boolean;
  };
  id?: string;
}

const AssociationTypeForm: React.FC<AssociationTypeFormProps> = ({
  onSuccess,
  initialData,
  id
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>(
    initialData?.payment_methods || []
  );
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [subscriptionLink, setSubscriptionLink] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      value: initialData?.value || 0,
      payment_methods: initialData?.payment_methods || [],
      max_installments: initialData?.max_installments || 1,
      interest_payment_by: initialData?.interest_payment_by || 'associado',
      active: initialData?.active ?? true,
    }
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title, // Ensure title is defined (not optional)
        value: data.value, // Ensure value is defined (not optional)
        description: data.description,
        payment_methods: data.payment_methods as PaymentMethod[],
        max_installments: data.max_installments || 1,
        interest_payment_by: data.interest_payment_by as InterestPaymentBy,
        active: data.active,
        updated_at: new Date().toISOString(),
      };

      let response;
      if (id) {
        response = await supabase
          .from('association_types')
          .update(payload)
          .eq('id', id)
          .select();
      } else {
        response = await supabase
          .from('association_types')
          .insert(payload)
          .select();
      }

      if (response.error) throw response.error;

      toast({
        title: id ? "Tipo de associação atualizado" : "Tipo de associação criado",
        description: `${data.title} foi ${id ? "atualizado" : "criado"} com sucesso.`
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o tipo de associação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLinks = async () => {
    try {
      setIsGeneratingLink(true);
      
      const formData = form.getValues();
      
      if (!formData.title || !formData.value || formData.payment_methods.length === 0) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha o título, valor e selecione pelo menos um método de pagamento.",
          variant: "destructive"
        });
        return;
      }

      const tempAssociationType = {
        id: id || '',
        title: formData.title,
        description: formData.description || '',
        value: formData.value,
        payment_methods: formData.payment_methods as PaymentMethod[],
        max_installments: formData.max_installments || 1,
        interest_payment_by: formData.interest_payment_by as InterestPaymentBy || 'associado',
        active: formData.active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const paymentLinkUrl = await generatePaymentLink(tempAssociationType);
      setPaymentLink(paymentLinkUrl);
      
      const subscriptionLinkUrl = await generateSubscriptionLink(tempAssociationType);
      setSubscriptionLink(subscriptionLinkUrl);
      
      toast({
        title: "Links gerados",
        description: "Links de pagamento gerados com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar links",
        description: error.message || "Não foi possível gerar os links de pagamento",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copiado",
      description: `Link de ${type} copiado para a área de transferência`
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="value">Valor</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            {...form.register('value', { valueAsNumber: true })}
          />
          {form.formState.errors.value && (
            <p className="text-red-500 text-sm">{form.formState.errors.value.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...form.register('description')}
        />
      </div>
      
      <div className="space-y-4">
        <Label>Métodos de Pagamento</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {paymentMethods.map((method) => (
            <div key={method.value} className="flex items-center space-x-2">
              <Checkbox
                id={`payment-${method.value}`}
                checked={selectedPaymentMethods.includes(method.value)}
                onCheckedChange={(checked) => {
                  const newMethods = checked
                    ? [...selectedPaymentMethods, method.value]
                    : selectedPaymentMethods.filter(m => m !== method.value);
                  
                  setSelectedPaymentMethods(newMethods);
                  form.setValue('payment_methods', newMethods as PaymentMethod[]);
                }}
              />
              <Label htmlFor={`payment-${method.value}`} className="cursor-pointer">
                {method.label}
              </Label>
            </div>
          ))}
        </div>
        {form.formState.errors.payment_methods && (
          <p className="text-red-500 text-sm">{form.formState.errors.payment_methods.message as string}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_installments">Número Máximo de Parcelas</Label>
          <Input
            id="max_installments"
            type="number"
            min="1"
            {...form.register('max_installments', { valueAsNumber: true })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interest_payment_by">Juros pagos por</Label>
          <div className="grid grid-cols-2 gap-2">
            {interestPaymentOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`interest-${option.value}`}
                  value={option.value}
                  {...form.register('interest_payment_by')}
                  className="rounded-full h-4 w-4 text-primary"
                />
                <Label htmlFor={`interest-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={form.getValues('active')}
          onCheckedChange={(checked) => form.setValue('active', checked)}
        />
        <Label htmlFor="active">Ativo</Label>
      </div>
      
      <div className="flex flex-col space-y-4 mt-6">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGenerateLinks}
          disabled={isGeneratingLink}
        >
          {isGeneratingLink ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando links de pagamento...
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              Gerar Links de Pagamento
            </>
          )}
        </Button>
        
        {paymentLink && (
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm font-medium mb-1">Link de Pagamento (único):</p>
            <div className="flex items-center">
              <input 
                type="text" 
                readOnly 
                value={paymentLink} 
                className="w-full text-sm bg-white border rounded px-2 py-1"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(paymentLink, "pagamento único")}
                className="ml-2"
              >
                Copiar
              </Button>
            </div>
          </div>
        )}
        
        {subscriptionLink && (
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm font-medium mb-1">Link de Assinatura (recorrente):</p>
            <div className="flex items-center">
              <input 
                type="text" 
                readOnly 
                value={subscriptionLink} 
                className="w-full text-sm bg-white border rounded px-2 py-1"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(subscriptionLink, "assinatura")}
                className="ml-2"
              >
                Copiar
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end pt-6">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : id ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};

export default AssociationTypeForm;
