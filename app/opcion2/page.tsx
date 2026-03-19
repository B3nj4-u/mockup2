"use client";

import React, { useMemo, useState } from "react";
import {
  Home,
  CalendarDays,
  ClipboardPenLine,
  FileText,
  Mic,
  Camera,
  FlaskConical,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  WifiOff,
  Wifi,
  Bell,
  Search,
  ChevronRight,
  ArrowUpRight,
  MapPin,
  Thermometer,
  Droplets,
  Activity,
  ShieldCheck,
  Database,
  Workflow,
  BarChart3,
  FolderKanban,
  Users,
  Plus,
  Filter,
  Send,
  Download,
  ClipboardCheck,
  Stethoscope,
  Pill,
  BadgeCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

type VisitStatus = "Pendiente" | "En progreso" | "Completada";
type Priority = "Alta" | "Media" | "Baja";
type TabKey = "inicio" | "visitas" | "registro" | "resumen";

type Visit = {
  id: string;
  centro: string;
  empresa: string;
  fecha: string;
  hora: string;
  veterinario: string;
  region: string;
  estado: VisitStatus;
  prioridad: Priority;
  biomasa: number;
  mortalidad: number;
  temperatura: number;
  oxigeno: number;
  hallazgo: string;
  tareas: number;
  muestrasPendientes: number;
};

const visitsSeed: Visit[] = [
  {
    id: "VST-24031",
    centro: "Centro Salmonero Aysén Norte",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "08:30",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    biomasa: 1240,
    mortalidad: 1.8,
    temperatura: 11.4,
    oxigeno: 8.2,
    hallazgo: "Lesiones branquiales en evaluación",
    tareas: 4,
    muestrasPendientes: 3,
  },
  {
    id: "VST-24032",
    centro: "Centro Chiloé Canal Sur",
    empresa: "Cermaq",
    fecha: "2026-03-21",
    hora: "10:00",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "En progreso",
    prioridad: "Media",
    biomasa: 980,
    mortalidad: 0.9,
    temperatura: 12.1,
    oxigeno: 7.9,
    hallazgo: "Control post vacunación",
    tareas: 2,
    muestrasPendientes: 1,
  },
  {
    id: "VST-24033",
    centro: "Centro Magallanes Este",
    empresa: "Multi X",
    fecha: "2026-03-22",
    hora: "14:00",
    veterinario: "Daniel Pacheco",
    region: "Magallanes",
    estado: "Completada",
    prioridad: "Alta",
    biomasa: 1560,
    mortalidad: 2.1,
    temperatura: 9.6,
    oxigeno: 8.6,
    hallazgo: "Necropsia con sospecha bacteriana",
    tareas: 0,
    muestrasPendientes: 0,
  },
];

const trendData = [
  { mes: "Oct", visitas: 42, alertas: 6 },
  { mes: "Nov", visitas: 51, alertas: 5 },
  { mes: "Dic", visitas: 48, alertas: 4 },
  { mes: "Ene", visitas: 63, alertas: 8 },
  { mes: "Feb", visitas: 70, alertas: 9 },
  { mes: "Mar", visitas: 57, alertas: 5 },
];

const actionsData = [
  { name: "Muestreo", value: 12 },
  { name: "Necropsia", value: 8 },
  { name: "Trat.", value: 6 },
  { name: "Docs", value: 9 },
];

const alertsSeed = [
  {
    titulo: "Mortalidad sobre umbral",
    descripcion: "Aysén Norte registra 1.8%. Revisar jaulas priorizadas.",
    severidad: "Alta",
  },
  {
    titulo: "3 muestras por despachar",
    descripcion: "Despacho requerido antes de las 17:00.",
    severidad: "Media",
  },
  {
    titulo: "Certificado por vencer",
    descripcion: "Renovación pendiente dentro de 48 horas.",
    severidad: "Baja",
  },
];

const diagnosisOptions = [
  "Branquial",
  "Bacteriano",
  "Parasitológico",
  "Post vacunación",
  "Estrés ambiental",
  "Sin hallazgos críticos",
];

const actionOptions = [
  "Aumentar monitoreo",
  "Tomar muestras",
  "Aplicar tratamiento",
  "Reforzar oxigenación",
  "Notificar a equipo",
  "Revisar en 48 h",
];

const quickCaptureOptions = [
  { label: "Dictado", icon: Mic },
  { label: "Foto", icon: Camera },
  { label: "Muestra", icon: FlaskConical },
  { label: "Checklist", icon: ClipboardCheck },
];

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    Pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    "En progreso": "bg-sky-50 text-sky-700 border-sky-200",
    Completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Alta: "bg-rose-50 text-rose-700 border-rose-200",
    Media: "bg-orange-50 text-orange-700 border-orange-200",
    Baja: "bg-slate-100 text-slate-700 border-slate-200",
    Offline: "bg-slate-900 text-white border-slate-900",
    Online: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        styles[value] || styles.Baja
      )}
    >
      {value}
    </span>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  tone?: "blue" | "emerald" | "amber" | "slate";
}) {
  const toneMap = {
    blue: "bg-[#E8F3FC] text-[#0F6CBD]",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", toneMap[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function MicrosoftBadge() {
  return (
    <div className="grid h-9 w-9 grid-cols-2 gap-0.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-[#F25022]" />
      <div className="bg-[#7FBA00]" />
      <div className="bg-[#00A4EF]" />
      <div className="bg-[#FFB900]" />
    </div>
  );
}

function TopBar({
  offline,
  notifications,
}: {
  offline: boolean;
  notifications: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <MicrosoftBadge />
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Microsoft 365</p>
            <h1 className="text-sm font-semibold text-slate-900">Sistema Veterinario</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold",
              offline
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {offline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            {offline ? "Offline" : "Online"}
          </div>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Bell className="h-5 w-5 text-slate-600" />
            {notifications > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {notifications}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchBox() {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        placeholder="Buscar centro, visita o muestra"
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#0F6CBD]"
      />
    </div>
  );
}

function VisitCard({
  visit,
  onOpen,
}: {
  visit: Visit;
  onOpen: (visit: Visit) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-900">{visit.centro}</p>
            <StatusBadge value={visit.estado} />
            <StatusBadge value={visit.prioridad} />
          </div>
          <p className="mt-2 text-sm text-slate-500">{visit.empresa}</p>
        </div>
        <button
          onClick={() => onOpen(visit)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0F6CBD] text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            <span>{visit.fecha}</span>
          </div>
          <p className="mt-1 font-medium text-slate-700">{visit.hora}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Región</span>
          </div>
          <p className="mt-1 font-medium text-slate-700">{visit.region}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {visit.tareas} tareas
        </span>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
          {visit.muestrasPendientes} muestras pendientes
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600">{visit.hallazgo}</p>
    </div>
  );
}

function ActionChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition",
        active
          ? "border-[#0F6CBD] bg-[#E8F3FC] text-[#0F6CBD]"
          : "border-slate-200 bg-white text-slate-700"
      )}
    >
      {label}
    </button>
  );
}

function BottomNav({
  tab,
  setTab,
}: {
  tab: TabKey;
  setTab: (value: TabKey) => void;
}) {
  const items: Array<{ key: TabKey; label: string; icon: React.ElementType }> = [
    { key: "inicio", label: "Inicio", icon: Home },
    { key: "visitas", label: "Visitas", icon: CalendarDays },
    { key: "registro", label: "Registro", icon: ClipboardPenLine },
    { key: "resumen", label: "Resumen", icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 py-2">
        {items.map((item) => {
          const active = tab === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                active ? "bg-[#E8F3FC] text-[#0F6CBD]" : "text-slate-500"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("inicio");
  const [offline] = useState(true);
  const [visits, setVisits] = useState<Visit[]>(visitsSeed);
  const [selectedVisit, setSelectedVisit] = useState<Visit>(visitsSeed[0]);

  const [clinicalNote, setClinicalNote] = useState(
    "Peces con nado errático, leve palidez branquial y aumento de mortalidad respecto de la semana anterior."
  );
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>(["Branquial"]);
  const [selectedActions, setSelectedActions] = useState<string[]>([
    "Aumentar monitoreo",
    "Tomar muestras",
    "Reforzar oxigenación",
  ]);
  const [samples, setSamples] = useState("12 histopatológicas · 8 bacteriológicas · 4 PCR");
  const [nextStep, setNextStep] = useState("Revisar evolución en 48 horas y despachar muestras hoy.");
  const [checklist, setChecklist] = useState([
    { label: "Evaluación clínica", done: true, icon: Stethoscope },
    { label: "Necropsia", done: true, icon: Activity },
    { label: "Muestreo", done: true, icon: FlaskConical },
    { label: "Tratamiento", done: false, icon: Pill },
    { label: "Documentos", done: true, icon: ShieldCheck },
  ]);

  const stats = useMemo(() => {
    return {
      total: visits.length,
      pendientes: visits.filter((v) => v.estado === "Pendiente").length,
      enCurso: visits.filter((v) => v.estado === "En progreso").length,
      completadas: visits.filter((v) => v.estado === "Completada").length,
    };
  }, [visits]);

  const toggleInArray = (
    value: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const openVisit = (visit: Visit) => {
    setSelectedVisit({ ...visit, estado: "En progreso" });
    setVisits((prev) =>
      prev.map((v) => (v.id === visit.id ? { ...v, estado: "En progreso" } : v))
    );
    setTab("registro");
  };

  const finishVisit = () => {
    setSelectedVisit((prev) => ({ ...prev, estado: "Completada" }));
    setVisits((prev) =>
      prev.map((v) => (v.id === selectedVisit.id ? { ...v, estado: "Completada" } : v))
    );
    setTab("resumen");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900">
      <TopBar offline={offline} notifications={3} />

      <main className="mx-auto max-w-md px-4 pb-28 pt-4">
        {tab === "inicio" && (
          <div className="space-y-4">
            <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F6CBD] to-[#115EA3] p-5 text-white shadow-xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Jornada en terreno</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">
                Mobile first, menos escritura y flujo Microsoft 365.
              </h2>
              <p className="mt-3 text-sm text-white/85">
                Registro rápido con dictado, fotos, muestras y cierre automático con Power Platform.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/70">Visitas hoy</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/70">Alertas</p>
                  <p className="mt-2 text-3xl font-semibold">{alertsSeed.length}</p>
                </div>
              </div>

              <button
                onClick={() => openVisit(visits[0])}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white font-semibold text-[#0F6CBD]"
              >
                <ClipboardCheck className="h-5 w-5" />
                Iniciar siguiente visita
              </button>
            </section>

            <SearchBox />

            <section className="grid grid-cols-2 gap-3">
              {quickCaptureOptions.map((item) => (
                <button
                  key={item.label}
                  className="rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F3FC] text-[#0F6CBD]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">Captura rápida</p>
                </button>
              ))}
            </section>

            <section className="grid grid-cols-2 gap-3">
              <MetricCard label="Pendientes" value={stats.pendientes} icon={Clock3} tone="amber" />
              <MetricCard label="En curso" value={stats.enCurso} icon={Activity} tone="blue" />
              <MetricCard
                label="Completadas"
                value={stats.completadas}
                icon={CheckCircle2}
                tone="emerald"
              />
              <MetricCard label="Sin señal" value="2 centros" icon={WifiOff} tone="slate" />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Alertas de hoy"
                subtitle="Lo más urgente primero"
                action={
                  <button className="text-sm font-medium text-[#0F6CBD]">
                    Ver todo
                  </button>
                }
              />
              <div className="space-y-3">
                {alertsSeed.map((alert) => (
                  <div key={alert.titulo} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{alert.titulo}</p>
                        <p className="mt-1 text-sm text-slate-500">{alert.descripcion}</p>
                      </div>
                      <StatusBadge value={alert.severidad} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Actividad" subtitle="Últimos meses" />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="mes"
                      tick={{ fontSize: 12, fill: "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitas" stroke="#0F6CBD" strokeWidth={3} />
                    <Line type="monotone" dataKey="alertas" stroke="#D13438" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-3xl bg-[#0F172A] p-4 text-white shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Power Platform</p>
              <h3 className="mt-2 text-lg font-semibold">Arquitectura visible para el cliente</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Database className="h-4 w-4" />
                    Dataverse
                  </div>
                  <p className="mt-1 text-xs text-white/70">Registro central</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Workflow className="h-4 w-4" />
                    Power Automate
                  </div>
                  <p className="mt-1 text-xs text-white/70">Flujos automáticos</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Teams
                  </div>
                  <p className="mt-1 text-xs text-white/70">Aviso al equipo</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FolderKanban className="h-4 w-4" />
                    SharePoint
                  </div>
                  <p className="mt-1 text-xs text-white/70">Respaldo documental</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {tab === "visitas" && (
          <div className="space-y-4">
            <section className="rounded-[28px] bg-white p-4 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Mis visitas</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Agenda pensada para trabajo móvil.
                  </p>
                </div>
                <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F6CBD] text-white">
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                  <Filter className="h-4 w-4" />
                  Hoy
                </button>
                <button className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                  <MapPin className="h-4 w-4" />
                  Ruta
                </button>
              </div>
            </section>

            <div className="space-y-3">
              {visits.map((visit) => (
                <VisitCard key={visit.id} visit={visit} onOpen={openVisit} />
              ))}
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Visitas cerradas" subtitle="Últimas semanas" />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="mes"
                      tick={{ fontSize: 12, fill: "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar dataKey="visitas" fill="#0F6CBD" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}

        {tab === "registro" && (
          <div className="space-y-4">
            <section className="rounded-[28px] bg-gradient-to-br from-[#0F6CBD] to-[#115EA3] p-5 text-white shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Registro activo</p>
                  <h2 className="mt-2 text-xl font-semibold">{selectedVisit.centro}</h2>
                  <p className="mt-2 text-sm text-white/80">
                    {selectedVisit.empresa} · {selectedVisit.region}
                  </p>
                </div>
                <StatusBadge value={selectedVisit.estado} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-xs text-white/70">Fecha</p>
                  <p className="mt-1 text-sm font-semibold">{selectedVisit.fecha}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-xs text-white/70">Hora</p>
                  <p className="mt-1 text-sm font-semibold">{selectedVisit.hora}</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Biomasa"
                value={`${selectedVisit.biomasa} ton`}
                icon={Activity}
                tone="blue"
              />
              <MetricCard
                label="Mortalidad"
                value={`${selectedVisit.mortalidad}%`}
                icon={AlertTriangle}
                tone="amber"
              />
              <MetricCard
                label="Temperatura"
                value={`${selectedVisit.temperatura} °C`}
                icon={Thermometer}
                tone="slate"
              />
              <MetricCard
                label="Oxígeno"
                value={`${selectedVisit.oxigeno} mg/L`}
                icon={Droplets}
                tone="emerald"
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Captura rápida" subtitle="Un toque y sigues trabajando" />
              <div className="grid grid-cols-2 gap-3">
                {quickCaptureOptions.map((item) => (
                  <button
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3FC] text-[#0F6CBD]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-800">{item.label}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Observación breve" subtitle="Pensado para dictado o texto corto" />
              <textarea
                value={clinicalNote}
                onChange={(e) => setClinicalNote(e.target.value)}
                className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Describe el hallazgo principal..."
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700">
                  <Mic className="h-4 w-4" />
                  Dictar
                </button>
                <button className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700">
                  <Camera className="h-4 w-4" />
                  Adjuntar foto
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Diagnóstico presuntivo"
                subtitle="Menos escribir, más tocar opciones"
              />
              <div className="grid grid-cols-2 gap-3">
                {diagnosisOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedDiagnosis.includes(item)}
                    onClick={() =>
                      toggleInArray(item, selectedDiagnosis, setSelectedDiagnosis)
                    }
                  />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Acción recomendada" subtitle="Selecciona una o varias" />
              <div className="grid grid-cols-2 gap-3">
                {actionOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedActions.includes(item)}
                    onClick={() => toggleInArray(item, selectedActions, setSelectedActions)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Muestras y seguimiento" />
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Muestras</label>
                  <input
                    value={samples}
                    onChange={(e) => setSamples(e.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Próximo paso</label>
                  <input
                    value={nextStep}
                    onChange={(e) => setNextStep(e.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Checklist operacional" subtitle="Marca y sigue" />
              <div className="space-y-3">
                {checklist.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() =>
                        setChecklist((prev) =>
                          prev.map((row, i) =>
                            i === index ? { ...row, done: !row.done } : row
                          )
                        )
                      }
                      className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0F6CBD]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      </div>
                      {item.done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Clock3 className="h-5 w-5 text-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-[#0F172A] p-4 text-white shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Flujo Microsoft</p>
              <h3 className="mt-2 text-lg font-semibold">Al cerrar la visita</h3>
              <div className="mt-4 space-y-3 text-sm text-white/85">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4" />
                  Guardar en Dataverse
                </div>
                <div className="flex items-center gap-3">
                  <Workflow className="h-4 w-4" />
                  Activar Power Automate
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4" />
                  Notificar en Teams
                </div>
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-4 w-4" />
                  Respaldar en SharePoint
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4" />
                  Actualizar Power BI
                </div>
              </div>
            </section>

            <div className="sticky bottom-20 z-30">
              <button
                onClick={finishVisit}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-base font-semibold text-white shadow-lg"
              >
                <BadgeCheck className="h-5 w-5" />
                Finalizar visita
              </button>
            </div>
          </div>
        )}

        {tab === "resumen" && (
          <div className="space-y-4">
            <section className="rounded-[28px] bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Resumen listo</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">{selectedVisit.centro}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {selectedVisit.empresa} · ID {selectedVisit.id}
                  </p>
                </div>
                <StatusBadge value="Completada" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700">
                  <Download className="h-4 w-4" />
                  PDF
                </button>
                <button className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-medium text-white">
                  <Send className="h-4 w-4" />
                  Teams
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Resumen clínico" subtitle="Contenido simple para el cliente" />
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-slate-500">Observación</p>
                  <p className="mt-1 leading-7 text-slate-700">{clinicalNote}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Diagnóstico</p>
                  <p className="mt-1 leading-7 text-slate-700">
                    {selectedDiagnosis.length ? selectedDiagnosis.join(", ") : "Sin selección"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Acciones</p>
                  <p className="mt-1 leading-7 text-slate-700">
                    {selectedActions.length ? selectedActions.join(", ") : "Sin selección"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Muestras</p>
                  <p className="mt-1 leading-7 text-slate-700">{samples}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Próximo paso</p>
                  <p className="mt-1 leading-7 text-slate-700">{nextStep}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Estado de publicación" subtitle="Automatización visible" />
              <div className="space-y-3">
                {[
                  ["Dataverse", "Registro sincronizado", Database],
                  ["Power Automate", "Flujo ejecutado", Workflow],
                  ["Teams", "Aviso enviado al equipo", Users],
                  ["SharePoint", "PDF respaldado", FolderKanban],
                  ["Power BI", "Indicadores actualizados", BarChart3],
                ].map(([title, desc, Icon]: any) => (
                  <div key={title} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3FC] text-[#0F6CBD]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Acciones realizadas" subtitle="Resumen rápido" />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={actionsData}>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748B" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0F6CBD" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-3xl bg-[#0F172A] p-4 text-white shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Mockup comercial</p>
              <h3 className="mt-2 text-lg font-semibold">Cómo venderlo al cliente</h3>
              <div className="mt-4 space-y-3 text-sm text-white/85">
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-4 w-4" />
                  Mobile first para terreno
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-4 w-4" />
                  Integración nativa con ecosistema Microsoft
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-4 w-4" />
                  Menos texto, más captura guiada
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-4 w-4" />
                  Offline y sincronización posterior
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}