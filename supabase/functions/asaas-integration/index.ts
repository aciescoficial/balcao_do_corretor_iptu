
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Configure CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Base URL for Asaas API
const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");

interface PaymentRequest {
  customerId: string;
  associationTypeId: string;
  billingType: string;
  value: number;
  dueDate: string;
  description: string;
  installmentCount?: number;
  installmentValue?: number;
}

interface CustomerRequest {
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
}

interface PaymentLinkRequest {
  name: string;
  description: string;
  value: number;
  billingType: string;
  chargeType: string;
  dueDateLimitDays?: number;
  subscriptionCycle?: string;
  maxInstallmentCount?: number;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function createCustomer(data: CustomerRequest) {
  const response = await fetch(`${ASAAS_API_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY!,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create customer: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function createPayment(data: PaymentRequest) {
  const paymentData = {
    customer: data.customerId,
    billingType: data.billingType,
    value: data.value,
    dueDate: data.dueDate,
    description: data.description,
    installmentCount: data.installmentCount,
    installmentValue: data.installmentValue,
  };

  const response = await fetch(`${ASAAS_API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY!,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create payment: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function createPaymentLink(data: PaymentLinkRequest) {
  const response = await fetch(`${ASAAS_API_URL}/paymentLinks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY!,
    },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      value: data.value,
      billingType: data.billingType,
      chargeType: data.chargeType,
      dueDateLimitDays: data.dueDateLimitDays || 5,
      subscriptionCycle: data.subscriptionCycle,
      maxInstallmentCount: data.maxInstallmentCount
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create payment link: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function createSubscription(data: any) {
  const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY!,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create subscription: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

async function handleWebhook(req: Request) {
  const data = await req.json();
  
  console.log("Received webhook from Asaas:", data);
  
  try {
    // Verify webhook signature if available
    
    // Process the webhook data
    if (data.event === "PAYMENT_CONFIRMED") {
      await processPaymentConfirmation(data.payment);
    } else if (data.event === "PAYMENT_RECEIVED") {
      await processPaymentConfirmation(data.payment);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error processing webhook" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

async function processPaymentConfirmation(payment: any) {
  console.log("Processing payment confirmation:", payment);
  
  // Check if this is an association payment
  if (!payment.externalReference || 
      !payment.externalReference.startsWith("association-")) {
    console.log("Not an association payment, skipping");
    return;
  }
  
  const interestId = payment.externalReference.replace("association-", "");
  
  try {
    // Get the interest record
    const { data: interest, error: interestError } = await supabase
      .from("associado_interesse")
      .select("*")
      .eq("id", interestId)
      .single();
    
    if (interestError || !interest) {
      throw new Error(`Interest record not found: ${interestError?.message || ""}`);
    }
    
    // Get email template
    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("codigo", "confirmacao_pagamento")
      .single();
    
    if (templateError || !template) {
      throw new Error(`Email template not found: ${templateError?.message || ""}`);
    }
    
    // Generate a signup link with a token
    const token = crypto.randomUUID();
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Save the token
    const { error: tokenError } = await supabase
      .from("signup_tokens")
      .insert({
        token,
        associado_interesse_id: interest.id,
        expires_at: expires.toISOString(),
        created_at: now.toISOString()
      });
    
    if (tokenError) {
      throw new Error(`Error saving token: ${tokenError.message}`);
    }
    
    // Create a signup link
    const signupLink = `${supabaseUrl}/associado-signup?token=${token}`;
    
    // Replace placeholders in the email template
    const emailBody = template.corpo
      .replace("{nome}", interest.nome)
      .replace("{email}", interest.email)
      .replace("{link_cadastro}", signupLink);
    
    // Send the email
    // This is a placeholder - you'll need to implement the actual email sending
    console.log("Would send email to:", interest.email);
    console.log("Email subject:", template.assunto);
    console.log("Email body:", emailBody);
    
    // Update the interest record
    const { error: updateError } = await supabase
      .from("associado_interesse")
      .update({
        pagamento_confirmado: true,
        pagamento_data: now.toISOString()
      })
      .eq("id", interest.id);
    
    if (updateError) {
      throw new Error(`Error updating interest record: ${updateError.message}`);
    }
    
  } catch (error: any) {
    console.error("Error processing payment confirmation:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // Handle different endpoints
    if (path === "create-customer") {
      const data = await req.json();
      const result = await createCustomer(data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "create-payment") {
      const data = await req.json();
      const result = await createPayment(data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "create-payment-link") {
      const data = await req.json();
      const result = await createPaymentLink(data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "create-subscription") {
      const data = await req.json();
      const result = await createSubscription(data);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (path === "webhook") {
      return handleWebhook(req);
    } else {
      return new Response(JSON.stringify({ error: "Endpoint not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
