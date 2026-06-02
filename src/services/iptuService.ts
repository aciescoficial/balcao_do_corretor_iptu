import { supabase } from "@/integrations/supabase/client";

const FUNCTIONS_URL = "https://bcjibnbhjjgthlbeewnf.supabase.co/functions/v1";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamlibmJoampndGhsYmVld25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDg5OTUsImV4cCI6MjA5NTU4NDk5NX0.ZCfvDzPdoQuuU8QBBz3Pf8uMshslpDX5bHTWsyvZGsI";

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token ?? ""}`,
    apikey: ANON_KEY,
    "x-application-name": "aciesc-app",
  };
}

export async function openIPTUEspelho(id_imovel_corretor: string, cd_imovel_corretor: string): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(
    `${FUNCTIONS_URL}/iptu-espelho?id_imovel_corretor=${id_imovel_corretor}&cd_imovel_corretor=${cd_imovel_corretor}`,
    { headers }
  );
  if (!res.ok) throw new Error("Falha ao carregar o espelho. Tente novamente.");
  const html = await res.text();
  const blob = new Blob([html], { type: "text/html; charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "scrollbars=yes,width=1000,height=720");
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function openIPTUPortal(): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${FUNCTIONS_URL}/iptu-portal`, { headers });
  if (!res.ok) throw new Error("Acesso não autorizado ao portal.");
  const html = await res.text();
  const blob = new Blob([html], { type: "text/html; charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "scrollbars=yes,width=1200,height=800");
  setTimeout(() => URL.revokeObjectURL(url), 15_000);
}

export interface IPTUSearchParams {
  cd_imovel?: string;
  nr_inscricao?: string;
  nm_logradouro?: string;
  nr_imovel?: string;
  ds_complemento?: string;
  nm_bairro?: string;
  nr_cep?: string;
  nr_apto?: string;
  nm_edificio?: string;
  cd_quadra?: string;
  cd_lote?: string;
  ds_loteamento?: string;
  nm_requerente?: string;
  cd_requerente?: string;
  ordem?: string;
  pageNum_processos?: string;
}

export interface ImovelItem {
  cd_imovel: string;
  nm_proprietario: string;
  endereco: string;
  nm_bairro: string;
  id_imovel_corretor: string;
  cd_imovel_corretor: string;
}

export interface IPTUSearchResult {
  count: number;
  items: ImovelItem[];
}

export interface IPTUQueryLog {
  id: string;
  search_params: IPTUSearchParams;
  result_count: number;
  created_at: string;
}

export async function searchIPTU(params: IPTUSearchParams): Promise<IPTUSearchResult> {
  const { data, error } = await supabase.functions.invoke("iptu-search", {
    body: params,
  });

  if (error) throw new Error(error.message ?? "Erro ao buscar dados");
  if (data?.error) throw new Error(data.error);
  return data as IPTUSearchResult;
}

export async function getMyIPTUQueries(): Promise<IPTUQueryLog[]> {
  const { data, error } = await supabase
    .from("iptu_queries")
    .select("id, search_params, result_count, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data ?? []) as IPTUQueryLog[];
}
