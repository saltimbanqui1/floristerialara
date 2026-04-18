-- Remove overpermissive user UPDATE/DELETE policies on orders
DROP POLICY IF EXISTS "Owner can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Owner can delete own orders" ON public.orders;

-- Remove overpermissive user UPDATE/DELETE policies on order_items
DROP POLICY IF EXISTS "Owner can update own order items" ON public.order_items;
DROP POLICY IF EXISTS "Owner can delete own order items" ON public.order_items;

-- All order mutations now go exclusively through edge functions using the
-- service role key (create-checkout, verify-payment) or through admin
-- accounts via the existing "Admins can update all orders" policy.