import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { LogOut, FileSearch, LogIn, RefreshCw, Lock } from "lucide-react";

interface Acesso {
  email: string | null;
  ip: string | null;
  ocorreu_em: string;
}
interface Consulta {
  email: string | null;
  nome: string | null;
  search_params: Record<string, string> | null;
  result_count: number | null;
  ip: string | null;
  ocorreu_em: string;
}

const FIELD_LABELS: Record<string, string> = {
  cd_imovel: "Código",
  nr_inscricao: "Inscrição",
  nm_logradouro: "Logradouro",
  nr_imovel: "Número",
  nm_bairro: "Bairro",
  nr_cep: "CEP",
  nm_requerente: "Contribuinte",
  cd_requerente: "Cód. requerente",
  nm_edificio: "Edifício",
  ordem: "Ordem",
};

function formatParams(p: Record<string, string> | null): string {
  if (!p) return "—";
  const parts = Object.entries(p)
    .filter(([k, v]) => v && String(v).trim() && k !== "ordem" && k !== "pageNum_processos")
    .map(([k, v]) => `${FIELD_LABELS[k] ?? k}: ${v}`);
  return parts.length ? parts.join(" · ") : "—";
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const AdminPanel: React.FC = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [acessos, setAcessos] = useState<Acesso[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [a, c] = await Promise.all([
        supabase.rpc("admin_acessos", { limit_n: 200 }),
        supabase.rpc("admin_consultas", { limit_n: 300 }),
      ]);
      if (a.error) throw a.error;
      if (c.error) throw c.error;
      setAcessos((a.data ?? []) as Acesso[]);
      setConsultas((c.data ?? []) as Consulta[]);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar os dados.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!loading && user && userRole === "admin") {
      carregar();
    }
  }, [loading, user, userRole]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" text="Carregando…" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (userRole !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topo */}
      <header className="bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={carregar} disabled={carregando}
              className="text-white hover:bg-white/10 hover:text-white">
              <RefreshCw className={`h-4 w-4 ${carregando ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}
              className="text-white hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Resumo */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Consultas registradas</p>
            <p className="text-3xl font-bold text-gray-900">{consultas.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Acessos registrados</p>
            <p className="text-3xl font-bold text-gray-900">{acessos.length}</p>
          </div>
        </div>

        {erro && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        <Tabs defaultValue="consultas">
          <TabsList>
            <TabsTrigger value="consultas">
              <FileSearch className="h-4 w-4 mr-1" /> Consultas
            </TabsTrigger>
            <TabsTrigger value="acessos">
              <LogIn className="h-4 w-4 mr-1" /> Acessos
            </TabsTrigger>
          </TabsList>

          {/* Histórico de consultas */}
          <TabsContent value="consultas">
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Associado</TableHead>
                      <TableHead>Busca</TableHead>
                      <TableHead className="text-center">Resultados</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carregando ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Carregando…</TableCell></TableRow>
                    ) : consultas.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhuma consulta registrada.</TableCell></TableRow>
                    ) : (
                      consultas.map((c, i) => (
                        <TableRow key={i}>
                          <TableCell className="whitespace-nowrap text-sm">{fmtDate(c.ocorreu_em)}</TableCell>
                          <TableCell className="text-sm">
                            <div className="font-medium">{c.nome ?? "—"}</div>
                            <div className="text-xs text-muted-foreground">{c.email ?? "—"}</div>
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate" title={formatParams(c.search_params)}>
                            {formatParams(c.search_params)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={c.result_count ? "default" : "secondary"}>
                              {c.result_count ?? 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{c.ip ?? "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Histórico de acessos */}
          <TabsContent value="acessos">
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carregando ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Carregando…</TableCell></TableRow>
                    ) : acessos.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Nenhum acesso registrado.</TableCell></TableRow>
                    ) : (
                      acessos.map((a, i) => (
                        <TableRow key={i}>
                          <TableCell className="whitespace-nowrap text-sm">{fmtDate(a.ocorreu_em)}</TableCell>
                          <TableCell className="text-sm">{a.email ?? "—"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{a.ip ?? "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
