-- Add explicit block policies for INSERT/DELETE on orders to guarantee
-- only service_role (which bypasses RLS) can create or remove orders.
CREATE POLICY "Block order inserts from clients"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block order deletes from clients"
ON public.orders
FOR DELETE
TO anon, authenticated
USING (false);

-- Also explicitly block client-side inserts/deletes/updates on order_items
CREATE POLICY "Block order_items inserts from clients"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block order_items updates from clients"
ON public.order_items
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Block order_items deletes from clients"
ON public.order_items
FOR DELETE
TO anon, authenticated
USING (false);