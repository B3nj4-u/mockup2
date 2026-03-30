import React from "react";
import { CheckCircle2, ClipboardCheck, ClipboardPenLine, FlaskConical, Stethoscope, WifiOff } from "lucide-react";
import type { NecropsyRecord, TabKey, Visit } from "../../lib/types";

type InicioModuleProps = {
  stats: { pendientes: number; enCurso: number; completadas: number };
  openVisit: (visit: Visit) => void;
  visits: Visit[];
  SearchBox: React.ComponentType<{ value: string; onChange: (value: string) => void; onClear: () => void }>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  MetricCard: React.ComponentType<{
    label: string;
    value: string | number;
    icon: React.ElementType;
    tone?: "blue" | "emerald" | "amber" | "slate";
  }>;
  offline: boolean;
  AccordionSection: React.ComponentType<{
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }>;
  setTab: (tab: TabKey) => void;
  openStandaloneSampling: () => void;
  hydrateNecropsyEditor: (record: NecropsyRecord) => void;
  selectedNecropsy: NecropsyRecord;
  placeholderModules: Array<{ title: string; description: string }>;
  alertsSeed: ReadonlyArray<{ titulo: string; descripcion: string; severidad: string }>;
  act: (message: string) => void;
  StatusBadge: React.ComponentType<{ value: string }>;
};

export default function InicioModule(props: InicioModuleProps) {
  const {
    stats,
    openVisit,
    visits,
    SearchBox,
    search,
    setSearch,
    MetricCard,
    offline,
    AccordionSection,
    setTab,
    openStandaloneSampling,
    hydrateNecropsyEditor,
    selectedNecropsy,
    placeholderModules,
    alertsSeed,
    act,
    StatusBadge,
  } = props;

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0F6CBD] to-[#115EA3] p-5 text-white shadow-xl">
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
          Iniciar diagnóstico de siguiente visita
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
            <p className="mt-1 text-xs leading-5 text-slate-500">Registro clínico y sanitario de la visita activa.</p>
          </button>

          <button
            onClick={openStandaloneSampling}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-600 hover:bg-emerald-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <FlaskConical className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">Módulo muestreo</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Toma de muestras independiente o vinculada a visita.</p>
          </button>

          <button
            onClick={() => {
              setTab("necropsias");
              hydrateNecropsyEditor(selectedNecropsy);
            }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-rose-600 hover:bg-rose-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
              <Stethoscope className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">Módulo necropsias</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Pontón de ensilaje → mortalidades → clasificación → impresión.</p>
          </button>
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
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">Alertas de hoy</h2>
          <p className="mt-1 text-sm text-slate-500">Prioridad clínica</p>
        </div>
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
  );
}
