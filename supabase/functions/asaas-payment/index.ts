
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: configData } = await supabaseClient
      .from("system_config")
      .select("*")
      .eq("key", "ASAAS_API_KEY")
      .single();

    const apiKey = configData?.value;
    if (!apiKey) {
      throw new Error("API key not found");
    }
    
    const { data: envData } = await supabaseClient
      .from("system_config")
      .select("*")
      .eq("key", "ASAAS_ENV")
      .single();
    
    const env = envData?.value || 'sandbox';
    const baseUrl = env === 'production' 
      ? 'https://api.asaas.com/v3' 
      : 'https://sandbox.asaas.com/api/v3';

    const body = await req.json();
    const { customer, value, description, solicitacaoId } = body;

    // Create or get existing customer
    let customerId;
    const customerResponse = await fetch(`${baseUrl}/customers?email=${encodeURIComponent(customer.email)}`, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'access_token': apiKey
      }
    });
    
    const customerData = await customerResponse.json();
    
    if (customerData.data && customerData.data.length > 0) {
      customerId = customerData.data[0].id;
    } else {
      // Create new customer
      const newCustomerResponse = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'access_token': apiKey
        },
        body: JSON.stringify({
          name: customer.name,
          email: customer.email,
          cpfCnpj: customer.cpfCnpj,
          notificationDisabled: false
        })
      });
      
      const newCustomerData = await newCustomerResponse.json();
      customerId = newCustomerData.id;
    }
    
    if (!customerId) {
      throw new Error("Failed to create or find customer");
    }

    // Create payment
    const paymentResponse = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'BOLETO',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
        value,
        description,
        externalReference: `carteirinha-${solicitacaoId}`,
        postalService: false
      })
    });
    
    const paymentData = await paymentResponse.json();
    
    if (!paymentData.id) {
      throw new Error("Failed to create payment");
    }
    
    // Update the solicitation with payment ID
    await supabaseClient
      .from("carteirinha_solicitacoes")
      .update({
        pagamento_id: paymentData.id,
      })
      .eq("id", solicitacaoId);
    
    return new Response(
      JSON.stringify({
        id: paymentData.id,
        invoiceUrl: paymentData.invoiceUrl || paymentData.bankSlipUrl,
        status: paymentData.status
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
