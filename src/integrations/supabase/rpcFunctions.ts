
/**
 * This file contains definitions of RPC functions available in the Supabase project.
 * Add function declarations here as they are defined in the Supabase project.
 */

/**
 * Check if a user has a specific role
 */
export async function hasRole(user_id: string, role_to_check: 'admin' | 'user' | 'empresa') {
  return { 
    user_id, 
    role_to_check 
  };
}

/**
 * Log user activity
 */
export async function logUserActivity(user_id_param: string, event_param: string, created_at_param: string) {
  return {
    user_id_param,
    event_param,
    created_at_param
  };
}

/**
 * Get users from auth schema (requires admin rights)
 * Returns array of user objects with id and email
 * 
 * This is registered with Supabase to be available as an RPC function
 */
export async function get_auth_users() {
  // This is just a type definition for the RPC function
  // The actual implementation is in the Supabase database
  return [] as Array<{ id: string; email: string }>;
}

/**
 * Get current user's role
 * Returns user role enum value
 */
export async function get_current_user_role() {
  // This is just a type definition for the RPC function
  // The actual implementation is in the Supabase database
  return 'user' as 'user' | 'admin' | 'empresa';
}

/**
 * Create a storage bucket with specified parameters
 */
export async function create_storage_bucket(
  name: string, 
  public_access: boolean = false, 
  file_size_limit: number | null = null
) {
  // This is just a type definition for the RPC function
  return { name, public: public_access, file_size_limit };
}

// Make the function names available for TypeScript to recognize in rpc calls
type RpcFunctionNames = 'has_role' | 'get_user_role' | 'get_auth_users' | 'get_current_user_role' | 'create_storage_bucket' | 'log_user_activity';

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(
      fn: RpcFunctionNames,
      params?: object,
      options?: object
    ): Promise<{ data: T; error: null } | { data: null; error: Error }>;
  }
}
