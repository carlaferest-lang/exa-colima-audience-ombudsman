CREATE OR REPLACE FUNCTION public.registrar_solicitud(
  _nombre text, _contacto text, _estacion text, _fecha_transmision text, _tipo text, _mensaje text
) RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _folio text;
BEGIN
  _nombre := btrim(coalesce(_nombre, ''));
  _contacto := btrim(coalesce(_contacto, ''));
  _estacion := btrim(coalesce(_estacion, ''));
  _mensaje := btrim(coalesce(_mensaje, ''));
  _fecha_transmision := nullif(btrim(coalesce(_fecha_transmision, '')), '');
  IF length(_nombre) < 2 OR length(_nombre) > 100 THEN RAISE EXCEPTION 'nombre inválido'; END IF;
  IF length(_contacto) < 5 OR length(_contacto) > 255 THEN RAISE EXCEPTION 'contacto inválido'; END IF;
  IF length(_estacion) < 1 OR length(_estacion) > 100 THEN RAISE EXCEPTION 'estación inválida'; END IF;
  IF _fecha_transmision IS NOT NULL AND length(_fecha_transmision) > 50 THEN RAISE EXCEPTION 'fecha inválida'; END IF;
  IF length(_mensaje) < 10 OR length(_mensaje) > 2000 THEN RAISE EXCEPTION 'mensaje inválido'; END IF;

  INSERT INTO public.audiencia_solicitudes (nombre, contacto, estacion, fecha_transmision, tipo, mensaje, canal)
  VALUES (_nombre, _contacto, _estacion, _fecha_transmision, _tipo, _mensaje, 'formulario')
  RETURNING folio INTO _folio;
  RETURN _folio;
END;
$$;

REVOKE ALL ON FUNCTION public.registrar_solicitud(text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.registrar_solicitud(text, text, text, text, text, text) TO anon, authenticated, service_role;