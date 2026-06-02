
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface CardActionsProps {
  onPrint: () => void;
  onDownload: () => void;
}

const CardActions: React.FC<CardActionsProps> = ({ onPrint, onDownload }) => {
  return (
    <div className="mt-4 flex space-x-3">
      <Button 
        className="flex items-center gap-2"
        onClick={onPrint}
        aria-label="Imprimir carteirinha"
      >
        <Printer size={18} />
        Imprimir
      </Button>
      <Button 
        variant="outline"
        onClick={onDownload}
        aria-label="Baixar carteirinha em PDF"
        className="flex items-center gap-2"
      >
        <Download size={18} />
        Download PDF
      </Button>
    </div>
  );
};

export default CardActions;
