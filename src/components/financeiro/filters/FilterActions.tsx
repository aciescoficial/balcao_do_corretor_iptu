
import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  activeFiltersCount: number;
  onApply: () => void;
  onClear: () => void;
}

export const FilterActions: React.FC<FilterActionsProps> = ({
  activeFiltersCount,
  onApply,
  onClear
}) => {
  return (
    <div className="flex justify-end gap-4 mt-8">
      <Button 
        variant="outline" 
        onClick={onClear}
      >
        Limpar filtros
      </Button>
      <Button onClick={onApply}>
        Aplicar {activeFiltersCount} filtros
      </Button>
    </div>
  );
};
