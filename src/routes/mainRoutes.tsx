
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { FinanceiroRoutes } from "./financeiroRoutes";
import { SharedRoutes } from "./sharedRoutes";
import { AdminRoutes } from "./adminRoutes";
import { UserRoutes } from "./userRoutes";
import { AuthRoutes } from "./authRoutes";
import { PublicRoutes } from "./publicRoutes";
import NotFound from "../pages/NotFound";

export const MainRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      {AuthRoutes}
      
      {/* Public Routes */}
      {PublicRoutes}
      
      {/* Redirect from root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Protected Routes */}
      {SharedRoutes}
      {AdminRoutes}
      {UserRoutes}
      {FinanceiroRoutes}
      
      {/* Catch-all 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
