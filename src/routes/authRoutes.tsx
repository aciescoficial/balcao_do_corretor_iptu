
import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { LoginPage } from "../components/auth";
import AppLoading from "../components/shared/AppLoading";
import ResetPasswordPage from "../components/auth/login/ResetPasswordPage";

// Fallback component with custom loading time
const PageLoading = () => <AppLoading message="Carregando página..." />;

export const AuthRoutes = [
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="cadastro" path="/cadastro" element={<LoginPage />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPasswordPage />} />
];
