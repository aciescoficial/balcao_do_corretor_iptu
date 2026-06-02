
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, AlertCircle, RefreshCcw } from "lucide-react";
import { UserRole } from '@/components/usuarios/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface RegisterFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  passwordsMatch: boolean;
  organizationType: UserRole;
  setOrganizationType: (type: UserRole) => void;
  isRateLimited?: boolean;
  retryCount?: number;
  retryCountdown?: number;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordsMatch,
  organizationType,
  setOrganizationType,
  isRateLimited = false,
  retryCount = 0,
  retryCountdown = 0,
  isLoading,
  handleSubmit
}) => {
  const [showRoleWarning, setShowRoleWarning] = useState(false);

  // Show warning when restricted roles are selected
  useEffect(() => {
    if (organizationType === 'admin' || organizationType === 'diretoria') {
      setShowRoleWarning(true);
    } else {
      setShowRoleWarning(false);
    }
  }, [organizationType]);

  // Calculate progress percentage for the countdown
  const progressPercentage = retryCountdown > 0 ? (retryCountdown / 60) * 100 : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email-register">E-mail</Label>
        <Input 
          id="email-register" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password-register">Senha</Label>
        <div className="relative">
          <Input 
            id="password-register" 
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password-register">Confirmar Senha</Label>
        <div className="relative">
          <Input 
            id="confirm-password-register" 
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
            className={!passwordsMatch && confirmPassword ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {!passwordsMatch && confirmPassword && (
          <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tipo de Conta</Label>
        <Select 
          value={organizationType} 
          onValueChange={(value) => setOrganizationType(value as UserRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Associado</SelectItem>
            <SelectItem value="empresa">Empresa</SelectItem>
            <SelectItem value="diretoria">Diretoria</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showRoleWarning && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Apenas administradores existentes podem criar contas com perfil de {organizationType === 'admin' ? 'Administrador' : 'Diretoria'}. 
            Este tipo de cadastro requer autorização especial.
          </AlertDescription>
        </Alert>
      )}
      
      {isRateLimited && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <div className="space-y-2 w-full">
            <AlertDescription className="block">
              Limite de cadastros excedido. Tentativa #{retryCount}.
            </AlertDescription>
            
            {retryCountdown > 0 && (
              <div className="space-y-1 w-full">
                <div className="flex justify-between text-xs">
                  <span>Aguarde</span>
                  <span>{retryCountdown} segundos</span>
                </div>
                <Progress value={progressPercentage} className="h-1" />
              </div>
            )}
          </div>
        </Alert>
      )}

      <div className="space-y-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !passwordsMatch || (isRateLimited && retryCountdown > 0)}
        >
          {isLoading ? (
            "Criando conta..."
          ) : isRateLimited && retryCountdown > 0 ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Aguarde {retryCountdown}s...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </div>
    </form>
  );
};

export default RegisterFormFields;
