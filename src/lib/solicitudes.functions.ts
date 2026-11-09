import { createServerFn } from "@tanstack/react-start";

import { solicitudSchema } from "./solicitudes";

export const registrarSolicitud = createServerFn({ method: "POST" })
  .inputValidator(solicitudSchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: fila, error } = await supabaseAdmin
      .from("audiencia_solicitudes")
      .insert({
        nombre: data.nombre,
        contacto: data.contacto,
        estacion: data.estacion,
        fecha_transmision: data.fechaTransmision?.trim() ? data.fechaTransmision.trim() : null,
        tipo: data.tipo,
        mensaje: data.mensaje,
        canal: "formulario",
      })
      .select("folio")
      .single();

    if (error || !fila) {
      console.error("No se pudo registrar la solicitud:", error);
      throw new Error("No fue posible registrar tu solicitud. Inténtalo de nuevo.");
    }

    return { folio: fila.folio };
  });
