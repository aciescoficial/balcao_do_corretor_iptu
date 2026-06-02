
import { supabase } from '@/integrations/supabase/client';
import { LogOperationParams } from './operationLogTypes';

/**
 * Logs an operation in the database for audit purposes
 * @param params Operation parameters to log
 */
export async function logOperation(params: LogOperationParams): Promise<void> {
  try {
    const { eventType, entityType, details, recordCount, format } = params;
    
    // Get current user
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    // Log the operation
    await supabase
      .from('operation_logs')
      .insert({
        user_id: userId,
        event_type: eventType,
        entity_type: entityType,
        details: details || null,
        record_count: recordCount || null,
        format: format || null,
      });
    
    console.log('Operation logged successfully:', { eventType, entityType });
  } catch (error) {
    console.error('Failed to log operation:', error);
    // Don't throw - we don't want to interrupt the main flow if logging fails
  }
}
