
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
  X,
  Trash2,
  Pencil,
  RotateCcw,
  Eye,
  Printer,
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
  Thermometer,
  Atom,
  Skull,
  PackageOpen,
  ClipboardList,
} from "lucide-react";

type VisitStatus = "Pendiente" | "En progreso" | "Completada";
type Priority = "Alta" | "Media" | "Baja";
type TabKey = "inicio" | "visitas" | "registro" | "muestreo" | "necropsias" | "resumen";
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
  numeroPeces: number;
  pesoPromedio: number;
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
  numeroPeces: string;
  pesoPromedio: string;
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

type NecropsyRecord = {
  id: string;
  fecha: string;
  centro: string;
  modulo: string;
  jaula: string;
  veterinario: string;
  estadoSanitario: SanitaryStatus;
  mortalidadDia: number;
  mortalidadMesPct: number;
  mortalidadAcumuladaPct: number;
  nroTratamientos: number;
  nroBanos: number;
  seleccionado: number;
  origen: "Ponton de ensilaje";
  motivo: "Rutina" | "Sospecha" | "Brote" | "Seguimiento tratamiento";
  hallazgoExterno: string;
  hallazgoInterno: string;
  diagnosticoPresuntivo: string;
  clasificacionPrimaria: string[];
  clasificacionSecundaria: MortalityCause[];
  observaciones: string;
};

const STORAGE_KEYS = {
  visits: "mockup-visits-v4",
  selectedVisitId: "mockup-selected-visit-id-v4",
  clinicalState: "mockup-clinical-state-v4",
  historyFilters: "mockup-history-filters-v4",
  samplingFlow: "mockup-sampling-flow-v4",
  necropsyState: "mockup-necropsy-state-v4",
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
    numeroPeces: 364266,
    pesoPromedio: 6.0,
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
    numeroPeces: 248000,
    pesoPromedio: 5.0,
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
    numeroPeces: 175000,
    pesoPromedio: 5.6,
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

const visitTypeOptions = [
  "Programa Sanitario Específico",
  "Monitoreo de Rutina o Preventiva",
  "Sospecha Sanitaria o Brote Activo",
  "Supervisión o Auditoría Interna",
  "Toma de Muestras Específicas",
  "Inspección Regulatoria",
  "Evaluación Pre-Cosecha",
  "Solicitada por el Cliente",
];

const visitObjectiveOptions = [
  "Vigilancia activa",
  "Cumplimiento normativo",
  "Control preventivo",
  "Bienestar animal",
  "Seguimiento productivo y sanitario",
  "Diagnóstico",
  "Toma de decisiones terapéuticas urgentes",
  "Aseguramiento de calidad",
  "Certificar condiciones sanitarias",
  "Evaluar riesgos",
  "Validación de procedimientos",
];

const visitFrequencyOptions = [
  "Semanal",
  "Quincenal",
  "Mensual",
  "Bimensual",
  "Según calendario establecido",
  "Según política de la empresa",
  "A solicitud",
];

const visitActivityOptions = [
  "Toma de muestras",
  "Chequeo clínico",
  "Registros de mortalidad",
  "Revisión de tratamientos",
  "Evaluación clínica",
  "Revisión de condiciones ambientales",
  "Control de alimentación",
  "Observación de comportamientos",
  "Inspección de peces afectados",
  "Implementación de medidas de contención",
  "Revisión documental",
  "Control de uso de antibióticos",
  "Protocolos de bioseguridad",
  "Trazabilidad",
  "Revisión de cargas parasitarias (Caligus)",
];

const visitSpecificProgramOptions = ["Programa SRS", "Programa ISA", "BKD", "IPN", "PD", "Otro"];

const samplingCategoryOptions = [
  "Por Programa Sanitario",
  "Monitoreo de Rutina",
  "Sospecha o Brote Clínico",
  "Análisis Microbiológico y Parasitológico",
  "Muestra Ambiental",
  "Muestras Genéticas o Histopatologías",
  "Muestras para Auditoría Interna o requisitos de cliente",
];

const samplingObjectiveOptions = [
  "Vigilancia activa",
  "Cumplimiento normativo",
  "Detectar alteraciones subclínicas",
  "Diagnóstico específico",
  "Toma de decisiones terapéuticas",
  "Apoyo diagnóstico",
  "Seguimiento de tratamientos",
  "Cumplimiento de requisitos de exportación/certificación",
  "Cumplimiento de estándares internacionales",
];

const samplingDiseaseOptions = [
  "SRS",
  "ISA",
  "BKD",
  "IPN",
  "PD",
  "P. salmonis",
  "Tenacibaculum",
  "Aeromonas",
  "Caligus rogercresseyi",
  "Ichthyobodo",
  "Trichodina",
  "Otro",
];

const samplingTypeOptions = [
  "Riñón",
  "Bazo",
  "Hígado",
  "Corazón",
  "Cerebro",
  "Raspado branquial",
  "Muestra sanguínea",
  "Branquias",
  "Intestino",
  "Piel",
  "Raspado de mucosa",
  "Condición general",
  "Tejidos internos",
  "Frotis",
  "Contenido intestinal",
  "Contenido de lesiones",
  "Hisopado branquial",
  "Hisopado intestinal",
  "Sedimentos",
  "Bioensayo",
];

const samplingEnvironmentOptions = [
  "Temperatura",
  "Oxígeno",
  "Salinidad",
  "Amonio",
  "pH",
  "Laboratorio externo",
  "Centro de cultivo",
  "Envío urgente a laboratorio",
  "Toma de muestras vivas",
  "BAP",
  "ASC",
];

const placeholderModules = [
  {
    title: "Módulo diagnóstico",
    description:
      "Descripción: el diagnóstico realizado por un médico veterinario es una de las herramientas clave para detectar, controlar y prevenir enfermedades que puedan afectar la producción, el bienestar animal y el cumplimiento normativo.",
  },
  {
    title: "Módulo análisis de laboratorio",
    description:
      "Descripción: Los análisis de laboratorio son fundamentales para complementar el diagnóstico clínico en terreno y tomar decisiones informadas respecto a la salud de los peces, la efectividad de tratamientos y la condición sanitaria del entorno.",
  },
  {
    title: "Módulo PMV",
    description:
      "Descripción: La prescripción médico veterinaria es una herramienta clave para asegurar un uso responsable de fármacos, cumplir con la normativa vigente y proteger tanto la salud animal como la inocuidad alimentaria.",
  },
  {
    title: "Módulo trazabilidad clínica",
    description:
      "Descripción: La trazabilidad clínica permite vincular cada acción sanitaria, tratamiento, evento clínico o decisión productiva con el grupo o unidad de peces afectada.",
  },
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
  numeroPeces: "",
  pesoPromedio: "",
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

const mortalityPrimaryOptions = ["SCA", "DaF", "DEF", "Rez", "TC", "Otras"];
const necropsyMotiveOptions: NecropsyRecord["motivo"][] = [
  "Rutina",
  "Sospecha",
  "Brote",
  "Seguimiento tratamiento",
];

const necropsySeed: NecropsyRecord[] = [
  {
    id: "NEC-24001",
    fecha: "2026-03-20",
    centro: "Quilque Sur",
    modulo: "QS01",
    jaula: "QS01-101",
    veterinario: "Pedro Ulloa",
    estadoSanitario: "Sin tratamiento",
    mortalidadDia: 248,
    mortalidadMesPct: 2.2,
    mortalidadAcumuladaPct: 11.6,
    nroTratamientos: 5,
    nroBanos: 3,
    seleccionado: 6,
    origen: "Ponton de ensilaje",
    motivo: "Sospecha",
    hallazgoExterno: "Peces letárgicos, leve palidez branquial.",
    hallazgoInterno: "Bazo agrandado y compromiso branquial compatible con proceso infeccioso.",
    diagnosticoPresuntivo: "SRS / PGD",
    clasificacionPrimaria: ["Otras"],
    clasificacionSecundaria: ["SRS", "PGD"],
    observaciones: "Tabilla prellenada para impresión y firma en pontón.",
  },
  {
    id: "NEC-24002",
    fecha: "2026-03-20",
    centro: "Capera",
    modulo: "Módulo 1",
    jaula: "104",
    veterinario: "Catalina Ruiz",
    estadoSanitario: "En tratamiento",
    mortalidadDia: 6,
    mortalidadMesPct: 1.8,
    mortalidadAcumuladaPct: 7.4,
    nroTratamientos: 2,
    nroBanos: 1,
    seleccionado: 4,
    origen: "Ponton de ensilaje",
    motivo: "Seguimiento tratamiento",
    hallazgoExterno: "Condición corporal disminuida en muestra de mortalidad.",
    hallazgoInterno: "Predominio de lesiones branquiales con focos hemorrágicos.",
    diagnosticoPresuntivo: "PGD",
    clasificacionPrimaria: ["Rez"],
    clasificacionSecundaria: ["PGD", "HSMI"],
    observaciones: "Caso alineado a seguimiento clínico del módulo.",
  },
];

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

function normalizeVisit(raw: Partial<Visit> | null | undefined): Visit {
  return {
    id: raw?.id ?? `VST-${Date.now().toString().slice(-6)}`,
    centro: raw?.centro ?? "",
    empresa: raw?.empresa ?? "",
    fecha: raw?.fecha ?? "",
    hora: raw?.hora ?? "",
    veterinario: raw?.veterinario ?? "",
    region: raw?.region ?? "",
    estado: raw?.estado ?? "Pendiente",
    prioridad: raw?.prioridad ?? "Media",
    modulo: raw?.modulo ?? "",
    jaula: raw?.jaula ?? "",
    numeroPeces: Number(raw?.numeroPeces ?? 0),
    pesoPromedio: Number(raw?.pesoPromedio ?? 0),
    biomasa: Number(raw?.biomasa ?? 0),
    mortalidad: Number(raw?.mortalidad ?? 0),
    temperatura: Number(raw?.temperatura ?? 0),
    oxigeno: Number(raw?.oxigeno ?? 0),
    hallazgo: raw?.hallazgo ?? "Sin hallazgo registrado",
    estadoSanitario: raw?.estadoSanitario ?? "Sin tratamiento",
  };
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

function AccordionSection({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group rounded-3xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 transition group-open:rotate-90" />
      </summary>
      <div className="border-t border-slate-100 px-4 pb-4 pt-3">{children}</div>
    </details>
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
    { key: "necropsias", label: "Necropsias", icon: Skull },
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
    numeroPeces: String(visit.numeroPeces),
    pesoPromedio: String(visit.pesoPromedio),
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
    numeroPeces: Number(form.numeroPeces || 0),
    pesoPromedio: Number(form.pesoPromedio || 0),
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

  const [selectedVisitTypes, setSelectedVisitTypes] = useState<string[]>(["Monitoreo de Rutina o Preventiva"]);
  const [selectedVisitObjectives, setSelectedVisitObjectives] = useState<string[]>(["Control preventivo"]);
  const [selectedVisitFrequencies, setSelectedVisitFrequencies] = useState<string[]>(["Mensual"]);
  const [selectedVisitActivities, setSelectedVisitActivities] = useState<string[]>([
    "Chequeo clínico",
    "Revisión de tratamientos",
  ]);
  const [selectedVisitPrograms, setSelectedVisitPrograms] = useState<string[]>(["Programa SRS"]);
  const [selectedSamplingCategories, setSelectedSamplingCategories] = useState<string[]>([
    "Por Programa Sanitario",
  ]);
  const [selectedSamplingObjectives, setSelectedSamplingObjectives] = useState<string[]>(["Vigilancia activa"]);
  const [selectedSamplingDiseases, setSelectedSamplingDiseases] = useState<string[]>(["SRS"]);
  const [selectedSamplingTypes, setSelectedSamplingTypes] = useState<string[]>([
    "Riñón",
    "Bazo",
    "Muestra sanguínea",
  ]);
  const [selectedSamplingEnvironment, setSelectedSamplingEnvironment] = useState<string[]>([
    "Temperatura",
    "Oxígeno",
  ]);
  const [samplingContextMode, setSamplingContextMode] = useState<"independiente" | "visita">("independiente");
  const [samplingLinkedVisitId, setSamplingLinkedVisitId] = useState<string | null>(null);

  const [historyLevel, setHistoryLevel] = useState<HistoryLevel>("jaula");
  const [selectedCentro, setSelectedCentro] = useState(visitsSeed[0].centro);
  const [selectedModulo, setSelectedModulo] = useState(visitsSeed[0].modulo);
  const [selectedJaula, setSelectedJaula] = useState(visitsSeed[0].jaula);

  const [necropsyRecords, setNecropsyRecords] = useState<NecropsyRecord[]>(necropsySeed);
  const [selectedNecropsyId, setSelectedNecropsyId] = useState<string>(necropsySeed[0].id);
  const [necropsySelectedCount, setNecropsySelectedCount] = useState("6");
  const [necropsyMotive, setNecropsyMotive] = useState<NecropsyRecord["motivo"]>("Sospecha");
  const [necropsyExternalNote, setNecropsyExternalNote] = useState("Peces con condición disminuida y palidez branquial.");
  const [necropsyInternalNote, setNecropsyInternalNote] = useState("Hallazgos macroscópicos compatibles con proceso sistémico.");
  const [necropsyPresumptiveDx, setNecropsyPresumptiveDx] = useState("SRS / PGD");
  const [necropsyObservations, setNecropsyObservations] = useState(
    "Registro preparado para impresión en pontón y respaldo en bitácora."
  );
  const [selectedNecropsyPrimary, setSelectedNecropsyPrimary] = useState<string[]>(["Otras"]);
  const [selectedNecropsySecondary, setSelectedNecropsySecondary] = useState<MortalityCause[]>(["SRS", "PGD"]);

  useEffect(() => {
    try {
      const savedVisits = localStorage.getItem(STORAGE_KEYS.visits);
      const savedSelectedVisitId = localStorage.getItem(STORAGE_KEYS.selectedVisitId);
      const savedClinicalState = localStorage.getItem(STORAGE_KEYS.clinicalState);
      const savedHistoryFilters = localStorage.getItem(STORAGE_KEYS.historyFilters);
      const savedSamplingFlow = localStorage.getItem(STORAGE_KEYS.samplingFlow);
      const savedNecropsyState = localStorage.getItem(STORAGE_KEYS.necropsyState);

      const parsedVisits: Visit[] = savedVisits
        ? JSON.parse(savedVisits).map((visit: Partial<Visit>) => normalizeVisit(visit))
        : visitsSeed;
      setVisits(parsedVisits);

      const selected = parsedVisits.find((v) => v.id === savedSelectedVisitId) || parsedVisits[0] || visitsSeed[0];
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
        setSelectedVisitTypes(parsed.selectedVisitTypes ?? ["Monitoreo de Rutina o Preventiva"]);
        setSelectedVisitObjectives(parsed.selectedVisitObjectives ?? ["Control preventivo"]);
        setSelectedVisitFrequencies(parsed.selectedVisitFrequencies ?? ["Mensual"]);
        setSelectedVisitActivities(parsed.selectedVisitActivities ?? ["Chequeo clínico", "Revisión de tratamientos"]);
        setSelectedVisitPrograms(parsed.selectedVisitPrograms ?? ["Programa SRS"]);
        setSelectedSamplingCategories(parsed.selectedSamplingCategories ?? ["Por Programa Sanitario"]);
        setSelectedSamplingObjectives(parsed.selectedSamplingObjectives ?? ["Vigilancia activa"]);
        setSelectedSamplingDiseases(parsed.selectedSamplingDiseases ?? ["SRS"]);
        setSelectedSamplingTypes(parsed.selectedSamplingTypes ?? ["Riñón", "Bazo", "Muestra sanguínea"]);
        setSelectedSamplingEnvironment(parsed.selectedSamplingEnvironment ?? ["Temperatura", "Oxígeno"]);
      }

      if (savedHistoryFilters) {
        const parsed = JSON.parse(savedHistoryFilters);
        setHistoryLevel(parsed.historyLevel ?? "jaula");
        setSelectedCentro(parsed.selectedCentro ?? selected.centro);
        setSelectedModulo(parsed.selectedModulo ?? selected.modulo);
        setSelectedJaula(parsed.selectedJaula ?? selected.jaula);
      }

      if (savedSamplingFlow) {
        const parsed = JSON.parse(savedSamplingFlow);
        setSamplingContextMode(parsed.samplingContextMode ?? "independiente");
        setSamplingLinkedVisitId(parsed.samplingLinkedVisitId ?? null);
      }

      if (savedNecropsyState) {
        const parsed = JSON.parse(savedNecropsyState);
        setNecropsyRecords(parsed.necropsyRecords ?? necropsySeed);
        setSelectedNecropsyId(parsed.selectedNecropsyId ?? necropsySeed[0].id);
        setNecropsySelectedCount(parsed.necropsySelectedCount ?? "6");
        setNecropsyMotive(parsed.necropsyMotive ?? "Sospecha");
        setNecropsyExternalNote(parsed.necropsyExternalNote ?? "");
        setNecropsyInternalNote(parsed.necropsyInternalNote ?? "");
        setNecropsyPresumptiveDx(parsed.necropsyPresumptiveDx ?? "");
        setNecropsyObservations(parsed.necropsyObservations ?? "");
        setSelectedNecropsyPrimary(parsed.selectedNecropsyPrimary ?? ["Otras"]);
        setSelectedNecropsySecondary(parsed.selectedNecropsySecondary ?? ["SRS", "PGD"]);
      }
    } catch {
      setVisits(visitsSeed);
      setSelectedVisit(visitsSeed[0]);
      setNecropsyRecords(necropsySeed);
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
        selectedVisitTypes,
        selectedVisitObjectives,
        selectedVisitFrequencies,
        selectedVisitActivities,
        selectedVisitPrograms,
        selectedSamplingCategories,
        selectedSamplingObjectives,
        selectedSamplingDiseases,
        selectedSamplingTypes,
        selectedSamplingEnvironment,
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
    selectedVisitTypes,
    selectedVisitObjectives,
    selectedVisitFrequencies,
    selectedVisitActivities,
    selectedVisitPrograms,
    selectedSamplingCategories,
    selectedSamplingObjectives,
    selectedSamplingDiseases,
    selectedSamplingTypes,
    selectedSamplingEnvironment,
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
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEYS.samplingFlow,
      JSON.stringify({
        samplingContextMode,
        samplingLinkedVisitId,
      })
    );
  }, [samplingContextMode, samplingLinkedVisitId, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEYS.necropsyState,
      JSON.stringify({
        necropsyRecords,
        selectedNecropsyId,
        necropsySelectedCount,
        necropsyMotive,
        necropsyExternalNote,
        necropsyInternalNote,
        necropsyPresumptiveDx,
        necropsyObservations,
        selectedNecropsyPrimary,
        selectedNecropsySecondary,
      })
    );
  }, [
    necropsyRecords,
    selectedNecropsyId,
    necropsySelectedCount,
    necropsyMotive,
    necropsyExternalNote,
    necropsyInternalNote,
    necropsyPresumptiveDx,
    necropsyObservations,
    selectedNecropsyPrimary,
    selectedNecropsySecondary,
    ready,
  ]);

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

  const linkedSamplingVisit = visits.find((visit) => visit.id === samplingLinkedVisitId) || null;

  const recipient = recipientsSeed[selectedVisit.centro] || {
    nombre: "Destino no definido",
    cargo: "Pendiente",
    canal: "Impresión",
  };

  const selectedNecropsy = useMemo(
    () => necropsyRecords.find((record) => record.id === selectedNecropsyId) || necropsyRecords[0] || necropsySeed[0],
    [necropsyRecords, selectedNecropsyId]
  );

  const necropsyForContext = useMemo(() => {
    return necropsyRecords.filter((item) => {
      const matchText = [item.id, item.centro, item.modulo, item.jaula, item.diagnosticoPresuntivo]
        .join(" ")
        .toLowerCase();
      if (search.trim() && !matchText.includes(search.toLowerCase().trim())) return false;
      if (selectedCentro && item.centro !== selectedCentro && tab === "necropsias") return false;
      return true;
    });
  }, [necropsyRecords, search, selectedCentro, tab]);

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
      numeroPeces: selectedVisit.numeroPeces,
      pesoPromedio: selectedVisit.pesoPromedio,
      biomasa: selectedVisit.biomasa,
      mortalidad: selectedVisit.mortalidad,
      temperatura: selectedVisit.temperatura,
      oxigeno: selectedVisit.oxigeno,
      inspeccion: inspectionNote,
      necropsia: necropsyNote,
      mortalidadDetalle: mortalityNote,
      tratamiento: treatmentNote,
      muestreo: samplingNote,
      tipoVisita: selectedVisitTypes.join(", ") || "Sin selección",
      objetivoVisita: selectedVisitObjectives.join(", ") || "Sin selección",
      frecuenciaVisita: selectedVisitFrequencies.join(", ") || "Sin selección",
      actividadesVisita: selectedVisitActivities.join(", ") || "Sin selección",
      programasVisita: selectedVisitPrograms.join(", ") || "Sin selección",
      categoriaMuestreo: selectedSamplingCategories.join(", ") || "Sin selección",
      objetivoMuestreo: selectedSamplingObjectives.join(", ") || "Sin selección",
      enfermedadMuestreo: selectedSamplingDiseases.join(", ") || "Sin selección",
      tipoMuestra: selectedSamplingTypes.join(", ") || "Sin selección",
      apoyoMuestreo: selectedSamplingEnvironment.join(", ") || "Sin selección",
      contextoMuestreo:
        samplingContextMode === "visita" && linkedSamplingVisit
          ? `Asociado a visita ${linkedSamplingVisit.id} · ${linkedSamplingVisit.centro} · ${linkedSamplingVisit.modulo} · ${linkedSamplingVisit.jaula}`
          : "Muestreo abierto desde menú principal",
      diagnostico: selectedDiagnosis.join(", ") || "Sin selección",
      acciones: selectedActions.join(", ") || "Sin selección",
      principalCausa: dominantCause,
      destinatario: recipient,
      necropsiaIntegrada: {
        id: selectedNecropsy.id,
        origen: selectedNecropsy.origen,
        motivo: necropsyMotive,
        seleccionados: necropsySelectedCount,
        hallazgoExterno: necropsyExternalNote,
        hallazgoInterno: necropsyInternalNote,
        diagnosticoPresuntivo: necropsyPresumptiveDx,
        clasificacionPrimaria: selectedNecropsyPrimary.join(", "),
        clasificacionSecundaria: selectedNecropsySecondary.join(", "),
      },
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
    selectedVisitTypes,
    selectedVisitObjectives,
    selectedVisitFrequencies,
    selectedVisitActivities,
    selectedVisitPrograms,
    selectedSamplingCategories,
    selectedSamplingObjectives,
    selectedSamplingDiseases,
    selectedSamplingTypes,
    selectedSamplingEnvironment,
    dominantCause,
    recipient,
    samplingContextMode,
    linkedSamplingVisit,
    selectedNecropsy,
    necropsyMotive,
    necropsySelectedCount,
    necropsyExternalNote,
    necropsyInternalNote,
    necropsyPresumptiveDx,
    selectedNecropsyPrimary,
    selectedNecropsySecondary,
  ]);

  const toggleInArray = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const toggleNecropsySecondary = (value: MortalityCause) => {
    setSelectedNecropsySecondary((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const openSamplingFromVisit = () => {
    setSamplingContextMode("visita");
    setSamplingLinkedVisitId(selectedVisit.id);
    setTab("muestreo");
    setToast(`Muestreo asociado a la visita ${selectedVisit.id}`);
  };

  const openStandaloneSampling = () => {
    setSamplingContextMode("independiente");
    setSamplingLinkedVisitId(null);
    setTab("muestreo");
    setToast("Módulo de muestreo abierto desde menú principal");
  };

  const openNecropsyFromVisit = () => {
    const linked = necropsyRecords.find(
      (item) =>
        item.centro === selectedVisit.centro && item.modulo === selectedVisit.modulo && item.jaula === selectedVisit.jaula
    );
    if (linked) {
      setSelectedNecropsyId(linked.id);
      hydrateNecropsyEditor(linked);
    }
    setTab("necropsias");
    setToast(`Necropsia abierta para ${selectedVisit.modulo} · ${selectedVisit.jaula}`);
  };

  const hydrateNecropsyEditor = (record: NecropsyRecord) => {
    setNecropsySelectedCount(String(record.seleccionado));
    setNecropsyMotive(record.motivo);
    setNecropsyExternalNote(record.hallazgoExterno);
    setNecropsyInternalNote(record.hallazgoInterno);
    setNecropsyPresumptiveDx(record.diagnosticoPresuntivo);
    setNecropsyObservations(record.observaciones);
    setSelectedNecropsyPrimary(record.clasificacionPrimaria);
    setSelectedNecropsySecondary(record.clasificacionSecundaria);
    setSelectedCentro(record.centro);
    setSelectedModulo(record.modulo);
    setSelectedJaula(record.jaula);
  };

  const linkSamplingToCurrentVisit = () => {
    setSamplingContextMode("visita");
    setSamplingLinkedVisitId(selectedVisit.id);
    setToast(`Muestreo vinculado a la visita ${selectedVisit.id}`);
  };

  const unlinkSamplingFromVisit = () => {
    setSamplingContextMode("independiente");
    setSamplingLinkedVisitId(null);
    setToast("Muestreo dejado como registro independiente");
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

  const saveNecropsyRecord = () => {
    const base = selectedNecropsy || necropsySeed[0];
    const updated: NecropsyRecord = {
      ...base,
      seleccionado: Number(necropsySelectedCount || 0),
      motivo: necropsyMotive,
      hallazgoExterno: necropsyExternalNote.trim(),
      hallazgoInterno: necropsyInternalNote.trim(),
      diagnosticoPresuntivo: necropsyPresumptiveDx.trim(),
      observaciones: necropsyObservations.trim(),
      clasificacionPrimaria: selectedNecropsyPrimary,
      clasificacionSecundaria: selectedNecropsySecondary,
      centro: selectedCentro,
      modulo: selectedModulo,
      jaula: selectedJaula,
      veterinario: selectedVisit.veterinario,
      estadoSanitario: selectedVisit.estadoSanitario,
    };
    setNecropsyRecords((prev) => prev.map((record) => (record.id === updated.id ? updated : record)));
    setNecropsyNote(
      `${updated.diagnosticoPresuntivo || "Sin diagnóstico"} · ${updated.clasificacionSecundaria.join(", ")}`
    );
    setMortalityNote(
      `Pontón de ensilaje · ${updated.jaula} · ${updated.clasificacionSecundaria.join(", ")} · ${updated.seleccionado} peces`
    );
    setToast(`Necropsia ${updated.id} actualizada`);
  };

  const resetClinicalData = () => {
    setInspectionNote("");
    setNecropsyNote("");
    setMortalityNote("");
    setTreatmentNote("");
    setSamplingNote("");
    setSelectedDiagnosis([]);
    setSelectedActions([]);
    setSelectedVisitTypes([]);
    setSelectedVisitObjectives([]);
    setSelectedVisitFrequencies([]);
    setSelectedVisitActivities([]);
    setSelectedVisitPrograms([]);
    setSelectedSamplingCategories([]);
    setSelectedSamplingObjectives([]);
    setSelectedSamplingDiseases([]);
    setSelectedSamplingTypes([]);
    setSelectedSamplingEnvironment([]);
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
      necropsias: necropsyRecords,
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

  const exportNecropsySheet = () => {
    const record = selectedNecropsy;
    const payload = {
      necropsia: record,
      clasificacionPrimaria: selectedNecropsyPrimary,
      clasificacionSecundaria: selectedNecropsySecondary,
      fechaExportacion: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.id}-tabilla-necropsia.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Tabilla de necropsia exportada");
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
                Centro → módulo → jaula → historial → registro → pontón de ensilaje → mortalidades → necropsias → reporte
              </h2>

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

            <section className="grid grid-cols-2 gap-3">
              <MetricCard label="Completadas" value={stats.completadas} icon={CheckCircle2} tone="emerald" />
              <MetricCard label="Sin señal" value={offline ? "Activo" : "No"} icon={WifiOff} tone="slate" />
            </section>

            <AccordionSection
              title="Módulos del sistema"
              subtitle="Los módulos se abren desde inicio. Muestreo y necropsias también pueden abrirse desde una visita activa."
              defaultOpen
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTab("registro")}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[#0F6CBD] hover:bg-[#E8F3FC]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3FC] text-[#0F6CBD]">
                    <ClipboardPenLine className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Módulo visita</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Registro clínico y sanitario de la visita activa.
                  </p>
                </button>

                <button
                  onClick={openStandaloneSampling}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-600 hover:bg-emerald-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Módulo muestreo</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Toma de muestras independiente o vinculada a visita.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setTab("necropsias");
                    hydrateNecropsyEditor(selectedNecropsy);
                  }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-rose-600 hover:bg-rose-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                    <Skull className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Módulo necropsias</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pontón de ensilaje → mortalidades → clasificación → impresión.
                  </p>
                </button>

                {/* <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <PackageOpen className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Bitácora pontón</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Respaldo documental conectado al módulo de necropsias.
                  </p>
                </div> */}
              </div>

              <div className="mt-3 space-y-3">
                {placeholderModules.map((module) => (
                  <div key={module.title} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{module.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p>
                      </div>
                      <p className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
                        Próximamente
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSection>

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

            <AccordionSection
              title="Antecedentes productivos"
              subtitle="N° peces, peso promedio, biomasa y mortalidad"
              defaultOpen
            >
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="N° peces"
                  value={(selectedVisit?.numeroPeces ?? 0).toLocaleString("es-CL")}
                  icon={Layers3}
                  tone="blue"
                />
                <MetricCard
                  label="Peso promedio"
                  value={`${selectedVisit?.pesoPromedio ?? 0} kg`}
                  icon={Grid3X3}
                  tone="blue"
                />
                <MetricCard
                  label="Biomasa"
                  value={(selectedVisit?.biomasa ?? 0).toLocaleString("es-CL")}
                  icon={Activity}
                  tone="emerald"
                />
                <MetricCard
                  label="Mortalidad"
                  value={`${selectedVisit?.mortalidad ?? 0}%`}
                  icon={AlertTriangle}
                  tone="amber"
                />
              </div>
            </AccordionSection>

            <AccordionSection title="Antecedentes ambientales" subtitle="Temperatura y oxígeno del entorno" defaultOpen>
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="Temperatura"
                  value={`${selectedVisit?.temperatura ?? 0} °C`}
                  icon={Thermometer}
                  tone="blue"
                />
                <MetricCard
                  label="Oxígeno"
                  value={`${selectedVisit?.oxigeno ?? 0} mg/L`}
                  icon={Atom}
                  tone="emerald"
                />
              </div>
            </AccordionSection>
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
              <div className="space-y-3 rounded-2xl bg-[#E8F3FC] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Flujos asociados a esta visita</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Muestreo y necropsias pueden abrirse y quedar alineados con centro, módulo y jaula.
                    </p>
                  </div>
                  <ClipboardList className="mt-1 h-5 w-5 text-[#0F6CBD]" />
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    onClick={openSamplingFromVisit}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-semibold text-white"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Ir a muestreo asociado
                  </button>
                  <button
                    onClick={openNecropsyFromVisit}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#0F6CBD] bg-white text-sm font-semibold text-[#0F6CBD]"
                  >
                    <Skull className="h-4 w-4" />
                    Ir a necropsias asociadas
                  </button>
                </div>
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

              <div className="mt-3 grid grid-cols-2 gap-3">
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
                    {Array.from(new Set(visits.filter((v) => v.modulo === selectedModulo).map((v) => v.jaula))).map(
                      (item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {lastMedicalEvents.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.tipo}</p>
                      <StatusBadge value={item.nivel} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{item.detalle}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {item.fecha} · {item.responsable}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <AccordionSection title="Inspección visual" subtitle="Hallazgos de jaula" defaultOpen>
              <textarea
                value={inspectionNote}
                onChange={(e) => setInspectionNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Registra signos clínicos, nado, alimentación, boqueo u observaciones"
              />
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  onClick={() => act("Dictado simulado")}
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
            </AccordionSection>

            <AccordionSection title="Necropsia" subtitle="Hallazgo resumido">
              <textarea
                value={necropsyNote}
                onChange={(e) => setNecropsyNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Complemento opcional del módulo visita"
              />
            </AccordionSection>

            <AccordionSection title="Mortalidad" subtitle="Clasificación y observación">
              <textarea
                value={mortalityNote}
                onChange={(e) => setMortalityNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Complemento opcional del módulo visita"
              />
              <div className="mt-4 space-y-2">
                {aggregatedByCause.slice(0, 5).map((item) => (
                  <div key={item.causa} className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{item.causa}</p>
                      <p className="text-sm font-semibold text-slate-900">{item.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Diagnóstico" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {diagnosisOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedDiagnosis.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedDiagnosis)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Acciones sugeridas" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {actionOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedActions.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedActions)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Tipo de visita" subtitle="Clasificación operativa">
              <div className="grid grid-cols-1 gap-2">
                {visitTypeOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedVisitTypes.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedVisitTypes)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Objetivos de visita" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {visitObjectiveOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedVisitObjectives.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedVisitObjectives)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Frecuencia de visita" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {visitFrequencyOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedVisitFrequencies.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedVisitFrequencies)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Actividades de visita" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {visitActivityOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedVisitActivities.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedVisitActivities)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Programa específico" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {visitSpecificProgramOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedVisitPrograms.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedVisitPrograms)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Tratamiento / receta" subtitle="Observaciones">
              <textarea
                value={treatmentNote}
                onChange={(e) => setTreatmentNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Tratamiento, receta, medidas de contención o seguimiento"
              />
            </AccordionSection>

            <section className="grid grid-cols-2 gap-3">
              <button
                onClick={resetClinicalData}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar
              </button>
              <button
                onClick={finishVisit}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-semibold text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                Finalizar visita
              </button>
            </section>
          </div>
        )}

        {tab === "muestreo" && (
          <div className="space-y-4">
            <section className="rounded-[28px] bg-gradient-to-br from-emerald-600 to-emerald-700 p-5 text-white shadow-xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Muestreo</p>
              <h2 className="mt-2 text-xl font-semibold">
                {samplingContextMode === "visita" && linkedSamplingVisit
                  ? `Asociado a ${linkedSamplingVisit.id}`
                  : "Registro independiente"}
              </h2>
              <p className="mt-2 text-sm text-white/80">
                {samplingContextMode === "visita" && linkedSamplingVisit
                  ? `${linkedSamplingVisit.centro} · ${linkedSamplingVisit.modulo} · ${linkedSamplingVisit.jaula}`
                  : "Abierto desde menú principal"}
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Contexto del muestreo" />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={linkSamplingToCurrentVisit}
                  className="h-11 rounded-2xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700"
                >
                  Vincular a visita
                </button>
                <button
                  onClick={unlinkSamplingFromVisit}
                  className="h-11 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
                >
                  Dejar independiente
                </button>
              </div>
            </section>

            <AccordionSection title="Categoría de muestreo" subtitle="Selección múltiple" defaultOpen>
              <div className="grid grid-cols-1 gap-2">
                {samplingCategoryOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedSamplingCategories.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedSamplingCategories)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Objetivos de muestreo" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {samplingObjectiveOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedSamplingObjectives.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedSamplingObjectives)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Enfermedades / agentes" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {samplingDiseaseOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedSamplingDiseases.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedSamplingDiseases)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Tipo de muestra" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {samplingTypeOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedSamplingTypes.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedSamplingTypes)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Apoyo ambiental / logístico" subtitle="Selección múltiple">
              <div className="grid grid-cols-2 gap-2">
                {samplingEnvironmentOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedSamplingEnvironment.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedSamplingEnvironment)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Nota de muestreo" subtitle="Observaciones">
              <textarea
                value={samplingNote}
                onChange={(e) => setSamplingNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:bg-white"
                placeholder="Detalle del muestreo, laboratorio, envío y observaciones"
              />
            </AccordionSection>
          </div>
        )}

        {tab === "necropsias" && (
          <div className="space-y-4">
            <section className="rounded-[28px] bg-gradient-to-br from-rose-600 to-rose-700 p-5 text-white shadow-xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Pontón de ensilaje</p>
              <h2 className="mt-2 text-xl font-semibold">Mortalidades → Módulo necropsias</h2>
              <p className="mt-2 text-sm text-white/80">
                Selección de peces, clasificación, hallazgos y salida documental imprimible.
              </p>
            </section>

            <SearchBox
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Buscar necropsia, centro, módulo o jaula"
            />

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Bandeja de mortalidades / necropsias" subtitle="Registros del pontón" />
              <div className="space-y-3">
                {necropsyForContext.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => {
                      setSelectedNecropsyId(record.id);
                      hydrateNecropsyEditor(record);
                    }}
                    className={cn(
                      "block w-full rounded-2xl border p-4 text-left",
                      selectedNecropsyId === record.id
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200 bg-slate-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{record.id}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {record.centro} · {record.modulo} · {record.jaula}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          Mortalidad día: {record.mortalidadDia} · Tratamientos: {record.nroTratamientos} · Baños:{" "}
                          {record.nroBanos}
                        </p>
                      </div>
                      <StatusBadge value={record.estadoSanitario} />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <MetricCard label="Mortalidad día" value={selectedNecropsy.mortalidadDia} icon={AlertTriangle} tone="amber" />
              <MetricCard
                label="Mortalidad mes"
                value={`${selectedNecropsy.mortalidadMesPct}%`}
                icon={Activity}
                tone="blue"
              />
              <MetricCard
                label="Mortalidad acc."
                value={`${selectedNecropsy.mortalidadAcumuladaPct}%`}
                icon={ClipboardList}
                tone="amber"
              />
              <MetricCard label="N° tratamientos" value={selectedNecropsy.nroTratamientos} icon={Pill} tone="emerald" />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Contexto del pontón" subtitle="Centro, módulo, jaula y estatus" />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Centro</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selectedCentro}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Módulo / Jaula</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {selectedModulo} · {selectedJaula}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Veterinario</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{selectedVisit.veterinario}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Estado sanitario</p>
                  <div className="mt-1">
                    <StatusBadge value={selectedVisit.estadoSanitario} />
                  </div>
                </div>
              </div>
            </section>

            <AccordionSection title="Selección para necropsia" subtitle="Peces a revisar" defaultOpen>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">N° seleccionados</label>
                  <input
                    value={necropsySelectedCount}
                    onChange={(e) => setNecropsySelectedCount(e.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-rose-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Motivo</label>
                  <select
                    value={necropsyMotive}
                    onChange={(e) => setNecropsyMotive(e.target.value as NecropsyRecord["motivo"])}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-rose-600 focus:bg-white"
                  >
                    {necropsyMotiveOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                <p className="text-sm text-slate-700">
                  Origen: <span className="font-semibold">{selectedNecropsy.origen}</span>
                </p>
              </div>
            </AccordionSection>

            <AccordionSection title="Hallazgos macroscópicos" subtitle="Externo e interno">
              <div className="space-y-3">
                <textarea
                  value={necropsyExternalNote}
                  onChange={(e) => setNecropsyExternalNote(e.target.value)}
                  className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-600 focus:bg-white"
                  placeholder="Hallazgos externos"
                />
                <textarea
                  value={necropsyInternalNote}
                  onChange={(e) => setNecropsyInternalNote(e.target.value)}
                  className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-600 focus:bg-white"
                  placeholder="Hallazgos internos / órganos / hemorragias / necrosis"
                />
              </div>
            </AccordionSection>

            <AccordionSection title="Diagnóstico presuntivo" subtitle="Resumen clínico">
              <input
                value={necropsyPresumptiveDx}
                onChange={(e) => setNecropsyPresumptiveDx(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-rose-600 focus:bg-white"
                placeholder="SRS, PGD, HSMI u otro"
              />
            </AccordionSection>

            <AccordionSection title="Clasificación primaria" subtitle="Tabilla R-Sal-11">
              <div className="grid grid-cols-2 gap-2">
                {mortalityPrimaryOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedNecropsyPrimary.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedNecropsyPrimary)}
                  />
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Clasificación secundaria" subtitle="Causas sanitarias">
              <div className="grid grid-cols-2 gap-2">
                {(["PGD", "HSMI", "SRS", "TENA", "Rezago", "ONI", "Deforme", "Daño físico", "BKD", "Otras"] as MortalityCause[]).map(
                  (item) => (
                    <ActionChip
                      key={item}
                      label={item}
                      active={selectedNecropsySecondary.includes(item)}
                      onClick={() => toggleNecropsySecondary(item)}
                    />
                  )
                )}
              </div>
            </AccordionSection>

            <AccordionSection title="Observaciones y salida documental" subtitle="Bitácora / impresión">
              <textarea
                value={necropsyObservations}
                onChange={(e) => setNecropsyObservations(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-600 focus:bg-white"
                placeholder="Notas para bitácora del pontón, impresión y firma"
              />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={saveNecropsyRecord}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 text-sm font-semibold text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Guardar necropsia
                </button>
                <button
                  onClick={exportNecropsySheet}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
                >
                  <Printer className="h-4 w-4" />
                  Exportar tabilla
                </button>
              </div>
            </AccordionSection>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Resumen rápido del registro" subtitle="Lo que quedará integrado al mockup" />
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">ID:</span> {selectedNecropsy.id}
                </p>
                <p>
                  <span className="font-semibold">Pontón:</span> {selectedNecropsy.origen}
                </p>
                <p>
                  <span className="font-semibold">Mortalidades:</span> {selectedNecropsy.mortalidadDia} día /{" "}
                  {selectedNecropsy.mortalidadMesPct}% mes / {selectedNecropsy.mortalidadAcumuladaPct}% acc.
                </p>
                <p>
                  <span className="font-semibold">Clasificación secundaria:</span>{" "}
                  {selectedNecropsySecondary.join(", ") || "Sin selección"}
                </p>
              </div>
            </section>
          </div>
        )}

        {tab === "resumen" && (
          <div className="space-y-4">
            <section className="rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Resumen integrado</p>
              <h2 className="mt-2 text-xl font-semibold">{selectedVisit.id}</h2>
              <p className="mt-2 text-sm text-white/80">
                {selectedVisit.centro} · {selectedModulo} · {selectedJaula}
              </p>
            </section>

            <AccordionSection title="Ficha sanitaria" subtitle="Visita + muestreo + necropsia" defaultOpen>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">Visita</p>
                  <p className="mt-1">{generatedReport.tipoVisita}</p>
                  <p className="mt-1">{generatedReport.objetivoVisita}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">Muestreo</p>
                  <p className="mt-1">{generatedReport.categoriaMuestreo}</p>
                  <p className="mt-1">{generatedReport.tipoMuestra}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-900">Necropsia</p>
                  <p className="mt-1">{generatedReport.necropsiaIntegrada.diagnosticoPresuntivo}</p>
                  <p className="mt-1">
                    {generatedReport.necropsiaIntegrada.clasificacionPrimaria} /{" "}
                    {generatedReport.necropsiaIntegrada.clasificacionSecundaria}
                  </p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Mortalidad y causas" subtitle="Distribución del contexto">
              <div className="space-y-2">
                {aggregatedByCause.map((item) => (
                  <div key={item.causa} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-800">{item.causa}</p>
                    <p className="text-sm font-semibold text-slate-900">{item.total}</p>
                  </div>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Destino del reporte" subtitle="Impresión / envío">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">Destinatario:</span> {recipient.nombre}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold">Cargo:</span> {recipient.cargo}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold">Canal:</span> {recipient.canal}
                </p>
              </div>
            </AccordionSection>

            <section className="grid grid-cols-2 gap-3">
              <button
                onClick={exportSummary}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
              >
                <Download className="h-4 w-4" />
                Exportar
              </button>
              <button
                onClick={sendToTeams}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-semibold text-white"
              >
                <Send className="h-4 w-4" />
                Marcar envío
              </button>
            </section>
          </div>
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
      <Toast message={toast} onClose={() => setToast("")} />

      <ModalShell open={showNotifications} title="Notificaciones" onClose={() => setShowNotifications(false)}>
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
      </ModalShell>

      <ModalShell
        open={showCreateModal}
        title={editingVisitId ? "Editar visita" : "Nueva visita"}
        onClose={() => setShowCreateModal(false)}
      >
        <div className="space-y-3">
          {(
            [
              ["Centro", "centro"],
              ["Empresa", "empresa"],
              ["Fecha", "fecha"],
              ["Hora", "hora"],
              ["Veterinario", "veterinario"],
              ["Región", "region"],
              ["Módulo", "modulo"],
              ["Jaula", "jaula"],
              ["N° peces", "numeroPeces"],
              ["Peso promedio", "pesoPromedio"],
              ["Biomasa", "biomasa"],
              ["Mortalidad", "mortalidad"],
              ["Temperatura", "temperatura"],
              ["Oxígeno", "oxigeno"],
            ] as Array<[string, keyof VisitForm]>
          ).map(([label, key]) => (
            <div key={key}>
              <label className="text-sm font-medium text-slate-700">{label}</label>
              <input
                type={key === "fecha" ? "date" : key === "hora" ? "time" : "text"}
                value={visitForm[key]}
                onChange={(e) => setVisitForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-medium text-slate-700">Prioridad</label>
            <select
              value={visitForm.prioridad}
              onChange={(e) => setVisitForm((prev) => ({ ...prev, prioridad: e.target.value as Priority }))}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
            >
              {(["Alta", "Media", "Baja"] as Priority[]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Estado sanitario</label>
            <select
              value={visitForm.estadoSanitario}
              onChange={(e) =>
                setVisitForm((prev) => ({ ...prev, estadoSanitario: e.target.value as SanitaryStatus }))
              }
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
            >
              {(["En tratamiento", "En carencia", "Sin tratamiento"] as SanitaryStatus[]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Hallazgo</label>
            <textarea
              value={visitForm.hallazgo}
              onChange={(e) => setVisitForm((prev) => ({ ...prev, hallazgo: e.target.value }))}
              className="mt-2 min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
            />
          </div>

          <button
            onClick={saveVisit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-semibold text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            Guardar visita
          </button>
        </div>
      </ModalShell>
    </div>
  );
}
