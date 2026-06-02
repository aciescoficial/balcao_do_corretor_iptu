import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";
import { createHash } from "node:crypto";

const PREF_BASE = "https://itapema-sc.prefeituramoderna.com.br/meuiptu/corretor";
const PREF_LOGIN = Deno.env.get("PREF_USUARIO") ?? "193677";
const PREF_SENHA_PLAIN = Deno.env.get("PREF_SENHA") ?? "Diretoria@2026";

function md5(text: string): string {
  return createHash("md5").update(text).digest("hex");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-application-name",
};

function rewriteUrls(html: string): string {
  const base = PREF_BASE;
  return html
    .replace(/(<(?:link|script|img)[^>]+(?:href|src)=["'])(?!https?:\/\/|\/\/)(\.\/)?([^"']+)(["'])/gi,
      (_m, pre, _dot, path, post) => `${pre}${base}/${path}${post}`)
    .replace(/url\(['"]?(?!https?:\/\/|\/\/)(\.\/)?([^'")\s]+)['"]?\)/gi,
      (_m, _dot, path) => `url('${base}/${path}')`)
    .replace(/action="(?!https?:\/\/)([^"]+)"/gi,
      (_m, path) => `action="${base}/${path}"`);
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
      .select("active, role")
      .eq("id", user.id)
      .single();

    if (userError || !userData || userData.active === false) {
      return new Response(JSON.stringify({ error: "Acesso não permitido" }), {
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

    const ipAddress = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;
    await serviceClient.from("iptu_queries").insert({
      user_id: user.id,
      search_params: { tipo: "portal_completo" },
      result_count: 0,
      ip_address: ipAddress,
    });

    // Server-side login
    const sessionId = await prefeituraLogin();
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Falha ao autenticar na prefeitura. Tente novamente." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the authenticated main portal page server-side
    const portalRes = await fetch(`${PREF_BASE}/`, {
      headers: {
        Cookie: `PHPSESSID=${sessionId}`,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": `${PREF_BASE}/`,
      },
    });

    const buffer = await portalRes.arrayBuffer();
    const decoder = new TextDecoder("windows-1252");
    let html = decoder.decode(buffer);

    html = html.replace(/charset=windows-1252/gi, "charset=utf-8");
    html = rewriteUrls(html);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("iptu-portal error:", err);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
