-- Explicitly block anonymous SELECT on user_roles to prevent role enumeration
CREATE POLICY "Block anonymous user_roles select"
ON public.user_roles
FOR SELECT
TO anon
USING (false);