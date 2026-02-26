
-- =============================================
-- 1. FIX orders TABLE: Replace permissive INSERT, add UPDATE/DELETE policies
-- =============================================

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Allow inserts only via service_role (edge functions use service_role key)
-- Guest checkout inserts are done by verify-payment using SUPABASE_SERVICE_ROLE_KEY,
-- so no public INSERT policy is needed at all. The service_role bypasses RLS.

-- Add UPDATE policy: only the order owner can update their own orders
CREATE POLICY "Owner can update own orders"
ON public.orders FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy: only the order owner can delete their own orders
CREATE POLICY "Owner can delete own orders"
ON public.orders FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================
-- 2. FIX order_items TABLE: Replace permissive INSERT, add UPDATE/DELETE policies
-- =============================================

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- No public INSERT policy needed - order_items are created by verify-payment
-- using service_role which bypasses RLS

-- Add UPDATE policy: only if user owns the parent order
CREATE POLICY "Owner can update own order items"
ON public.order_items FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));

-- Add DELETE policy: only if user owns the parent order
CREATE POLICY "Owner can delete own order items"
ON public.order_items FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));

-- =============================================
-- 3. FIX products TABLE: Block all write operations for non-admin
-- =============================================

-- Block INSERT for all (admin uses service_role)
CREATE POLICY "Block product inserts"
ON public.products FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- Block UPDATE for all
CREATE POLICY "Block product updates"
ON public.products FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Block DELETE for all
CREATE POLICY "Block product deletes"
ON public.products FOR DELETE
TO anon, authenticated
USING (false);

-- =============================================
-- 4. FIX delivery_zones TABLE: Block all write operations
-- =============================================

CREATE POLICY "Block delivery zone inserts"
ON public.delivery_zones FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block delivery zone updates"
ON public.delivery_zones FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Block delivery zone deletes"
ON public.delivery_zones FOR DELETE
TO anon, authenticated
USING (false);
