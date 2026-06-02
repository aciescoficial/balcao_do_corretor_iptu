
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMigrationCheck = () => {
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkMigration = async () => {
      try {
        // Try to check if the necessary policy exists
        const { data, error } = await supabase
          .from('user')
          .select('id')
          .limit(1);

        if (error && error.message.includes('permission denied')) {
          console.error("Migration seems to be needed:", error);
          setMigrationNeeded(true);
        } else {
          setMigrationNeeded(false);
        }
      } catch (err) {
        console.error("Error checking migration status:", err);
        setMigrationNeeded(true);
      } finally {
        setChecking(false);
      }
    };

    checkMigration();
  }, []);

  return { migrationNeeded, checking };
};
