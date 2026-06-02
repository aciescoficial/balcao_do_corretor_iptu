import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";
import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-application-name",
};

const PREF_BASE = "https://itapema-sc.prefeituramoderna.com.br/meuiptu/corretor";
const PREF_LOGIN = Deno.env.get("PREF_USUARIO") ?? "193677";
const PREF_SENHA_PLAIN = Deno.env.get("PREF_SENHA") ?? "Diretoria@2026";

function md5(text: string): string {
  return createHash("md5").update(text).digest("hex");
}

async function prefeituraLogin(): Promise<string | null> {
  const initRes = await fetch(`${PREF_BASE}/`, { redirect: "follow" });
  const initCookieHeader = initRes.headers.get("set-cookie") ?? "";
  const initMatch = initCookieHeader.match(/PHPSESSID=([^;]+)/);
  const initSession = initMatch ? initMatch[1] : null;

  const senha = md5(PREF_SENHA_PLAIN);
  const body = new URLSearchParams({ usuario: PREF_LOGIN, senha });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (initSession) headers["Cookie"] = `PHPSESSID=${initSession}`;

  const res = await fetch(`${PREF_BASE}/login_form.php`, {
    method: "POST",
    headers,
    body: body.toString(),
  });

  const setCookie = res.headers.get("set-cookie") ?? "";
  const loginMatch = setCookie.match(/PHPSESSID=([^;]+)/);
  if (loginMatch) return loginMatch[1];

  const text = await res.text();
  if (text.includes("conectado ao sistema") && initSession) return initSession;

  return null;
}

async function prefeituraSearch(
  sessionId: string,
  params: Record<string, string>
): Promise<string> {
  const body = new URLSearchParams({
    cd_requerente: params.cd_requerente ?? "",
    nm_requerente: params.nm_requerente ?? "",
    cd_imovel: params.cd_imovel ?? "",
    nr_inscricao: params.nr_inscricao ?? "",
    nm_logradouro: params.nm_logradouro ?? "",
    nr_imovel: params.nr_imovel ?? "",
    ds_complemento: params.ds_complemento ?? "",
    nm_bairro: params.nm_bairro ?? "",
    nr_cep: params.nr_cep ?? "",
    nr_apto: params.nr_apto ?? "",
    nm_edificio: params.nm_edificio ?? "",
    cd_quadra: params.cd_quadra ?? "",
    cd_lote: params.cd_lote ?? "",
    ds_loteamento: params.ds_loteamento ?? "",
    ordem: ["nm_nomefantasia", "ds_logradouro", "nm_bairro", "cd_imovel"].includes(params.ordem ?? "")
      ? (params.ordem ?? "nm_nomefantasia")
      : "nm_nomefantasia",
    pageNum_processos: params.pageNum_processos ?? "0",
  });

  const res = await fetch(`${PREF_BASE}/lista-busca-imoveis.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Cookie: `PHPSESSID=${sessionId}`,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": `${PREF_BASE}/`,
      "X-Requested-With": "XMLHttpRequest",
      "X-Prototype-Version": "1.7.3.0",
    },
    body: body.toString(),
  });

  // The prefeitura uses Windows-1252 encoding; res.text() defaults to UTF-8
  // and corrupts accented characters (e.g. Ó→♦). Decode explicitly.
  const buffer = await res.arrayBuffer();
  return new TextDecoder("windows-1252").decode(buffer);
}

interface ImovelResult {
  cd_imovel: string;
  nm_proprietario: string;
  endereco: string;
  nm_bairro: string;
  id_imovel_corretor: string;
  cd_imovel_corretor: string;
}

function parseSearchResults(html: string): { count: number; items: ImovelResult[] } {
  const countMatch = html.match(/(\d+)\s+Registro\(s\)\s+Localizado\(s\)/i);
  const count = countMatch ? parseInt(countMatch[1]) : 0;

  if (count === 0) {
    return { count: 0, items: [] };
  }

  const items: ImovelResult[] = [];
  const rowPattern = /<tr>\s*<td[^>]*>\s*<div[^>]*>\s*([\d]+)\s*<\/div><\/td>\s*<td[^>]*><div[^>]*>(.*?)<\/div><\/td>\s*<td[^>]*><div[^>]*>(.*?)<\/div><\/td>\s*<td[^>]*><div[^>]*>(.*?)<\/div><\/td>[\s\S]*?id_imovel_corretor=(\d+)&(?:amp;)?cd_imovel_corretor=(\d+)/gi;

  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    items.push({
      cd_imovel: match[1].trim(),
      nm_proprietario: decodeHtmlEntities(match[2].trim()),
      endereco: decodeHtmlEntities(match[3].trim()),
      nm_bairro: decodeHtmlEntities(match[4].trim()),
      id_imovel_corretor: match[5],
      cd_imovel_corretor: match[6],
    });
  }

  return { count, items };
}

// Named HTML entities commonly found in Portuguese text / prefeitura data
const HTML_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  nbsp: " ", ensp: " ", emsp: " ", thinsp: " ",
  // Lowercase accented
  aacute: "á", agrave: "à", acirc: "â", atilde: "ã", auml: "ä", aring: "å",
  eacute: "é", egrave: "è", ecirc: "ê", euml: "ë",
  iacute: "í", igrave: "ì", icirc: "î", iuml: "ï",
  oacute: "ó", ograve: "ò", ocirc: "ô", otilde: "õ", ouml: "ö",
  uacute: "ú", ugrave: "ù", ucirc: "û", uuml: "ü",
  ccedil: "ç", ntilde: "ñ", szlig: "ß", aelig: "æ",
  // Uppercase accented
  Aacute: "Á", Agrave: "À", Acirc: "Â", Atilde: "Ã", Auml: "Ä",
  Eacute: "É", Egrave: "È", Ecirc: "Ê", Euml: "Ë",
  Iacute: "Í", Igrave: "Ì", Icirc: "Î", Iuml: "Ï",
  Oacute: "Ó", Ograve: "Ò", Ocirc: "Ô", Otilde: "Õ", Ouml: "Ö",
  Uacute: "Ú", Ugrave: "Ù", Ucirc: "Û", Uuml: "Ü",
  Ccedil: "Ç", Ntilde: "Ñ", AElig: "Æ",
};

function decodeHtmlEntities(text: string): string {
  return text
    // Named entities (e.g. &Oacute; &atilde; &ccedil;)
    .replace(/&([a-zA-Z]+);/g, (_, name) => HTML_ENTITIES[name] ?? "")
    // Decimal numeric entities (e.g. &#211;)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    // Hex numeric entities (e.g. &#xD3;)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

async function validateHigestorAssociate(associadoId: string): Promise<boolean> {
  const higestorUrl = Deno.env.get("HIGESTOR_API_URL");
  const higestorToken = Deno.env.get("HIGESTOR_API_TOKEN");

  if (!higestorUrl || !higestorToken) return true;

  try {
    const res = await fetch(`${higestorUrl}/associados/${associadoId}`, {
      headers: { Authorization: `Bearer ${higestorToken}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.ativo === true || data.situacao === "ATIVO" || data.status === "ativo";
  } catch {
    return true;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT with anon client
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role client to bypass RLS for the user table check
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: userData, error: userError } = await serviceClient
      .from("user")
      .select("active, associado_id, role")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allowedRoles = ["admin", "diretoria", "user", "associado"];
    if (!allowedRoles.includes(userData.role)) {
      return new Response(JSON.stringify({ error: "Acesso não permitido para este perfil" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (userData.active === false) {
      return new Response(JSON.stringify({ error: "Associado inativo. Regularize sua situação para usar esta funcionalidade." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (userData.associado_id) {
      const isActive = await validateHigestorAssociate(userData.associado_id);
      if (!isActive) {
        return new Response(JSON.stringify({ error: "Associado não está ativo no Higestor. Verifique sua situação." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const searchParams: Record<string, string> = await req.json();

    const hasAnyParam = Object.values(searchParams).some((v) => v?.trim());
    if (!hasAnyParam) {
      return new Response(JSON.stringify({ error: "Informe pelo menos um campo de busca." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sessionId = await prefeituraLogin();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Falha ao autenticar na prefeitura. Tente novamente." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = await prefeituraSearch(sessionId, searchParams);
    const { count, items } = parseSearchResults(html);

    const ipAddress = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;

    await serviceClient.from("iptu_queries").insert({
      user_id: user.id,
      search_params: searchParams,
      result_count: count,
      ip_address: ipAddress,
    });

    return new Response(
      JSON.stringify({ count, items }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("iptu-search error:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
