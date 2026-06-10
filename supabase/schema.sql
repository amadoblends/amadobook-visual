-- ============================================================
-- AMADOBOOK — Schema completo de la base de datos
-- Correr en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: profiles
-- ============================================================
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL CHECK (role IN ('admin', 'client')) DEFAULT 'client',
  full_name     TEXT NOT NULL DEFAULT '',
  phone         TEXT,
  email         TEXT,
  birth_date    DATE,
  avatar_url    TEXT,
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  push_token    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: services
-- ============================================================
CREATE TABLE public.services (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT,
  duration_min  INTEGER NOT NULL,
  price         NUMERIC(10,2) NOT NULL,
  image_url     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: packages
-- ============================================================
CREATE TABLE public.packages (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  description    TEXT,
  regular_price  NUMERIC(10,2) NOT NULL,
  discount_price NUMERIC(10,2),
  category       TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  image_urls     TEXT[],
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: package_services
-- ============================================================
CREATE TABLE public.package_services (
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, service_id)
);

-- ============================================================
-- TABLA: offers
-- ============================================================
CREATE TABLE public.offers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  applies_to      TEXT NOT NULL CHECK (applies_to IN ('services', 'packages', 'all')),
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value  NUMERIC(10,2) NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  days_of_week    INTEGER[],
  all_day         BOOLEAN NOT NULL DEFAULT TRUE,
  start_time      TIME,
  end_time        TIME,
  status          TEXT NOT NULL DEFAULT 'scheduled'
                  CHECK (status IN ('active', 'scheduled', 'finished')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.offer_services (
  offer_id   UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, service_id)
);

CREATE TABLE public.offer_packages (
  offer_id   UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, package_id)
);

-- ============================================================
-- TABLA: appointments
-- ============================================================
CREATE TABLE public.appointments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID NOT NULL REFERENCES public.profiles(id),
  service_id      UUID REFERENCES public.services(id),
  package_id      UUID REFERENCES public.packages(id),
  CONSTRAINT appointment_has_one_item CHECK (
    (service_id IS NOT NULL AND package_id IS NULL) OR
    (service_id IS NULL AND package_id IS NOT NULL)
  ),
  scheduled_at    TIMESTAMPTZ NOT NULL,
  duration_min    INTEGER NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  price           NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  final_price     NUMERIC(10,2) NOT NULL,
  payment_method  TEXT CHECK (payment_method IN ('cash', 'card', 'transfer')),
  notes           TEXT,
  cancelled_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_client    ON public.appointments(client_id);
CREATE INDEX idx_appointments_scheduled ON public.appointments(scheduled_at);
CREATE INDEX idx_appointments_status    ON public.appointments(status);
CREATE INDEX idx_appointments_date_status ON public.appointments(scheduled_at, status);

-- ============================================================
-- TABLA: reviews
-- ============================================================
CREATE TABLE public.reviews (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id),
  client_id      UUID NOT NULL REFERENCES public.profiles(id),
  rating         INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: favorites
-- ============================================================
CREATE TABLE public.favorites (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT favorites_has_one_item CHECK (
    (service_id IS NOT NULL AND package_id IS NULL) OR
    (service_id IS NULL AND package_id IS NOT NULL)
  ),
  UNIQUE (client_id, service_id),
  UNIQUE (client_id, package_id)
);

-- ============================================================
-- TABLA: payment_methods
-- ============================================================
CREATE TABLE public.payment_methods (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('visa', 'mastercard', 'amex', 'cash', 'transfer')),
  last_four  TEXT,
  expiry     TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: notifications
-- ============================================================
CREATE TABLE public.notifications (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type     TEXT NOT NULL CHECK (type IN (
             'appointment_confirmed', 'appointment_reminder',
             'appointment_cancelled', 'appointment_completed',
             'new_offer', 'payment_received', 'new_client', 'pending_review'
           )),
  title    TEXT NOT NULL,
  body     TEXT NOT NULL,
  data     JSONB,
  is_read  BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, sent_at DESC);

-- ============================================================
-- TABLA: blocked_times
-- ============================================================
CREATE TABLE public.blocked_times (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  starts_at  TIMESTAMPTZ NOT NULL,
  ends_at    TIMESTAMPTZ NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated     BEFORE UPDATE ON public.profiles     FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER trg_services_updated     BEFORE UPDATE ON public.services     FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER trg_packages_updated     BEFORE UPDATE ON public.packages     FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER trg_offers_updated       BEFORE UPDATE ON public.offers       FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
CREATE TRIGGER trg_appointments_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================================
-- TRIGGER: crear perfil automáticamente al registrarse
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- FUNCIÓN: is_admin() — helper para RLS
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_services  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_packages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_times   ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Admin: full access profiles"  ON public.profiles FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Client: read own profile"     ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Client: update own profile"   ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Appointments
CREATE POLICY "Admin: full access appointments" ON public.appointments FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Client: read own appointments"   ON public.appointments FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Client: create appointment"      ON public.appointments FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Client: update own appointment"  ON public.appointments FOR UPDATE USING (client_id = auth.uid() AND status NOT IN ('completed')) WITH CHECK (client_id = auth.uid());

-- Services (public read, admin write)
CREATE POLICY "Public: read active services" ON public.services FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admin: manage services"       ON public.services FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Packages (public read, admin write)
CREATE POLICY "Public: read active packages" ON public.packages FOR SELECT USING (is_active = TRUE OR is_admin());
CREATE POLICY "Admin: manage packages"       ON public.packages FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Package services
CREATE POLICY "Public: read package_services" ON public.package_services FOR SELECT USING (TRUE);
CREATE POLICY "Admin: manage package_services" ON public.package_services FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Offers (public read, admin write)
CREATE POLICY "Public: read offers" ON public.offers FOR SELECT USING (TRUE);
CREATE POLICY "Admin: manage offers" ON public.offers FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Public: read offer_services" ON public.offer_services FOR SELECT USING (TRUE);
CREATE POLICY "Admin: manage offer_services" ON public.offer_services FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Public: read offer_packages" ON public.offer_packages FOR SELECT USING (TRUE);
CREATE POLICY "Admin: manage offer_packages" ON public.offer_packages FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Reviews
CREATE POLICY "Public: read reviews"   ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Client: create review"  ON public.reviews FOR INSERT WITH CHECK (client_id = auth.uid());
CREATE POLICY "Admin: manage reviews"  ON public.reviews FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Favorites
CREATE POLICY "Client: manage favorites" ON public.favorites FOR ALL USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());
CREATE POLICY "Admin: read favorites"    ON public.favorites FOR SELECT USING (is_admin());

-- Payment methods
CREATE POLICY "Client: manage payment_methods" ON public.payment_methods FOR ALL USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());
CREATE POLICY "Admin: read payment_methods"    ON public.payment_methods FOR SELECT USING (is_admin());

-- Notifications
CREATE POLICY "User: read own notifications"  ON public.notifications FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Admin: insert notifications"   ON public.notifications FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "User: mark own read"           ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Blocked times
CREATE POLICY "Admin: manage blocked_times"   ON public.blocked_times FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Public: read blocked_times"    ON public.blocked_times FOR SELECT USING (TRUE);

-- ============================================================
-- STORAGE: crear buckets
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars',  'avatars',  TRUE),
  ('services', 'services', TRUE),
  ('packages', 'packages', TRUE)
ON CONFLICT DO NOTHING;

-- Policies de storage
CREATE POLICY "Public read avatars"  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth upload avatars"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Own delete avatars"   ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read services"  ON storage.objects FOR SELECT USING (bucket_id = 'services');
CREATE POLICY "Admin manage services storage" ON storage.objects FOR ALL USING (bucket_id = 'services' AND is_admin());

CREATE POLICY "Public read packages"  ON storage.objects FOR SELECT USING (bucket_id = 'packages');
CREATE POLICY "Admin manage packages storage" ON storage.objects FOR ALL USING (bucket_id = 'packages' AND is_admin());
