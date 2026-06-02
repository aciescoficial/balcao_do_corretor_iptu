
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
    const { paymentId } = body;

    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: "Payment ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get payment status from ASAAS
    const paymentResponse = await fetch(`${baseUrl}/payments/${paymentId}`, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'access_token': apiKey
      }
    });
    
    const paymentData = await paymentResponse.json();
    
    if (paymentData.errors) {
      throw new Error(paymentData.errors[0].description || "Error checking payment status");
    }
    
    console.log("Payment status:", paymentData.status);
    
    // If payment is confirmed (paid), update the solicitation status
    if (['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(paymentData.status)) {
      // Find the associado_interesse with this payment ID
      const { data: interests } = await supabaseClient
        .from("carteirinha_solicitacoes")
        .select("*")
        .eq("pagamento_id", paymentId)
        .maybeSingle();
      
      if (interests) {
        // Update the interest status
        await supabaseClient
          .from("carteirinha_solicitacoes")
          .update({
            status: 'pago'
          })
          .eq("pagamento_id", paymentId);
          
        console.log("Updated solicitation status to 'pago'");
      }
      
      // Also check associado_interesse table for this payment
      const { data: associadoInteresse } = await supabaseClient
        .from("associado_interesse")
        .select("*")
        .eq("pagamento_url", paymentData.invoiceUrl || paymentData.bankSlipUrl)
        .maybeSingle();
        
      if (associadoInteresse) {
        // Update the payment confirmation
        await supabaseClient
          .from("associado_interesse")
          .update({
            pagamento_confirmado: true,
            pagamento_data: new Date().toISOString()
          })
          .eq("id", associadoInteresse.id);
          
        console.log("Updated associado_interesse payment confirmation");
      }
    }
    
    return new Response(
      JSON.stringify({
        status: paymentData.status,
        invoiceUrl: paymentData.invoiceUrl || paymentData.bankSlipUrl,
        paymentDate: paymentData.paymentDate,
        value: paymentData.value
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking payment status:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
