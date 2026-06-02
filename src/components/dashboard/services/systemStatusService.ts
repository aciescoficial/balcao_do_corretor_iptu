
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface SystemStatus {
  asaas: { active: boolean; message: string };
  stripe: { active: boolean; message: string };
  emails: { active: boolean; message: string };
}

/**
 * Checks the status of system integrations
 * @param retries Number of retry attempts
 */
export const checkSystemStatus = async (retries = 1): Promise<SystemStatus> => {
  try {
    // Default values in case of errors
    const defaultStatus: SystemStatus = {
      asaas: { active: false, message: 'Verificação falhou' },
      stripe: { active: false, message: 'Verificação falhou' },
      emails: { active: false, message: 'Verificação falhou' }
    };
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      return defaultStatus;
    }

    console.log('Authenticated user found, checking system status');
    
    // Use Promise.race with a timeout
    const timeoutPromise = new Promise<SystemStatus>((resolve) => {
      setTimeout(() => {
        console.log('Status check timed out, using default values');
        resolve(defaultStatus);
      }, 3500); // Increased from 1500ms to 3500ms
    });
    
    // Create the actual data fetching promise
    const dataPromise = (async () => {
      try {
        // Execute queries in parallel for better performance
        const [asaasResult, stripeResult, ghlResult] = await Promise.all([
          // Check Asaas integration status
          supabase
            .from('system_config')
            .select('value')
            .eq('key', 'ASAAS_API_KEY')
            .maybeSingle(),
            
          // Check Stripe integration status
          supabase
            .from('system_config')
            .select('value')
            .eq('key', 'STRIPE_SECRET_KEY')
            .maybeSingle(),
            
          // Check GHL integration status for email functionality
          supabase
            .from('system_config')
            .select('value')
            .eq('key', 'GO_HIGH_LEVEL_API_KEY')
            .maybeSingle()
        ]);
        
        const asaasActive = !!asaasResult.data?.value;
        const stripeActive = !!stripeResult.data?.value;
        const ghlActive = !!ghlResult.data?.value;
        
        console.log('System status check results:', {
          asaasActive,
          stripeActive,
          ghlActive
        });
        
        return {
          asaas: { 
            active: asaasActive, 
            message: asaasActive ? 'Operacional' : 'Inativo (Token não cadastrado ou não funcionando)'
          },
          stripe: {
            active: stripeActive,
            message: stripeActive ? 'Operacional' : 'Inativo (Token não cadastrado ou não funcionando)'
          },
          emails: {
            active: ghlActive,
            message: ghlActive ? 'Ativos' : 'Inativos (Token não funcionando)'
          }
        };
      } catch (error) {
        console.error('Error in status check promise:', error);
        return defaultStatus;
      }
    })();

    // Race between actual data and timeout
    return await Promise.race([dataPromise, timeoutPromise]);
    
  } catch (error) {
    console.error('Error checking system status:', error);
    if (retries > 0) {
      console.log(`Retrying checkSystemStatus (${retries} attempts remaining)...`);
      return checkSystemStatus(retries - 1);
    }
    toast({
      title: "Erro ao verificar status do sistema",
      description: "Tente atualizar a página",
      variant: "destructive"
    });
    return {
      asaas: { active: false, message: 'Verificação falhou' },
      stripe: { active: false, message: 'Verificação falhou' },
      emails: { active: false, message: 'Verificação falhou' }
    };
  }
};
