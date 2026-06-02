
import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../pages/AuthRoutes";
import PluginLayout from "../components/PluginLayout";
import IPTUStandaloneLayout from "../components/iptu/IPTUStandaloneLayout";
import AppLoading from "../components/shared/AppLoading";

// Lazily loaded components
const PesquisaAssociado = lazy(() => import("../components/PesquisaAssociado"));
const PagamentosAssociadoPage = lazy(() => import("../components/associado/PagamentosAssociadoPage"));
const SolicitarCarteirinhaPage = lazy(() => import("../components/associado/SolicitarCarteirinhaPage"));
const EmpresasConveniadas = lazy(() => import("../components/associado/EmpresasConveniadas"));
const ConsultaIPTU = lazy(() => import("../components/iptu/ConsultaIPTU"));

// Fallback component with custom loading time
const PageLoading = () => <AppLoading message="Carregando página..." />;

export const UserRoutes = [
  <Route key="associados-pesquisa" path="/associados/pesquisa" element={
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <PesquisaAssociado />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  // User (Associado) specific routes
  <Route key="meus-pagamentos" path="/meus-pagamentos" element={
    <ProtectedRoute allowedRoles={["user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <PagamentosAssociadoPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="solicitar-carteirinha" path="/solicitar-carteirinha" element={
    <ProtectedRoute allowedRoles={["user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <SolicitarCarteirinhaPage />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,
  
  <Route key="empresas-conveniadas" path="/empresas-conveniadas" element={
    <ProtectedRoute allowedRoles={["user"]}>
      <PluginLayout>
        <Suspense fallback={<PageLoading />}>
          <EmpresasConveniadas />
        </Suspense>
      </PluginLayout>
    </ProtectedRoute>
  } />,

  <Route key="consulta-iptu" path="/consulta-iptu" element={
    <ProtectedRoute allowedRoles={["user", "admin", "diretoria", "associado"]}>
      <IPTUStandaloneLayout>
        <ConsultaIPTU />
      </IPTUStandaloneLayout>
    </ProtectedRoute>
  } />,
];
