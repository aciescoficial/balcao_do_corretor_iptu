import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';

interface EmpresaImageUploadProps {
  onImageUpload: (url: string) => void;
  existingImageUrl?: string | null;
}

export const EmpresaImageUpload: React.FC<EmpresaImageUploadProps> = ({ onImageUpload, existingImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(existingImageUrl || null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'aciesc_logos');

      const response = await fetch('https://api.cloudinary.com/v1_1/dvc3ovcoc/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      onImageUpload(data.secure_url);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onImageUpload('');
  };

  return (
    <div>
      {imageUrl ? (
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <img src={imageUrl} alt="Logo da empresa" className="object-cover w-full h-full" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 shadow-md"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label htmlFor="image-upload" className="relative cursor-pointer">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200">
            {uploading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
};
