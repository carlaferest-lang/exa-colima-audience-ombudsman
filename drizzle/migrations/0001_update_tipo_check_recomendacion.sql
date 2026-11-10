ALTER TABLE public.audiencia_solicitudes
  ADD CONSTRAINT audiencia_solicitudes_tipo_check_v2
  CHECK (tipo = ANY (ARRAY['Recomendación'::text, 'Queja'::text, 'Consulta'::text]));

ALTER TABLE public.audiencia_solicitudes
  DROP CONSTRAINT audiencia_solicitudes_tipo_check;