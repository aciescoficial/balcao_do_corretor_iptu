
import React from "react";
import { Route } from "react-router-dom";
import IPTUOtpLogin from "../components/auth/login/IPTUOtpLogin";

// Login por OTP validado no Higestor — substitui o login/cadastro por senha
// neste app standalone (iptu.aciesc.com.br). Associados entram apenas com o
// e-mail cadastrado na ACIESC + código de acesso.
export const AuthRoutes = [
  <Route key="login" path="/login" element={<IPTUOtpLogin />} />,
  <Route key="cadastro" path="/cadastro" element={<IPTUOtpLogin />} />,
];
