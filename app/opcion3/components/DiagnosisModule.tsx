"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Microscope,
  ShieldCheck,
  Stethoscope,
  TestTubeDiagonal,
  Waves,
} from "lucide-react";

type Visit = {
  id: string;
  centro: string;
  empresa: string;
  fecha: string;
  hora: string;
  veterinario: string;
  region: string;
  estado: "Pendiente" | "En progreso" | "Completada";
  prioridad: "Alta" | "Media" | "Baja";
  modulo: string;
  jaula: string;
  numeroPeces: number;
  pesoPromedio: number;
  biomasa: number;
  mortalidad: number;
  temperatura: number;
  oxigeno: number;
  hallazgo: string;
  estadoSanitario: "En tratamiento" | "En carencia" | "Sin tratamiento";
};

type AccordionSectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

type ActionChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

type DiagnosisModuleProps = {
  selectedVisit: Visit;
  selectedModulo: string;
  selectedJaula: string;
  inspectionNote: string;
  necropsyNote: string;
  mortalityNote: string;
  treatmentNote: string;
  samplingNote: string;
  selectedDiagnosis: string[];
  selectedActions: string[];
  setSelectedDiagnosis: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedActions: React.Dispatch<React.SetStateAction<string[]>>;
  diagnosisOptions: string[];
  actionOptions: string[];
  toggleInArray: (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => void;
  act: (message: string) => void;
  AccordionSection: React.ComponentType<AccordionSectionProps>;
  ActionChip: React.ComponentType<ActionChipProps>;
};

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ToneCard({
  title,
  subtitle,
  icon: Icon,
  tone = "blue",
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  tone?: "blue" | "emerald" | "amber" | "violet" | "rose";
  children: React.ReactNode;
}) {
  const toneMap = {
    blue: "border-sky-200 bg-sky-50",
    emerald: "border-emerald-200 bg-emerald-50",
    amber: "border-amber-200 bg-amber-50",
    violet: "border-violet-200 bg-violet-50",
    rose: "border-rose-200 bg-rose-50",
  } as const;

  return (
    <section className={cn("rounded-3xl border p-4 shadow-sm", toneMap[tone])}>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function MiniKpi({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function DiagnosisModule({
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
  setSelectedDiagnosis,
  setSelectedActions,
  diagnosisOptions,
  actionOptions,
  toggleInArray,
  act,
  AccordionSection,
  ActionChip,
}: DiagnosisModuleProps) {
  const suggestedStatus =
    selectedActions.includes("Despachar a laboratorio") || selectedActions.includes("Tomar muestras")
      ? "Pendiente laboratorio"
      : selectedActions.includes("Aplicar tratamiento")
      ? "Presuntivo"
      : selectedDiagnosis.length > 0
      ? "En evaluación"
      : "Sin definir";

  const likelySource = necropsyNote.trim()
    ? "Clínico + macroscópico"
    : inspectionNote.trim()
    ? "Clínico"
    : "Sin evidencia cargada";

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] bg-gradient-to-br from-violet-700 to-indigo-800 p-5 text-white shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Diagnóstico de la Visita</p>
            <h2 className="mt-2 text-xl font-semibold">Diagnóstico sanitario</h2>
            <p className="mt-2 text-sm text-white/80">
              Consolida evidencia clínica, necropsia, mortalidad, muestreo y plan de acción.
            </p>
          </div>
          <Microscope className="mt-1 h-8 w-8 text-white" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <MiniKpi label="Centro" value={selectedVisit.centro} />
          <MiniKpi label="Ubicación" value={`${selectedModulo} · ${selectedJaula}`} />
          <MiniKpi label="Estado" value={suggestedStatus} />
          <MiniKpi label="Fuente" value={likelySource} />
        </div>
      </section>

      {/* <ToneCard
        title="Resumen diagnóstico"
        subtitle="Panel rápido para orientar la toma de decisiones dentro de la visita"
        icon={ClipboardList}
        tone="violet"
      >
        <div className="grid grid-cols-2 gap-3">
          <MiniKpi label="Mortalidad" value={`${selectedVisit.mortalidad}%`} />
          <MiniKpi label="Temperatura" value={`${selectedVisit.temperatura} °C`} />
          <MiniKpi label="Oxígeno" value={`${selectedVisit.oxigeno} mg/L`} />
          <MiniKpi label="Diagnósticos" value={selectedDiagnosis.join(", ") || "Sin selección"} />
        </div>
      </ToneCard> */}

      <AccordionSection
        title="Diagnóstico clínico"
        subtitle="Observación de signos, comportamiento, parámetros ambientales y mortalidad"
        defaultOpen
      >
        <div className="grid grid-cols-1 gap-3">
          <ToneCard
            title="Evidencia clínica cargada"
            subtitle="Se alimenta desde inspección visual, mortalidad y variables ambientales"
            icon={Stethoscope}
            tone="blue"
          >
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-white p-3">
                <p className="font-semibold text-slate-900">Inspección visual</p>
                <p className="mt-1">{inspectionNote || "Sin registro"}</p>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="font-semibold text-slate-900">Mortalidad / tendencias</p>
                <p className="mt-1">{mortalityNote || "Sin registro"}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MiniKpi label="Nado / conducta" value={inspectionNote ? "Registrado" : "Pendiente"} />
                <MiniKpi label="Temperatura" value={`${selectedVisit.temperatura} °C`} />
                <MiniKpi label="Oxígeno" value={`${selectedVisit.oxigeno} mg/L`} />
              </div>
            </div>
          </ToneCard>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Diagnóstico macroscópico"
        subtitle="Integra necropsia de terreno y hallazgos visibles de órganos y tejidos"
      >
        <ToneCard
          title="Hallazgo macroscópico"
          subtitle="Complementa el diagnóstico clínico previo"
          icon={TestTubeDiagonal}
          tone="amber"
        >
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white p-3">
              <p className="font-semibold text-slate-900">Necropsia</p>
              <p className="mt-1">{necropsyNote || "Sin registro"}</p>
            </div>
            <button
              onClick={() => act("Se revisó evidencia macroscópica desde módulo diagnóstico")}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Marcar revisión macroscópica
            </button>
          </div>
        </ToneCard>
      </AccordionSection>

      <AccordionSection
        title="Diagnóstico de laboratorio y muestreo"
        subtitle="Usa el contexto de muestras para sostener o confirmar la hipótesis"
      >
        <ToneCard
          title="Apoyo diagnóstico"
          subtitle="Permite orientar confirmación oficial del agente"
          icon={FlaskConical}
          tone="emerald"
        >
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white p-3">
              <p className="font-semibold text-slate-900">Muestreo asociado</p>
              <p className="mt-1">{samplingNote || "Sin muestreo descrito"}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["Microbiológico", "Parasitológico", "Virológico", "Histopatológico"].map((item) => (
                <button
                  key={item}
                  onClick={() => act(`Solicitud de análisis ${item} simulada`)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </ToneCard>
      </AccordionSection>

      <AccordionSection
        title="Diagnóstico presuntivo y confirmado"
        subtitle="Hipótesis actual, selección múltiple y estado operativo"
      >
        <div className="space-y-3">
          <ToneCard
            title="Hipótesis diagnóstica"
            subtitle="Puedes mantener selección múltiple y usarla en el reporte integrado"
            icon={Activity}
            tone="rose"
          >
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
          </ToneCard>

          <ToneCard
            title="Estado sugerido"
            subtitle="No reemplaza tus estados actuales; agrega una lectura diagnóstica separada"
            icon={ShieldCheck}
            tone="violet"
          >
            <div className="rounded-2xl bg-white p-4 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Estado:</span> {suggestedStatus}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-slate-900">Hipótesis vigente:</span>{" "}
                {selectedDiagnosis.join(", ") || "Sin selección"}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-slate-900">Tratamiento / conducta:</span>{" "}
                {treatmentNote || "Sin observaciones"}
              </p>
            </div>
          </ToneCard>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Acciones sugeridas"
        subtitle="Mantiene las mismas acciones del flujo actual, pero desde el módulo aparte"
      >
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

      <AccordionSection
        title="Bienestar animal y alertas"
        subtitle="Lectura rápida de factores no patológicos con impacto sanitario"
      >
        <ToneCard
          title="Bienestar animal"
          subtitle="Parámetros ambientales y gatillos operativos"
          icon={Waves}
          tone="blue"
        >
          <div className="grid grid-cols-2 gap-3">
            <MiniKpi label="Oxígeno" value={`${selectedVisit.oxigeno} mg/L`} />
            <MiniKpi label="Temperatura" value={`${selectedVisit.temperatura} °C`} />
            <MiniKpi label="Estado sanitario" value={selectedVisit.estadoSanitario} />
            <MiniKpi label="Prioridad" value={selectedVisit.prioridad} />
          </div>

          {(selectedVisit.oxigeno < 8 || selectedVisit.mortalidad > 2) && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Se detecta una señal que amerita seguimiento: oxígeno bajo o mortalidad elevada para el contexto de la
                  visita.
                </p>
              </div>
            </div>
          )}
        </ToneCard>
      </AccordionSection>
    </div>
  );
}
