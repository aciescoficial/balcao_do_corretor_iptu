
// Supabase Edge Function for updating associado metadata
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.3';

type MetadataUpdate = {
  associado_id: string;
  meta_key: string;
  meta_value: string;
};

serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: req.headers.get('Authorization')! } 
        } 
      }
    );

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized', error: authError }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the request payload
    const { associado_id, meta_key, meta_value }: MetadataUpdate = await req.json();

    if (!associado_id || !meta_key || !meta_value) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if we need to update an associado
    if (meta_key === 'comprovante_url') {
      // Since we can't directly access comprovante_url, we'll store it elsewhere
      // For example, in the tipo_pagamento field as a JSON string
      const { error: updateError } = await supabaseClient
        .from('associados')
        .update({
          // Store comprovante info within an existing field
          tipo_pagamento: JSON.stringify({
            method: 'comprovante',
            url: meta_value,
            date: new Date().toISOString()
          })
        })
        .eq('id', associado_id);

      if (updateError) {
        return new Response(
          JSON.stringify({ message: 'Error updating associado', error: updateError }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Metadata updated successfully',
          data: { associado_id, meta_key, meta_value } 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle other metadata types if needed

    return new Response(
      JSON.stringify({ success: false, message: 'Unsupported metadata key' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
