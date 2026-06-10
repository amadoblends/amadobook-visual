-- ============================================================
-- AMADOBOOK — Hacer admin a tu cuenta
-- 1. Primero regístrate con tu email en la app
-- 2. Luego corre este SQL en Supabase SQL Editor
--    cambiando 'tu-email@gmail.com' por tu email real
-- ============================================================

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'tu-email@gmail.com';

-- Verificar que funcionó:
SELECT id, email, role, full_name
FROM public.profiles
WHERE email = 'tu-email@gmail.com';
