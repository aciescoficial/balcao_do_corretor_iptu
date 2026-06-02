
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logUserActivity } from '@/components/audit/services/userActivityService';
import { ImageCropper } from './ImageCropper';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface AvatarUploadProps {
  user: any;
  avatarUrl: string | null;
  onAvatarUpdate: (url: string | null) => void;
}

export const AvatarUpload = ({ user, avatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);
  const [showSizeAlert, setShowSizeAlert] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const { toast } = useToast();
  
  const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
  const RECOMMENDED_SIZE = "400x400";
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    const file = e.target.files[0];
    
    // Validate file size
    if (file.size > FILE_SIZE_LIMIT) {
      setShowSizeAlert(true);
      return;
    }
    
    // Create object URL for the cropper
    const objectUrl = URL.createObjectURL(file);
    setCroppingImage(objectUrl);
    setFileToCrop(file);
  };
  
  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!fileToCrop) return;
    
    setIsUploadingAvatar(true);
    setCroppingImage(null);
    
    try {
      // Create a new file from the cropped blob
      const fileExt = fileToCrop.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const croppedFile = new File([croppedBlob], fileName, { type: `image/${fileExt}` });
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, croppedFile, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update user with avatar URL
      const { error: updateError } = await supabase
        .from('user')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Log user activity
      await logUserActivity(user.id, 'Atualização de foto de perfil');
      
      onAvatarUpdate(data.publicUrl);
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar foto",
        description: error.message || "Não foi possível atualizar a foto de perfil.",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Clean up object URL
      if (croppingImage) {
        URL.revokeObjectURL(croppingImage);
      }
    }
  };
  
  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;
    
    setIsRemovingAvatar(true);
    try {
      // Update user to remove avatar URL
      const { error: updateError } = await supabase
        .from('user')
        .update({ avatar_url: null })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Try to remove file from storage (optional, won't fail if file doesn't exist)
      const filePath = `${user.id}/avatar.`;
      try {
        await supabase
          .storage
          .from('avatars')
          .remove([`${filePath}png`, `${filePath}jpg`, `${filePath}jpeg`]);
      } catch (storageError) {
        console.warn('Failed to remove avatar from storage:', storageError);
        // Don't throw error here, as the DB update is the critical part
      }
      
      // Log user activity
      await logUserActivity(user.id, 'Remoção de foto de perfil');
      
      onAvatarUpdate(null);
      
      toast({
        title: "Foto removida",
        description: "Sua foto de perfil foi removida com sucesso.",
      });
    } catch (error: any) {
      console.error('Avatar removal error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover foto",
        description: error.message || "Não foi possível remover a foto de perfil.",
      });
    } finally {
      setIsRemovingAvatar(false);
    }
  };
  
  const handleCropCancel = () => {
    if (croppingImage) {
      URL.revokeObjectURL(croppingImage);
    }
    setCroppingImage(null);
    setFileToCrop(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24 border-2 border-aciesc-primary">
          <AvatarImage src={avatarUrl || undefined} alt="User avatar" />
          <AvatarFallback>
            {user.email?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 right-0 flex gap-1">
          <label 
            htmlFor="avatar-upload" 
            className="bg-aciesc-primary text-white rounded-full p-1.5 cursor-pointer hover:bg-aciesc-dark transition-colors"
          >
            <Camera className="h-4 w-4" />
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileSelect}
              disabled={isUploadingAvatar || isRemovingAvatar}
            />
          </label>
          
          {avatarUrl && (
            <button 
              type="button" 
              onClick={handleRemoveAvatar}
              disabled={isUploadingAvatar || isRemovingAvatar}
              className="bg-red-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-red-600 transition-colors"
              aria-label="Remover foto"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {(isUploadingAvatar || isRemovingAvatar) && (
        <p className="text-xs text-muted-foreground">
          {isUploadingAvatar ? "Enviando..." : "Removendo..."}
        </p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Tamanho recomendado: {RECOMMENDED_SIZE} pixels. Máx: 5MB
      </p>
      
      {croppingImage && (
        <ImageCropper 
          imageUrl={croppingImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
        />
      )}
      
      <AlertDialog open={showSizeAlert} onOpenChange={setShowSizeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivo muito grande</AlertDialogTitle>
            <AlertDialogDescription>
              O arquivo selecionado é muito grande. Por favor, escolha uma imagem com até 5MB.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSizeAlert(false)}>Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
