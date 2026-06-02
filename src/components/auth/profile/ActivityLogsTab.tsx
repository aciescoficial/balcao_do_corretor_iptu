
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ActivityLogsProps {
  userId: string;
}

interface ActivityLog {
  id: string;
  event: string;
  created_at: string;
  is_login?: boolean;
}

export const ActivityLogsTab = ({ userId }: ActivityLogsProps) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        
        // First check if is_login column exists
        const { data: columnInfo, error: columnError } = await supabase
          .from('user_access_logs')
          .select('is_login')
          .limit(1);
          
        if (columnError) {
          console.error('Error checking column existence:', columnError);
          // Continue with a safe fallback
        }
        
        const hasLoginField = columnInfo && columnInfo.length > 0 && 'is_login' in columnInfo[0];
        
        // Fetch logs with conditional selection of is_login field
        const { data, error } = await supabase
          .from('user_access_logs')
          .select(hasLoginField ? 'id, event, created_at, is_login' : 'id, event, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Make sure we handle the data properly with type safety
          const validData = (data as Array<any>)
            .filter((item): item is any => 
              item !== null && 
              typeof item === 'object' &&
              'id' in item &&
              'event' in item &&
              'created_at' in item
            )
            .map(item => ({
              id: item.id,
              event: item.event,
              created_at: item.created_at,
              is_login: item.is_login
            }));
          
          setLogs(validData as ActivityLog[]);
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.error('Error fetching activity logs:', error);
        setLogs([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, [userId]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: pt });
  };
  
  const getEventBadge = (event: string, isLogin?: boolean) => {
    // Show "Login" badge only for actual login events
    if (event === 'Acesso ao sistema' && isLogin === true) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Login</Badge>;
    }
    
    // For other events, use appropriate badges
    switch (event) {
      case 'Atualização de perfil':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Perfil</Badge>;
      case 'Alteração de senha':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Senha</Badge>;
      case 'Atualização de foto de perfil':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Foto</Badge>;
      case 'Remoção de foto de perfil':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Foto</Badge>;
      default:
        return <Badge variant="outline">{event}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Atividades</CardTitle>
        <CardDescription>
          Registro das suas últimas atividades no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="medium" />
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {getEventBadge(log.event, log.is_login)}
                  <span>{log.event}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(log.created_at)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Não há registros de atividade para exibir.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
