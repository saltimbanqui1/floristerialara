INSERT INTO public.products (id, name, price, description, size, image_url)
VALUES ('test-lara', 'Test Lara', 1.00, 'Producto de prueba interno (no visible en catálogo)', 'Test', '/placeholder.svg')
ON CONFLICT (id) DO NOTHING;