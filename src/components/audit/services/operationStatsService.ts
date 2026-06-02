
import { supabase } from '@/integrations/supabase/client';
import { OperationStats } from './operationLogTypes';

/**
 * Get statistics about operations
 */
export async function getOperationStats(): Promise<OperationStats> {
  try {
    // Get count of operations by type in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Use separate count queries instead of group
    const { data: statsData, error: statsError } = await supabase
      .from('operation_logs')
      .select('event_type, id')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (statsError) throw statsError;
    
    // Process the data to get counts by type
    const statsByType = statsData ? 
      Array.from(
        statsData.reduce((acc, curr) => {
          const count = (acc.get(curr.event_type) || 0) + 1;
          acc.set(curr.event_type, count);
          return acc;
        }, new Map())
      ).map(([event_type, count]) => ({ event_type, count })) : [];
    
    // Get count of operations by entity
    const { data: entityData, error: entityError } = await supabase
      .from('operation_logs')
      .select('entity_type, id')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (entityError) throw entityError;
    
    // Process the data to get counts by entity type
    const statsByEntity = entityData ? 
      Array.from(
        entityData.reduce((acc, curr) => {
          const count = (acc.get(curr.entity_type) || 0) + 1;
          acc.set(curr.entity_type, count);
          return acc;
        }, new Map())
      ).map(([entity_type, count]) => ({ entity_type, count })) : [];
    
    // Get most active users
    const { data: userData, error: usersError } = await supabase
      .from('operation_logs')
      .select(`user_id, user:user_id (name)`)
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    if (usersError) throw usersError;
    
    // Process the data to get user activity counts with null checks
    const userCounts = userData ? 
      Array.from(
        userData.reduce((acc, curr) => {
          const count = (acc.get(curr.user_id) || 0) + 1;
          
          // Safely extract user name with proper null checks
          let userName = 'Unknown';
          
          // Use the proper null check with type guard
          if (curr.user !== null && typeof curr.user === 'object') {
            // Use optional chaining with type assertion for safety
            const userObj = curr.user as { name?: string | null };
            userName = userObj?.name || 'Unknown';
          }
          
          acc.set(curr.user_id, {
            count,
            name: userName
          });
          return acc;
        }, new Map())
      ).map(([user_id, data]) => ({
        id: user_id,
        name: data.name,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) : [];
    
    return {
      byType: statsByType,
      byEntity: statsByEntity,
      activeUsers: userCounts
    };
  } catch (error) {
    console.error('Error fetching operation stats:', error);
    throw error;
  }
}
