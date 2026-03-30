"use client";

import React from "react";
import {
  Activity,
  ClipboardList,
  FlaskConical,
  Microscope,
  ShieldCheck,
  Stethoscope,
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

function SelectionGroup({
  title,
  options,
  selected,
  onToggle,
  Chip,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  Chip: React.ComponentType<ActionChipProps>;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((item) => (
          <Chip
            key={item}
            label={item}
            active={selected.includes(item)}
            onClick={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
}

export default function DiagnosisModule({
  selectedDiagnosis,
  selectedActions,
  setSelectedDiagnosis,
  setSelectedActions,
  toggleInArray,
  AccordionSection,
  ActionChip,
}: DiagnosisModuleProps) {
  const diagnosticMethodOptions = [
    "Diagnóstico clínico",
    "Diagnóstico macroscópico",
    "Diagnóstico de laboratorio",
    "Diagnóstico epidemiológico o de tendencias",
  ];

  const laboratorySubtypeOptions = [
    "Microbiológico",
    "Parasitológico",
    "Virológico",
    "Histopatológico",
    "Molecular y genético",
  ];

  const clinicalOrientationOptions = ["SRS", "IPN", "BKD", "ISA", "Otro"];
  const diagnosticStatusOptions = ["Diagnóstico presuntivo", "Diagnóstico confirmado"];

  const orderedActionOptions = [
    "Tomar muestras",
    "Despachar a laboratorio",
    "Aplicar tratamiento",
    "Emitir receta",
    "Reforzar monitoreo",
    "Revisar en 48 h",
  ];

  return (
    <div className="space-y-4">
        <AccordionSection
        title="Diagnóstico"
        subtitle="Módulo de diagnóstico de la visita"
      >
      <AccordionSection
        title="Selección diagnóstica"
        subtitle="Solo opciones de selección múltiple para exportar al informe"
        defaultOpen
      >
        <div className="space-y-3">
          <ToneCard
            title="Método diagnóstico"
            subtitle="Clasificación del diagnóstico según el enfoque utilizado"
            icon={ClipboardList}
            tone="blue"
          >
            <SelectionGroup
              title="Clasificación"
              options={diagnosticMethodOptions}
              selected={selectedDiagnosis}
              onToggle={(value) => toggleInArray(value, setSelectedDiagnosis)}
              Chip={ActionChip}
            />
          </ToneCard>

          <ToneCard
            title="Diagnóstico clínico y macroscópico"
            subtitle="Selección de sospechas o hallazgos orientativos para el informe"
            icon={Stethoscope}
            tone="amber"
          >
            <SelectionGroup
              title="Sospecha / orientación clínica"
              options={clinicalOrientationOptions}
              selected={selectedDiagnosis}
              onToggle={(value) => toggleInArray(value, setSelectedDiagnosis)}
              Chip={ActionChip}
            />
          </ToneCard>

          <ToneCard
            title="Diagnóstico de laboratorio"
            subtitle="Subtipos diagnósticos asociados a confirmación por laboratorio"
            icon={FlaskConical}
            tone="emerald"
          >
            <SelectionGroup
              title="Subtipo de laboratorio"
              options={laboratorySubtypeOptions}
              selected={selectedDiagnosis}
              onToggle={(value) => toggleInArray(value, setSelectedDiagnosis)}
              Chip={ActionChip}
            />
          </ToneCard>

          <ToneCard
            title="Estado del diagnóstico"
            subtitle="Marca si el diagnóstico corresponde a una hipótesis o a una confirmación"
            icon={ShieldCheck}
            tone="violet"
          >
            <SelectionGroup
              title="Estado"
              options={diagnosticStatusOptions}
              selected={selectedDiagnosis}
              onToggle={(value) => toggleInArray(value, setSelectedDiagnosis)}
              Chip={ActionChip}
            />
          </ToneCard>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Acciones asociadas"
        subtitle="Conductas seleccionables para exportar junto al diagnóstico"
      >
        <ToneCard
          title="Plan de acción"
          subtitle="Mantiene la lógica de exportación y el estado sugerido del flujo principal"
          icon={Activity}
          tone="rose"
        >
          <div className="grid grid-cols-2 gap-2">
            {orderedActionOptions.map((item) => (
              <ActionChip
                key={item}
                label={item}
                active={selectedActions.includes(item)}
                onClick={() => toggleInArray(item, setSelectedActions)}
              />
            ))}
          </div>
        </ToneCard>
      </AccordionSection>

      <AccordionSection
        title="Selección exportable"
        subtitle="Vista compacta de lo actualmente marcado"
      >
        <ToneCard
          title="Resumen de selección"
          subtitle="Sin duplicar evidencia clínica ni datos ya presentes en otros módulos"
          icon={Microscope}
          tone="blue"
        >
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-white p-3">
              <p className="font-semibold text-slate-900">Diagnóstico</p>
              <p className="mt-1">{selectedDiagnosis.join(", ") || "Sin selección"}</p>
            </div>

            <div className="rounded-2xl bg-white p-3">
              <p className="font-semibold text-slate-900">Acciones</p>
              <p className="mt-1">{selectedActions.join(", ") || "Sin selección"}</p>
            </div>
          </div>
        </ToneCard>
      </AccordionSection>
      </AccordionSection>
    </div>
  );
}