
import React from 'react';
import { Eye, RotateCw, Printer, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import IdCard from './IdCard';
import { ConveniadoData, CardSettings } from './types';

interface CardPreviewPanelProps {
  selectedConveniado: ConveniadoData | null;
  cardView: 'front' | 'back';
  setCardView: React.Dispatch<React.SetStateAction<'front' | 'back'>>;
  cardSettings: CardSettings;
  handlePrint: () => void;
  handleDownload: () => void;
}

const CardPreviewPanel: React.FC<CardPreviewPanelProps> = ({
  selectedConveniado,
  cardView,
  setCardView,
  cardSettings,
  handlePrint,
  handleDownload
}) => {
  const toggleCardView = () => {
    setCardView(prev => prev === 'front' ? 'back' : 'front');
  };

  return (
    <div className="wp-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="wp-subheader mb-0">Previsualização da Carteirinha</h2>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <button className="wp-button-secondary flex items-center gap-1">
                <Eye size={18} />
                {cardView === 'front' ? 'Ver Frente' : 'Ver Verso'}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <IdCard 
                selectedConveniado={selectedConveniado} 
                cardView={cardView} 
                cardSettings={cardSettings} 
                preview={true} 
              />
            </DialogContent>
          </Dialog>
          
          <button
            onClick={toggleCardView}
            className="flex items-center gap-1 text-sm text-wp-primary hover:text-wp-primary-hover"
            aria-label={cardView === 'front' ? 'Alternar para verso da carteirinha' : 'Alternar para frente da carteirinha'}
          >
            <RotateCw size={16} />
            {cardView === 'front' ? 'Alternar para Verso' : 'Alternar para Frente'}
          </button>
        </div>
      </div>

      <Tabs value={cardView} onValueChange={(value) => setCardView(value as 'front' | 'back')} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="front" className="flex-1">Frente</TabsTrigger>
          <TabsTrigger value="back" className="flex-1">Verso</TabsTrigger>
        </TabsList>
        
        <TabsContent value="front" className="mt-0">
          <IdCard selectedConveniado={selectedConveniado} cardView="front" cardSettings={cardSettings} />
        </TabsContent>
        
        <TabsContent value="back" className="mt-0">
          <IdCard selectedConveniado={selectedConveniado} cardView="back" cardSettings={cardSettings} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 flex space-x-3">
        <button 
          className="wp-button flex items-center gap-2"
          onClick={handlePrint}
          aria-label="Imprimir carteirinha"
        >
          <Printer size={18} />
          Imprimir
        </button>
        <button 
          className="wp-button-secondary flex items-center gap-2"
          onClick={handleDownload}
          aria-label="Baixar carteirinha em PDF"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CardPreviewPanel;
