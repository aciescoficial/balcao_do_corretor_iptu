
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminRoutes } from "./routes/adminRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { SharedRoutes } from "./routes/sharedRoutes";
import { PublicRoutes } from "./routes/publicRoutes";
import { AuthRoutes } from "./routes/authRoutes";
import { FinanceiroRoutes } from "./routes/financeiroRoutes";
import NotFound from "./pages/NotFound";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirect raiz para consulta IPTU */}
      <Route path="/" element={<Navigate to="/consulta-iptu" replace />} />
      
      {/* Rotas de Autenticação */}
      {AuthRoutes}
      
      {/* Rotas Públicas */}
      {PublicRoutes}
      
      {/* Rotas Compartilhadas */}
      {SharedRoutes}
      
      {/* Rotas Admin */}
      {AdminRoutes}
      
      {/* Rotas Usuário */}
      {UserRoutes}
      
      {/* Rotas Financeiro */}
      {FinanceiroRoutes}
      
      {/* Rota de fallback para 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
