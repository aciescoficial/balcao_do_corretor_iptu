
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

/**
 * File storage operations for associados
 */

export const uploadFoto = async (id: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}.${fileExt}`;
    
    // Verificar se o bucket existe
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    let bucketExists = false;
    if (buckets) {
      bucketExists = buckets.some(bucket => bucket.name === 'associados');
    }
    
    // Criar bucket se não existir
    if (!bucketExists) {
      await supabase
        .storage
        .createBucket('associados', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        });
    }
    
    const { error } = await supabase
      .storage
      .from('associados')
      .upload(fileName, file, {
        upsert: true
      });
      
    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    
    // Get public URL
    const { data: publicUrl } = supabase
      .storage
      .from('associados')
      .getPublicUrl(fileName);
      
    return publicUrl.publicUrl;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao fazer upload da foto:", errorMsg);
    throw error;
  }
};

export const uploadComprovante = async (id: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `comprovante-${id}.${fileExt}`;
    
    // Verificar se o bucket existe
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
    
    let bucketExists = false;
    if (buckets) {
      bucketExists = buckets.some(bucket => bucket.name === 'comprovantes');
    }
    
    // Criar bucket se não existir
    if (!bucketExists) {
      await supabase
        .storage
        .createBucket('comprovantes', {
          public: false, // Comprovantes ficam privados por segurança
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
        });
    }
    
    const { error } = await supabase
      .storage
      .from('comprovantes')
      .upload(fileName, file, {
        upsert: true
      });
      
    if (error) {
      console.error("Error uploading payment receipt:", error);
      throw error;
    }
    
    // Use the Edge Function to update the metadata
    await supabase.functions.invoke('update-associado-metadata', {
      body: {
        associado_id: id,
        meta_key: 'comprovante_url',
        meta_value: fileName
      }
    }).catch(err => {
      console.warn("Function error, using alternative approach:", err);
      
      // Alternative: Store as part of an existing text field
      return supabase
        .from('associados')
        .update({
          // Store comprovante info in an existing field as JSON string
          tipo_pagamento: JSON.stringify({
            method: 'comprovante',
            url: fileName,
            date: new Date().toISOString()
          })
        })
        .eq('id', id);
    });
    
    return fileName;
  } catch (error) {
    const errorMsg = handleSupabaseError(error);
    console.error("Erro ao fazer upload do comprovante:", errorMsg);
    throw error;
  }
};
