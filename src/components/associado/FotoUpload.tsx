
import React from 'react';
import { Image } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface FotoUploadProps {
  fotoPreview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  register: any;
}

export const FotoUpload: React.FC<FotoUploadProps> = ({ fotoPreview, onUpload, onRemove, register }) => {
  return (
    <div className="w-32">
      <Label htmlFor="foto" className="mb-2 block">Foto</Label>
      <div className="relative h-40 w-32 border rounded-md flex flex-col items-center justify-center overflow-hidden bg-gray-50">
        {fotoPreview ? (
          <>
            <img 
              src={fotoPreview} 
              alt="Preview" 
              className="object-cover h-full w-full"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </>
        ) : (
          <>
            <Image size={24} className="text-gray-400 mb-1" />
            <label 
              htmlFor="foto-upload" 
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Adicionar foto
            </label>
          </>
        )}
        <input 
          id="foto-upload"
          type="file" 
          {...register('foto')}
          accept="image/*"
          onChange={onUpload}
          className="sr-only"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">JPG ou PNG. Máx 1MB</p>
    </div>
  );
};
