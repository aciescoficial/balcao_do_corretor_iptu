
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  template_id?: string;
  template_data?: Record<string, any>;
}

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

    const body = await req.json() as EmailRequest;
    let { to, subject, body: emailBody, template_id, template_data } = body;

    // Validate input
    if (!to) {
      throw new Error("Missing required field: to");
    }

    console.log(`Processing email to ${to}`);

    // If template_id is provided, fetch template and replace placeholders
    if (template_id) {
      console.log(`Using template: ${template_id}`);
      
      const { data: template, error: templateError } = await supabaseClient
        .from('email_templates')
        .select('*')
        .eq('codigo', template_id)
        .single();
        
      if (templateError || !template) {
        throw new Error(`Template not found: ${templateError?.message || template_id}`);
      }
      
      // Use template subject and body
      subject = template.assunto;
      emailBody = template.corpo;
      
      // Replace placeholders in template if template_data is provided
      if (template_data) {
        for (const [key, value] of Object.entries(template_data)) {
          const placeholder = `{${key}}`;
          emailBody = emailBody.replaceAll(placeholder, value);
          subject = subject.replaceAll(placeholder, value);
        }
      }
    }
    
    // Validate after potential template processing
    if (!subject || !emailBody) {
      throw new Error("Missing required fields: subject, body");
    }

    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${emailBody}`);

    // Log the email in the database
    const { error } = await supabaseClient
      .from("email_logs")
      .insert({
        recipient: to,
        subject,
        body: emailBody,
        status: "sent" // In a real implementation, this would be based on the email service response
      });

    if (error) {
      throw new Error(`Failed to log email: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email queued for delivery" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
