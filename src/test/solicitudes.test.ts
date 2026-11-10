import { describe, expect, it } from "vitest";

import { EMAIL, TIPOS, WHATSAPP_URL, solicitudSchema } from "@/lib/solicitudes";

const valida = {
  nombre: "Carla Estrada",
  contacto: "carla@example.com",
  estacion: "EXA FM 99.7 Colima",
  tipo: "Queja",
  mensaje: "La publicidad del programa de la mañana se presentó como noticia.",
};

describe("Buzón de la Audiencia", () => {
  it("rechaza una solicitud cuyo mensaje tiene menos de 10 caracteres", () => {
    expect(solicitudSchema.safeParse({ ...valida, mensaje: "corto" }).success).toBe(false);
  });

  it("rechaza un tipo que no sea Recomendación, Queja o Consulta", () => {
    expect(solicitudSchema.safeParse({ ...valida, tipo: "Reclamo" }).success).toBe(false);
  });

  it("pone Recomendación como primera opción, no Queja", () => {
    expect(TIPOS[0]).toBe("Recomendación");
    expect(TIPOS).toEqual(["Recomendación", "Queja", "Consulta"]);
  });

  it("acepta una recomendación", () => {
    expect(solicitudSchema.safeParse({ ...valida, tipo: "Recomendación" }).success).toBe(true);
  });

  it("rechaza una solicitud sin forma de contacto", () => {
    expect(solicitudSchema.safeParse({ ...valida, contacto: "" }).success).toBe(false);
  });

  it("acepta una queja completa", () => {
    const r = solicitudSchema.safeParse(valida);
    expect(r.success).toBe(true);
  });

  it("usa el correo y el WhatsApp de la Defensoría", () => {
    expect(EMAIL).toBe("derechos@defensoriaradio.com");
    expect(WHATSAPP_URL).toContain("wa.me/525631736994");
  });
});
