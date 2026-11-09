import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import {
  Radio, ShieldCheck, Megaphone, MessageSquareReply, Baby, Users, FileText, Download,
  Menu, X, CheckCircle2, ChevronDown, Scale, Mail, Building2, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Defensoría Radio – Tus Derechos como Audiencia | EXA FM 99.7 Colima" },
      { name: "description", content: "Defensoría independiente de las audiencias de EXA FM 99.7 Colima. Conoce tus derechos, el Código de Ética y presenta quejas o sugerencias." },
      { property: "og:title", content: "Defensoría Radio – Tus Derechos como Audiencia" },
      { property: "og:description", content: "Tu voz en la radio, escuchada y defendida. Defensoría de audiencias de EXA FM 99.7 Colima." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#defensoria", label: "¿Qué es la Defensoría?" },
  { href: "#derechos", label: "Derechos de la Audiencia" },
  { href: "#codigo", label: "Código de Ética" },
];

const rights = [
  { icon: ShieldCheck, title: "Veracidad", text: "Recibir información veraz, oportuna y plural, diferenciando claramente los hechos de las opiniones de quien la presenta." },
  { icon: Megaphone, title: "Distinción de publicidad", text: "Que la publicidad se identifique con claridad y no se presente como contenido informativo o editorial." },
  { icon: MessageSquareReply, title: "Derecho de réplica", text: "Solicitar la rectificación de información inexacta o falsa que te afecte, conforme a la ley aplicable." },
  { icon: Baby, title: "Protección a menores", text: "Contenidos que respeten el interés superior de niñas, niños y adolescentes y los horarios de clasificación." },
  { icon: Users, title: "No discriminación", text: "Una programación libre de mensajes que discriminen por origen, género, edad, discapacidad, religión u orientación." },
];

const ethics = [
  { n: "01", t: "Independencia editorial", d: "La emisora garantiza que sus contenidos informativos no estén subordinados a intereses comerciales o políticos." },
  { n: "02", t: "Respeto a la dignidad", d: "Se evitará el lenguaje ofensivo, estigmatizante o que vulnere la intimidad de las personas." },
  { n: "03", t: "Pluralidad de voces", d: "Se procurará la diversidad de opiniones y la inclusión de distintos sectores de la sociedad colimense." },
  { n: "04", t: "Rendición de cuentas", d: "Las quejas de la audiencia serán atendidas por la Defensoría en los plazos previstos por los lineamientos." },
];

const schema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  contact: z.string().trim().min(5, "Ingresa un correo o teléfono").max(255),
  station: z.string().trim().min(1, "Indica la estación").max(100),
  datetime: z.string().trim().max(50).optional(),
  type: z.enum(["Queja", "Sugerencia", "Consulta"]),
  message: z.string().trim().min(10, "Describe tu solicitud (mín. 10 caracteres)").max(2000),
});

function Index() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = schema.safeParse(data);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(`DR-${Date.now().toString().slice(-6)}`);
    e.currentTarget.reset();
  }

  const field = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20";
  const label = "mb-1.5 block text-sm font-medium text-foreground";
  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a href="#inicio" className="flex items-center gap-2.5 font-bold text-primary">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Radio className="h-5 w-5" /></span>
            Defensoría Radio
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-muted-foreground transition hover:text-primary">{n.label}</a>
            ))}
            <a href="#buzon" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:bg-primary-deep">Presentar una Queja / Contacto</a>
          </nav>
          <button className="lg:hidden" aria-label="Menú" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <div className="border-t border-border px-5 py-4 lg:hidden">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-medium">{n.label}</a>
            ))}
            <a href="#buzon" onClick={() => setOpen(false)} className="mt-3 block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">Presentar una Queja / Contacto</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="inicio" className="bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Defensoría de Audiencias · EXA FM 99.7 Colima
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Tu voz en la radio, escuchada y defendida</h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Somos el enlace independiente entre la audiencia y EXA FM 99.7 Colima. Recibimos, analizamos y damos seguimiento a tus quejas, sugerencias y consultas para garantizar contenidos responsables.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#buzon" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 py-3.5 font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-lift">Presentar un reporte <ArrowRight className="h-4 w-4" /></a>
            <a href="#codigo" className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3.5 font-semibold transition hover:bg-primary-foreground/10"><FileText className="h-4 w-4" /> Leer el Código de Ética</a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="defensoria" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">¿Qué es la Defensoría?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Una figura autónoma al servicio de quienes escuchan</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              La Defensoría de las Audiencias es una instancia independiente prevista en la Ley Federal de Telecomunicaciones y Radiodifusión. Su función es proteger tus derechos como oyente, mediar con la emisora y promover una radio ética, plural y de calidad.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
            {[{ k: "Independiente", v: "Sin subordinación editorial" }, { k: "Gratuita", v: "Sin costo para la audiencia" }, { k: "Transparente", v: "Respuesta documentada" }].map((s) => (
              <div key={s.k} className="rounded-xl bg-card p-5 shadow-card">
                <p className="font-bold text-primary">{s.k}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rights */}
      <section id="derechos" className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Derechos de la Audiencia</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">Lo que puedes exigir de cada transmisión</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rights.map((r, i) => {
              const on = active === i;
              return (
                <button
                  key={r.title}
                  onClick={() => setActive(on ? null : i)}
                  className={`group rounded-xl border p-6 text-left transition hover:-translate-y-1 hover:shadow-lift ${on ? "border-primary bg-background shadow-lift" : "border-transparent bg-card shadow-card"}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`grid h-11 w-11 place-items-center rounded-lg transition ${on ? "bg-primary text-primary-foreground" : "bg-accent text-primary"}`}><r.icon className="h-5 w-5" /></span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition ${on ? "rotate-180" : ""}`} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
                  <div className={`grid transition-all duration-300 ${on ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ethics */}
      <section id="codigo" className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Código de Ética</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Principios que rigen nuestra programación</h2>
          </div>
          <button
            onClick={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 2500); }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:bg-primary-deep"
          >
            {downloaded ? <><CheckCircle2 className="h-4 w-4" /> Descarga iniciada</> : <><Download className="h-4 w-4" /> Descargar PDF</>}
          </button>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-border shadow-card">
          <div className="flex items-center gap-3 border-b border-border bg-card px-6 py-4">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Codigo_Etica_EXA_FM_99.7_Colima.pdf</span>
            <span className="ml-auto text-xs text-muted-foreground">Versión vigente · 2026</span>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {ethics.map((e) => (
              <div key={e.n} className="bg-background p-7 transition hover:bg-card">
                <span className="text-sm font-bold text-primary/60">{e.n}</span>
                <h3 className="mt-2 font-semibold">{e.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="buzon" className="bg-muted py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Buzón de la Audiencia</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Cuéntanos qué escuchaste</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">Tu solicitud será revisada por la Defensoría y recibirás respuesta en un plazo máximo de 20 días hábiles.</p>
            <div className="mt-8 space-y-3 text-sm">
              <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> defensoria@defensoriaradio.mx</p>
              <p className="flex items-center gap-3"><Scale className="h-4 w-4 text-primary" /> Art. 259 LFTR</p>
            </div>
          </div>
          <div className="rounded-2xl bg-background p-6 shadow-card md:p-8 lg:col-span-3">
            {sent ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">Solicitud recibida</h3>
                <p className="mt-2 text-muted-foreground">Folio de seguimiento: <strong className="text-foreground">{sent}</strong></p>
                <button onClick={() => setSent(null)} className="mt-6 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-card">Enviar otra solicitud</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                <div><label className={label} htmlFor="name">Nombre</label><input id="name" name="name" className={field} maxLength={100} />{err("name")}</div>
                <div><label className={label} htmlFor="contact">Correo o teléfono</label><input id="contact" name="contact" className={field} maxLength={255} />{err("contact")}</div>
                <div><label className={label} htmlFor="station">Estación / Frecuencia</label><input id="station" name="station" defaultValue="EXA FM 99.7 Colima" className={field} maxLength={100} />{err("station")}</div>
                <div><label className={label} htmlFor="datetime">Fecha y hora de transmisión</label><input id="datetime" name="datetime" type="datetime-local" className={field} /></div>
                <div className="sm:col-span-2"><label className={label} htmlFor="type">Tipo de solicitud</label>
                  <select id="type" name="type" className={field} defaultValue="Queja">
                    <option>Queja</option><option>Sugerencia</option><option>Consulta</option>
                  </select>
                </div>
                <div className="sm:col-span-2"><label className={label} htmlFor="message">Mensaje</label><textarea id="message" name="message" rows={5} maxLength={2000} className={field} />{err("message")}</div>
                <button type="submit" className="rounded-lg bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition hover:bg-primary-deep sm:col-span-2">Enviar solicitud</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <div className="mb-10 flex flex-col items-start gap-4 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 md:flex-row md:items-center">
            <Building2 className="h-6 w-6 shrink-0" />
            <p className="text-sm text-primary-foreground/85">Estructura multicanal: Defensoría Radio está preparada para brindar asesoría y servicio de defensoría a otras estaciones de radiodifusión.</p>
            <a href="#buzon" className="text-sm font-semibold underline-offset-4 hover:underline md:ml-auto">Contactar</a>
          </div>
          <div className="grid gap-8 text-sm md:grid-cols-3">
            <div>
              <p className="flex items-center gap-2 font-bold"><Radio className="h-4 w-4" /> Defensoría Radio</p>
              <p className="mt-3 text-primary-foreground/70">Instancia independiente, sin subordinación editorial a la emisora.</p>
            </div>
            <div>
              <p className="font-semibold">Marco legal</p>
              <p className="mt-3 text-primary-foreground/70">Ley Federal de Telecomunicaciones y Radiodifusión · Lineamientos Generales sobre la Defensa de las Audiencias.</p>
            </div>
            <div>
              <p className="font-semibold">Emisoras atendidas</p>
              <p className="mt-3 text-primary-foreground/70">EXA FM 99.7 Colima</p>
            </div>
          </div>
          <p className="mt-10 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60">© 2026 Defensoría Radio. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
