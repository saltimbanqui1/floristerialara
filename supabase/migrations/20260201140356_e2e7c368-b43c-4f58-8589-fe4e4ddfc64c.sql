-- Add DELETE policy for profiles table (GDPR Right to Erasure compliance)
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);