
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Base URL para API do Go High Level
const GHL_API_URL = "https://rest.gohighlevel.com/v1";
const GHL_API_KEY = Deno.env.get("GO_HIGH_LEVEL_API_KEY");

interface ConveniadoData {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  creci?: string;
}

interface EmpresaData {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavel: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
  site?: string;
  instagram?: string;
  whatsapp?: string;
}

async function createContactFromConveniado(data: ConveniadoData) {
  console.log("Criando contato no Go High Level:", data);

  const contactData = {
    firstName: data.nome,
    lastName: data.sobrenome,
    email: data.email,
    phone: data.telefone,
    address1: data.rua || "",
    city: data.cidade || "",
    state: data.estado || "",
    postalCode: data.cep || "",
    customField: {
      "cpf": data.cpf,
      "creci": data.creci || ""
    },
    tags: ["Conveniado CRECI-SC"]
  };

  const response = await fetch(`${GHL_API_URL}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GHL_API_KEY}`
    },
    body: JSON.stringify(contactData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Falha ao criar contato: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function createCompanyFromEmpresa(data: EmpresaData) {
  console.log("Criando empresa no Go High Level:", data);

  const companyData = {
    name: data.nomeFantasia || data.razaoSocial,
    address1: data.endereco || "",
    city: data.cidade || "",
    postalCode: data.cep || "",
    website: data.site || "",
    phone: data.telefone || "",
    customField: {
      "razao_social": data.razaoSocial,
      "cnpj": data.cnpj,
      "responsavel": data.responsavel,
      "instagram": data.instagram || "",
      "whatsapp": data.whatsapp || ""
    },
    tags: ["Empresa Conveniada CRECI-SC"]
  };

  const response = await fetch(`${GHL_API_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GHL_API_KEY}`
    },
    body: JSON.stringify(companyData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Falha ao criar empresa: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function syncConveniados(conveniados: ConveniadoData[]) {
  console.log(`Sincronizando ${conveniados.length} conveniados`);
  
  const results = [];
  for (const conveniado of conveniados) {
    try {
      const result = await createContactFromConveniado(conveniado);
      results.push({
        id: conveniado.id,
        success: true,
        ghlId: result.id,
        email: conveniado.email
      });
    } catch (error) {
      console.error(`Erro ao sincronizar conveniado ${conveniado.id}:`, error);
      results.push({
        id: conveniado.id,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

async function syncEmpresas(empresas: EmpresaData[]) {
  console.log(`Sincronizando ${empresas.length} empresas`);
  
  const results = [];
  for (const empresa of empresas) {
    try {
      const result = await createCompanyFromEmpresa(empresa);
      results.push({
        id: empresa.id,
        success: true,
        ghlId: result.id,
        nome: empresa.nomeFantasia
      });
    } catch (error) {
      console.error(`Erro ao sincronizar empresa ${empresa.id}:`, error);
      results.push({
        id: empresa.id,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

async function getGHLUser() {
  console.log("Obtendo informações do usuário Go High Level");
  
  const response = await fetch(`${GHL_API_URL}/users/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${GHL_API_KEY}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Falha ao obter informações do usuário: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Obter caminho da URL
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // Lidar com diferentes endpoints
    if (path === "sync-conveniados") {
      const { conveniados } = await req.json();
      const results = await syncConveniados(conveniados);
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "sync-empresas") {
      const { empresas } = await req.json();
      const results = await syncEmpresas(empresas);
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "test-connection") {
      const user = await getGHLUser();
      return new Response(JSON.stringify(user), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ error: "Endpoint não encontrado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
