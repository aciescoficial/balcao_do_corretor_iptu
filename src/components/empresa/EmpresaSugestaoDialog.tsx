
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  nome_empresa: z.string().min(3, "Nome da empresa deve ter pelo menos 3 caracteres"),
  cidade: z.string().min(2, "Informe a cidade"),
  estado: z.string().min(2, "Informe o estado").max(2, "Use a sigla do estado (ex: SC)"),
  telefone: z.string().min(10, "Informe um telefone válido"),
  instagram: z.string().optional(),
  site: z.string().optional(),
  contato: z.string().min(3, "Informe o nome do contato"),
  motivo: z.string().min(10, "Por favor descreva o motivo"),
  produtos: z.string().min(5, "Informe os principais produtos"),
});

type FormValues = z.infer<typeof formSchema>;

interface EmpresaSugestaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmpresaSugestaoDialog: React.FC<EmpresaSugestaoDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_empresa: "",
      cidade: "",
      estado: "",
      telefone: "",
      instagram: "",
      site: "",
      contato: "",
      motivo: "",
      produtos: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // In a real implementation, we'd store this in a 'empresa_sugestoes' table
      // For now, we're just simulating success
      console.log("Sugestão recebida:", data);
      
      // Here you would save to database with:
      // const { error } = await supabase.from('empresa_sugestoes').insert(data);
      // if (error) throw error;
      
      toast({
        title: "Sugestão enviada!",
        description: "Obrigado por sua sugestão. Nossa equipe irá analisá-la em breve.",
      });
      
      // Reset the form and close the dialog
      form.reset();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Error submitting suggestion:", error);
      toast({
        title: "Erro ao enviar sugestão",
        description: error.message || "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Sugerir Empresa para Convênio
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da empresa que você gostaria de ver como conveniada da ACIESC.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome_empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proprietário/Nome do Contato*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável ou contato" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade*</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="UF" 
                        {...field} 
                        maxLength={2}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="@perfil" {...field} />
                    </FormControl>
                    <FormDescription>
                      Opcional
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site</FormLabel>
                    <FormControl>
                      <Input placeholder="www.exemplo.com.br" {...field} />
                    </FormControl>
                    <FormDescription>
                      Opcional
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Por que você gostaria de ter essa empresa associada à ACIESC?*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva brevemente o motivo da sugestão..." 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="produtos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quais os principais produtos dessa empresa?*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste os principais produtos ou serviços..." 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Enviar Sugestão
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmpresaSugestaoDialog;
