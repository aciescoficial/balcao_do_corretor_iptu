
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

// This hook is kept for backward compatibility but now returns empty values
// as we've removed Google Maps integration
export const useGoogleMapsApi = () => {
  return { 
    apiKey: null, 
    isLoading: false 
  };
};
