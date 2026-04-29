-- Harden has_role(): prevent authenticated users from probing other users' roles.
-- Service role bypasses this restriction (used by edge functions / admin tooling).
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (
        -- Allow service_role to check any user
        (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
        -- Otherwise restrict checks to the caller's own uid
        OR _user_id = auth.uid()
      )
  )
$$;