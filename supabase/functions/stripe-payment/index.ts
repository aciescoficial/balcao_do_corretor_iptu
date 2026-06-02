
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Retrieve Stripe key from system_config
    const { data: configData } = await supabaseClient
      .from("system_config")
      .select("*")
      .eq("key", "STRIPE_SECRET_KEY")
      .single();

    const stripeKey = configData?.value;
    if (!stripeKey) {
      throw new Error("Stripe key not found");
    }

    const body = await req.json();
    const { customerId, customerEmail, amount, description, solicitacaoId } = body;

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Taxa de Carteirinha",
              description: description,
            },
            unit_amount: amount, // amount in cents (e.g. 1500 = R$ 15,00)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/solicitar-carteirinha`,
      metadata: {
        solicitacao_id: solicitacaoId,
        customer_id: customerId,
      },
    });

    // Update the solicitation with payment ID
    await supabaseClient
      .from("carteirinha_solicitacoes")
      .update({
        pagamento_id: session.id,
      })
      .eq("id", solicitacaoId);

    return new Response(
      JSON.stringify({ 
        id: session.id,
        url: session.url 
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
