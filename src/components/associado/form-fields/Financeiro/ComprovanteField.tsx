
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ComprovanteFieldProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ComprovanteField: React.FC<ComprovanteFieldProps> = ({ handleFileChange }) => {
  return (
    <div className="col-span-full">
      <Label htmlFor="comprovantePagamento">Comprovante de Pagamento</Label>
      <div className="flex items-center mt-2">
        <Input
          id="comprovantePagamento"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="max-w-md"
        />
        <p className="text-xs text-muted-foreground ml-2">
          Formatos aceitos: JPG, PNG e PDF
        </p>
      </div>
    </div>
  );
};
