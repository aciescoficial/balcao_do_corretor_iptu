
import { toast } from '@/hooks/use-toast';

export abstract class BaseService {
  protected handleError(error: any, message: string) {
    console.error(`${message}:`, error);
    toast({
      title: "Erro",
      description: message,
      variant: "destructive",
    });
    throw error;
  }

  protected logInfo(message: string, data?: any) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
}
