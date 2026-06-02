
import { useState, useEffect } from 'react';
import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ConveniadoFormData } from '../types';

export const useFotoUpload = (
  watch: UseFormWatch<ConveniadoFormData>,
  setValue: UseFormSetValue<ConveniadoFormData>
) => {
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fotoFile = watch('foto');
  
  useEffect(() => {
    if (fotoFile && fotoFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(fotoFile[0]);
    }
  }, [fotoFile]);

  const removeFoto = () => {
    setValue('foto', undefined);
    setFotoPreview(null);
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This is handled by the useEffect watching fotoFile
  };

  return {
    fotoPreview,
    removeFoto,
    handleFotoUpload
  };
};
