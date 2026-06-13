import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail, MailCheck, ArrowLeft } from "lucide-react";

const FUNCTIONS_URL = "https://bcjibnbhjjgthlbeewnf.supabase.co/functions/v1";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamlibmJoampndGhsYmVld25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDg5OTUsImV4cCI6MjA5NTU4NDk5NX0.ZCfvDzPdoQuuU8QBBz3Pf8uMshslpDX5bHTWsyvZGsI";

type Step = "email" | "sent";

const IPTUOtpLogin: React.FC = () => {
  const { user, loading } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Já autenticado (inclusive logo após clicar no link) → vai para a consulta
  if (!loading && user) {
    return <Navigate to="/consulta-iptu" replace />;
  }

  const requestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setError("Informe seu e-mail.");
      return;
    }

    setBusy(true);
    try {
      // 1. Portão: valida no Higestor e provisiona a conta
      const gateRes = await fetch(`${FUNCTIONS_URL}/iptu-otp-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ email: normalized }),
      });
      const gate = await gateRes.json().catch(() => ({}));

      if (!gateRes.ok) {
        setError(gate?.error ?? "Não foi possível validar seu acesso.");
        return;
      }
      setNome(gate?.nome ?? null);

      // 2. Envia o link de acesso (mágico). Redireciona de volta para a consulta.
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: normalized,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/consulta-iptu`,
        },
      });

      if (otpErr) {
        setError("Não foi possível enviar o link agora. Tente novamente em instantes.");
        return;
      }

      setStep("sent");
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setBusy(false);
    }
  };

  const resetToEmail = () => {
    setStep("email");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Cabeçalho de marca */}
      <header className="bg-aciesc-primary shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-medium leading-none tracking-widest uppercase">
              ACIESC
            </p>
            <p className="text-white font-bold text-sm leading-tight">
              Consulta IPTU — Itapema
            </p>
          </div>
        </div>
      </header>

      {/* Card central */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-6 sm:p-8">
          {step === "email" ? (
            <form onSubmit={requestLink} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="mx-auto w-12 h-12 rounded-full bg-aciesc-primary/10 flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-aciesc-primary" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Acesso do Associado</h1>
                <p className="text-sm text-muted-foreground">
                  Informe o e-mail cadastrado na ACIESC. Enviaremos um link de acesso.
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando…
                  </>
                ) : (
                  "Receber link de acesso"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Apenas associados ativos da ACIESC têm acesso. O sistema valida sua
                situação automaticamente no Higestor.
              </p>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MailCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {nome ? `Tudo certo, ${nome.split(" ")[0]}!` : "Link enviado!"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enviamos um link de acesso para
                  <br />
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  Abra seu e-mail e clique em <strong>"Entrar"</strong> para acessar o
                  sistema. Se não encontrar, verifique a caixa de <strong>spam</strong>.
                </AlertDescription>
              </Alert>

              <button
                type="button"
                onClick={resetToEmail}
                className="flex items-center justify-center gap-1 w-full text-sm text-muted-foreground hover:text-gray-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Usar outro e-mail
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-white py-2.5 text-center text-[11px] text-muted-foreground">
        ACIESC · Associação Comercial e Industrial de Itapema
      </footer>
    </div>
  );
};

export default IPTUOtpLogin;
