
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AssociadoFormNavigationProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  isSubmitting: boolean;
  isLastTab: boolean;
}

export const AssociadoFormNavigation: React.FC<AssociadoFormNavigationProps> = ({ 
  activeTab, 
  onChangeTab, 
  isSubmitting,
  isLastTab
}) => {
  const getNextTab = () => {
    switch (activeTab) {
      case "dados-pessoais":
        return "contato";
      case "contato":
        return "endereco";
      case "endereco":
        return "veiculo";
      case "veiculo":
        return "financeiro";
      default:
        return "dados-pessoais";
    }
  };
  
  const getPreviousTab = () => {
    switch (activeTab) {
      case "contato":
        return "dados-pessoais";
      case "endereco":
        return "contato";
      case "veiculo":
        return "endereco";
      case "financeiro":
        return "veiculo";
      default:
        return "dados-pessoais";
    }
  };
  
  if (activeTab === "dados-pessoais") {
    return (
      <div className="flex justify-end mt-6">
        <Button
          type="button"
          onClick={() => onChangeTab(getNextTab())}
        >
          Próximo
        </Button>
      </div>
    );
  }
  
  if (isLastTab) {
    return (
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onChangeTab(getPreviousTab())}
        >
          Anterior
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Associado"
          )}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex justify-between mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={() => onChangeTab(getPreviousTab())}
      >
        Anterior
      </Button>
      <Button
        type="button"
        onClick={() => onChangeTab(getNextTab())}
      >
        Próximo
      </Button>
    </div>
  );
};
