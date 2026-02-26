
-- Drop the existing restrictive SELECT policy that only allows authenticated users with matching user_id
-- Guest orders have user_id = NULL, so this policy already blocks anon reads
-- But we need an explicit anon-blocking policy for defense in depth

-- Add explicit policy to block anonymous users from reading orders
CREATE POLICY "Block anonymous order access"
ON public.orders FOR SELECT
TO anon
USING (false);

-- Add explicit policy to block anonymous users from reading order_items  
CREATE POLICY "Block anonymous order_items access"
ON public.order_items FOR SELECT
TO anon
USING (false);
