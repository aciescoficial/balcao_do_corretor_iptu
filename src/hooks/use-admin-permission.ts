
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

export function useAdminPermission() {
  const { userRole, userTags, isAdmin, hasFinanceiroAccess } = useAuth();
  const { toast } = useToast();

  const checkAdminPermission = (): boolean => {
    if (!isAdmin) {
      toast({
        title: "Permissão Negada",
        description: "Você não tem permissão para realizar esta ação.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const checkFinanceiroPermission = (): boolean => {
    if (!hasFinanceiroAccess) {
      toast({
        title: "Permissão Negada",
        description: "Você não tem permissão para acessar recursos financeiros.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { 
    isAdmin,
    userRole, 
    checkAdminPermission,
    checkFinanceiroPermission,
    hasFinanceiroAccess
  };
}
