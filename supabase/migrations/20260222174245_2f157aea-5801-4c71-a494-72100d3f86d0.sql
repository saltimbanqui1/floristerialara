
-- Create delivery_zones table for managing allowed ZIP codes and fees
CREATE TABLE public.delivery_zones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  postal_code text NOT NULL UNIQUE,
  municipality text NOT NULL,
  zone_name text NOT NULL DEFAULT 'Estándar',
  delivery_cost numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Everyone can read delivery zones (public data)
CREATE POLICY "Delivery zones are viewable by everyone"
ON public.delivery_zones
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_delivery_zones_updated_at
BEFORE UPDATE ON public.delivery_zones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Santa Cruz ZIP codes
INSERT INTO public.delivery_zones (postal_code, municipality, zone_name, delivery_cost) VALUES
('38001', 'Santa Cruz de Tenerife', 'Local', 3.00),
('38002', 'Santa Cruz de Tenerife', 'Local', 3.00),
('38003', 'Santa Cruz de Tenerife', 'Local', 3.00),
('38004', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38005', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38006', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38007', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38008', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38009', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38010', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38011', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38120', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38129', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38130', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38139', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38140', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38150', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38160', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38170', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38180', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38190', 'Santa Cruz de Tenerife', 'Estándar', 7.00),
('38291', 'Santa Cruz de Tenerife', 'Alejada', 12.00),
('38294', 'Santa Cruz de Tenerife', 'Alejada', 12.00),
-- La Laguna ZIP codes
('38201', 'San Cristóbal de La Laguna', 'Local', 3.00),
('38202', 'San Cristóbal de La Laguna', 'Local', 3.00),
('38203', 'San Cristóbal de La Laguna', 'Local', 3.00),
('38204', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38205', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38206', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38207', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38208', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38240', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38250', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38260', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38270', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38290', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38293', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38296', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38297', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38320', 'San Cristóbal de La Laguna', 'Estándar', 7.00),
('38330', 'San Cristóbal de La Laguna', 'Estándar', 7.00);
