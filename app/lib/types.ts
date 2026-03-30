import type { ElementType } from "react";

export type VisitStatus = "Pendiente" | "En progreso" | "Completada";
export type Priority = "Alta" | "Media" | "Baja";
export type TabKey = "inicio" | "visitas" | "registro" | "muestreo" | "necropsias" | "resumen";
export type FilterKey = "Todas" | "Hoy" | "Pendientes" | "En progreso" | "Completadas";
export type HistoryLevel = "centro" | "modulo" | "jaula";
export type SanitaryStatus = "En tratamiento" | "En carencia" | "Sin tratamiento";
export type MortalityCause =
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

export type Visit = {
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

export type VisitForm = {
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

export type MedicalEvent = {
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

export type CageMortalityRecord = {
  centro: string;
  modulo: string;
  jaula: string;
  causa: MortalityCause;
  total: number;
  porcentaje: number;
};

export type AutoReportRecipient = {
  nombre: string;
  cargo: string;
  canal: string;
};

export type ChecklistItem = {
  label: string;
  done: boolean;
  icon: ElementType;
};

export type NecropsyRecord = {
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

export type StoredChecklistItem = {
  label: string;
  done: boolean;
};
