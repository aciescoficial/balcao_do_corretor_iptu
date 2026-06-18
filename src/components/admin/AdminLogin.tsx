import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertCircle, Loader2, ShieldCheck, Lock, ArrowLeft } from "lucide-react";

const ADMIN_EMAIL = "aciesc.oficial@gmail.com";
const CODE_LENGTH = 8;

type Step = "email" | "code";

const AdminLogin: React.FC = () => {
  const { user, userRole, loading } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Já logado como admin → vai pro painel
  if (!loading && user && userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const normalized = email.trim().toLowerCase();
    if (normalized !== ADMIN_EMAIL) {
      setError("Acesso restrito à administração da ACIESC.");
      return;
    }

    setBusy(true);
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: normalized,
        options: { shouldCreateUser: false },
      });
      if (otpErr) {
        setError("Não foi possível enviar o código agora. Tente novamente em instantes.");
        return;
      }
      setStep("code");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.length < CODE_LENGTH) {
      setError(`Digite os ${CODE_LENGTH} dígitos do código.`);
      return;
    }
    setBusy(true);
    try {
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: "email",
      });
      if (verifyErr) {
        setError("Código inválido ou expirado. Solicite um novo.");
        setCode("");
        return;
      }
      // Registra o acesso (não bloqueia o login se falhar)
      supabase.functions.invoke("log-access").catch(() => {});
      // Sucesso: o redirect no topo assume quando userRole = admin
    } catch {
      setError("Erro ao validar o código. Tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-950 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/10">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/50 text-[10px] font-medium leading-none tracking-widest uppercase">
              ACIESC · Administração
            </p>
            <p className="text-white font-bold text-sm leading-tight">
              Painel do Balcão do Corretor
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {step === "email" ? (
            <form onSubmit={requestCode} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-900/5 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6 text-gray-900" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Área Administrativa</h1>
                <p className="text-sm text-muted-foreground">
                  Acesso exclusivo da administração. Enviaremos um código de acesso.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email">E-mail do administrador</Label>
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                />
              </div>

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando…</>
                ) : (
                  "Receber código de acesso"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-900/5 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6 text-gray-900" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Digite o código</h1>
                <p className="text-sm text-muted-foreground">
                  Enviamos um código de {CODE_LENGTH} dígitos para
                  <br />
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center">
                <InputOTP maxLength={CODE_LENGTH} value={code} onChange={setCode} disabled={busy}>
                  <InputOTPGroup>
                    {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" className="w-full" disabled={busy || code.length < CODE_LENGTH}>
                {busy ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando…</>
                ) : (
                  "Entrar"
                )}
              </Button>

              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); setError(null); }}
                disabled={busy}
                className="flex items-center justify-center gap-1 w-full text-sm text-muted-foreground hover:text-gray-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
