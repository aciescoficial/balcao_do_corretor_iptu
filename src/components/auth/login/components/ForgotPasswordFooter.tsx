
import React from 'react';
import { Button } from '@/components/ui/button';
import { Key } from "lucide-react";

interface ForgotPasswordFooterProps {
  onForgotPassword: () => void;
}

const ForgotPasswordFooter: React.FC<ForgotPasswordFooterProps> = ({ onForgotPassword }) => {
  return (
    <Button
      variant="link"
      onClick={onForgotPassword}
      className="text-blue-600"
    >
      <Key className="w-4 h-4 mr-2" />
      Esqueceu sua senha?
    </Button>
  );
};

export default ForgotPasswordFooter;
