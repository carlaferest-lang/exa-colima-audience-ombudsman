import { z } from "zod";

export const EMAIL = "derechos@defensoriaradio.com";
export const WHATSAPP_DIGITOS = "525631736994";
export const WHATSAPP_LABEL = "56 3173 6994";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_DIGITOS}?text=${encodeURIComponent(
  "Hola, quiero hacer llegar una recomendación, queja o consulta a la Defensoría de las Audiencias.",
)}`;

export const TIPOS = ["Recomendación", "Queja", "Consulta"] as const;

export const solicitudSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  contacto: z.string().trim().min(5, "Ingresa un correo o teléfono").max(255),
  estacion: z.string().trim().min(1, "Indica la estación").max(100),
  fechaTransmision: z.string().trim().max(50).optional(),
  tipo: z.enum(TIPOS),
  mensaje: z.string().trim().min(10, "Describe tu solicitud (mín. 10 caracteres)").max(2000),
});

export type SolicitudInput = z.input<typeof solicitudSchema>;
