
-- Rate limiting table for edge functions
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_ip TEXT NOT NULL,
  function_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits (client_ip, function_name, created_at DESC);

-- Auto-cleanup: delete entries older than 10 minutes
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE created_at < now() - interval '10 minutes';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_cleanup_rate_limits
AFTER INSERT ON public.rate_limits
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_rate_limits();

-- RLS: only service_role can access
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies = no access for anon/authenticated, only service_role bypasses RLS
