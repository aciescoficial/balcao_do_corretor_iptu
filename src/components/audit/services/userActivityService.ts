
import { supabase } from '@/integrations/supabase/client';

/**
 * Log a user access event
 * @param userId User ID
 * @param event Event description
 * @param isLoginEvent Whether this is a true login event or just a page access
 * @returns Promise resolving to success status
 */
export const logUserActivity = async (userId: string, event: string, isLoginEvent: boolean = false): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_access_logs')
      .insert({ 
        user_id: userId, 
        event,
        is_login: isLoginEvent 
      });
      
    if (error) {
      console.error('Error logging user activity:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception logging user activity:', error);
    return false;
  }
};

/**
 * Log system access event when user logs in
 * @param userId User ID
 * @returns Promise resolving to success status
 */
export const logSystemAccess = async (userId: string): Promise<boolean> => {
  return logUserActivity(userId, 'Acesso ao sistema', true);
};

/**
 * Log profile update event
 * @param userId User ID
 * @returns Promise resolving to success status
 */
export const logProfileUpdate = async (userId: string): Promise<boolean> => {
  return logUserActivity(userId, 'Atualização de perfil');
};

/**
 * Log password change event
 * @param userId User ID
 * @returns Promise resolving to success status
 */
export const logPasswordChange = async (userId: string): Promise<boolean> => {
  return logUserActivity(userId, 'Alteração de senha');
};

/**
 * Log entity linking event (Associado or Empresa)
 * @param userId User ID
 * @param entityType Type of entity ('associado' or 'empresa')
 * @returns Promise resolving to success status
 */
export const logEntityLinking = async (userId: string, entityType: 'associado' | 'empresa'): Promise<boolean> => {
  return logUserActivity(userId, `Vinculação de ${entityType}`);
};
