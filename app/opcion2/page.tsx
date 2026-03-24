"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  X,
  Trash2,
  Pencil,
  Save,
  RotateCcw,
  Eye,
  Building2,
  Layers3,
  Grid3X3,
  History,
  FileOutput,
  Printer,
  TestTube2,
  Sparkles,
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
type FilterKey = "Todas" | "Hoy" | "Pendientes" | "En progreso" | "Completadas";
type HistoryLevel = "centro" | "modulo" | "jaula";
type MortalityCause =
  | "PGD"
  | "HSMI"
  | "SRS"
  | "TENA"
  | "Rezago"
  | "ONI"
  | "Deforme"
  | "Daño físico"
  | "BKD";

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
  modulo: string;
  jaula: string;
};

type VisitForm = {
  centro: string;
  empresa: string;
  fecha: string;
  hora: string;
  veterinario: string;
  region: string;
  prioridad: Priority;
  biomasa: string;
  mortalidad: string;
  temperatura: string;
  oxigeno: string;
  hallazgo: string;
  tareas: string;
  muestrasPendientes: string;
  modulo: string;
  jaula: string;
};

type MedicalEvent = {
  id: string;
  fecha: string;
  tipo: "Tratamiento" | "Muestreo" | "Necropsia" | "Diagnóstico" | "Vacunación" | "Alerta";
  detalle: string;
  nivel: HistoryLevel;
  centro: string;
  modulo: string;
  jaula: string;
  responsable: string;
};

type CageMortalityRecord = {
  centro: string;
  modulo: string;
  jaula: string;
  causa: MortalityCause;
  total: number;
  porcentaje: number;
};

type AutoReportRecipient = {
  nombre: string;
  cargo: string;
  canal: string;
};

const STORAGE_KEYS = {
  visits: "mockup-visits-v2",
  selectedVisitId: "mockup-selected-visit-id-v2",
  clinicalState: "mockup-clinical-state-v2",
  historyFilters: "mockup-history-filters-v2",
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
    modulo: "Módulo 3",
    jaula: "Jaula 103",
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
    modulo: "Módulo 2",
    jaula: "Jaula 204",
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
    modulo: "Módulo 5",
    jaula: "Jaula 512",
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
] as const;

const diagnosisOptions = [
  "Branquial",
  "Bacteriano",
  "Parasitológico",
  "Post vacunación",
  "Estrés ambiental",
  "Sin hallazgos críticos",
  "PGD",
  "SRS",
  "HSMI",
];

const actionOptions = [
  "Aumentar monitoreo",
  "Tomar muestras",
  "Aplicar tratamiento",
  "Reforzar oxigenación",
  "Notificar a equipo",
  "Revisar en 48 h",
  "Priorizar jaulas críticas",
  "Despachar a laboratorio",
];

const quickCaptureOptions = [
  { label: "Dictado", icon: Mic },
  { label: "Foto", icon: Camera },
  { label: "Muestra", icon: FlaskConical },
  { label: "Checklist", icon: ClipboardCheck },
];

const defaultForm: VisitForm = {
  centro: "",
  empresa: "",
  fecha: "",
  hora: "",
  veterinario: "",
  region: "",
  prioridad: "Media",
  biomasa: "",
  mortalidad: "",
  temperatura: "",
  oxigeno: "",
  hallazgo: "",
  tareas: "0",
  muestrasPendientes: "0",
  modulo: "",
  jaula: "",
};

const defaultChecklist = [
  { label: "Evaluación clínica", done: true, icon: Stethoscope },
  { label: "Necropsia", done: true, icon: Activity },
  { label: "Muestreo", done: true, icon: FlaskConical },
  { label: "Tratamiento", done: false, icon: Pill },
  { label: "Documentos", done: true, icon: ShieldCheck },
];

const medicalHistorySeed: MedicalEvent[] = [
  {
    id: "ME-01",
    fecha: "2026-03-18",
    tipo: "Tratamiento",
    detalle: "Refuerzo de oxigenación y ajuste terapéutico por PGD.",
    nivel: "jaula",
    centro: "Centro Salmonero Aysén Norte",
    modulo: "Módulo 3",
    jaula: "Jaula 103",
    responsable: "Catalina Ruiz",
  },
  {
    id: "ME-02",
    fecha: "2026-03-17",
    tipo: "Muestreo",
    detalle: "Despacho de 8 muestras bacteriológicas y 4 PCR.",
    nivel: "modulo",
    centro: "Centro Salmonero Aysén Norte",
    modulo: "Módulo 3",
    jaula: "",
    responsable: "Pedro Ulloa",
  },
  {
    id: "ME-03",
    fecha: "2026-03-16",
    tipo: "Necropsia",
    detalle: "Necropsia con sospecha de proceso branquial crónico.",
    nivel: "jaula",
    centro: "Centro Salmonero Aysén Norte",
    modulo: "Módulo 3",
    jaula: "Jaula 104",
    responsable: "Pedro Ulloa",
  },
  {
    id: "ME-04",
    fecha: "2026-03-15",
    tipo: "Alerta",
    detalle: "Incremento de mortalidad acumulada a nivel centro.",
    nivel: "centro",
    centro: "Centro Salmonero Aysén Norte",
    modulo: "",
    jaula: "",
    responsable: "Sistema",
  },
  {
    id: "ME-05",
    fecha: "2026-03-14",
    tipo: "Diagnóstico",
    detalle: "Confirmación compatible con PGD predominante en módulo.",
    nivel: "modulo",
    centro: "Centro Salmonero Aysén Norte",
    modulo: "Módulo 3",
    jaula: "",
    responsable: "Laboratorio",
  },
  {
    id: "ME-06",
    fecha: "2026-03-12",
    tipo: "Vacunación",
    detalle: "Control post vacunación del lote centro completo.",
    nivel: "centro",
    centro: "Centro Chiloé Canal Sur",
    modulo: "",
    jaula: "",
    responsable: "Catalina Ruiz",
  },
];

const mortalityDistributionSeed: CageMortalityRecord[] = [
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 101", causa: "PGD", total: 145, porcentaje: 18.2 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 102", causa: "SRS", total: 66, porcentaje: 8.3 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 103", causa: "PGD", total: 212, porcentaje: 26.6 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 104", causa: "HSMI", total: 88, porcentaje: 11.0 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 105", causa: "Rezago", total: 55, porcentaje: 6.9 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 106", causa: "ONI", total: 34, porcentaje: 4.3 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 107", causa: "Daño físico", total: 28, porcentaje: 3.5 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 108", causa: "TENA", total: 72, porcentaje: 9.0 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 109", causa: "Deforme", total: 23, porcentaje: 2.9 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 110", causa: "PGD", total: 109, porcentaje: 13.7 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 111", causa: "BKD", total: 20, porcentaje: 2.5 },
  { centro: "Centro Salmonero Aysén Norte", modulo: "Módulo 3", jaula: "Jaula 112", causa: "SRS", total: 45, porcentaje: 5.6 },

  { centro: "Centro Chiloé Canal Sur", modulo: "Módulo 2", jaula: "Jaula 201", causa: "Post vacunación" as MortalityCause, total: 32, porcentaje: 14 },
  { centro: "Centro Chiloé Canal Sur", modulo: "Módulo 2", jaula: "Jaula 202", causa: "PGD", total: 40, porcentaje: 17.5 },
  { centro: "Centro Chiloé Canal Sur", modulo: "Módulo 2", jaula: "Jaula 203", causa: "SRS", total: 24, porcentaje: 10.5 },
  { centro: "Centro Chiloé Canal Sur", modulo: "Módulo 2", jaula: "Jaula 204", causa: "TENA", total: 28, porcentaje: 12.2 },
].filter((item) =>
  ["PGD", "HSMI", "SRS", "TENA", "Rezago", "ONI", "Deforme", "Daño físico", "BKD"].includes(
    item.causa
  )
) as CageMortalityRecord[];

const recipientsSeed: Record<string, AutoReportRecipient> = {
  "Centro Salmonero Aysén Norte": {
    nombre: "María Torres",
    cargo: "Asistente operativa",
    canal: "Outlook / Impresión",
  },
  "Centro Chiloé Canal Sur": {
    nombre: "Javier Méndez",
    cargo: "Coordinador de soporte",
    canal: "Outlook / Impresión",
  },
  "Centro Magallanes Este": {
    nombre: "Lorena Díaz",
    cargo: "Administración de centro",
    canal: "Outlook / Impresión",
  },
};

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
    centro: "bg-violet-50 text-violet-700 border-violet-200",
    modulo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    jaula: "bg-cyan-50 text-cyan-700 border-cyan-200",
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
  onToggleOffline,
  onOpenNotifications,
}: {
  offline: boolean;
  notifications: number;
  onToggleOffline: () => void;
  onOpenNotifications: () => void;
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
          <button
            onClick={onToggleOffline}
            className={cn(
              "flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold",
              offline
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            )}
          >
            {offline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            {offline ? "Offline" : "Online"}
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white"
          >
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

function SearchBox({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar centro, visita, módulo o jaula"
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 text-sm outline-none transition focus:border-[#0F6CBD]"
      />
      {value ? (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100"
        >
          <X className="h-4 w-4 text-slate-600" />
        </button>
      ) : null}
    </div>
  );
}

function VisitCard({
  visit,
  onOpen,
  onEdit,
  onDelete,
}: {
  visit: Visit;
  onOpen: (visit: Visit) => void;
  onEdit: (visit: Visit) => void;
  onDelete: (visit: Visit) => void;
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
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => onEdit(visit)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white"
          >
            <Pencil className="h-4 w-4 text-slate-700" />
          </button>
          <button
            onClick={() => onOpen(visit)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F6CBD] text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
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
            <span>{visit.region}</span>
          </div>
          <p className="mt-1 font-medium text-slate-700">
            {visit.modulo} · {visit.jaula}
          </p>
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

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
          {visit.modulo}
        </span>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
          {visit.jaula}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onEdit(visit)}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>
        <button
          onClick={() => onDelete(visit)}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 text-sm font-medium text-rose-700"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </div>
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

function ModalShell({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  if (!message) return null;

  return (
    <div className="fixed inset-x-0 bottom-24 z-[90] mx-auto w-[calc(100%-2rem)] max-w-md">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
        <span>{message}</span>
        <button onClick={onClose} className="rounded-lg bg-white/10 p-1">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function toForm(visit: Visit): VisitForm {
  return {
    centro: visit.centro,
    empresa: visit.empresa,
    fecha: visit.fecha,
    hora: visit.hora,
    veterinario: visit.veterinario,
    region: visit.region,
    prioridad: visit.prioridad,
    biomasa: String(visit.biomasa),
    mortalidad: String(visit.mortalidad),
    temperatura: String(visit.temperatura),
    oxigeno: String(visit.oxigeno),
    hallazgo: visit.hallazgo,
    tareas: String(visit.tareas),
    muestrasPendientes: String(visit.muestrasPendientes),
    modulo: visit.modulo,
    jaula: visit.jaula,
  };
}

function createVisitFromForm(form: VisitForm, existingId?: string, currentState?: VisitStatus): Visit {
  return {
    id: existingId || `VST-${Date.now().toString().slice(-6)}`,
    centro: form.centro.trim(),
    empresa: form.empresa.trim(),
    fecha: form.fecha,
    hora: form.hora,
    veterinario: form.veterinario.trim(),
    region: form.region.trim(),
    estado: currentState || "Pendiente",
    prioridad: form.prioridad,
    biomasa: Number(form.biomasa || 0),
    mortalidad: Number(form.mortalidad || 0),
    temperatura: Number(form.temperatura || 0),
    oxigeno: Number(form.oxigeno || 0),
    hallazgo: form.hallazgo.trim() || "Sin hallazgo registrado",
    tareas: Number(form.tareas || 0),
    muestrasPendientes: Number(form.muestrasPendientes || 0),
    modulo: form.modulo.trim() || "Módulo sin asignar",
    jaula: form.jaula.trim() || "Jaula sin asignar",
  };
}

function matchesVisit(visit: Visit, query: string) {
  const text = query.toLowerCase().trim();
  if (!text) return true;

  return [
    visit.id,
    visit.centro,
    visit.empresa,
    visit.fecha,
    visit.hora,
    visit.veterinario,
    visit.region,
    visit.estado,
    visit.prioridad,
    visit.hallazgo,
    visit.modulo,
    visit.jaula,
  ]
    .join(" ")
    .toLowerCase()
    .includes(text);
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TabKey>("inicio");
  const [offline, setOffline] = useState(true);
  const [visits, setVisits] = useState<Visit[]>(visitsSeed);
  const [selectedVisit, setSelectedVisit] = useState<Visit>(visitsSeed[0]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("Todas");
  const [showRouteOnly, setShowRouteOnly] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVisitId, setEditingVisitId] = useState<string | null>(null);
  const [visitForm, setVisitForm] = useState<VisitForm>(defaultForm);

  const [clinicalNote, setClinicalNote] = useState(
    "Peces con nado errático, leve palidez branquial y aumento de mortalidad respecto de la semana anterior."
  );
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>(["Branquial", "PGD"]);
  const [selectedActions, setSelectedActions] = useState<string[]>([
    "Aumentar monitoreo",
    "Tomar muestras",
    "Reforzar oxigenación",
    "Priorizar jaulas críticas",
  ]);
  const [samples, setSamples] = useState("12 histopatológicas · 8 bacteriológicas · 4 PCR");
  const [nextStep, setNextStep] = useState("Revisar evolución en 48 horas y despachar muestras hoy.");
  const [checklist, setChecklist] = useState(defaultChecklist);

  const [historyLevel, setHistoryLevel] = useState<HistoryLevel>("jaula");
  const [selectedCentro, setSelectedCentro] = useState(visitsSeed[0].centro);
  const [selectedModulo, setSelectedModulo] = useState(visitsSeed[0].modulo);
  const [selectedJaula, setSelectedJaula] = useState(visitsSeed[0].jaula);

  useEffect(() => {
    try {
      const savedVisits = localStorage.getItem(STORAGE_KEYS.visits);
      const savedSelectedVisitId = localStorage.getItem(STORAGE_KEYS.selectedVisitId);
      const savedClinicalState = localStorage.getItem(STORAGE_KEYS.clinicalState);
      const savedHistoryFilters = localStorage.getItem(STORAGE_KEYS.historyFilters);

      const parsedVisits: Visit[] = savedVisits ? JSON.parse(savedVisits) : visitsSeed;
      setVisits(parsedVisits);

      const selected =
        parsedVisits.find((v) => v.id === savedSelectedVisitId) || parsedVisits[0] || visitsSeed[0];
      setSelectedVisit(selected);
      setSelectedCentro(selected.centro);
      setSelectedModulo(selected.modulo);
      setSelectedJaula(selected.jaula);

      if (savedClinicalState) {
        const parsed = JSON.parse(savedClinicalState);
        setClinicalNote(parsed.clinicalNote ?? "");
        setSelectedDiagnosis(parsed.selectedDiagnosis ?? []);
        setSelectedActions(parsed.selectedActions ?? []);
        setSamples(parsed.samples ?? "");
        setNextStep(parsed.nextStep ?? "");
        setChecklist(parsed.checklist ?? defaultChecklist);
      }

      if (savedHistoryFilters) {
        const parsed = JSON.parse(savedHistoryFilters);
        setHistoryLevel(parsed.historyLevel ?? "jaula");
        setSelectedCentro(parsed.selectedCentro ?? selected.centro);
        setSelectedModulo(parsed.selectedModulo ?? selected.modulo);
        setSelectedJaula(parsed.selectedJaula ?? selected.jaula);
      }
    } catch {
      setVisits(visitsSeed);
      setSelectedVisit(visitsSeed[0]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEYS.visits, JSON.stringify(visits));
  }, [visits, ready]);

  useEffect(() => {
    if (!ready || !selectedVisit?.id) return;
    localStorage.setItem(STORAGE_KEYS.selectedVisitId, selectedVisit.id);
  }, [selectedVisit, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEYS.clinicalState,
      JSON.stringify({
        clinicalNote,
        selectedDiagnosis,
        selectedActions,
        samples,
        nextStep,
        checklist,
      })
    );
  }, [clinicalNote, selectedDiagnosis, selectedActions, samples, nextStep, checklist, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEYS.historyFilters,
      JSON.stringify({
        historyLevel,
        selectedCentro,
        selectedModulo,
        selectedJaula,
      })
    );
  }, [historyLevel, selectedCentro, selectedModulo, selectedJaula, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setSelectedCentro(selectedVisit.centro);
    setSelectedModulo(selectedVisit.modulo);
    setSelectedJaula(selectedVisit.jaula);
  }, [selectedVisit]);

  const filteredVisits = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return visits.filter((visit) => {
      if (!matchesVisit(visit, search)) return false;
      if (showRouteOnly && visit.region !== selectedVisit.region) return false;

      if (filter === "Hoy") return visit.fecha === today;
      if (filter === "Pendientes") return visit.estado === "Pendiente";
      if (filter === "En progreso") return visit.estado === "En progreso";
      if (filter === "Completadas") return visit.estado === "Completada";
      return true;
    });
  }, [visits, search, filter, showRouteOnly, selectedVisit.region]);

  const visibleAlerts = showAllAlerts ? alertsSeed : alertsSeed.slice(0, 2);

  const stats = useMemo(() => {
    return {
      total: visits.length,
      pendientes: visits.filter((v) => v.estado === "Pendiente").length,
      enCurso: visits.filter((v) => v.estado === "En progreso").length,
      completadas: visits.filter((v) => v.estado === "Completada").length,
    };
  }, [visits]);

  const centros = useMemo(() => {
    return Array.from(new Set(visits.map((v) => v.centro)));
  }, [visits]);

  const modulosForCentro = useMemo(() => {
    return Array.from(
      new Set(
        visits
          .filter((v) => v.centro === selectedCentro)
          .map((v) => v.modulo)
      )
    );
  }, [visits, selectedCentro]);

  const jaulasForModulo = useMemo(() => {
    return Array.from(
      new Set(
        visits
          .filter((v) => v.centro === selectedCentro && v.modulo === selectedModulo)
          .map((v) => v.jaula)
      )
    );
  }, [visits, selectedCentro, selectedModulo]);

  const filteredMedicalHistory = useMemo(() => {
    return medicalHistorySeed.filter((item) => {
      if (selectedCentro && item.centro !== selectedCentro) return false;
      if (historyLevel === "centro") return true;
      if (historyLevel === "modulo") return item.modulo === selectedModulo || item.nivel === "centro";
      return (
        item.jaula === selectedJaula ||
        item.modulo === selectedModulo ||
        item.nivel === "centro"
      );
    });
  }, [historyLevel, selectedCentro, selectedModulo, selectedJaula]);

  const mortalityForContext = useMemo(() => {
    return mortalityDistributionSeed.filter((item) => {
      if (item.centro !== selectedCentro) return false;
      if (historyLevel === "centro") return true;
      if (historyLevel === "modulo") return item.modulo === selectedModulo;
      return item.modulo === selectedModulo && item.jaula === selectedJaula;
    });
  }, [historyLevel, selectedCentro, selectedModulo, selectedJaula]);

  const aggregatedByCage = useMemo(() => {
    const bucket = new Map<
      string,
      { jaula: string; total: number; principal: MortalityCause; principalTotal: number }
    >();

    mortalityForContext.forEach((item) => {
      const current = bucket.get(item.jaula);
      if (!current) {
        bucket.set(item.jaula, {
          jaula: item.jaula,
          total: item.total,
          principal: item.causa,
          principalTotal: item.total,
        });
      } else {
        current.total += item.total;
        if (item.total > current.principalTotal) {
          current.principal = item.causa;
          current.principalTotal = item.total;
        }
      }
    });

    return Array.from(bucket.values()).sort((a, b) => b.total - a.total);
  }, [mortalityForContext]);

  const topCriticalCages = useMemo(() => aggregatedByCage.slice(0, 4), [aggregatedByCage]);

  const aggregatedByCause = useMemo(() => {
    const bucket = new Map<MortalityCause, number>();
    mortalityForContext.forEach((item) => {
      bucket.set(item.causa, (bucket.get(item.causa) || 0) + item.total);
    });

    return Array.from(bucket.entries())
      .map(([causa, total]) => ({ causa, total }))
      .sort((a, b) => b.total - a.total);
  }, [mortalityForContext]);

  const lastMedicalEvents = useMemo(() => filteredMedicalHistory.slice(0, 4), [filteredMedicalHistory]);

  const recipient = recipientsSeed[selectedVisit.centro] || {
    nombre: "Destino no definido",
    cargo: "Pendiente",
    canal: "Impresión",
  };

  const generatedReport = useMemo(() => {
    const totalMortality = aggregatedByCause.reduce((acc, item) => acc + item.total, 0);
    const dominantCause = aggregatedByCause[0]?.causa || "Sin predominio";
    const dominantPercent =
      totalMortality > 0 && aggregatedByCause[0]
        ? ((aggregatedByCause[0].total / totalMortality) * 100).toFixed(1)
        : "0";

    return {
      centro: selectedVisit.centro,
      empresa: selectedVisit.empresa,
      modulo: selectedModulo,
      jaula: selectedJaula,
      veterinario: selectedVisit.veterinario,
      fecha: selectedVisit.fecha,
      hora: selectedVisit.hora,
      biomasa: selectedVisit.biomasa,
      mortalidad: selectedVisit.mortalidad,
      temperatura: selectedVisit.temperatura,
      oxigeno: selectedVisit.oxigeno,
      observacion: clinicalNote,
      diagnostico: selectedDiagnosis.join(", ") || "Sin selección",
      acciones: selectedActions.join(", ") || "Sin selección",
      muestras: samples,
      proximoPaso: nextStep,
      principalCausa: dominantCause,
      principalCausaPct: dominantPercent,
      jaulasCriticas: topCriticalCages,
      destinatario: recipient,
    };
  }, [
    selectedVisit,
    selectedModulo,
    selectedJaula,
    clinicalNote,
    selectedDiagnosis,
    selectedActions,
    samples,
    nextStep,
    aggregatedByCause,
    topCriticalCages,
    recipient,
  ]);

  const toggleInArray = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const openVisit = (visit: Visit) => {
    const updatedVisit = { ...visit, estado: "En progreso" as VisitStatus };
    setSelectedVisit(updatedVisit);
    setSelectedCentro(updatedVisit.centro);
    setSelectedModulo(updatedVisit.modulo);
    setSelectedJaula(updatedVisit.jaula);
    setHistoryLevel("jaula");
    setVisits((prev) => prev.map((v) => (v.id === visit.id ? updatedVisit : v)));
    setTab("registro");
    setToast(`Visita ${updatedVisit.id} abierta`);
  };

  const saveSelectedVisitFields = (patch: Partial<Visit>) => {
    setSelectedVisit((prev) => {
      const next = { ...prev, ...patch };
      setVisits((current) => current.map((v) => (v.id === prev.id ? next : v)));
      return next;
    });
  };

  const finishVisit = () => {
    setSelectedVisit((prev) => {
      const next = {
        ...prev,
        estado: "Completada" as VisitStatus,
        hallazgo: clinicalNote || prev.hallazgo,
        modulo: selectedModulo,
        jaula: selectedJaula,
      };
      setVisits((current) => current.map((v) => (v.id === prev.id ? next : v)));
      return next;
    });
    setTab("resumen");
    setToast("Visita finalizada y reporte automático preparado");
  };

  const resetClinicalData = () => {
    setClinicalNote("");
    setSelectedDiagnosis([]);
    setSelectedActions([]);
    setSamples("");
    setNextStep("");
    setChecklist(defaultChecklist);
    setToast("Registro clínico reiniciado");
  };

  const openCreateModal = () => {
    setEditingVisitId(null);
    setVisitForm(defaultForm);
    setShowCreateModal(true);
  };

  const openEditModal = (visit: Visit) => {
    setEditingVisitId(visit.id);
    setVisitForm(toForm(visit));
    setShowCreateModal(true);
  };

  const saveVisit = () => {
    if (
      !visitForm.centro.trim() ||
      !visitForm.empresa.trim() ||
      !visitForm.fecha ||
      !visitForm.hora ||
      !visitForm.region.trim() ||
      !visitForm.veterinario.trim() ||
      !visitForm.modulo.trim() ||
      !visitForm.jaula.trim()
    ) {
      setToast("Completa centro, empresa, fecha, hora, región, veterinario, módulo y jaula");
      return;
    }

    if (editingVisitId) {
      const current = visits.find((v) => v.id === editingVisitId);
      if (!current) return;

      const updated = createVisitFromForm(visitForm, editingVisitId, current.estado);
      setVisits((prev) => prev.map((v) => (v.id === editingVisitId ? updated : v)));
      if (selectedVisit.id === editingVisitId) setSelectedVisit(updated);
      setToast(`Visita ${updated.id} actualizada`);
    } else {
      const created = createVisitFromForm(visitForm);
      setVisits((prev) => [created, ...prev]);
      setSelectedVisit(created);
      setToast(`Visita ${created.id} creada`);
    }

    setShowCreateModal(false);
    setTab("visitas");
  };

  const deleteVisit = (visit: Visit) => {
    const confirmed = window.confirm(`¿Eliminar la visita ${visit.id} de ${visit.centro}?`);
    if (!confirmed) return;

    const nextVisits = visits.filter((v) => v.id !== visit.id);
    setVisits(nextVisits);

    if (selectedVisit.id === visit.id && nextVisits.length > 0) {
      setSelectedVisit(nextVisits[0]);
    }

    if (nextVisits.length === 0) {
      const fallback = visitsSeed[0];
      setVisits([fallback]);
      setSelectedVisit(fallback);
    }

    setToast(`Visita ${visit.id} eliminada`);
  };

  const exportSummary = () => {
    const payload = {
      visita: selectedVisit,
      contextoHistorial: {
        nivel: historyLevel,
        centro: selectedCentro,
        modulo: selectedModulo,
        jaula: selectedJaula,
        eventos: filteredMedicalHistory,
        mortalidad: mortalityForContext,
        jaulasCriticas: topCriticalCages,
      },
      clinicalNote,
      selectedDiagnosis,
      selectedActions,
      samples,
      nextStep,
      checklist,
      reporteAutomatico: generatedReport,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedVisit.id}-reporte-automatico.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Reporte exportado en JSON local");
  };

  const sendToTeams = () => {
    setToast(`Reporte de ${selectedVisit.id} marcado como enviado a Teams`);
  };

  const act = (message: string) => setToast(message);

  if (!ready) {
    return <div className="min-h-screen bg-[#F5F7FA]" />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900">
      <TopBar
        offline={offline}
        notifications={alertsSeed.length}
        onToggleOffline={() => {
          setOffline((prev) => !prev);
          setToast(offline ? "Modo online activado" : "Modo offline activado");
        }}
        onOpenNotifications={() => setShowNotifications(true)}
      />

      <main className="mx-auto max-w-md px-4 pb-28 pt-4">
        {tab === "inicio" && (
          <div className="space-y-4">
            <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F6CBD] to-[#115EA3] p-5 text-white shadow-xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Jornada en terreno</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">
                Historial sanitario primero, registro después.
              </h2>
              <p className="mt-3 text-sm text-white/85">
                El veterinario entra viendo centro, módulo, jaula, antecedentes médicos, jaulas críticas y cierre automático para impresión.
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

            <SearchBox value={search} onChange={setSearch} onClear={() => setSearch("")} />

            <section className="grid grid-cols-2 gap-3">
              {quickCaptureOptions.map((item) => (
                <button
                  key={item.label}
                  onClick={() => act(`Captura rápida: ${item.label}`)}
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
              <MetricCard label="Completadas" value={stats.completadas} icon={CheckCircle2} tone="emerald" />
              <MetricCard label="Sin señal" value={offline ? "2 centros" : "0 centros"} icon={WifiOff} tone="slate" />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Qué verá al llegar"
                subtitle="Nueva prioridad clínica"
              />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Historial por centro", Building2],
                  ["Historial por módulo", Layers3],
                  ["Historial por jaula", Grid3X3],
                  ["Reporte automático", FileOutput],
                ].map(([label, Icon]: any) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3FC] text-[#0F6CBD]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Alertas de hoy"
                subtitle="Lo más urgente primero"
                action={
                  <button
                    onClick={() => setShowAllAlerts((prev) => !prev)}
                    className="text-sm font-medium text-[#0F6CBD]"
                  >
                    {showAllAlerts ? "Ver menos" : "Ver todo"}
                  </button>
                }
              />
              <div className="space-y-3">
                {visibleAlerts.map((alert) => (
                  <button
                    key={alert.titulo}
                    onClick={() => act(`${alert.titulo}: ${alert.descripcion}`)}
                    className="block w-full rounded-2xl bg-slate-50 p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{alert.titulo}</p>
                        <p className="mt-1 text-sm text-slate-500">{alert.descripcion}</p>
                      </div>
                      <StatusBadge value={alert.severidad} />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Actividad" subtitle="Últimos meses" />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitas" stroke="#0F6CBD" strokeWidth={3} />
                    <Line type="monotone" dataKey="alertas" stroke="#D13438" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-3xl bg-[#0F172A] p-4 text-white shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Power Platform</p>
              <h3 className="mt-2 text-lg font-semibold">Arquitectura integrada</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Dataverse", "Historial y reporte", Database],
                  ["Power Automate", "Emisión automática", Workflow],
                  ["Teams", "Aviso al equipo", Users],
                  ["SharePoint", "Respaldo documental", FolderKanban],
                ].map(([title, desc, Icon]: any) => (
                  <button
                    key={title}
                    onClick={() => act(`${title}: ${desc}`)}
                    className="rounded-2xl bg-white/5 p-3 text-left"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="h-4 w-4" />
                      {title}
                    </div>
                    <p className="mt-1 text-xs text-white/70">{desc}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "visitas" && (
          <div className="space-y-4">
            <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Mis visitas</h2>
                  <p className="mt-1 text-sm text-slate-500">Agenda pensada para trabajo móvil con centro, módulo y jaula.</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F6CBD] text-white"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilter((prev) => (prev === "Hoy" ? "Todas" : "Hoy"))}
                  className={cn(
                    "flex h-10 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium",
                    filter === "Hoy"
                      ? "border-[#0F6CBD] bg-[#E8F3FC] text-[#0F6CBD]"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  {filter === "Hoy" ? "Hoy activo" : "Hoy"}
                </button>
                <button
                  onClick={() => setShowRouteOnly((prev) => !prev)}
                  className={cn(
                    "flex h-10 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium",
                    showRouteOnly
                      ? "border-[#0F6CBD] bg-[#E8F3FC] text-[#0F6CBD]"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  )}
                >
                  <MapPin className="h-4 w-4" />
                  {showRouteOnly ? "Ruta activa" : "Ruta"}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["Todas", "Pendientes", "En progreso", "Completadas"] as FilterKey[]).map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={cn(
                      "h-10 rounded-2xl border px-3 text-sm font-medium",
                      filter === item
                        ? "border-[#0F6CBD] bg-[#E8F3FC] text-[#0F6CBD]"
                        : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <SearchBox value={search} onChange={setSearch} onClear={() => setSearch("")} />

            <div className="space-y-3">
              {filteredVisits.length ? (
                filteredVisits.map((visit) => (
                  <VisitCard
                    key={visit.id}
                    visit={visit}
                    onOpen={openVisit}
                    onEdit={openEditModal}
                    onDelete={deleteVisit}
                  />
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
                  <p className="text-sm font-medium text-slate-800">No hay visitas para este filtro</p>
                  <p className="mt-1 text-sm text-slate-500">Crea una nueva o ajusta la búsqueda.</p>
                  <button
                    onClick={openCreateModal}
                    className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] px-4 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Crear visita
                  </button>
                </div>
              )}
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Visitas cerradas" subtitle="Últimas semanas" />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
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
                <button
                  onClick={() => act(`Fecha de visita: ${selectedVisit.fecha}`)}
                  className="rounded-2xl bg-white/10 p-3 text-left"
                >
                  <p className="text-xs text-white/70">Fecha</p>
                  <p className="mt-1 text-sm font-semibold">{selectedVisit.fecha}</p>
                </button>
                <button
                  onClick={() => act(`Hora de visita: ${selectedVisit.hora}`)}
                  className="rounded-2xl bg-white/10 p-3 text-left"
                >
                  <p className="text-xs text-white/70">Hora</p>
                  <p className="mt-1 text-sm font-semibold">{selectedVisit.hora}</p>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  {selectedModulo}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  {selectedJaula}
                </span>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Historial sanitario"
                subtitle="Lo primero que debe ver el veterinario"
                action={<History className="h-4 w-4 text-[#0F6CBD]" />}
              />

              <div className="grid grid-cols-3 gap-2">
                {(["centro", "modulo", "jaula"] as HistoryLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setHistoryLevel(level)}
                    className={cn(
                      "h-10 rounded-2xl border text-sm font-medium capitalize",
                      historyLevel === level
                        ? "border-[#0F6CBD] bg-[#E8F3FC] text-[#0F6CBD]"
                        : "border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Centro</label>
                  <select
                    value={selectedCentro}
                    onChange={(e) => {
                      const centro = e.target.value;
                      const firstModulo =
                        Array.from(new Set(visits.filter((v) => v.centro === centro).map((v) => v.modulo)))[0] || "";
                      const firstJaula =
                        Array.from(
                          new Set(
                            visits
                              .filter((v) => v.centro === centro && v.modulo === firstModulo)
                              .map((v) => v.jaula)
                          )
                        )[0] || "";
                      setSelectedCentro(centro);
                      setSelectedModulo(firstModulo);
                      setSelectedJaula(firstJaula);
                    }}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                  >
                    {centros.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Módulo</label>
                    <select
                      value={selectedModulo}
                      onChange={(e) => {
                        const modulo = e.target.value;
                        const firstJaula =
                          Array.from(
                            new Set(
                              visits
                                .filter((v) => v.centro === selectedCentro && v.modulo === modulo)
                                .map((v) => v.jaula)
                            )
                          )[0] || "";
                        setSelectedModulo(modulo);
                        setSelectedJaula(firstJaula);
                      }}
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                    >
                      {modulosForCentro.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Jaula</label>
                    <select
                      value={selectedJaula}
                      onChange={(e) => setSelectedJaula(e.target.value)}
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                    >
                      {jaulasForModulo.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricCard label="Eventos previos" value={filteredMedicalHistory.length} icon={History} tone="blue" />
                <MetricCard label="Jaulas críticas" value={topCriticalCages.length} icon={AlertTriangle} tone="amber" />
                <MetricCard
                  label="Causa principal"
                  value={aggregatedByCause[0]?.causa || "Sin datos"}
                  icon={Sparkles}
                  tone="emerald"
                />
                <MetricCard
                  label="Mortalidad acum."
                  value={aggregatedByCause.reduce((acc, item) => acc + item.total, 0)}
                  icon={Activity}
                  tone="slate"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Últimos antecedentes médicos" subtitle="Centro, módulo y jaula seleccionados" />
              <div className="space-y-3">
                {lastMedicalEvents.length ? (
                  lastMedicalEvents.map((event) => (
                    <div key={event.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{event.tipo}</p>
                            <StatusBadge value={event.nivel} />
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{event.detalle}</p>
                          <p className="mt-2 text-xs text-slate-500">
                            {event.fecha} · {event.responsable}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                    No hay antecedentes para este filtro.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Jaulas críticas y causas"
                subtitle="Prioriza intervención clínica"
              />
              <div className="space-y-3">
                {topCriticalCages.length ? (
                  topCriticalCages.map((item) => (
                    <button
                      key={item.jaula}
                      onClick={() => {
                        setHistoryLevel("jaula");
                        setSelectedJaula(item.jaula);
                        act(`${item.jaula} priorizada por ${item.principal}`);
                      }}
                      className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.jaula}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Principal causa: {item.principal}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-rose-600">{item.total}</p>
                        <p className="text-xs text-slate-500">mortalidades</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                    Sin datos agregados para la selección actual.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Distribución de mortalidad"
                subtitle="Lectura tipo reporte por causa"
              />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={aggregatedByCause}>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="causa" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0F6CBD" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2">
                {mortalityForContext.slice(0, 6).map((item, index) => (
                  <div
                    key={`${item.jaula}-${item.causa}-${index}`}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {item.jaula} · {item.causa}
                      </p>
                      <p className="text-xs text-slate-500">{item.modulo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{item.total}</p>
                      <p className="text-xs text-slate-500">{item.porcentaje}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <MetricCard label="Biomasa" value={`${selectedVisit.biomasa} ton`} icon={Activity} tone="blue" />
              <MetricCard label="Mortalidad" value={`${selectedVisit.mortalidad}%`} icon={AlertTriangle} tone="amber" />
              <MetricCard label="Temperatura" value={`${selectedVisit.temperatura} °C`} icon={Thermometer} tone="slate" />
              <MetricCard label="Oxígeno" value={`${selectedVisit.oxigeno} mg/L`} icon={Droplets} tone="emerald" />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Captura rápida"
                subtitle="Un toque y sigues trabajando"
                action={
                  <button
                    onClick={() => act("Modo captura rápida listo")}
                    className="text-sm font-medium text-[#0F6CBD]"
                  >
                    Probar
                  </button>
                }
              />
              <div className="grid grid-cols-2 gap-3">
                {quickCaptureOptions.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => act(`Registro rápido: ${item.label}`)}
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
              <SectionHeader
                title="Observación breve"
                subtitle="Pensado para dictado o texto corto"
                action={
                  <button
                    onClick={resetClinicalData}
                    className="text-sm font-medium text-[#0F6CBD]"
                  >
                    Limpiar
                  </button>
                }
              />
              <textarea
                value={clinicalNote}
                onChange={(e) => {
                  setClinicalNote(e.target.value);
                  saveSelectedVisitFields({ hallazgo: e.target.value || selectedVisit.hallazgo });
                }}
                className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Describe el hallazgo principal..."
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={() => act("Simulación de dictado iniciada")}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  <Mic className="h-4 w-4" />
                  Dictar
                </button>
                <button
                  onClick={() => act("Simulación de carga de foto")}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  <Camera className="h-4 w-4" />
                  Adjuntar foto
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Diagnóstico presuntivo" subtitle="Menos escribir, más tocar opciones" />
              <div className="grid grid-cols-2 gap-3">
                {diagnosisOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedDiagnosis.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedDiagnosis)}
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
                    onClick={() => toggleInArray(item, setSelectedActions)}
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
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => act("Seguimiento guardado localmente")}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
                  >
                    <Save className="h-4 w-4" />
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setSamples("12 histopatológicas · 8 bacteriológicas · 4 PCR");
                      setNextStep("Revisar evolución en 48 horas y despachar muestras hoy.");
                      act("Muestras y seguimiento restaurados");
                    }}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restaurar
                  </button>
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
                          prev.map((row, i) => (i === index ? { ...row, done: !row.done } : row))
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
                {[
                  ["Guardar historial en Dataverse", Database],
                  ["Activar Power Automate para emisión", Workflow],
                  ["Notificar en Teams", Users],
                  ["Respaldar reporte en SharePoint", FolderKanban],
                  ["Actualizar Power BI", BarChart3],
                ].map(([label, Icon]: any) => (
                  <button
                    key={label}
                    onClick={() => act(String(label))}
                    className="flex w-full items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-left"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openEditModal(selectedVisit)}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm"
              >
                <Pencil className="h-5 w-5" />
                Editar visita
              </button>
              <button
                onClick={finishVisit}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-base font-semibold text-white shadow-lg"
              >
                <BadgeCheck className="h-5 w-5" />
                Finalizar visita
              </button>
            </div>
          </div>
        )}

        {tab === "resumen" && (
          <div className="space-y-4">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Reporte listo</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">{selectedVisit.centro}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {selectedVisit.empresa} · ID {selectedVisit.id}
                  </p>
                </div>
                <StatusBadge value="Completada" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={exportSummary}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  <Download className="h-4 w-4" />
                  PDF/JSON
                </button>
                <button
                  onClick={sendToTeams}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-medium text-white"
                >
                  <Send className="h-4 w-4" />
                  Teams
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Destino automático del reporte" subtitle="Se espera envío a impresión" />
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F3FC] text-[#0F6CBD]">
                    <Printer className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{generatedReport.destinatario.nombre}</p>
                    <p className="text-xs text-slate-500">
                      {generatedReport.destinatario.cargo} · {generatedReport.destinatario.canal}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Resumen clínico final"
                subtitle="Alineado al reporte automático"
                action={
                  <button
                    onClick={() => setTab("registro")}
                    className="text-sm font-medium text-[#0F6CBD]"
                  >
                    Editar
                  </button>
                }
              />
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-500">Centro</p>
                    <p className="mt-1 leading-7 text-slate-700">{generatedReport.centro}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-500">Módulo / Jaula</p>
                    <p className="mt-1 leading-7 text-slate-700">
                      {generatedReport.modulo} · {generatedReport.jaula}
                    </p>
                  </div>
                </div>

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
              <SectionHeader title="Antecedentes incorporados al reporte" subtitle="Historial y mortalidad resumidos" />
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">Principal causa observada</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {generatedReport.principalCausa} · {generatedReport.principalCausaPct}%
                  </p>
                </div>

                {generatedReport.jaulasCriticas.map((item) => (
                  <div
                    key={item.jaula}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.jaula}</p>
                      <p className="text-xs text-slate-500">Principal: {item.principal}</p>
                    </div>
                    <p className="text-sm font-semibold text-rose-600">{item.total}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Estado de publicación" subtitle="Automatización visible" />
              <div className="space-y-3">
                {[
                  ["Dataverse", "Historial y registro sincronizados", Database],
                  ["Power Automate", "Flujo de emisión listo", Workflow],
                  ["Teams", "Aviso listo para el equipo", Users],
                  ["SharePoint", "Reporte respaldado", FolderKanban],
                  ["Power BI", "Indicadores actualizados", BarChart3],
                  ["Outlook / Impresión", "Destinatario listo para imprimir", Printer],
                ].map(([title, desc, Icon]: any) => (
                  <button
                    key={title}
                    onClick={() => act(`${title}: ${desc}`)}
                    className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 text-left"
                  >
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
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Acciones realizadas" subtitle="Resumen rápido" />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={actionsData}>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0F6CBD" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-3xl bg-[#0F172A] p-4 text-white shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Mockup comercial</p>
              <h3 className="mt-2 text-lg font-semibold">Beneficios</h3>
              <div className="mt-4 space-y-3 text-sm text-white/85">
                {[
                  "Historial sanitario visible antes del registro",
                  "Jerarquía centro · módulo · jaula",
                  "Reporte automático para impresión",
                  "Integración nativa con ecosistema Microsoft",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => act(item)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 text-left"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    {item}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} />

      <ModalShell
        open={showCreateModal}
        title={editingVisitId ? "Editar visita" : "Crear visita"}
        onClose={() => setShowCreateModal(false)}
      >
        <div className="space-y-3">
          {[
            ["Centro", "centro"],
            ["Empresa", "empresa"],
            ["Fecha", "fecha"],
            ["Hora", "hora"],
            ["Veterinario", "veterinario"],
            ["Región", "region"],
            ["Módulo", "modulo"],
            ["Jaula", "jaula"],
            ["Biomasa", "biomasa"],
            ["Mortalidad", "mortalidad"],
            ["Temperatura", "temperatura"],
            ["Oxígeno", "oxigeno"],
            ["Tareas", "tareas"],
            ["Muestras pendientes", "muestrasPendientes"],
          ].map(([label, key]) => {
            const isDate = key === "fecha";
            const isTime = key === "hora";
            const isNumeric = [
              "biomasa",
              "mortalidad",
              "temperatura",
              "oxigeno",
              "tareas",
              "muestrasPendientes",
            ].includes(key);

            return (
              <div key={key}>
                <label className="text-sm font-medium text-slate-700">{label}</label>
                <input
                  type={isDate ? "date" : isTime ? "time" : isNumeric ? "number" : "text"}
                  value={(visitForm as Record<string, string>)[key]}
                  onChange={(e) => setVisitForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                />
              </div>
            );
          })}

          <div>
            <label className="text-sm font-medium text-slate-700">Prioridad</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["Alta", "Media", "Baja"] as Priority[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setVisitForm((prev) => ({ ...prev, prioridad: item }))}
                  className={cn(
                    "h-11 rounded-2xl border text-sm font-medium",
                    visitForm.prioridad === item
                      ? "border-[#0F6CBD] bg-[#E8F3FC] text-[#0F6CBD]"
                      : "border-slate-200 bg-white text-slate-700"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Hallazgo</label>
            <textarea
              value={visitForm.hallazgo}
              onChange={(e) => setVisitForm((prev) => ({ ...prev, hallazgo: e.target.value }))}
              className="mt-2 min-h-[100px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setVisitForm(defaultForm);
                setEditingVisitId(null);
              }}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar
            </button>
            <button
              onClick={saveVisit}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-semibold text-white"
            >
              <Save className="h-4 w-4" />
              {editingVisitId ? "Guardar" : "Crear"}
            </button>
          </div>
        </div>
      </ModalShell>

      <ModalShell
        open={showNotifications}
        title="Notificaciones"
        onClose={() => setShowNotifications(false)}
      >
        <div className="space-y-3">
          {alertsSeed.map((alert) => (
            <button
              key={alert.titulo}
              onClick={() => {
                setShowNotifications(false);
                act(`${alert.titulo}: ${alert.descripcion}`);
              }}
              className="flex w-full items-start justify-between rounded-2xl bg-slate-50 p-4 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{alert.titulo}</p>
                <p className="mt-1 text-sm text-slate-500">{alert.descripcion}</p>
              </div>
              <StatusBadge value={alert.severidad} />
            </button>
          ))}

          <button
            onClick={() => {
              setShowNotifications(false);
              setTab("inicio");
              setShowAllAlerts(true);
            }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
          >
            <Eye className="h-4 w-4" />
            Ver alertas en inicio
          </button>
        </div>
      </ModalShell>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}