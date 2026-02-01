-- Create products table with external buy URLs
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  description TEXT,
  size TEXT,
  image_url TEXT,
  external_buy_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access (products are public)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Insert the products with external URLs
INSERT INTO public.products (id, name, price, original_price, description, size, external_buy_url) VALUES
('presencia', 'Presencia', 48.00, NULL, 'Arreglo floral elegante', 'Arreglo floral - 48,00 €', 'https://www.floristerialaraonline.com/p11677603-presencia.html'),
('cedro', 'Cédro', 68.00, NULL, 'Caja de plantas naturales', 'Caja de plantas naturales - 68,00 €', 'https://www.floristerialaraonline.com/p11316788-pl-6-caja-madera-plantas.html'),
('olivo', 'Olivo', 41.00, NULL, 'Composición natural', 'Composición natural - 41,00 €', 'https://www.floristerialaraonline.com/p11314438-pl-6-suave.html'),
('amor', 'Amor', 45.00, NULL, 'Ramo romántico', 'Ramo romántico - 45,00 €', 'https://www.floristerialaraonline.com/p11189691-amor-en-rojo-y-blaco.html'),
('suave', 'Suave', 90.00, NULL, 'Arreglo premium', 'Arreglo premium - 90,00 €', 'https://www.floristerialaraonline.com/p10956756-san-valentin.html'),
('ebano', 'Ébano', 48.00, NULL, 'Composición elegante', 'Composición elegante - 48,00 €', 'https://www.floristerialaraonline.com/p10558856-combo.html'),
('picea', 'Picea', 33.15, 39.00, 'Arreglo especial', 'Arreglo especial - 33,15 €', 'https://www.floristerialaraonline.com/p10553216-picea.html'),
('esplendor', 'Esplendor', 115.00, NULL, 'Arreglo de lujo', 'Arreglo de lujo - 115,00 €', 'https://www.floristerialaraonline.com/p9795836-esplendor-para-mama.html');

-- Create profiles table for customer data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  country TEXT DEFAULT 'España',
  city TEXT,
  province TEXT,
  address TEXT,
  postal_code TEXT,
  -- Shipping address (if different)
  shipping_first_name TEXT,
  shipping_last_name TEXT,
  shipping_phone TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  shipping_province TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();