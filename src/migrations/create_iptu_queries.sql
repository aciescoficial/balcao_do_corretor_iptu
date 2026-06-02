-- Table for logging IPTU queries per associate
CREATE TABLE IF NOT EXISTS public.iptu_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_params JSONB NOT NULL,
  result_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_iptu_queries_user_id ON public.iptu_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_iptu_queries_created_at ON public.iptu_queries(created_at);

ALTER TABLE public.iptu_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own iptu queries"
  ON public.iptu_queries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all iptu queries"
  ON public.iptu_queries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user
      WHERE id = auth.uid() AND role IN ('admin', 'diretoria')
    )
  );

CREATE POLICY "Service role can manage iptu queries"
  ON public.iptu_queries
  USING (true)
  WITH CHECK (true);
