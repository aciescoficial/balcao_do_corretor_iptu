
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface AssociationType {
  id: string;
  title: string;
  value: number;
  description: string | null;
  payment_methods: string[];
  max_installments: number;
  active: boolean;
}

interface AssociationTypeSelectorProps {
  onSelect: (type: AssociationType | null) => void;
  selectedTypeId: string | null;
}

const AssociationTypeSelector: React.FC<AssociationTypeSelectorProps> = ({ onSelect, selectedTypeId }) => {
  const [associationTypes, setAssociationTypes] = useState<AssociationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssociationTypes() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('association_types')
          .select('*')
          .eq('active', true)
          .order('title');

        if (error) throw error;

        setAssociationTypes(data || []);
      } catch (err: any) {
        console.error('Error fetching association types:', err);
        setError(err.message || 'Failed to load association types');
      } finally {
        setLoading(false);
      }
    }

    fetchAssociationTypes();
  }, []);

  const handleChange = (value: string) => {
    const selectedType = associationTypes.find(type => type.id === value) || null;
    onSelect(selectedType);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Carregando tipos de associação...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  if (associationTypes.length === 0) {
    return <div className="text-amber-500 text-sm">Nenhum tipo de associação encontrado. Por favor, cadastre pelo menos um tipo ativo.</div>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="associationType">Tipo de Associação</Label>
      <Select value={selectedTypeId || ''} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um tipo de associação" />
        </SelectTrigger>
        <SelectContent>
          {associationTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.title} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(type.value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AssociationTypeSelector;
