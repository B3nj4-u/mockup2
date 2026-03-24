"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  CalendarDays,
  ClipboardPenLine,
  FileText,
  Bell,
  Search,
  ChevronRight,
  MapPin,
  Activity,
  Plus,
  Send,
  Download,
  ClipboardCheck,
  BadgeCheck,
  X,
  Trash2,
  Pencil,
  Save,
  RotateCcw,
  Eye,
  History,
  Printer,
  Building2,
  Layers3,
  Grid3X3,
  Mic,
  Camera,
  FlaskConical,
  Stethoscope,
  Pill,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Wifi,
  WifiOff,
  FileOutput,
} from "lucide-react";

type VisitStatus = "Pendiente" | "En progreso" | "Completada";
type Priority = "Alta" | "Media" | "Baja";
type TabKey = "inicio" | "visitas" | "registro" | "resumen";
type FilterKey = "Todas" | "Hoy" | "Pendientes" | "En progreso" | "Completadas";
type HistoryLevel = "centro" | "modulo" | "jaula";
type SanitaryStatus = "En tratamiento" | "En carencia" | "Sin tratamiento";
type MortalityCause =
  | "PGD"
  | "HSMI"
  | "SRS"
  | "TENA"
  | "Rezago"
  | "ONI"
  | "Deforme"
  | "Daño físico"
  | "BKD"
  | "Otras";

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
  modulo: string;
  jaula: string;
  biomasa: number;
  mortalidad: number;
  temperatura: number;
  oxigeno: number;
  hallazgo: string;
  estadoSanitario: SanitaryStatus;
};

type VisitForm = {
  centro: string;
  empresa: string;
  fecha: string;
  hora: string;
  veterinario: string;
  region: string;
  prioridad: Priority;
  modulo: string;
  jaula: string;
  biomasa: string;
  mortalidad: string;
  temperatura: string;
  oxigeno: string;
  hallazgo: string;
  estadoSanitario: SanitaryStatus;
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

type ChecklistItem = {
  label: string;
  done: boolean;
  icon: React.ElementType;
};

const STORAGE_KEYS = {
  visits: "mockup-visits-v3",
  selectedVisitId: "mockup-selected-visit-id-v3",
  clinicalState: "mockup-clinical-state-v3",
  historyFilters: "mockup-history-filters-v3",
};

const visitsSeed: Visit[] = [
  {
    id: "VST-24031",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "08:30",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "QS01",
    jaula: "QS01-101",
    biomasa: 2185595,
    mortalidad: 2.2,
    temperatura: 11.4,
    oxigeno: 8.2,
    hallazgo: "Inspección inicial pendiente.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24032",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-21",
    hora: "10:00",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "En progreso",
    prioridad: "Media",
    modulo: "Módulo 1",
    jaula: "104",
    biomasa: 1240000,
    mortalidad: 1.8,
    temperatura: 12.1,
    oxigeno: 7.9,
    hallazgo: "Seguimiento por PGD.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24033",
    centro: "Huenquillahue",
    empresa: "AquaChile",
    fecha: "2026-03-22",
    hora: "14:00",
    veterinario: "Daniel Pacheco",
    region: "Los Lagos",
    estado: "Completada",
    prioridad: "Alta",
    modulo: "Módulo 2",
    jaula: "203",
    biomasa: 980000,
    mortalidad: 1.2,
    temperatura: 9.6,
    oxigeno: 8.6,
    hallazgo: "Cierre de visita con reporte emitido.",
    estadoSanitario: "En carencia",
  },
];

const alertsSeed = [
  {
    titulo: "Mortalidad sobre umbral",
    descripcion: "QS01-103 registra aumento de mortalidad. Revisar prioridad clínica.",
    severidad: "Alta",
  },
  {
    titulo: "Muestras pendientes",
    descripcion: "Existen muestras por despachar antes de finalizar la jornada.",
    severidad: "Media",
  },
] as const;

const diagnosisOptions = ["PGD", "SRS", "HSMI", "Branquial", "Bacteriano", "Parasitológico", "Otras"];

const actionOptions = [
  "Tomar muestras",
  "Aplicar tratamiento",
  "Emitir receta",
  "Reforzar monitoreo",
  "Despachar a laboratorio",
  "Revisar en 48 h",
];

const defaultForm: VisitForm = {
  centro: "",
  empresa: "",
  fecha: "",
  hora: "",
  veterinario: "",
  region: "",
  prioridad: "Media",
  modulo: "",
  jaula: "",
  biomasa: "",
  mortalidad: "",
  temperatura: "",
  oxigeno: "",
  hallazgo: "",
  estadoSanitario: "Sin tratamiento",
};

const defaultChecklist: ChecklistItem[] = [
  { label: "Inspección visual", done: true, icon: Eye },
  { label: "Necropsia", done: false, icon: Stethoscope },
  { label: "Mortalidad", done: false, icon: Activity },
  { label: "Muestreo", done: false, icon: FlaskConical },
  { label: "Tratamiento / receta", done: false, icon: Pill },
];

const checklistIconMap: Record<string, React.ElementType> = Object.fromEntries(
  defaultChecklist.map((item) => [item.label, item.icon])
);

type StoredChecklistItem = {
  label: string;
  done: boolean;
};

function restoreChecklist(input: unknown): ChecklistItem[] {
  if (!Array.isArray(input)) return defaultChecklist;

  return input.map((item) => {
    const row = item as Partial<StoredChecklistItem>;
    return {
      label: row.label ?? "",
      done: Boolean(row.done),
      icon: checklistIconMap[row.label ?? ""] ?? Eye,
    };
  });
}

const medicalHistorySeed: MedicalEvent[] = [
  {
    id: "ME-01",
    fecha: "2026-03-18",
    tipo: "Tratamiento",
    detalle: "Jaula QS01-101 con tratamiento activo y seguimiento clínico.",
    nivel: "jaula",
    centro: "Quilque Sur",
    modulo: "QS01",
    jaula: "QS01-101",
    responsable: "Catalina Ruiz",
  },
  {
    id: "ME-02",
    fecha: "2026-03-17",
    tipo: "Muestreo",
    detalle: "Despacho de muestras bacteriológicas desde QS01.",
    nivel: "modulo",
    centro: "Quilque Sur",
    modulo: "QS01",
    jaula: "",
    responsable: "Pedro Ulloa",
  },
  {
    id: "ME-03",
    fecha: "2026-03-16",
    tipo: "Necropsia",
    detalle: "Necropsia con hallazgos compatibles con proceso branquial.",
    nivel: "jaula",
    centro: "Capera",
    modulo: "Módulo 1",
    jaula: "104",
    responsable: "Pedro Ulloa",
  },
  {
    id: "ME-04",
    fecha: "2026-03-15",
    tipo: "Alerta",
    detalle: "Incremento de mortalidad acumulada a nivel centro.",
    nivel: "centro",
    centro: "Huenquillahue",
    modulo: "",
    jaula: "",
    responsable: "Sistema",
  },
  {
    id: "ME-05",
    fecha: "2026-03-14",
    tipo: "Diagnóstico",
    detalle: "Predominio de SRS en módulo 2.",
    nivel: "modulo",
    centro: "Huenquillahue",
    modulo: "Módulo 2",
    jaula: "",
    responsable: "Laboratorio",
  },
];

const mortalityDistributionSeed: CageMortalityRecord[] = [
  { centro: "Quilque Sur", modulo: "QS01", jaula: "QS01-101", causa: "SRS", total: 42, porcentaje: 35.9 },
  { centro: "Quilque Sur", modulo: "QS01", jaula: "QS01-101", causa: "TENA", total: 71, porcentaje: 28.6 },
  { centro: "Quilque Sur", modulo: "QS01", jaula: "QS01-101", causa: "PGD", total: 8, porcentaje: 3.2 },
  { centro: "Quilque Sur", modulo: "QS01", jaula: "QS01-102", causa: "SRS", total: 89, porcentaje: 35.9 },
  { centro: "Capera", modulo: "Módulo 1", jaula: "104", causa: "PGD", total: 19, porcentaje: 52.78 },
  { centro: "Capera", modulo: "Módulo 1", jaula: "104", causa: "HSMI", total: 5, porcentaje: 13.89 },
  { centro: "Capera", modulo: "Módulo 1", jaula: "104", causa: "Rezago", total: 4, porcentaje: 11.11 },
  { centro: "Huenquillahue", modulo: "Módulo 2", jaula: "203", causa: "SRS", total: 24, porcentaje: 27.59 },
  { centro: "Huenquillahue", modulo: "Módulo 2", jaula: "203", causa: "PGD", total: 20, porcentaje: 22.99 },
  { centro: "Huenquillahue", modulo: "Módulo 2", jaula: "203", causa: "Daño físico", total: 17, porcentaje: 19.54 },
];

const recipientsSeed: Record<string, AutoReportRecipient> = {
  "Quilque Sur": {
    nombre: "María Torres",
    cargo: "Asistente operativa",
    canal: "Outlook / Impresión",
  },
  Capera: {
    nombre: "Javier Méndez",
    cargo: "Coordinador de soporte",
    canal: "Outlook / Impresión",
  },
  Huenquillahue: {
    nombre: "Lorena Díaz",
    cargo: "Administración de centro",
    canal: "Outlook / Impresión",
  },
};

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
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
    "En tratamiento": "bg-rose-50 text-rose-700 border-rose-200",
    "En carencia": "bg-amber-50 text-amber-700 border-amber-200",
    "Sin tratamiento": "bg-emerald-50 text-emerald-700 border-emerald-200",
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
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
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
  placeholder = "Buscar centro, módulo o jaula",
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
            <span>{visit.region}</span>
          </div>
          <p className="mt-1 font-medium text-slate-700">
            {visit.modulo} · {visit.jaula}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatusBadge value={visit.prioridad} />
        <StatusBadge value={visit.estadoSanitario} />
      </div>

      <p className="mt-3 text-sm text-slate-600">{visit.hallazgo}</p>

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

function toForm(visit: Visit): VisitForm {
  return {
    centro: visit.centro,
    empresa: visit.empresa,
    fecha: visit.fecha,
    hora: visit.hora,
    veterinario: visit.veterinario,
    region: visit.region,
    prioridad: visit.prioridad,
    modulo: visit.modulo,
    jaula: visit.jaula,
    biomasa: String(visit.biomasa),
    mortalidad: String(visit.mortalidad),
    temperatura: String(visit.temperatura),
    oxigeno: String(visit.oxigeno),
    hallazgo: visit.hallazgo,
    estadoSanitario: visit.estadoSanitario,
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
    modulo: form.modulo.trim(),
    jaula: form.jaula.trim(),
    biomasa: Number(form.biomasa || 0),
    mortalidad: Number(form.mortalidad || 0),
    temperatura: Number(form.temperatura || 0),
    oxigeno: Number(form.oxigeno || 0),
    hallazgo: form.hallazgo.trim() || "Sin hallazgo registrado",
    estadoSanitario: form.estadoSanitario,
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
    visit.estadoSanitario,
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVisitId, setEditingVisitId] = useState<string | null>(null);
  const [visitForm, setVisitForm] = useState<VisitForm>(defaultForm);

  const [inspectionNote, setInspectionNote] = useState(
    "Peces con nado normal. Sin boqueo evidente. Se requiere confirmar condición clínica."
  );
  const [necropsyNote, setNecropsyNote] = useState("Sin necropsia registrada.");
  const [mortalityNote, setMortalityNote] = useState("Registrar clasificación de mortalidad observada.");
  const [treatmentNote, setTreatmentNote] = useState("Sin tratamiento indicado.");
  const [samplingNote, setSamplingNote] = useState("Sin muestras registradas.");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string[]>(["PGD"]);
  const [selectedActions, setSelectedActions] = useState<string[]>(["Tomar muestras"]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);

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
        setInspectionNote(parsed.inspectionNote ?? "");
        setNecropsyNote(parsed.necropsyNote ?? "");
        setMortalityNote(parsed.mortalityNote ?? "");
        setTreatmentNote(parsed.treatmentNote ?? "");
        setSamplingNote(parsed.samplingNote ?? "");
        setSelectedDiagnosis(parsed.selectedDiagnosis ?? []);
        setSelectedActions(parsed.selectedActions ?? []);
        setChecklist(restoreChecklist(parsed.checklist));
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
        inspectionNote,
        necropsyNote,
        mortalityNote,
        treatmentNote,
        samplingNote,
        selectedDiagnosis,
        selectedActions,
        checklist: checklist.map(({ label, done }) => ({ label, done })),
      })
    );
  }, [
    inspectionNote,
    necropsyNote,
    mortalityNote,
    treatmentNote,
    samplingNote,
    selectedDiagnosis,
    selectedActions,
    checklist,
    ready,
  ]);

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
      if (filter === "Hoy") return visit.fecha === today;
      if (filter === "Pendientes") return visit.estado === "Pendiente";
      if (filter === "En progreso") return visit.estado === "En progreso";
      if (filter === "Completadas") return visit.estado === "Completada";
      return true;
    });
  }, [visits, search, filter]);

  const stats = useMemo(() => {
    return {
      pendientes: visits.filter((v) => v.estado === "Pendiente").length,
      enCurso: visits.filter((v) => v.estado === "En progreso").length,
      completadas: visits.filter((v) => v.estado === "Completada").length,
    };
  }, [visits]);

  const centros = useMemo(() => Array.from(new Set(visits.map((v) => v.centro))), [visits]);

  const modulosForCentro = useMemo(() => {
    return Array.from(new Set(visits.filter((v) => v.centro === selectedCentro).map((v) => v.modulo)));
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
      return item.jaula === selectedJaula || item.modulo === selectedModulo || item.nivel === "centro";
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

  const aggregatedByCause = useMemo(() => {
    const bucket = new Map<MortalityCause, number>();
    mortalityForContext.forEach((item) => {
      bucket.set(item.causa, (bucket.get(item.causa) || 0) + item.total);
    });

    return Array.from(bucket.entries())
      .map(([causa, total]) => ({ causa, total }))
      .sort((a, b) => b.total - a.total);
  }, [mortalityForContext]);

  const lastMedicalEvents = useMemo(() => filteredMedicalHistory.slice(0, 5), [filteredMedicalHistory]);

  const dominantCause = aggregatedByCause[0]?.causa || "Sin datos";

  const recipient = recipientsSeed[selectedVisit.centro] || {
    nombre: "Destino no definido",
    cargo: "Pendiente",
    canal: "Impresión",
  };

  const generatedReport = useMemo(() => {
    return {
      centro: selectedVisit.centro,
      empresa: selectedVisit.empresa,
      modulo: selectedModulo,
      jaula: selectedJaula,
      veterinario: selectedVisit.veterinario,
      fecha: selectedVisit.fecha,
      hora: selectedVisit.hora,
      estadoSanitario: selectedVisit.estadoSanitario,
      biomasa: selectedVisit.biomasa,
      mortalidad: selectedVisit.mortalidad,
      temperatura: selectedVisit.temperatura,
      oxigeno: selectedVisit.oxigeno,
      inspeccion: inspectionNote,
      necropsia: necropsyNote,
      mortalidadDetalle: mortalityNote,
      tratamiento: treatmentNote,
      muestreo: samplingNote,
      diagnostico: selectedDiagnosis.join(", ") || "Sin selección",
      acciones: selectedActions.join(", ") || "Sin selección",
      principalCausa: dominantCause,
      destinatario: recipient,
    };
  }, [
    selectedVisit,
    selectedModulo,
    selectedJaula,
    inspectionNote,
    necropsyNote,
    mortalityNote,
    treatmentNote,
    samplingNote,
    selectedDiagnosis,
    selectedActions,
    dominantCause,
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
    if (nextVisits.length === 0) {
      setVisits([visitsSeed[0]]);
      setSelectedVisit(visitsSeed[0]);
      setToast(`Visita ${visit.id} eliminada`);
      return;
    }

    setVisits(nextVisits);
    if (selectedVisit.id === visit.id) {
      setSelectedVisit(nextVisits[0]);
    }
    setToast(`Visita ${visit.id} eliminada`);
  };

  const resetClinicalData = () => {
    setInspectionNote("");
    setNecropsyNote("");
    setMortalityNote("");
    setTreatmentNote("");
    setSamplingNote("");
    setSelectedDiagnosis([]);
    setSelectedActions([]);
    setChecklist(defaultChecklist);
    setToast("Registro clínico reiniciado");
  };

  const finishVisit = () => {
    setSelectedVisit((prev) => {
      const next = {
        ...prev,
        estado: "Completada" as VisitStatus,
        modulo: selectedModulo,
        jaula: selectedJaula,
        hallazgo: inspectionNote || prev.hallazgo,
      };
      setVisits((current) => current.map((v) => (v.id === prev.id ? next : v)));
      return next;
    });
    setTab("resumen");
    setToast("Visita finalizada y reporte preparado");
  };

  const exportSummary = () => {
    const payload = {
      visita: selectedVisit,
      historial: filteredMedicalHistory,
      mortalidad: mortalityForContext,
      reporte: generatedReport,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedVisit.id}-resumen-visita.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Resumen exportado en JSON local");
  };

  const sendToTeams = () => {
    setToast(`Reporte de ${selectedVisit.id} marcado como enviado`);
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
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Flujo de terreno</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight">
                Centro → módulo → jaula → historial → registro → reporte
              </h2>
              {/* <p className="mt-3 text-sm text-white/85">
                Mockup alineado al trabajo real del veterinario y a la futura implementación en Power Apps.
              </p> */}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/70">Pendientes</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.pendientes}</p>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/70">En curso</p>
                  <p className="mt-2 text-3xl font-semibold">{stats.enCurso}</p>
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

            {/* <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Flujo principal" subtitle="Solo lo necesario para terreno" />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Centro", Building2],
                  ["Módulo", Layers3],
                  ["Jaula", Grid3X3],
                  ["Historial sanitario", History],
                  ["Registro clínico", ClipboardPenLine],
                  ["Reporte PDF", FileOutput],
                ].map(([label, Icon]: any) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3FC] text-[#0F6CBD]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
                  </div>
                ))}
              </div>
            </section> */}

            <section className="grid grid-cols-2 gap-3">
              <MetricCard label="Completadas" value={stats.completadas} icon={CheckCircle2} tone="emerald" />
              <MetricCard label="Sin señal" value={offline ? "Activo" : "No"} icon={WifiOff} tone="slate" />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Alertas de hoy" subtitle="Prioridad clínica" />
              <div className="space-y-3">
                {alertsSeed.map((alert) => (
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
          </div>
        )}

        {tab === "visitas" && (
          <div className="space-y-4">
            <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Visitas</h2>
                  <p className="mt-1 text-sm text-slate-500">Agenda simple con centro, módulo, jaula y estado.</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F6CBD] text-white"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["Todas", "Hoy", "Pendientes", "En progreso", "Completadas"] as FilterKey[]).map((item) => (
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
          </div>
        )}

        {tab === "registro" && (
          <div className="space-y-4">
            <section className="rounded-[28px] bg-gradient-to-br from-[#0F6CBD] to-[#115EA3] p-5 text-white shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Visita activa</p>
                  <h2 className="mt-2 text-xl font-semibold">{selectedVisit.centro}</h2>
                  <p className="mt-2 text-sm text-white/80">
                    {selectedVisit.empresa} · {selectedVisit.region}
                  </p>
                </div>
                <StatusBadge value={selectedVisit.estado} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-xs text-white/70">Módulo</p>
                  <p className="mt-1 text-sm font-semibold">{selectedModulo}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-xs text-white/70">Jaula</p>
                  <p className="mt-1 text-sm font-semibold">{selectedJaula}</p>
                </div>
              </div>

              <div className="mt-3">
                <StatusBadge value={selectedVisit.estadoSanitario} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Contexto clínico" subtitle="Resumen" />
              <div className="grid grid-cols-2 gap-2">
                {(["modulo", "jaula"] as HistoryLevel[]).map((level) => (
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

              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Módulo</label>
                    <select
                      value={selectedModulo}
                      onChange={(e) => {
                        const modulo = e.target.value;
                        const firstJaula =
                          Array.from(new Set(visits.filter((v) => v.modulo === modulo).map((v) => v.jaula)))[0] || "";
                        setSelectedModulo(modulo);
                        setSelectedJaula(firstJaula);
                      }}
                      className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                    >
                      {Array.from(new Set(visits.map((v) => v.modulo))).map((item) => (
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
                      {Array.from(
                        new Set(visits.filter((v) => v.modulo === selectedModulo).map((v) => v.jaula))
                      ).map((item) => (
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
                <MetricCard label="Causa principal" value={dominantCause} icon={AlertTriangle} tone="amber" />
                <MetricCard label="Estado jaula" value={selectedVisit.estadoSanitario} icon={ClipboardCheck} tone="emerald" />
                <MetricCard
                  label="Mortalidad total"
                  value={mortalityForContext.reduce((acc, item) => acc + item.total, 0)}
                  icon={Activity}
                  tone="slate"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Últimos antecedentes" subtitle="Historial sanitario relevante" />
              <div className="space-y-3">
                {lastMedicalEvents.length ? (
                  lastMedicalEvents.map((event) => (
                    <div key={event.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{event.tipo}</p>
                        <StatusBadge value={event.nivel} />
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{event.detalle}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {event.fecha} · {event.responsable}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                    No hay antecedentes para esta selección.
                  </div>
                )}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <MetricCard label="Biomasa" value={selectedVisit.biomasa} icon={Activity} tone="blue" />
              <MetricCard label="Mortalidad %" value={`${selectedVisit.mortalidad}%`} icon={AlertTriangle} tone="amber" />
              <MetricCard label="Temperatura" value={`${selectedVisit.temperatura} °C`} icon={Activity} tone="slate" />
              <MetricCard label="Oxígeno" value={`${selectedVisit.oxigeno} mg/L`} icon={Activity} tone="emerald" />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Inspección visual"
                subtitle="Registro breve de comportamiento y observación"
                action={
                  <button onClick={() => act("Simulación de dictado iniciada")} className="text-sm font-medium text-[#0F6CBD]">
                    Dictar
                  </button>
                }
              />
              <textarea
                value={inspectionNote}
                onChange={(e) => setInspectionNote(e.target.value)}
                className="min-h-[110px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Natación, boqueo, peces orillados, comportamiento general..."
              />
              <div className="mt-3 grid grid-cols-3 gap-3">
                <button
                  onClick={() => act("Dictado activado")}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  <Mic className="h-4 w-4" />
                  Dictado
                </button>
                <button
                  onClick={() => act("Carga de foto simulada")}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  <Camera className="h-4 w-4" />
                  Foto
                </button>
                <button
                  onClick={() => act("Checklist actualizado")}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Checklist
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Necropsia" subtitle="Hallazgo resumido" />
              <textarea
                value={necropsyNote}
                onChange={(e) => setNecropsyNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Describe hallazgos de necropsia..."
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Mortalidad" subtitle="Clasificación y observación" />
              <textarea
                value={mortalityNote}
                onChange={(e) => setMortalityNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Registrar causas observadas y distribución relevante..."
              />
              <div className="mt-4 space-y-2">
                {aggregatedByCause.slice(0, 5).map((item) => (
                  <div key={item.causa} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="font-medium text-slate-800">{item.causa}</span>
                    <span className="font-semibold text-slate-900">{item.total}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Diagnóstico presuntivo" subtitle="Selección rápida" />
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
              <SectionHeader title="Tratamiento / receta" subtitle="Acciones indicadas" />
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
              <textarea
                value={treatmentNote}
                onChange={(e) => setTreatmentNote(e.target.value)}
                className="mt-4 min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Detalle de tratamiento, receta o indicación..."
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Muestreo" subtitle="Solo lo esencial" />
              <textarea
                value={samplingNote}
                onChange={(e) => setSamplingNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Tipo de muestra, cantidad y destino..."
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Checklist"
                subtitle="Control rápido de la visita"
                action={
                  <button onClick={resetClinicalData} className="text-sm font-medium text-[#0F6CBD]">
                    Limpiar
                  </button>
                }
              />
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
                  Exportar
                </button>
                <button
                  onClick={sendToTeams}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-medium text-white"
                >
                  <Send className="h-4 w-4" />
                  Enviar
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Destino del reporte" subtitle="Listo para impresión o envío" />
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
                title="Resumen final"
                subtitle="Contenido principal del reporte"
                action={
                  <button onClick={() => setTab("registro")} className="text-sm font-medium text-[#0F6CBD]">
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

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-500">Estado sanitario</p>
                  <div className="mt-2">
                    <StatusBadge value={generatedReport.estadoSanitario} />
                  </div>
                </div>

                <div>
                  <p className="font-medium text-slate-500">Inspección visual</p>
                  <p className="mt-1 leading-7 text-slate-700">{generatedReport.inspeccion}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Necropsia</p>
                  <p className="mt-1 leading-7 text-slate-700">{generatedReport.necropsia}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Mortalidad</p>
                  <p className="mt-1 leading-7 text-slate-700">{generatedReport.mortalidadDetalle}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Diagnóstico</p>
                  <p className="mt-1 leading-7 text-slate-700">{generatedReport.diagnostico}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Tratamiento / receta</p>
                  <p className="mt-1 leading-7 text-slate-700">{generatedReport.tratamiento}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Muestreo</p>
                  <p className="mt-1 leading-7 text-slate-700">{generatedReport.muestreo}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Acciones</p>
                  <p className="mt-1 leading-7 text-slate-700">{generatedReport.acciones}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Causa principal</p>
                  <p className="mt-1 leading-7 text-slate-700">{generatedReport.principalCausa}</p>
                </div>
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
          ].map(([label, key]) => {
            const isDate = key === "fecha";
            const isTime = key === "hora";
            const isNumeric = ["biomasa", "mortalidad", "temperatura", "oxigeno"].includes(key);

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
            <label className="text-sm font-medium text-slate-700">Estado sanitario</label>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {(["En tratamiento", "En carencia", "Sin tratamiento"] as SanitaryStatus[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setVisitForm((prev) => ({ ...prev, estadoSanitario: item }))}
                  className={cn(
                    "h-11 rounded-2xl border text-sm font-medium",
                    visitForm.estadoSanitario === item
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
            <label className="text-sm font-medium text-slate-700">Hallazgo inicial</label>
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
            }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
          >
            <Eye className="h-4 w-4" />
            Ir a inicio
          </button>
        </div>
      </ModalShell>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
