import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const solicitudSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  contacto: z.string().trim().min(5, "Ingresa un correo o teléfono").max(255),
  estacion: z.string().trim().min(1, "Indica la estación").max(100),
  fechaTransmision: z.string().trim().max(50).optional(),
  tipo: z.enum(["Queja", "Sugerencia", "Consulta"]),
  mensaje: z.string().trim().min(10, "Describe tu solicitud (mín. 10 caracteres)").max(2000),
});

export type SolicitudInput = z.input<typeof solicitudSchema>;

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
