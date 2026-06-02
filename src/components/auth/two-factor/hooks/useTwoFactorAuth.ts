
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { generateSecret, generateQrCodeUrl, generateBackupCodes } from '../utils/totpUtils';

export const useTwoFactorAuth = (userId: string) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { toast } = useToast();
  
  const fetchTwoFactorStatus = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_2fa')
        .select('enabled, secret, backup_codes')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setIsEnabled(data.enabled);
        if (data.enabled && data.backup_codes) {
          setBackupCodes(data.backup_codes);
        }
      }
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTwoFactorStatus();
  }, [userId]);

  const setupNewTotpSecret = async () => {
    const newSecret = generateSecret();
    setSecret(newSecret);
    
    // Create QR code URL
    const user = await supabase.auth.getUser();
    if (user.data.user) {
      const email = user.data.user.email || '';
      const url = generateQrCodeUrl(newSecret, email);
      setQrCodeUrl(url);
    }
    
    return { secret: newSecret, qrCodeUrl };
  };

  const enableTwoFactor = async (verificationCode: string) => {
    try {
      const newBackupCodes = generateBackupCodes();
      
      // Store in database
      const { error } = await supabase
        .from('user_2fa')
        .upsert({ 
          user_id: userId, 
          enabled: true, 
          secret, 
          backup_codes: newBackupCodes,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setBackupCodes(newBackupCodes);
      setIsEnabled(true);
      
      // Log the 2FA activation
      await supabase.from('user_access_logs').insert({
        user_id: userId,
        event: 'Ativação da autenticação de dois fatores',
        created_at: new Date().toISOString()
      });

      return newBackupCodes;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao ativar 2FA",
        description: error.message,
      });
      throw error;
    }
  };

  const disableTwoFactor = async () => {
    try {
      const { error } = await supabase
        .from('user_2fa')
        .update({
          enabled: false,
          secret: null,
          backup_codes: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      setIsEnabled(false);
      setSecret('');
      setBackupCodes([]);
      
      // Log the 2FA deactivation
      await supabase.from('user_access_logs').insert({
        user_id: userId,
        event: 'Desativação da autenticação de dois fatores',
        created_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      throw error;
    }
  };

  const regenerateBackupCodes = async () => {
    try {
      const newBackupCodes = generateBackupCodes();
      
      const { error } = await supabase
        .from('user_2fa')
        .update({
          backup_codes: newBackupCodes,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setBackupCodes(newBackupCodes);
      return; // Return void instead of newBackupCodes
    } catch (error) {
      throw error;
    }
  };

  return {
    isEnabled,
    isLoading,
    secret,
    qrCodeUrl,
    backupCodes,
    setupNewTotpSecret,
    enableTwoFactor,
    disableTwoFactor,
    regenerateBackupCodes,
    setSecret
  };
};
