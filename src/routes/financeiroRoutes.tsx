
import React from "react";
import { Route } from "react-router-dom";
import { FinanceRoute } from "../pages/routes/FinanceiroRoutes";
import PluginLayout from "../components/PluginLayout";
import FinanceiroResumoPage from "../components/financeiro/FinanceiroResumoPage";
import AssociadosPage from "../components/financeiro/AssociadosPage";
import FinanceiroRelatoriosPage from "../components/financeiro/FinanceiroRelatoriosPage";
import IntegracaoFinanceira from "../components/IntegracaoFinanceira";

// Fallback component with custom loading time
const PageLoading = () => <div className="flex justify-center items-center h-48">Carregando...</div>;

export const FinanceiroRoutes = [
  <Route key="financeiro-resumo" path="/financeiro/resumo" element={
    <FinanceRoute>
      <PluginLayout>
        <FinanceiroResumoPage />
      </PluginLayout>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-associados" path="/financeiro/associados" element={
    <FinanceRoute>
      <PluginLayout>
        <AssociadosPage />
      </PluginLayout>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-relatorios" path="/financeiro/relatorios" element={
    <FinanceRoute>
      <PluginLayout>
        <FinanceiroRelatoriosPage />
      </PluginLayout>
    </FinanceRoute>
  } />,
  
  <Route key="financeiro-integracoes" path="/financeiro/integracoes" element={
    <FinanceRoute>
      <PluginLayout>
        <IntegracaoFinanceira />
      </PluginLayout>
    </FinanceRoute>
  } />,
];
