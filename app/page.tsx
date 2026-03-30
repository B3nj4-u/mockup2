
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
  ChartNoAxesCombined,
  ClipboardCheck,
  X,
  Trash2,
  Pencil,
  RotateCcw,
  Eye,
  Printer,
  Fish,
  XLineTop,
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
  PackageOpen,
  ClipboardList,
} from "lucide-react";
import DiagnosisModule from "./components/DiagnosisModule";
import InicioModule from "./components/modules/InicioModule";
import ResumenModule from "./components/modules/ResumenModule";
import VisitasModule from "./components/modules/VisitasModule";

import {
  actionOptions,
  alertsSeed,
  defaultForm,
  diagnosisOptions,
  medicalHistorySeed,
  mortalityDistributionSeed,
  mortalityPrimaryOptions,
  necropsyMotiveOptions,
  necropsySeed,
  placeholderModules,
  recipientsSeed,
  samplingCategoryOptions,
  samplingDiseaseOptions,
  samplingEnvironmentOptions,
  samplingObjectiveOptions,
  samplingTypeOptions,
  STORAGE_KEYS,
  visitChartNoAxesCombinedOptions,
  visitFrequencyOptions,
  visitObjectiveOptions,
  visitSpecificProgramOptions,
  visitsSeed,
  visitTypeOptions,
} from "./lib/constants";
import {
  createVisitFromForm,
  matchesVisit,
  normalizeVisit,
  restoreChecklist,
  toForm,
} from "./lib/visit-utils";
import type {
  ChecklistItem,
  FilterKey,
  HistoryLevel,
  MortalityCause,
  NecropsyRecord,
  Priority,
  SanitaryStatus,
  TabKey,
  Visit,
  VisitForm,
  VisitStatus,
} from "./lib/types";

const defaultChecklist: ChecklistItem[] = [
  { label: "Inspección visual", done: true, icon: Eye },
  { label: "Necropsia", done: false, icon: Stethoscope },
  { label: "Mortalidad", done: false, icon: ChartNoAxesCombined },
  { label: "Muestreo", done: false, icon: FlaskConical },
  { label: "Tratamiento / receta", done: false, icon: Pill },
];

const checklistIconMap: Record<string, React.ElementType> = Object.fromEntries(
  defaultChecklist.map((item) => [item.label, item.icon])
);

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
    { key: "registro", label: "Diagnóstico", icon: ClipboardPenLine },
    { key: "muestreo", label: "Muestreos", icon: FlaskConical },
    { key: "necropsias", label: "Necropsias", icon: Stethoscope },
    { key: "resumen", label: "Resumen", icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-6 px-2 py-2">
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
      const savedDiagnosisModuleState = localStorage.getItem(STORAGE_KEYS.diagnosisModuleState);

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
        setChecklist(restoreChecklist(parsed.checklist, defaultChecklist, checklistIconMap, Eye));
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

      if (savedDiagnosisModuleState) {
        const parsed = JSON.parse(savedDiagnosisModuleState);
        setSelectedDiagnosis(parsed.selectedDiagnosis ?? ["PGD"]);
        setSelectedActions(parsed.selectedActions ?? ["Tomar muestras"]);
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
      STORAGE_KEYS.diagnosisModuleState,
      JSON.stringify({
        selectedDiagnosis,
        selectedActions,
      })
    );
  }, [selectedDiagnosis, selectedActions, ready]);

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
      diagnosticoModulo: "Módulo de diagnóstico",
      diagnosticoEstado:
        selectedActions.includes("Despachar a laboratorio") || selectedActions.includes("Tomar muestras")
          ? "Pendiente laboratorio"
          : selectedActions.includes("Aplicar tratamiento")
          ? "Presuntivo"
          : selectedDiagnosis.length > 0
          ? "En evaluación"
          : "Sin definir",
      diagnosticoFuente: necropsyNote ? "Clínico + macroscópico" : inspectionNote ? "Clínico" : "Sin evidencia",
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
          <InicioModule
            stats={stats}
            openVisit={openVisit}
            visits={visits}
            SearchBox={SearchBox}
            search={search}
            setSearch={setSearch}
            MetricCard={MetricCard}
            offline={offline}
            AccordionSection={AccordionSection}
            setTab={setTab}
            openStandaloneSampling={openStandaloneSampling}
            hydrateNecropsyEditor={hydrateNecropsyEditor}
            selectedNecropsy={selectedNecropsy}
            placeholderModules={placeholderModules}
            alertsSeed={alertsSeed}
            act={act}
            StatusBadge={StatusBadge}
          />
        )}

        {tab === "visitas" && (
          <VisitasModule
            openCreateModal={openCreateModal}
            filter={filter}
            setFilter={setFilter}
            cn={cn}
            SearchBox={SearchBox}
            search={search}
            setSearch={setSearch}
            filteredVisits={filteredVisits}
            VisitCard={VisitCard}
            openVisit={openVisit}
            openEditModal={openEditModal}
            deleteVisit={deleteVisit}
          />
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
                    <Stethoscope className="h-4 w-4" />
                    Ir a necropsias asociadas
                  </button>
                </div>
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
                  icon={Fish}
                  tone="blue"
                />
                <MetricCard
                  label="Peso promedio"
                  value={`${selectedVisit?.pesoPromedio ?? 0} kg`}
                  icon={XLineTop}
                  tone="blue"
                />
                <MetricCard
                  label="Biomasa"
                  value={(selectedVisit?.biomasa ?? 0).toLocaleString("es-CL")}
                  icon={ChartNoAxesCombined}
                  tone="emerald"
                />
                <MetricCard
                  label="Mortalidad"
                  value={`${selectedVisit?.mortalidad ?? 0}%`}
                  icon={Stethoscope}
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

            <DiagnosisModule
              selectedVisit={selectedVisit}
              selectedModulo={selectedModulo}
              selectedJaula={selectedJaula}
              inspectionNote={inspectionNote}
              necropsyNote={necropsyNote}
              mortalityNote={mortalityNote}
              treatmentNote={treatmentNote}
              samplingNote={samplingNote}
              selectedDiagnosis={selectedDiagnosis}
              selectedActions={selectedActions}
              setSelectedDiagnosis={setSelectedDiagnosis}
              setSelectedActions={setSelectedActions}
              diagnosisOptions={diagnosisOptions}
              actionOptions={actionOptions}
              toggleInArray={toggleInArray}
              act={act}
              AccordionSection={AccordionSection}
              ActionChip={ActionChip}
            />

           

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

            {/* <AccordionSection title="Necropsia" subtitle="Hallazgo resumido">
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
            </AccordionSection> */}

            {/* <AccordionSection title="Diagnóstico" subtitle="Selección múltiple">
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
            </AccordionSection> */}

            {/* <AccordionSection title="Acciones sugeridas" subtitle="Selección múltiple">
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
            </AccordionSection> */}

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
                {visitChartNoAxesCombinedOptions.map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedVisitActivities.includes(item)}
                    onClick={() => toggleInArray(item, setSelectedVisitActivities)}
                  />
                ))}
              </div>
            </AccordionSection>

            {/* <AccordionSection title="Programa específico" subtitle="Selección múltiple">
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
            </AccordionSection> */}

            {/* <AccordionSection title="Tratamiento / receta" subtitle="Observaciones">
              <textarea
                value={treatmentNote}
                onChange={(e) => setTreatmentNote(e.target.value)}
                className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Tratamiento, receta, medidas de contención o seguimiento"
              />
            </AccordionSection> */}

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
            <section className="rounded-[28px] bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/70"></p>
                  <h2 className="mt-2 text-xl font-semibold">Módulo muestreo</h2>
                  <p className="mt-2 text-sm text-white/80">
                    Descripción: En la acuicultura, cuando un médico veterinario realiza una salida a terreno para la toma de muestras, estas pueden clasificarse según su objetivo y el contexto operativo.
                  </p>
                </div>
                <FlaskConical className="h-8 w-8 text-white" />
              </div>

              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">
                <p className="font-semibold text-white">Contexto del muestreo</p>
                {samplingContextMode === "visita" && linkedSamplingVisit ? (
                  <div className="mt-2 space-y-1 text-white/85">
                    <p>Asociado a visita {linkedSamplingVisit.id}</p>
                    <p>{linkedSamplingVisit.centro} · {linkedSamplingVisit.modulo} · {linkedSamplingVisit.jaula}</p>
                    <p>Veterinario responsable: {linkedSamplingVisit.veterinario}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-white/85">
                    Registro abierto desde inicio como muestreo independiente. Puede vincularse luego a la visita activa.
                  </p>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={linkSamplingToCurrentVisit}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white font-semibold text-emerald-700"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Asociar a visita activa
                </button>
                <button
                  onClick={unlinkSamplingFromVisit}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 font-semibold text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  Dejar independiente
                </button>
              </div>
            </section>

            <AccordionSection
              title="Módulo muestreo"
              subtitle="Descripción: En la acuicultura, cuando un médico veterinario realiza una salida a terreno para la toma de muestras, estas pueden clasificarse según su objetivo y el contexto operativo."
              defaultOpen
            >
              {/* <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Configuración rápida de muestreo</p>
                <p className="mt-1">
                  Se incorporan categorías y tipos de muestra del documento para que el veterinario seleccione sin escribir en terreno.
                </p>
              </div> */}

              <div className="mt-4 space-y-3">
                <AccordionSection title="Categoría de muestreo" defaultOpen>
                  <div className="grid grid-cols-2 gap-3">
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

                <AccordionSection title="Objetivo del muestreo" >
                  <div className="grid grid-cols-2 gap-3">
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

                <AccordionSection title="Enfermedad / agente / foco" >
                  <div className="grid grid-cols-2 gap-3">
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

                <AccordionSection title="Tipo de muestra" >
                  <div className="grid grid-cols-2 gap-3">
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

                <AccordionSection title="Apoyo ambiental / envío / certificación" >
                  <div className="grid grid-cols-2 gap-3">
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
              </div>

              <textarea
                value={samplingNote}
                onChange={(e) => setSamplingNote(e.target.value)}
                className="mt-4 min-h-[96px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                placeholder="Complemento opcional del módulo muestreo"
              />
            </AccordionSection>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTab("inicio")}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm"
              >
                <Home className="h-4 w-4" />
                Volver a inicio
              </button>
              <button
                onClick={() => setTab("resumen")}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-semibold text-white shadow-lg"
              >
                <FileText className="h-4 w-4" />
                Ir a resumen
              </button>
            </div>
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
              <MetricCard label="Mortalidad día" value={selectedNecropsy.mortalidadDia} icon={Stethoscope} tone="amber" />
              <MetricCard
                label="Mortalidad mes"
                value={`${selectedNecropsy.mortalidadMesPct}%`}
                icon={ChartNoAxesCombined}
                tone="blue"
              />
              <MetricCard
                label="Mortalidad acumulada"
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
          <ResumenModule
            selectedVisit={selectedVisit}
            selectedModulo={selectedModulo}
            selectedJaula={selectedJaula}
            AccordionSection={AccordionSection}
            generatedReport={generatedReport}
            aggregatedByCause={aggregatedByCause}
            recipient={recipient}
            exportSummary={exportSummary}
            sendToTeams={sendToTeams}
          />
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
