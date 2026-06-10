-- ============================================================
-- AMADOBOOK — Datos de prueba (seed)
-- Correr DESPUÉS del schema.sql y DESPUÉS de crear tu cuenta admin
-- ============================================================

-- Servicios de ejemplo
INSERT INTO public.services (name, description, duration_min, price, is_active, display_order)
VALUES
  ('Corte clásico',     'Corte tradicional con tijera y navaja',   30, 200, TRUE, 1),
  ('Degradado',         'Fade moderno con máquina',                 40, 250, TRUE, 2),
  ('Corte + Barba',     'Corte completo más arreglo de barba',      45, 300, TRUE, 3),
  ('Degradado + Barba', 'Fade con arreglo completo de barba',       60, 350, TRUE, 4),
  ('Diseño de Barba',   'Perfilado y diseño de barba',              20, 150, TRUE, 5),
  ('Corte Niños',       'Corte para menores de 12 años',            30, 180, TRUE, 6);

-- Paquete de ejemplo
INSERT INTO public.packages (name, description, regular_price, category, is_active)
VALUES
  ('Paquete Clásico',   'Corte clásico + Barba',                   450, 'Clásico',  TRUE),
  ('Paquete Premium',   'Degradado + Barba + Diseño',               600, 'Premium',  TRUE);

SELECT 'Seed completado ✅' as resultado;
