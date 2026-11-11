import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Radio, ShieldCheck, Megaphone, MessageSquareReply, Baby, Users, FileText, Download,
  Menu, X, CheckCircle2, ChevronDown, Scale, Mail, Building2, ArrowRight, Mic,
  ClipboardList, AlertCircle, Accessibility, PhoneCall,
} from "lucide-react";

// Logos are served from /public so they load on any host, including GitHub Pages.
const logoMark = { url: "/brand/defensoria-radio-mark.png" };
const logo = { url: "/brand/defensoria-radio-logo.png" };
const logoFull = { url: "/brand/defensoria-radio-logo-full.png" };
import { registrarSolicitud } from "@/lib/solicitudes.functions";
import { EMAIL, TEL_URL, TIPOS, WHATSAPP_LABEL, WHATSAPP_URL, solicitudSchema } from "@/lib/solicitudes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Defensoría Radio – Tus Derechos como Audiencia | EXA FM 99.7 Colima" },
      { name: "description", content: "Defensoría independiente de las audiencias de EXA FM 99.7 Colima, a cargo de la Mtra. Carla Fernanda Estrada Alonso. Conoce tus derechos, el Código de Ética y presenta tu queja por el formulario o por audio de WhatsApp." },
      { property: "og:title", content: "Defensoría Radio – Tus Derechos como Audiencia" },
      { property: "og:description", content: "Tu voz en la radio, escuchada y defendida. Presenta tu queja por el formulario o con un audio de voz por WhatsApp." },
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
  { n: "I", t: "Disposiciones generales", d: "Datos de la concesión XHCOC-FM 99.7 MHz, marco jurídico aplicable, misión, visión y valores rectores de la estación." },
  { n: "II", t: "Programación y derechos", d: "Publicación de la barra de programación y los cinco derechos que tiene toda persona que escucha EXA 99.7." },
  { n: "III", t: "Responsabilidades de la transmisión", d: "Separación entre noticias y opiniones, distinción publicitaria y protección a grupos vulnerables." },
  { n: "IV", t: "La Defensoría y mecanismos de atención", d: "Designación de la Defensora, procedimiento de quejas, información mínima, plazos de respuesta y derecho de réplica." },
  { n: "V", t: "Publicidad y transparencia", d: "Publicación de reportes estadísticos, resoluciones y recomendaciones ante la CRT en abril y octubre." },
];

const channels = [
  {
    icon: ClipboardList,
    title: "Por el formulario",
    text: "Escribe tu recomendación, queja o consulta en el Buzón de la Audiencia. Al enviarla recibes un folio con el que das seguimiento.",
    cta: "Ir al formulario",
    href: "#buzon",
    action: "form" as const,
  },
  {
    icon: Mic,
    title: "Con un audio de voz por WhatsApp",
    text: `Si te es más fácil hablar que escribir, manda un audio de voz al WhatsApp ${WHATSAPP_LABEL} contando lo que escuchaste: estación, hora y el motivo de tu solicitud.`,
    cta: "Enviar audio por WhatsApp",
    href: WHATSAPP_URL,
    action: "wa" as const,
  },
];

const schema = solicitudSchema;

const accessOptions = [
  {
    icon: Mic,
    title: "Mandar un audio",
    text: `Graba un audio de voz por WhatsApp al ${WHATSAPP_LABEL} contando lo que escuchaste.`,
    cta: "Enviar audio",
    href: WHATSAPP_URL,
    external: true,
  },
  {
    icon: Mail,
    title: "Mandar un correo",
    text: `Escríbenos a ${EMAIL} y te ayudamos a redactar tu solicitud.`,
    cta: "Escribir correo",
    href: `mailto:${EMAIL}?subject=${encodeURIComponent("Apoyo para levantar mi solicitud")}`,
    external: false,
  },
  {
    icon: PhoneCall,
    title: "Llamar y agendar cita",
    text: "Llámanos y agenda una cita para levantar tu petición de forma personal.",
    cta: "Llamar para agendar",
    href: TEL_URL,
    external: false,
  },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [fallo, setFallo] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const r = schema.safeParse(data);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setFallo(null);
    setEnviando(true);
    try {
      const { folio } = await registrarSolicitud({ data: r.data });
      setSent(folio);
      form.reset();
    } catch {
      setFallo("No fue posible enviar tu solicitud. Inténtalo de nuevo o manda un audio de voz por WhatsApp.");
    } finally {
      setEnviando(false);
    }
  }

  const field = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20";
  const label = "mb-1.5 block text-sm font-medium text-foreground";
  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <a href="#inicio" aria-label="Defensoría Radio, inicio" className="shrink-0">
            <img src={logo.url} alt="Defensoría Radio – Defensoría de los derechos de las audiencias" className="h-11 w-auto md:h-12" />
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
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="inline-flex rounded-2xl bg-background px-5 py-3 shadow-lift">
            <img src={logoFull.url} alt="Defensoría Radio – Defensoría de los derechos de las audiencias" className="h-14 w-auto md:h-16" />
          </div>
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Defensoría de Audiencias · EXA FM 99.7 Colima
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Tu voz en la radio, escuchada y defendida</h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80">
            Somos el enlace independiente entre la audiencia y EXA FM 99.7 Colima. Recibimos, analizamos y damos seguimiento a tus recomendaciones, quejas y consultas para garantizar contenidos responsables.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#buzon" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 py-3.5 font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-lift">Presentar un reporte <ArrowRight className="h-4 w-4" /></a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3.5 font-semibold transition hover:bg-primary-foreground/10"><Mic className="h-4 w-4" /> Enviar audio por WhatsApp</a>
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

      {/* Titular */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 rounded-2xl bg-background p-6 shadow-card md:grid-cols-[auto_1fr] md:items-center md:p-10">
            <div className="flex items-center gap-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-secondary">
                <img src={logoMark.url} alt="" aria-hidden="true" className="h-14 w-14" />
              </span>
              <div className="md:hidden">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Titular de la Defensoría</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight">Mtra. Carla Fernanda Estrada Alonso</h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Especialista en Derecho</p>
              </div>
            </div>
            <div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Titular de la Defensoría</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight">Mtra. Carla Fernanda Estrada Alonso</h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Especialista en Derecho</p>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                La Titular recibe, analiza y da seguimiento a las recomendaciones, quejas y consultas de la audiencia, y gestiona ante la emisora las respuestas y rectificaciones que correspondan, conforme a la Ley Federal de Telecomunicaciones y Radiodifusión y a los Lineamientos Generales sobre la Defensa de las Audiencias.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-medium transition hover:bg-card">
                  <Mail className="h-4 w-4 text-primary" /> {EMAIL}
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-medium transition hover:bg-card">
                  <Mic className="h-4 w-4 text-primary" /> WhatsApp {WHATSAPP_LABEL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rights */}
      <section id="derechos" className="py-20">
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
      <section id="codigo" className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Código de Ética</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Código de Ética para las Audiencias de EXA 99.7 FM</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Documento oficial de JA RADIO, S. de R.L. de C.V., en cumplimiento de la Ley Federal de Telecomunicaciones y Radiodifusión. Puedes consultarlo completo aquí mismo.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ethics.map((e) => (
              <div key={e.n} className="rounded-2xl bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                <span className="text-sm font-bold text-primary/60">Cap. {e.n}</span>
                <h3 className="mt-2 font-semibold">{e.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-card">
            <div className="flex items-center gap-3 border-b border-border bg-card px-6 py-4">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Código de Ética para las Audiencias · JA RADIO (EXA 99.7 FM)</span>
              <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">Consulta en línea · Documento vigente</span>
            </div>
            <iframe
              src="/codigo-de-etica.pdf#toolbar=0&navpanes=0&view=FitH"
              title="Código de Ética para las Audiencias de EXA 99.7 FM"
              className="h-[70vh] w-full bg-background"
            />
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Cómo hacer llegar tu solicitud</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">Dos formas de comunicarte con la Defensoría</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          Puedes escribir tu recomendación, queja o consulta en el formulario o, si prefieres, enviar un audio de voz por WhatsApp. Ambos canales llegan a la misma instancia y reciben seguimiento.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {channels.map((c) => (
            <div key={c.title} className="flex flex-col rounded-2xl bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground"><c.icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{c.text}</p>
              <a
                href={c.href}
                {...(c.action === "wa" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-6 inline-flex items-center gap-2 self-start rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-deep"
              >
                {c.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-primary/15 bg-secondary p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><Accessibility className="h-6 w-6" /></span>
            <div>
              <h3 className="text-lg font-semibold">¿Tienes alguna limitación o discapacidad?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Con gusto te apoyamos a levantar tu reclamación: una persona de la Defensoría la redacta contigo y la registra a tu nombre con su folio de seguimiento. Elige la vía que te resulte más fácil.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {accessOptions.map((o) => (
              <div key={o.title} className="flex flex-col rounded-xl bg-background p-5 shadow-card">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary"><o.icon className="h-5 w-5" /></span>
                <h4 className="mt-3 font-semibold">{o.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{o.text}</p>
                <a
                  href={o.href}
                  {...(o.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary transition hover:underline"
                >
                  {o.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">En cualquiera de las tres vías</strong>, indícanos tu nombre y un número de contacto o un correo: son necesarios para poder darte respuesta y entregarte tu folio.
          </p>
        </div>
      </section>

      {/* Form */}
      <section id="buzon" className="bg-muted py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Buzón de la Audiencia</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Cuéntanos qué escuchaste</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Tu solicitud será revisada por la Titular de la Defensoría. Si prefieres no escribir, manda un audio de voz al WhatsApp {WHATSAPP_LABEL}.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${EMAIL}`} className="underline-offset-4 hover:underline">{EMAIL}</a>
              </p>
              <p className="flex items-center gap-3">
                <Mic className="h-4 w-4 shrink-0 text-primary" />
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">WhatsApp {WHATSAPP_LABEL} · audio de voz</a>
              </p>
              <p className="flex items-center gap-3">
                <PhoneCall className="h-4 w-4 shrink-0 text-primary" />
                <a href={TEL_URL} className="underline-offset-4 hover:underline">Llamar para agendar una cita</a>
              </p>
              <p className="flex items-center gap-3"><Scale className="h-4 w-4 shrink-0 text-primary" /> Art. 259 LFTR</p>
            </div>
            <p className="mt-6 rounded-xl border border-primary/15 bg-secondary p-4 text-sm leading-relaxed text-muted-foreground">
              <strong className="font-semibold text-foreground">¿Tienes alguna limitación o discapacidad?</strong> Manda un audio de voz por WhatsApp, escríbenos a {EMAIL} o llámanos para agendar una cita y levantar tu petición de forma personal. Te apoyamos a redactarla y la registramos por ti con su folio.
            </p>
          </div>
          <div className="rounded-2xl bg-background p-6 shadow-card md:p-8 lg:col-span-3">
            {sent ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
                <h3 className="mt-4 text-xl font-semibold">Solicitud recibida</h3>
                <p className="mt-2 text-muted-foreground">Folio de seguimiento: <strong className="text-foreground">{sent}</strong></p>
                <p className="mt-1 text-sm text-muted-foreground">Guarda tu folio para dar seguimiento a tu solicitud.</p>
                <button onClick={() => setSent(null)} className="mt-6 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-card">Enviar otra solicitud</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                <div><label className={label} htmlFor="nombre">Nombre</label><input id="nombre" name="nombre" className={field} maxLength={100} />{err("nombre")}</div>
                <div><label className={label} htmlFor="contacto">Correo o teléfono</label><input id="contacto" name="contacto" className={field} maxLength={255} />{err("contacto")}</div>
                <div><label className={label} htmlFor="estacion">Estación / Frecuencia</label><input id="estacion" name="estacion" defaultValue="EXA FM 99.7 Colima" className={field} maxLength={100} />{err("estacion")}</div>
                <div><label className={label} htmlFor="fechaTransmision">Fecha y hora de transmisión</label><input id="fechaTransmision" name="fechaTransmision" type="datetime-local" className={field} /></div>
                <div className="sm:col-span-2"><label className={label} htmlFor="tipo">Tipo de solicitud</label>
                  <select id="tipo" name="tipo" className={field} defaultValue={TIPOS[0]}>
                    {TIPOS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2"><label className={label} htmlFor="mensaje">Mensaje</label><textarea id="mensaje" name="mensaje" rows={5} maxLength={2000} className={field} />{err("mensaje")}</div>
                {fallo && (
                  <p className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:col-span-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {fallo}
                  </p>
                )}
                <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">
                  Necesitamos tu nombre y un número de contacto o un correo para poder darte respuesta y entregarte tu folio de seguimiento.
                </p>
                <button type="submit" disabled={enviando} className="rounded-lg bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2">
                  {enviando ? "Enviando…" : "Enviar solicitud"}
                </button>
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
          <div className="grid gap-8 text-sm md:grid-cols-4">
            <div>
              <span className="inline-flex rounded-xl bg-background px-4 py-3">
                <img src={logo.url} alt="Defensoría Radio – Defensoría de los derechos de las audiencias" className="h-14 w-auto" />
              </span>
              <p className="mt-4 text-primary-foreground/70">Instancia independiente, sin subordinación editorial a la emisora.</p>
            </div>
            <div>
              <p className="font-semibold">Titular</p>
              <p className="mt-3 text-primary-foreground/70">Mtra. Carla Fernanda Estrada Alonso<br />Especialista en Derecho</p>
            </div>
            <div>
              <p className="font-semibold">Contacto</p>
              <p className="mt-3 text-primary-foreground/70">
                <a href={`mailto:${EMAIL}`} className="underline-offset-4 hover:underline">{EMAIL}</a><br />
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">WhatsApp {WHATSAPP_LABEL}</a>
              </p>
            </div>
            <div>
              <p className="font-semibold">Marco legal</p>
              <p className="mt-3 text-primary-foreground/70">Ley Federal de Telecomunicaciones y Radiodifusión · Lineamientos Generales sobre la Defensa de las Audiencias.</p>
            </div>
          </div>
          <p className="mt-10 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60">© 2026 Defensoría Radio · EXA FM 99.7 Colima. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
