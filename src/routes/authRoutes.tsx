
import React from "react";
import { Route } from "react-router-dom";
import IPTUOtpLogin from "../components/auth/login/IPTUOtpLogin";
import AdminLogin from "../components/admin/AdminLogin";
import AdminPanel from "../components/admin/AdminPanel";

// Login por OTP validado no Higestor — substitui o login/cadastro por senha
// neste app standalone (balcao.aciesc.com.br). Associados entram apenas com o
// e-mail cadastrado na ACIESC + código de acesso.
export const AuthRoutes = [
  <Route key="login" path="/login" element={<IPTUOtpLogin />} />,
  <Route key="cadastro" path="/cadastro" element={<IPTUOtpLogin />} />,

  // Área administrativa — login por OTP exclusivo do admin; o painel checa o
  // papel "admin" internamente.
  <Route key="admin-login" path="/admin/login" element={<AdminLogin />} />,
  <Route key="admin" path="/admin" element={<AdminPanel />} />,
];
