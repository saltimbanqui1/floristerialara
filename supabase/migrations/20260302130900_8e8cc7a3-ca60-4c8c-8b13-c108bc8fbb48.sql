
-- Block anonymous/public INSERT on user_roles (explicit deny)
CREATE POLICY "Block user_roles inserts"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Block user_roles updates"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Block user_roles deletes"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (false);
