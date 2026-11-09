CREATE TABLE public.audiencia_solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folio TEXT NOT NULL UNIQUE DEFAULT ('DR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))),
  nombre TEXT NOT NULL,
  contacto TEXT NOT NULL,
  estacion TEXT NOT NULL,
  fecha_transmision TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('Queja', 'Sugerencia', 'Consulta')),
  mensaje TEXT NOT NULL,
  canal TEXT NOT NULL DEFAULT 'formulario',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.audiencia_solicitudes TO service_role;

ALTER TABLE public.audiencia_solicitudes ENABLE ROW LEVEL SECURITY;

CREATE INDEX audiencia_solicitudes_created_at_idx ON public.audiencia_solicitudes (created_at DESC);