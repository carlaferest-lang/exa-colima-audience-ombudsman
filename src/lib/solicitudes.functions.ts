import { supabase } from "@/integrations/supabase/client";

import type { solicitudSchema } from "./solicitudes";
import type { z } from "zod";

// Runs from the browser through a validated database function, so the form keeps
// saving requests on static hosting (GitHub Pages) as well as on Lovable hosting.
export async function registrarSolicitud({ data }: { data: z.output<typeof solicitudSchema> }) {
  const { data: folio, error } = await supabase.rpc("registrar_solicitud", {
    _nombre: data.nombre,
    _contacto: data.contacto,
    _estacion: data.estacion,
    _fecha_transmision: data.fechaTransmision?.trim() ?? "",
    _tipo: data.tipo,
    _mensaje: data.mensaje,
  });
  if (error || !folio) {
    console.error("No se pudo registrar la solicitud:", error);
    throw new Error("No fue posible registrar tu solicitud. Inténtalo de nuevo.");
  }
  return { folio: folio as string };
}
