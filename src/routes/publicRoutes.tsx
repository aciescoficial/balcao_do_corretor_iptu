
import React, { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import AppLoading from "../components/shared/AppLoading";

// Lazily loaded components
const FormularioInteressePage = lazy(() => import("../components/associado/FormularioInteressePage"));
const AssociadoSignupCompletion = lazy(() => import("../components/associado/AssociadoSignupCompletion"));

// Fallback component with custom loading time
const PageLoading = () => <AppLoading message="Carregando página..." />;

export const PublicRoutes = [
  // Standalone routes
  <Route key="formulario-interesse" path="/formulario-interesse" element={
    <Suspense fallback={<PageLoading />}>
      <FormularioInteressePage />
    </Suspense>
  } />,
  
  <Route key="associado-signup" path="/associado-signup" element={
    <Suspense fallback={<PageLoading />}>
      <AssociadoSignupCompletion />
    </Suspense>
  } />
];
