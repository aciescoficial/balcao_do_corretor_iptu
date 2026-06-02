
import React from 'react';
import { Routes } from 'react-router-dom';
import { AdminRoutes, UserRoutes, SharedRoutes } from './routes';

const Index: React.FC = () => {
  return (
    <Routes>
      {/* Include all route groups */}
      {SharedRoutes}
      {AdminRoutes}
      {UserRoutes}
    </Routes>
  );
};

export default Index;
