-- Block all direct client access to rate_limits table
-- Edge functions use service_role which bypasses RLS

CREATE POLICY "Block rate_limits select" ON public.rate_limits
FOR SELECT USING (false);

CREATE POLICY "Block rate_limits insert" ON public.rate_limits
FOR INSERT WITH CHECK (false);

CREATE POLICY "Block rate_limits update" ON public.rate_limits
FOR UPDATE USING (false);

CREATE POLICY "Block rate_limits delete" ON public.rate_limits
FOR DELETE USING (false);