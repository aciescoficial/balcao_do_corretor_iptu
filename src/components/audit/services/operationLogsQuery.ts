
import { supabase } from '@/integrations/supabase/client';
import { OperationLog, OperationLogQuery } from './operationLogTypes';

/**
 * Get operation logs with optional filtering
 */
export async function getOperationLogs(options: OperationLogQuery = {}) {
  try {
    const {
      limit = 100,
      offset = 0,
      user_id,
      entity_type,
      event_type,
      startDate,
      endDate,
    } = options;

    // First check if the table exists
    const { error: checkError } = await supabase
      .from('operation_logs')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === '42P01') { // 42P01 is PostgreSQL's code for "relation does not exist"
      console.error('Operation logs table does not exist:', checkError);
      return { logs: [], count: 0, error: 'Table operation_logs does not exist' };
    }

    // Proceed with the actual query
    let query = supabase
      .from('operation_logs')
      .select(`
        id, 
        event_type, 
        entity_type, 
        details, 
        record_count, 
        format, 
        created_at, 
        user_id
      `, { count: 'exact' })
      .order('created_at', { ascending: false });
    
    // Add pagination if not fetching all logs
    if (limit > 0) {
      query = query.range(offset, offset + limit - 1);
    }

    // Apply filters if provided
    if (user_id) query = query.eq('user_id', user_id);
    if (entity_type) query = query.eq('entity_type', entity_type);
    if (event_type) query = query.eq('event_type', event_type);
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching operation logs:', error);
      return { logs: [], count: 0, error: error.message };
    }

    // Get user names in a separate query for logs with user_id
    const userIds = data?.filter(log => log.user_id).map(log => log.user_id) || [];
    
    let userMap: Record<string, { name: string | null }> = {};
    
    if (userIds.length > 0) {
      try {
        const { data: userData } = await supabase
          .from('user')
          .select('id, name')
          .in('id', userIds);
        
        // Create a map of user_id to user name
        userMap = (userData || []).reduce((acc, user) => {
          acc[user.id] = { name: user.name };
          return acc;
        }, {} as Record<string, { name: string | null }>);
      } catch (userError) {
        console.warn('Error fetching user details:', userError);
      }
    }

    // Format data for display
    const formattedLogs: OperationLog[] = data?.map(log => {
      // Get user info from map or default to unknown
      const userData = log.user_id ? userMap[log.user_id] : null;
      const userName = userData?.name || 'Unknown';
      
      return {
        id: log.id,
        eventType: log.event_type,
        entityType: log.entity_type,
        details: log.details,
        recordCount: log.record_count,
        format: log.format,
        createdAt: new Date(log.created_at).toLocaleString(),
        userName: userName,
        userId: log.user_id,
        created_at: log.created_at,
        user: userData ? { name: userData.name } : null
      };
    }) || [];

    return { 
      logs: formattedLogs || [], 
      count: count || 0,
      error: null 
    };
  } catch (error: any) {
    console.error('Error in getOperationLogs:', error);
    return { 
      logs: [], 
      count: 0, 
      error: error.message || 'Erro desconhecido ao buscar logs' 
    };
  }
}
