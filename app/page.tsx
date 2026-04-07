
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
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import DiagnosisModule from "./components/DiagnosisModule";

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

type SecondaryClassificationMatrix = Partial<Record<MortalityCause, Record<string, number>>>;

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
  clasificacionSecundaria: MortalityCause[];
  clasificacionSecundariaDetalle?: SecondaryClassificationMatrix;
  observaciones: string;
};

const STORAGE_KEYS = {
  visits: "mockup-visits-v5",
  selectedVisitId: "mockup-selected-visit-id-v5",
  clinicalState: "mockup-clinical-state-v5",
  historyFilters: "mockup-history-filters-v5",
  samplingFlow: "mockup-sampling-flow-v5",
  necropsyState: "mockup-necropsy-state-v5",
  diagnosisModuleState: "mockup-diagnosis-module-state-v2",
};

const visitsSeed: Visit[] = [
  {
    id: "VST-24031",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "08:00",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "QS01",
    jaula: "QS01-101",
    numeroPeces: 354600,
    pesoPromedio: 5.7,
    biomasa: 2021220,
    mortalidad: 1.4,
    temperatura: 11.4,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS01.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24032",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "08:15",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "QS01",
    jaula: "QS01-102",
    numeroPeces: 353700,
    pesoPromedio: 5.8,
    biomasa: 2051460,
    mortalidad: 1.4,
    temperatura: 11.4,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS01.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24033",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "08:30",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS01",
    jaula: "QS01-103",
    numeroPeces: 352800,
    pesoPromedio: 5.8,
    biomasa: 2046240,
    mortalidad: 1.5,
    temperatura: 11.4,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS01.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24034",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "09:45",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS01",
    jaula: "QS01-104",
    numeroPeces: 351900,
    pesoPromedio: 5.9,
    biomasa: 2076210,
    mortalidad: 1.5,
    temperatura: 11.4,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de QS01.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24035",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "09:50",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS01",
    jaula: "QS01-105",
    numeroPeces: 351000,
    pesoPromedio: 5.9,
    biomasa: 2070900,
    mortalidad: 1.6,
    temperatura: 11.4,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de QS01.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24036",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "09:55",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS01",
    jaula: "QS01-106",
    numeroPeces: 350100,
    pesoPromedio: 6.0,
    biomasa: 2100600,
    mortalidad: 1.6,
    temperatura: 11.4,
    oxigeno: 8.0,
    hallazgo: "Revisión programada de QS01.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24037",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "10:00",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "QS02",
    jaula: "QS02-201",
    numeroPeces: 350100,
    pesoPromedio: 5.8,
    biomasa: 2030580,
    mortalidad: 1.4,
    temperatura: 11.3,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS02.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24038",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "10:15",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "QS02",
    jaula: "QS02-202",
    numeroPeces: 349200,
    pesoPromedio: 5.9,
    biomasa: 2060280,
    mortalidad: 1.5,
    temperatura: 11.3,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS02.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24039",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "10:30",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS02",
    jaula: "QS02-203",
    numeroPeces: 348300,
    pesoPromedio: 6.0,
    biomasa: 2089800,
    mortalidad: 1.5,
    temperatura: 11.3,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS02.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24040",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "11:45",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS02",
    jaula: "QS02-204",
    numeroPeces: 347400,
    pesoPromedio: 6.0,
    biomasa: 2084400,
    mortalidad: 1.6,
    temperatura: 11.3,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de QS02.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24041",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "11:50",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS02",
    jaula: "QS02-205",
    numeroPeces: 346500,
    pesoPromedio: 6.0,
    biomasa: 2079000,
    mortalidad: 1.6,
    temperatura: 11.3,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de QS02.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24042",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "11:55",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS02",
    jaula: "QS02-206",
    numeroPeces: 345600,
    pesoPromedio: 6.1,
    biomasa: 2108160,
    mortalidad: 1.7,
    temperatura: 11.3,
    oxigeno: 8.0,
    hallazgo: "Revisión programada de QS02.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24043",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "12:00",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "QS03",
    jaula: "QS03-301",
    numeroPeces: 345600,
    pesoPromedio: 5.9,
    biomasa: 2039040,
    mortalidad: 1.6,
    temperatura: 11.2,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS03.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24044",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "12:15",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "QS03",
    jaula: "QS03-302",
    numeroPeces: 344700,
    pesoPromedio: 6.0,
    biomasa: 2068200,
    mortalidad: 1.6,
    temperatura: 11.2,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS03.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24045",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "12:30",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS03",
    jaula: "QS03-303",
    numeroPeces: 343800,
    pesoPromedio: 6.0,
    biomasa: 2062800,
    mortalidad: 1.6,
    temperatura: 11.2,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de QS03.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24046",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "13:45",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS03",
    jaula: "QS03-304",
    numeroPeces: 342900,
    pesoPromedio: 6.1,
    biomasa: 2091689,
    mortalidad: 1.7,
    temperatura: 11.2,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de QS03.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24047",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "13:50",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS03",
    jaula: "QS03-305",
    numeroPeces: 342000,
    pesoPromedio: 6.1,
    biomasa: 2086199,
    mortalidad: 1.8,
    temperatura: 11.2,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de QS03.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24048",
    centro: "Quilque Sur",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "13:55",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "QS03",
    jaula: "QS03-306",
    numeroPeces: 341100,
    pesoPromedio: 6.2,
    biomasa: 2114820,
    mortalidad: 1.8,
    temperatura: 11.2,
    oxigeno: 8.0,
    hallazgo: "Revisión programada de QS03.",
    estadoSanitario: "Sin tratamiento",
  },
  {
    id: "VST-24049",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "12:00",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "CAP01",
    jaula: "CAP01-101",
    numeroPeces: 336600,
    pesoPromedio: 5.8,
    biomasa: 1952280,
    mortalidad: 1.4,
    temperatura: 11.2,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP01.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24050",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "12:15",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "CAP01",
    jaula: "CAP01-102",
    numeroPeces: 335700,
    pesoPromedio: 5.9,
    biomasa: 1980630,
    mortalidad: 1.5,
    temperatura: 11.2,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP01.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24051",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "12:30",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP01",
    jaula: "CAP01-103",
    numeroPeces: 334800,
    pesoPromedio: 5.9,
    biomasa: 1975320,
    mortalidad: 1.5,
    temperatura: 11.2,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP01.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24052",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "13:45",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP01",
    jaula: "CAP01-104",
    numeroPeces: 333900,
    pesoPromedio: 6.0,
    biomasa: 2003400,
    mortalidad: 1.6,
    temperatura: 11.2,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de CAP01.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24053",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "13:50",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP01",
    jaula: "CAP01-105",
    numeroPeces: 333000,
    pesoPromedio: 6.0,
    biomasa: 1998000,
    mortalidad: 1.6,
    temperatura: 11.2,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de CAP01.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24054",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "13:55",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP01",
    jaula: "CAP01-106",
    numeroPeces: 332100,
    pesoPromedio: 6.1,
    biomasa: 2025809,
    mortalidad: 1.7,
    temperatura: 11.2,
    oxigeno: 8.0,
    hallazgo: "Revisión programada de CAP01.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24055",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "14:00",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "CAP02",
    jaula: "CAP02-201",
    numeroPeces: 332100,
    pesoPromedio: 5.9,
    biomasa: 1959390,
    mortalidad: 1.5,
    temperatura: 11.1,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP02.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24056",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "14:15",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "CAP02",
    jaula: "CAP02-202",
    numeroPeces: 331200,
    pesoPromedio: 6.0,
    biomasa: 1987200,
    mortalidad: 1.6,
    temperatura: 11.1,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP02.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24057",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "14:30",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP02",
    jaula: "CAP02-203",
    numeroPeces: 330300,
    pesoPromedio: 6.0,
    biomasa: 1981800,
    mortalidad: 1.6,
    temperatura: 11.1,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP02.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24058",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "15:45",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP02",
    jaula: "CAP02-204",
    numeroPeces: 329400,
    pesoPromedio: 6.1,
    biomasa: 2009339,
    mortalidad: 1.6,
    temperatura: 11.1,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de CAP02.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24059",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "15:50",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP02",
    jaula: "CAP02-205",
    numeroPeces: 328500,
    pesoPromedio: 6.1,
    biomasa: 2003849,
    mortalidad: 1.7,
    temperatura: 11.1,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de CAP02.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24060",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "15:55",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP02",
    jaula: "CAP02-206",
    numeroPeces: 327600,
    pesoPromedio: 6.2,
    biomasa: 2031120,
    mortalidad: 1.8,
    temperatura: 11.1,
    oxigeno: 8.0,
    hallazgo: "Revisión programada de CAP02.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24061",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "16:00",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "CAP03",
    jaula: "CAP03-301",
    numeroPeces: 327600,
    pesoPromedio: 6.0,
    biomasa: 1965600,
    mortalidad: 1.6,
    temperatura: 11.0,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP03.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24062",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "16:15",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Alta",
    modulo: "CAP03",
    jaula: "CAP03-302",
    numeroPeces: 326700,
    pesoPromedio: 6.1,
    biomasa: 1992870,
    mortalidad: 1.7,
    temperatura: 11.0,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP03.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24063",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "16:30",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP03",
    jaula: "CAP03-303",
    numeroPeces: 325800,
    pesoPromedio: 6.1,
    biomasa: 1987380,
    mortalidad: 1.7,
    temperatura: 11.0,
    oxigeno: 8.2,
    hallazgo: "Revisión programada de CAP03.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24064",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "17:45",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP03",
    jaula: "CAP03-304",
    numeroPeces: 324900,
    pesoPromedio: 6.2,
    biomasa: 2014380,
    mortalidad: 1.8,
    temperatura: 11.0,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de CAP03.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24065",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "17:50",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP03",
    jaula: "CAP03-305",
    numeroPeces: 324000,
    pesoPromedio: 6.2,
    biomasa: 2008800,
    mortalidad: 1.8,
    temperatura: 11.0,
    oxigeno: 8.1,
    hallazgo: "Revisión programada de CAP03.",
    estadoSanitario: "En tratamiento",
  },
  {
    id: "VST-24066",
    centro: "Capera",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "17:55",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Media",
    modulo: "CAP03",
    jaula: "CAP03-306",
    numeroPeces: 323100,
    pesoPromedio: 6.3,
    biomasa: 2035530,
    mortalidad: 1.9,
    temperatura: 11.0,
    oxigeno: 8.0,
    hallazgo: "Revisión programada de CAP03.",
    estadoSanitario: "En tratamiento",
  }
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

const visitChartNoAxesCombinedOptions = [
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
  // {
  //   title: "Módulo diagnóstico",
  //   description:
  //     "Descripción: el diagnóstico realizado por un médico veterinario es una de las herramientas clave para detectar, controlar y prevenir enfermedades que puedan afectar la producción, el bienestar animal y el cumplimiento normativo.",
  // },
  {
    title: "Módulo análisis de laboratorio",
    // description:
    //   "Descripción: Los análisis de laboratorio son fundamentales para complementar el diagnóstico clínico en terreno y tomar decisiones informadas respecto a la salud de los peces, la efectividad de tratamientos y la condición sanitaria del entorno.",
  },
  {
    title: "Módulo PMV",
    // description:
    //   "Descripción: La prescripción médico veterinaria es una herramienta clave para asegurar un uso responsable de fármacos, cumplir con la normativa vigente y proteger tanto la salud animal como la inocuidad alimentaria.",
  },
  {
    title: "Módulo trazabilidad clínica",
    // description:
    //   "Descripción: La trazabilidad clínica permite vincular cada acción sanitaria, tratamiento, evento clínico o decisión productiva con el grupo o unidad de peces afectada.",
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
  { label: "Mortalidad", done: false, icon: ChartNoAxesCombined },
  { label: "Muestreo", done: false, icon: FlaskConical },
  { label: "Tratamiento / receta", done: false, icon: Pill },
];

const checklistIconMap: Record<string, React.ElementType> = Object.fromEntries(
  defaultChecklist.map((item) => [item.label, item.icon])
);

const necropsyMotiveOptions: NecropsyRecord["motivo"][] = [
  "Rutina",
  "Sospecha",
  "Brote",
  "Seguimiento tratamiento",
];

function formatJaula(jaula: string) {
  return jaula?.split("-").pop() || jaula;
}

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
    seleccionado: 18,
    origen: "Ponton de ensilaje",
    motivo: "Sospecha",
    hallazgoExterno: "Registro rápido por causa principal y cantidad por jaula.",
    hallazgoInterno: "Sin hallazgos detallados en este flujo simplificado.",
    diagnosticoPresuntivo: "PGD / SRS",
    clasificacionSecundaria: ["PGD", "SRS"],
    clasificacionSecundariaDetalle: {
      PGD: {
        "QS01-101": 3,
        "QS01-102": 4,
        "QS01-103": 5,
        "QS01-104": 2,
        "QS01-105": 1,
        "QS01-106": 0,
      },
      SRS: {
        "QS01-101": 1,
        "QS01-102": 2,
        "QS01-103": 0,
        "QS01-104": 1,
        "QS01-105": 3,
        "QS01-106": 2,
      },
    },
    observaciones: "Base de ejemplo para módulo 1 del centro Quilque Sur.",
  },
  {
    id: "NEC-24002",
    fecha: "2026-03-20",
    centro: "Capera",
    modulo: "CAP01",
    jaula: "CAP01-101",
    veterinario: "Catalina Ruiz",
    estadoSanitario: "En tratamiento",
    mortalidadDia: 16,
    mortalidadMesPct: 1.8,
    mortalidadAcumuladaPct: 7.4,
    nroTratamientos: 2,
    nroBanos: 1,
    seleccionado: 10,
    origen: "Ponton de ensilaje",
    motivo: "Seguimiento tratamiento",
    hallazgoExterno: "Registro rápido por causa principal y cantidad por jaula.",
    hallazgoInterno: "Sin hallazgos detallados en este flujo simplificado.",
    diagnosticoPresuntivo: "HSMI / Daño físico",
    clasificacionSecundaria: ["HSMI", "Daño físico"],
    clasificacionSecundariaDetalle: {
      HSMI: {
        "CAP01-101": 3,
        "CAP01-102": 1,
        "CAP01-103": 0,
        "CAP01-104": 2,
        "CAP01-105": 1,
        "CAP01-106": 0,
      },
      "Daño físico": {
        "CAP01-101": 0,
        "CAP01-102": 1,
        "CAP01-103": 2,
        "CAP01-104": 1,
        "CAP01-105": 0,
        "CAP01-106": 1,
      },
    },
    observaciones: "Base de ejemplo para módulo 1 del centro Capera.",
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

function getMatrixFromRecord(record: NecropsyRecord | null | undefined): SecondaryClassificationMatrix {
  if (!record?.clasificacionSecundariaDetalle) return {};

  return Object.fromEntries(
    Object.entries(record.clasificacionSecundariaDetalle).map(([cause, cageMap]) => [
      cause,
      Object.fromEntries(
        Object.entries(cageMap || {}).filter(([, amount]) => Number(amount) > 0).map(([cage, amount]) => [cage, Number(amount)])
      ),
    ])
  ) as SecondaryClassificationMatrix;
}

function summarizeSecondaryMatrix(matrix: SecondaryClassificationMatrix) {
  const grouped: Record<string, Array<{ causa: MortalityCause; cantidad: number }>> = {};

  Object.entries(matrix).forEach(([cause, cageMap]) => {
    Object.entries(cageMap || {}).forEach(([jaula, cantidad]) => {
      const numericAmount = Number(cantidad || 0);
      if (numericAmount <= 0) return;

      if (!grouped[jaula]) grouped[jaula] = [];
      grouped[jaula].push({
        causa: cause as MortalityCause,
        cantidad: numericAmount,
      });
    });
  });

  return Object.entries(grouped)
    .map(([jaula, items]) => ({
      jaula,
      items: items.sort((a, b) => a.causa.localeCompare(b.causa)),
    }))
    .sort((a, b) => a.jaula.localeCompare(b.jaula, undefined, { numeric: true }));
}
const NECROPSY_TABLE_ALL_CAUSES: MortalityCause[] = [
  "PGD",
  "HSMI",
  "SRS",
  "TENA",
  "Rezago",
  "ONI",
  "Deforme",
  "Daño físico",
  "BKD",
  "Otras",
];

function buildNecropsyFullTable(matrix: SecondaryClassificationMatrix) {
  const cageSet = new Set<string>();

  NECROPSY_TABLE_ALL_CAUSES.forEach((cause) => {
    Object.entries(matrix[cause] || {}).forEach(([jaula, cantidad]) => {
      if (Number(cantidad || 0) > 0) {
        cageSet.add(formatJaula(jaula));
      }
    });
  });

  const rows = Array.from(cageSet)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((jaula) => {
      const values = Object.fromEntries(
        NECROPSY_TABLE_ALL_CAUSES.map((cause) => {
          const amount =
            Object.entries(matrix[cause] || {}).find(
              ([cageKey]) => formatJaula(cageKey) === jaula
            )?.[1] ?? 0;

          return [cause, Number(amount)];
        })
      ) as Record<MortalityCause, number>;

      const total = NECROPSY_TABLE_ALL_CAUSES.reduce(
        (sum, cause) => sum + Number(values[cause] || 0),
        0
      );

      return {
        jaula,
        values,
        total,
      };
    })
    .filter((row) => row.total > 0);

  const totals = Object.fromEntries(
    NECROPSY_TABLE_ALL_CAUSES.map((cause) => [
      cause,
      rows.reduce((sum, row) => sum + Number(row.values[cause] || 0), 0),
    ])
  ) as Record<MortalityCause, number>;

  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

  const percentages = Object.fromEntries(
    NECROPSY_TABLE_ALL_CAUSES.map((cause) => [
      cause,
      grandTotal > 0 ? (Number(totals[cause] || 0) / grandTotal) * 100 : 0,
    ])
  ) as Record<MortalityCause, number>;

  return {
    causes: NECROPSY_TABLE_ALL_CAUSES,
    rows,
    totals,
    percentages,
    grandTotal,
  };
}

function formatNecropsyTablePercent(value: number) {
  return `${value.toFixed(2).replace(".", ",")}%`;
}
function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateChile(dateString?: string) {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}-${month}-${year}`;
}

function formatNumberCL(value?: number, digits = 0) {
  const numeric = Number(value ?? 0);
  return new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(numeric);
}

function formatPercentCL(value?: number, digits = 1) {
  const numeric = Number(value ?? 0);
  return `${formatNumberCL(numeric, digits)}%`;
}

function formatTextList(value?: string) {
  if (!value) return "Sin registro";
  return value.trim() || "Sin registro";
}

function buildCommentsBlock(report: any, selectedVisit: Visit, selectedNecropsy: NecropsyRecord) {
  const comments = [
    report?.resumenInspeccion,
    report?.resumenMortalidad,
    report?.resumenNecropsia,
    report?.resumenTratamiento,
    report?.resumenMuestreo,
    selectedVisit?.hallazgo,
    selectedNecropsy?.observaciones,
  ]
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);

  if (comments.length === 0) {
    return "<p>Sin comentarios registrados.</p>";
  }

  return comments.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
}

function VisitFinalReportHtml({
  selectedVisit,
  selectedNecropsy,
  generatedReport,
  secondaryClassificationMatrix,
}: {
  selectedVisit: Visit;
  selectedNecropsy: NecropsyRecord;
  generatedReport: any;
  secondaryClassificationMatrix: SecondaryClassificationMatrix;
}) {
  const fullTable = buildNecropsyFullTable(secondaryClassificationMatrix);

  const reportDate = formatDateChile(selectedVisit?.fecha);
  const empresa = selectedVisit?.empresa || "Sin empresa";
  const centro = selectedVisit?.centro || "Sin centro";
  const modulo = selectedVisit?.modulo || generatedReport?.modulo || "-";

  const totalFish = Number(selectedVisit?.numeroPeces ?? 0);
  const finalWeight = Number(selectedVisit?.pesoPromedio ?? 0);
  const biomass = Number(selectedVisit?.biomasa ?? 0);

  const dailyMortality = Number(selectedNecropsy?.mortalidadDia ?? 0);
  const monthlyMortality = Number(selectedNecropsy?.mortalidadMesPct ?? 0);
  const accumulatedMortality = Number(selectedNecropsy?.mortalidadAcumuladaPct ?? 0);

  const treatments = Number(selectedNecropsy?.nroTratamientos ?? 0);
  const baths = Number(selectedNecropsy?.nroBanos ?? 0);

  const rowsHtml =
    fullTable.rows.length > 0
      ? fullTable.rows
        .map((row) => {
          return `
              <tr>
                <td>${escapeHtml(`${modulo}-${row.jaula}`)}</td>
                <td>${escapeHtml("-")}</td>
                <td class="num">${formatNumberCL(row.total)}</td>
                ${fullTable.causes
              .map(
                (cause) =>
                  `<td class="num">${Number(row.values[cause] || 0) > 0 ? formatNumberCL(row.values[cause]) : ""}</td>`
              )
              .join("")}
              </tr>
            `;
        })
        .join("")
      : `
        <tr>
          <td>${escapeHtml(selectedVisit?.jaula || "-")}</td>
          <td>${escapeHtml("-")}</td>
          <td class="num">0</td>
          ${NECROPSY_TABLE_ALL_CAUSES.map(() => `<td class="num"></td>`).join("")}
        </tr>
      `;

  const totalsRow = `
    <tr class="totals">
      <td colspan="3">Total N°</td>
      ${fullTable.causes.map((cause) => `<td class="num">${formatNumberCL(fullTable.totals[cause] || 0)}</td>`).join("")}
    </tr>
  `;

  const percentagesRow = `
    <tr class="totals">
      <td colspan="3">Total %</td>
      ${fullTable.causes
      .map((cause) => `<td class="num">${formatNecropsyTablePercent(fullTable.percentages[cause] || 0)}</td>`)
      .join("")}
    </tr>
  `;

  const barItems = fullTable.causes
    .map((cause) => ({
      cause,
      pct: Number(fullTable.percentages[cause] || 0),
    }))
    .filter((item) => item.pct > 0);

  const maxPct = Math.max(...barItems.map((item) => item.pct), 1);

  const barsHtml =
    barItems.length > 0
      ? barItems
        .map(
          (item) => `
              <div class="bar-item">
                <div class="bar-value">${formatNecropsyTablePercent(item.pct)}</div>
                <div class="bar-track">
                  <div class="bar-fill" style="height:${Math.max((item.pct / maxPct) * 180, 6)}px"></div>
                </div>
                <div class="bar-label">${escapeHtml(item.cause)}</div>
              </div>
            `
        )
        .join("")
      : `<div class="empty-chart">Sin datos para gráfico</div>`;

  const commentsHtml = buildCommentsBlock(generatedReport, selectedVisit, selectedNecropsy);

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Informe-${escapeHtml(selectedVisit.id)}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #ffffff;
          }

          .page {
            width: 100%;
          }

          .header {
            display: grid;
            grid-template-columns: 1fr 1.2fr 1fr;
            align-items: start;
            gap: 12px;
            font-size: 14px;
            margin-bottom: 18px;
          }

          .header-left {
            text-align: left;
          }

          .header-center {
            text-align: center;
            font-weight: 700;
          }

          .header-right {
            text-align: right;
            font-weight: 700;
          }

          .block-title {
            font-size: 15px;
            font-weight: 700;
            border-bottom: 1px solid #111;
            padding-bottom: 2px;
            margin-bottom: 6px;
          }

          .top-grid {
            display: grid;
            grid-template-columns: 1.4fr 0.8fr;
            gap: 24px;
            margin-bottom: 18px;
          }

          .metrics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px 18px;
            font-size: 13px;
          }

          .metric-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
          }

          .metric-label {
            font-weight: 700;
          }

          .table-title {
            text-align: center;
            font-weight: 700;
            margin: 4px 0 2px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          th, td {
            border: 1px solid #444;
            padding: 4px 6px;
            vertical-align: middle;
          }

          th {
            background: #f3f4f6;
            font-weight: 700;
          }

          .num {
            text-align: right;
          }

          .totals td {
            font-weight: 700;
            background: #fafafa;
          }

          .charts {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 14px;
            margin-bottom: 14px;
          }

          .chart-box {
            border: 1px solid #444;
            min-height: 250px;
            padding: 10px;
          }

          .chart-placeholder {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
            font-size: 12px;
            text-align: center;
          }

          .bars {
            height: 220px;
            display: flex;
            align-items: end;
            justify-content: space-around;
            gap: 10px;
            padding: 8px 4px 0;
          }

          .bar-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: end;
            width: 100%;
            max-width: 58px;
            height: 100%;
          }

          .bar-value {
            font-size: 11px;
            margin-bottom: 6px;
            text-align: center;
          }

          .bar-track {
            height: 180px;
            width: 26px;
            display: flex;
            align-items: end;
            justify-content: center;
          }

          .bar-fill {
            width: 26px;
            background: #4b5563;
          }

          .bar-label {
            margin-top: 8px;
            font-size: 11px;
            text-align: center;
            word-break: break-word;
          }

          .empty-chart {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #6b7280;
            font-size: 12px;
          }

          .comments-box {
            border: 1px solid #111;
            margin-top: 8px;
          }

          .comments-title {
            text-align: center;
            font-weight: 700;
            border-bottom: 1px solid #111;
            padding: 4px 8px;
            background: #f9fafb;
          }

          .comments-body {
            min-height: 130px;
            padding: 8px 10px;
            font-size: 13px;
            line-height: 1.45;
          }

          .comments-body p {
            margin: 0 0 6px;
          }

          .signature {
            margin-top: 48px;
            text-align: center;
            font-size: 14px;
          }

          .muted {
            color: #6b7280;
          }

          @media print {
            .page {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="header-left"><strong>Fecha:</strong> ${escapeHtml(reportDate)}</div>
            <div class="header-center">
              <div>Reporte de Visita</div>
              <div>Centro ${escapeHtml(centro)}</div>
            </div>
            <div class="header-right">${escapeHtml(empresa)}</div>
          </div>

          <div class="top-grid">
            <div>
              <div class="block-title">${escapeHtml(`${modulo}-${centro}`)}</div>
              <div class="metrics">
                <div class="metric-row"><span class="metric-label">N° Final:</span><span>${formatNumberCL(totalFish)}</span></div>
                <div class="metric-row"><span class="metric-label">SFR:</span><span>${formatPercentCL(selectedVisit?.mortalidad ?? 0, 2)}</span></div>

                <div class="metric-row"><span class="metric-label">Peso Final:</span><span>${formatNumberCL(finalWeight, 1)}</span></div>
                <div class="metric-row"><span class="metric-label">N° Ttos:</span><span>${formatNumberCL(treatments)}</span></div>

                <div class="metric-row"><span class="metric-label">Biomasa:</span><span>${formatNumberCL(biomass)}</span></div>
                <div class="metric-row"><span class="metric-label">N° Baños:</span><span>${formatNumberCL(baths)}</span></div>
              </div>
            </div>

            <div>
              <div class="block-title">Mortalidad</div>
              <div class="metrics" style="grid-template-columns: 1fr;">
                <div class="metric-row"><span class="metric-label">Día:</span><span>${formatNumberCL(dailyMortality)}</span></div>
                <div class="metric-row"><span class="metric-label">Mes:</span><span>${formatPercentCL(monthlyMortality, 2)}</span></div>
                <div class="metric-row"><span class="metric-label">Acc:</span><span>${formatPercentCL(accumulatedMortality, 1)}</span></div>
              </div>
            </div>
          </div>

          <div class="table-title">Mortalidad por causa N°</div>
          <table>
            <thead>
              <tr>
                <th>Jaulas</th>
                <th>Grupo</th>
                <th class="num">N</th>
                ${fullTable.causes.map((cause) => `<th class="num">${escapeHtml(cause)}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              ${totalsRow}
              ${percentagesRow}
            </tbody>
          </table>

          <div class="charts">
            <div class="chart-box">
              <div class="chart-placeholder">
                Tendencia histórica por implementar.<br />
              </div>
            </div>

            <div class="chart-box">
              <div class="bars">${barsHtml}</div>
            </div>
          </div>

          <div class="comments-box">
            <div class="comments-title">Comentarios y Recomendaciones</div>
            <div class="comments-body">
              ${commentsHtml}
            </div>
          </div>

          <div class="signature">
            ${escapeHtml(selectedVisit?.veterinario || "Médico Veterinario")}
          </div>
        </div>
      </body>
    </html>
  `;
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

function ContextSelectorsCard({
  title = "Contexto",
  subtitle = "Centro, módulo y jaula",
  selectedCentro,
  selectedModulo,
  selectedJaula,
  centerOptions,
  moduleOptions,
  cageOptions,
  onCentroChange,
  onModuloChange,
  onJaulaChange,
}: {
  title?: string;
  subtitle?: string;
  selectedCentro: string;
  selectedModulo: string;
  selectedJaula: string;
  centerOptions: string[];
  moduleOptions: string[];
  cageOptions: string[];
  onCentroChange: (value: string) => void;
  onModuloChange: (value: string) => void;
  onJaulaChange: (value: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-slate-700">Centro</label>
          <select
            value={selectedCentro}
            onChange={(e) => onCentroChange(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
          >
            {centerOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Módulo</label>
          <select
            value={selectedModulo}
            onChange={(e) => onModuloChange(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
          >
            {moduleOptions.map((item) => (
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
            onChange={(e) => onJaulaChange(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
          >
            {cageOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
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



function CorporateLogin({
  email,
  password,
  onSuccess,
}: {
  email: string;
  password: string;
  onSuccess: () => void;
}) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [logoError, setLogoError] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === email && pass === password) {
      setError("");
      onSuccess();
      return;
    }

    setError("Credenciales inválidas. Verifica tu correo corporativo y contraseña.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <div className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-[#0F6CBD] to-[#115EA3] px-6 py-8 text-white">
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
                Acceso corporativo
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                {!logoError ? (
                  <img
                    src="/imagen.png"
                    alt="Logo empresa"
                    className="h-full w-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Fish className="h-8 w-8 text-[#0F6CBD]" />
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">AquaChile</p>
                <h1 className="mt-1 text-2xl font-semibold">Sistema Veterinario</h1>
                <p className="mt-1 text-sm text-white/80">Inicio de sesión interno</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* <div className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-800">
              <p className="font-semibold">Credenciales de demostración</p>
              <p className="mt-1">Usuario: {email}</p>
              <p>Contraseña: {password}</p>
            </div> */}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Correo corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="aquachile@ejemplo.cl"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#0F6CBD]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-24 text-sm outline-none transition focus:border-[#0F6CBD]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] font-semibold text-white transition hover:bg-[#115EA3]"
              >
                <ShieldCheck className="h-5 w-5" />
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
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
  const DEMO_USER = "aquachile@ejemplo.cl";
  const DEMO_PASSWORD = "P@ssword123";

  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tab, setTab] = useState<TabKey>("inicio");
  const [offline, setOffline] = useState(true);
  const [visits, setVisits] = useState<Visit[]>(visitsSeed);
  const [selectedVisit, setSelectedVisit] = useState<Visit>(visitsSeed[0]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("Todas");
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState("");
  const [showNecropsyFullTable, setShowNecropsyFullTable] = useState(false);

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
  const [selectedNecropsySecondary, setSelectedNecropsySecondary] = useState<MortalityCause[]>(["SRS", "PGD"]);
  const [selectedSecondaryCause, setSelectedSecondaryCause] = useState<MortalityCause | null>("SRS");
  const [selectedReportRecipients, setSelectedReportRecipients] = useState<string[]>([]);
  const [secondaryClassificationMatrix, setSecondaryClassificationMatrix] = useState<SecondaryClassificationMatrix>(
    getMatrixFromRecord(necropsySeed[0])
  );

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
        setSelectedNecropsySecondary(parsed.selectedNecropsySecondary ?? ["SRS", "PGD"]);
        setSelectedSecondaryCause(parsed.selectedSecondaryCause ?? "SRS");
        setSecondaryClassificationMatrix(parsed.secondaryClassificationMatrix ?? getMatrixFromRecord(parsed.necropsyRecords?.find((record: NecropsyRecord) => record.id === (parsed.selectedNecropsyId ?? necropsySeed[0].id)) ?? necropsySeed[0]));
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
        selectedNecropsySecondary,
        selectedSecondaryCause,
        secondaryClassificationMatrix,
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
    selectedNecropsySecondary,
    selectedSecondaryCause,
    secondaryClassificationMatrix,
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

  useEffect(() => {
    if (!selectedVisit.centro) return;
    setSelectedReportRecipients((prev) => (prev.length > 0 ? prev : [selectedVisit.centro]));
  }, [selectedVisit.centro]);

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

  const availableRecipients = useMemo(() => {
    const entries = Object.entries(recipientsSeed).map(([centro, data]) => ({
      id: centro,
      centro,
      ...data,
    }));

    const currentRecipientId = selectedVisit.centro || "default";
    const alreadyIncluded = entries.some((item) => item.id === currentRecipientId);

    if (!alreadyIncluded) {
      entries.unshift({
        id: currentRecipientId,
        centro: selectedVisit.centro,
        ...recipient,
      });
    }

    return entries;
  }, [recipient, selectedVisit.centro]);

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

  const necropsyCenterOptions = useMemo(
    () => Array.from(new Set([...visits.map((visit) => visit.centro), ...necropsyRecords.map((record) => record.centro)])).sort(),
    [visits, necropsyRecords]
  );

  const necropsyModuleOptions = useMemo(
    () =>
      Array.from(
        new Set(
          [...visits, ...necropsyRecords]
            .filter((item) => item.centro === selectedCentro)
            .map((item) => item.modulo)
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [visits, necropsyRecords, selectedCentro]
  );

  const secondaryCageRows = useMemo(() => {
    const cagesFromVisits = visits
      .filter((visit) => visit.centro === selectedCentro && visit.modulo === selectedModulo)
      .map((visit) => visit.jaula)
      .filter(Boolean);

    const cagesFromNecropsies = necropsyRecords
      .filter((record) => record.centro === selectedCentro && record.modulo === selectedModulo)
      .map((record) => record.jaula)
      .filter(Boolean);

    const cagesFromMatrix = Object.values(secondaryClassificationMatrix)
      .flatMap((cageMap) => Object.keys(cageMap || {}))
      .filter(Boolean);

    return Array.from(new Set([...cagesFromVisits, ...cagesFromNecropsies, ...cagesFromMatrix])).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }, [visits, necropsyRecords, selectedCentro, selectedModulo, secondaryClassificationMatrix]);

  const orderedNecropsySummary = useMemo(
    () => summarizeSecondaryMatrix(secondaryClassificationMatrix),
    [secondaryClassificationMatrix]
  );
  const necropsyFullTable = useMemo(
    () => buildNecropsyFullTable(secondaryClassificationMatrix),
    [secondaryClassificationMatrix]
  );

  const contextCageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          [...visits, ...necropsyRecords]
            .filter((item) => item.centro === selectedCentro && item.modulo === selectedModulo)
            .map((item) => item.jaula)
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [visits, necropsyRecords, selectedCentro, selectedModulo]
  );

  const handleCentroChange = (centro: string) => {
    const nextModules = Array.from(
      new Set(
        [...visits, ...necropsyRecords]
          .filter((item) => item.centro === centro)
          .map((item) => item.modulo)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const nextModulo = nextModules[0] || "";
    const nextJaulas = Array.from(
      new Set(
        [...visits, ...necropsyRecords]
          .filter((item) => item.centro === centro && item.modulo === nextModulo)
          .map((item) => item.jaula)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    setSelectedCentro(centro);
    setSelectedModulo(nextModulo);
    setSelectedJaula(nextJaulas[0] || "");
  };

  const handleModuloChange = (modulo: string) => {
    const nextJaulas = Array.from(
      new Set(
        [...visits, ...necropsyRecords]
          .filter((item) => item.centro === selectedCentro && item.modulo === modulo)
          .map((item) => item.jaula)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    setSelectedModulo(modulo);
    setSelectedJaula(nextJaulas[0] || "");
  };

  const summarizedSecondaryCauses = useMemo(
    () =>
      orderedNecropsySummary
        .flatMap((group) => group.items.map((item) => item.causa))
        .filter((value, index, array) => array.indexOf(value) === index),
    [orderedNecropsySummary]
  );

  useEffect(() => {
    if (!selectedCentro) return;
    if (!necropsyModuleOptions.includes(selectedModulo)) {
      const nextModulo = necropsyModuleOptions[0] || "";
      setSelectedModulo(nextModulo);
      const nextJaula = Array.from(
        new Set(
          [...visits, ...necropsyRecords]
            .filter((item) => item.centro === selectedCentro && item.modulo === nextModulo)
            .map((item) => item.jaula)
            .filter(Boolean)
        )
      )[0] || "";
      setSelectedJaula(nextJaula);
    }
  }, [selectedCentro, selectedModulo, necropsyModuleOptions, visits, necropsyRecords]);

  useEffect(() => {
    if (!selectedModulo) return;
    if (!secondaryCageRows.includes(selectedJaula)) {
      setSelectedJaula(secondaryCageRows[0] || "");
    }
  }, [selectedModulo, secondaryCageRows, selectedJaula]);


  useEffect(() => {
    const derivedCauses = orderedNecropsySummary
      .flatMap((group) => group.items.map((item) => item.causa))
      .filter((value, index, array) => array.indexOf(value) === index) as MortalityCause[];

    const derivedDx = derivedCauses.join(", ") || "Sin clasificación secundaria";
    const derivedNecropsyNote = derivedDx;
    const derivedMortalityNote =
      orderedNecropsySummary.length > 0
        ? orderedNecropsySummary
          .map(
            (group) =>
              `Jaula ${group.jaula}: ${group.items
                .map((item) => `${item.cantidad} ${item.causa}`)
                .join(", ")}`
          )
          .join(" · ")
        : "Sin clasificación secundaria";

    if (necropsyPresumptiveDx !== derivedDx) setNecropsyPresumptiveDx(derivedDx);
    if (necropsyNote !== derivedNecropsyNote) setNecropsyNote(derivedNecropsyNote);
    if (mortalityNote !== derivedMortalityNote) setMortalityNote(derivedMortalityNote);
    if (JSON.stringify(selectedNecropsySecondary) !== JSON.stringify(derivedCauses)) {
      setSelectedNecropsySecondary(derivedCauses);
    }
  }, [orderedNecropsySummary, necropsyPresumptiveDx, necropsyNote, mortalityNote, selectedNecropsySecondary]);

  const generatedReport = useMemo(() => {
    const totalNecropsias = orderedNecropsySummary.reduce(
      (sum, group) => sum + group.items.reduce((inner, item) => inner + item.cantidad, 0),
      0
    );

    const jaulasConRegistro = orderedNecropsySummary.length;

    const resumenNecropsia =
      orderedNecropsySummary.length > 0
        ? orderedNecropsySummary
          .map(
            (group) =>
              `Jaula ${group.jaula}: ${group.items
                .map((item) => `${item.cantidad} ${item.causa}`)
                .join(", ")}`
          )
          .join(" · ")
        : "Sin registros de necropsia";

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
      diagnosticoFuente: orderedNecropsySummary.length > 0 ? "Causa principal + cantidad por jaula" : inspectionNote ? "Clínico" : "Sin evidencia",
      acciones: selectedActions.join(", ") || "Sin selección",
      principalCausa: dominantCause,
      destinatario: recipient,
      necropsiaIntegrada: {
        titulo: "Necropsia",
        id: selectedNecropsy.id,
        origen: selectedNecropsy.origen,
        motivo: necropsyMotive,
        seleccionados: necropsySelectedCount,
        hallazgoExterno: necropsyExternalNote,
        hallazgoInterno: necropsyInternalNote,
        diagnosticoPresuntivo: necropsyPresumptiveDx,
        baseRegistro: "Causa principal",
        causasRegistradas: summarizedSecondaryCauses,
        totalJaulas: jaulasConRegistro,
        totalNecropsias,
        resumen: resumenNecropsia,
        clasificacionSecundariaDetalle: orderedNecropsySummary,
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
    selectedNecropsySecondary,
    summarizedSecondaryCauses,
    orderedNecropsySummary,
  ]);

  const toggleInArray = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const updateSecondaryCageCount = (cause: MortalityCause, cage: string, amount: number) => {
    const nextAmount = Math.max(0, amount);

    setSecondaryClassificationMatrix((prev) => {
      const next: SecondaryClassificationMatrix = {
        ...prev,
        [cause]: {
          ...(prev[cause] || {}),
          [cage]: nextAmount,
        },
      };

      if (nextAmount === 0 && next[cause]) {
        const { [cage]: _removed, ...rest } = next[cause] || {};
        next[cause] = rest;
        if (Object.keys(rest).length === 0) {
          delete next[cause];
        }
      }

      return next;
    });
  };

  const toggleReportRecipient = (recipientId: string) => {
    setSelectedReportRecipients((prev) =>
      prev.includes(recipientId) ? prev.filter((item) => item !== recipientId) : [...prev, recipientId]
    );
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
    setNecropsyPresumptiveDx(record.clasificacionSecundaria.join(", ") || "Sin clasificación secundaria");
    setNecropsyObservations(record.observaciones);
    setSelectedNecropsySecondary(record.clasificacionSecundaria);
    setSecondaryClassificationMatrix(getMatrixFromRecord(record));
    setSelectedSecondaryCause(record.clasificacionSecundaria[0] ?? "PGD");
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
    const summarized = summarizeSecondaryMatrix(secondaryClassificationMatrix);
    const activeCauses = summarized
      .flatMap((group) => group.items.map((item) => item.causa))
      .filter((value, index, array) => array.indexOf(value) === index) as MortalityCause[];

    const updated: NecropsyRecord = {
      ...base,
      seleccionado: Number(necropsySelectedCount || 0),
      motivo: necropsyMotive,
      hallazgoExterno: necropsyExternalNote.trim(),
      hallazgoInterno: necropsyInternalNote.trim(),
      diagnosticoPresuntivo: activeCauses.join(", ") || "Sin clasificación secundaria",
      observaciones: necropsyObservations.trim(),
      clasificacionSecundaria: activeCauses,
      clasificacionSecundariaDetalle: secondaryClassificationMatrix,
      centro: selectedCentro,
      modulo: selectedModulo,
      jaula: selectedJaula,
      veterinario: selectedVisit.veterinario,
      estadoSanitario: selectedVisit.estadoSanitario,
    };

    setSelectedNecropsySecondary(activeCauses);
    setNecropsyRecords((prev) => prev.map((record) => (record.id === updated.id ? updated : record)));
    setNecropsyNote(
      `${updated.diagnosticoPresuntivo || "Sin diagnóstico"} · ${activeCauses.join(", ") || "Sin clasificación"}`
    );
    setMortalityNote(
      summarized.length > 0
        ? summarized
          .map((group) => `Jaula ${group.jaula}: ${group.items.map((item) => `${item.cantidad} ${item.causa}`).join(", ")}`)
          .join(" · ")
        : `Pontón de ensilaje · ${updated.jaula} · Sin clasificación secundaria`
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
    downloadFinalReport();
  };

  const exportNecropsySheet = () => {
    const record = selectedNecropsy;
    const payload = {
      necropsia: record,
      clasificacionSecundaria: summarizedSecondaryCauses,
      clasificacionSecundariaDetalle: secondaryClassificationMatrix,
      resumenPorJaula: orderedNecropsySummary,
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
    const recipientsToSend = availableRecipients.filter((item) => selectedReportRecipients.includes(item.id));
    const destinationLabel =
      recipientsToSend.length > 0
        ? recipientsToSend.map((item) => item.nombre).join(", ")
        : "sin destinatarios seleccionados";

    setToast(`Informe ${selectedVisit.id} enviado a ${destinationLabel}`);
  };

  const act = (message: string) => setToast(message);
  const downloadFinalReport = () => {
    if (!selectedVisit || !selectedNecropsy) {
      setToast("No hay información suficiente para generar el informe");
      return;
    }

    const html = VisitFinalReportHtml({
      selectedVisit,
      selectedNecropsy,
      generatedReport,
      secondaryClassificationMatrix,
    });

    const reportWindow = window.open("", "_blank", "width=1200,height=900");

    if (!reportWindow) {
      setToast("No se pudo abrir la ventana de impresión");
      return;
    }

    reportWindow.document.open();
    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.focus();

    setTimeout(() => {
      reportWindow.print();
    }, 400);
  };

  if (!ready) {
    return <div className="min-h-screen bg-[#F5F7FA]" />;
  }

  if (!isAuthenticated) {
    return (
      <CorporateLogin
        email={DEMO_USER}
        password={DEMO_PASSWORD}
        onSuccess={() => {
          setIsAuthenticated(true);
          setToast("Sesión corporativa iniciada");
        }}
      />
    );
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
              {/* <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Flujo de terreno</p> */}
              {/* <h2 className="mt-2 text-2xl font-semibold leading-tight">
                Centro → módulo → jaula → historial → registro → pontón de ensilaje → mortalidades → necropsias → reporte
              </h2> */}

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
              // subtitle="Los módulos se abren desde inicio. Muestreo y necropsias también pueden abrirse desde una visita activa."
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
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Módulo necropsias</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Registro de necropsias con clasificación.
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
                        {/* <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p> */}
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

            {/* <ContextSelectorsCard
              title="Contexto del registro"
              subtitle="Cada dato del módulo queda ligado al centro, módulo y jaula seleccionados"
              selectedCentro={selectedCentro}
              selectedModulo={selectedModulo}
              selectedJaula={selectedJaula}
              centerOptions={necropsyCenterOptions}
              moduleOptions={necropsyModuleOptions}
              cageOptions={contextCageOptions}
              onCentroChange={handleCentroChange}
              onModuloChange={handleModuloChange}
              onJaulaChange={setSelectedJaula}
            /> */}





            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Contexto clínico" subtitle="Historial filtrado por la jaula seleccionada" />
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
                  {/* <p className="mt-2 text-sm text-white/80">
                    Descripción: En la acuicultura, cuando un médico veterinario realiza una salida a terreno para la toma de muestras, estas pueden clasificarse según su objetivo y el contexto operativo.
                  </p> */}
                </div>
                <FlaskConical className="h-8 w-8 text-white" />
              </div>

              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm">
                {/* <p className="font-semibold text-white">Contexto del muestreo</p> */}
                {samplingContextMode === "visita" && linkedSamplingVisit ? (
                  <div className="mt-2 space-y-1 text-white/85">
                    <p>Asociado a visita {linkedSamplingVisit.id}</p>
                    <p>{linkedSamplingVisit.centro} · {linkedSamplingVisit.modulo} · {linkedSamplingVisit.jaula}</p>
                    <p>Veterinario responsable: {linkedSamplingVisit.veterinario}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-white/85">
                    Muestreo Independiente.
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

            {/* <ContextSelectorsCard
              title="Contexto del muestreo"
              subtitle="Las opciones de muestreo quedan ligadas a la jaula seleccionada"
              selectedCentro={selectedCentro}
              selectedModulo={selectedModulo}
              selectedJaula={selectedJaula}
              centerOptions={necropsyCenterOptions}
              moduleOptions={necropsyModuleOptions}
              cageOptions={contextCageOptions}
              onCentroChange={handleCentroChange}
              onModuloChange={handleModuloChange}
              onJaulaChange={setSelectedJaula}
            /> */}

            <AccordionSection
              title="Módulo muestreo"
              // subtitle="Descripción: En la acuicultura, cuando un médico veterinario realiza una salida a terreno para la toma de muestras, estas pueden clasificarse según su objetivo y el contexto operativo."
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
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">
                Pontón de ensilaje
              </p>
              <h2 className="mt-2 text-xl font-semibold">Necropsias</h2>
              <p className="mt-2 text-sm text-white/80">
                Registro rápido por centro, módulo y jaulas. Marca una causa principal y asigna cantidades por cada jaula del módulo.
              </p>
            </section>

            {/* ================= CAUSA ================= */}
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader title="Causa principal" />
              <div className="grid grid-cols-2 gap-2">
                {([
                  "PGD",
                  "HSMI",
                  "SRS",
                  "TENA",
                  "Rezago",
                  "ONI",
                  "Deforme",
                  "Daño físico",
                  "BKD",
                  "Otras",
                ] as MortalityCause[]).map((item) => (
                  <ActionChip
                    key={item}
                    label={item}
                    active={selectedSecondaryCause === item}
                    onClick={() => setSelectedSecondaryCause(item)}
                  />
                ))}
              </div>
            </section>

            {/* ================= REGISTRO ================= */}
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Registro rápido"
                subtitle={
                  selectedSecondaryCause && selectedJaula
                    ? `Causa activa: ${selectedSecondaryCause} · Jaula activa: ${formatJaula(selectedJaula)}`
                    : "Selecciona causa principal y jaula"
                }
              />

              {selectedSecondaryCause ? (
                secondaryCageRows.length > 0 ? (
                  <div className="space-y-4">

                    {/* 🔹 SELECTOR JAULAS */}
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Jaulas del módulo
                      </p>

                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {secondaryCageRows.map((row) => {
                          const cageValue =
                            secondaryClassificationMatrix[selectedSecondaryCause]?.[row] ?? 0;

                          const active = selectedJaula === row;

                          return (
                            <button
                              key={`selector-${row}`}
                              onClick={() => setSelectedJaula(row)}
                              className={`rounded-2xl border px-3 py-3 text-left transition ${active
                                ? "border-rose-600 bg-rose-600 text-white"
                                : "border-slate-200 bg-slate-50 text-slate-800"
                                }`}
                            >
                              <p className="text-xs font-medium opacity-80">Jaula</p>
                              <p className="text-base font-bold">
                                {formatJaula(row)}
                              </p>
                              <p className="mt-1 text-lg font-bold">{cageValue}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 🔹 CONTADOR */}
                    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-rose-900">
                            Carga directa
                          </p>
                          <p className="text-lg font-bold text-rose-950">
                            {selectedSecondaryCause} en jaula{" "}
                            {selectedJaula ? formatJaula(selectedJaula) : "-"}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-4 py-2 text-2xl font-black text-slate-900 shadow-sm">
                          {selectedJaula
                            ? secondaryClassificationMatrix[selectedSecondaryCause]?.[
                            selectedJaula
                            ] ?? 0
                            : 0}
                        </span>
                      </div>

                      {selectedJaula ? (
                        <>
                          <div className="grid grid-cols-3 gap-2">
                            {[0, 1, 2, 3, 4, 5].map((n) => {
                              const value =
                                secondaryClassificationMatrix[selectedSecondaryCause]?.[
                                selectedJaula
                                ] ?? 0;

                              return (
                                <button
                                  key={n}
                                  onClick={() =>
                                    updateSecondaryCageCount(
                                      selectedSecondaryCause,
                                      selectedJaula,
                                      n
                                    )
                                  }
                                  className={`h-16 rounded-2xl border text-2xl font-black ${value === n
                                    ? "border-rose-600 bg-rose-600 text-white"
                                    : "border-slate-200 bg-white text-slate-800"
                                    }`}
                                >
                                  {n}
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <button
                              onClick={() =>
                                updateSecondaryCageCount(
                                  selectedSecondaryCause,
                                  selectedJaula,
                                  Math.max(
                                    0,
                                    (secondaryClassificationMatrix[
                                      selectedSecondaryCause
                                    ]?.[selectedJaula] ?? 0) - 1
                                  )
                                )
                              }
                              className="h-14 rounded-2xl border border-slate-200 bg-white text-xl font-bold text-slate-700"
                            >
                              -1
                            </button>

                            <button
                              onClick={() =>
                                updateSecondaryCageCount(
                                  selectedSecondaryCause,
                                  selectedJaula,
                                  (secondaryClassificationMatrix[
                                    selectedSecondaryCause
                                  ]?.[selectedJaula] ?? 0) + 1
                                )
                              }
                              className="h-14 rounded-2xl border border-slate-200 bg-white text-xl font-bold text-slate-700"
                            >
                              +1
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-4 text-sm text-slate-600">
                          Selecciona una jaula para registrar la cantidad.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    No hay jaulas disponibles para este centro o módulo.
                  </div>
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  Selecciona una causa principal para comenzar.
                </div>
              )}
            </section>

            {/* ================= RESUMEN ================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionHeader
                title="Resumen por jaula"
                subtitle="Salida ordenada y concisa"
              />

              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => setShowNecropsyFullTable(true)}
                  disabled={necropsyFullTable.rows.length === 0}
                  className={cn(
                    "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                    necropsyFullTable.rows.length > 0
                      ? "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-slate-100"
                      : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  )}
                >
                  Ver tabla completa
                </button>
              </div>

              <div className="space-y-3">
                {orderedNecropsySummary.length > 0 ? (
                  orderedNecropsySummary.map((group) => (
                    <div
                      key={group.jaula}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Jaula {formatJaula(group.jaula)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {group.items.map((item) => `${item.causa}: ${item.cantidad}`).join(" · ")}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-900">
                          {group.items.reduce((acc, item) => acc + item.cantidad, 0)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    Aún no hay registros para mostrar en el resumen.
                  </div>
                )}
              </div>
            </section>
            <ModalShell
              open={showNecropsyFullTable}
              title="Tabla completa"
              onClose={() => setShowNecropsyFullTable(false)}
            >
              {necropsyFullTable.rows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-700 text-white">
                        <th className="border border-slate-300 px-3 py-2 text-left font-semibold">
                          Jaula
                        </th>

                        {necropsyFullTable.causes.map((cause) => (
                          <th
                            key={cause}
                            className="border border-slate-300 px-3 py-2 text-center font-semibold whitespace-nowrap"
                          >
                            {cause}
                          </th>
                        ))}

                        <th className="border border-slate-300 px-3 py-2 text-center font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {necropsyFullTable.rows.map((row) => (
                        <tr key={row.jaula} className="bg-white">
                          <td className="border border-slate-300 px-3 py-2 font-medium text-slate-900">
                            {row.jaula}
                          </td>

                          {necropsyFullTable.causes.map((cause) => (
                            <td
                              key={`${row.jaula}-${cause}`}
                              className="border border-slate-300 px-3 py-2 text-center"
                            >
                              {row.values[cause] || 0}
                            </td>
                          ))}

                          <td className="border border-slate-300 px-3 py-2 text-center font-semibold">
                            {row.total}
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100">
                        <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-900">
                          TOTAL
                        </td>

                        {necropsyFullTable.causes.map((cause) => (
                          <td
                            key={`total-${cause}`}
                            className="border border-slate-300 px-3 py-2 text-center font-semibold"
                          >
                            {necropsyFullTable.totals[cause]}
                          </td>
                        ))}

                        <td className="border border-slate-300 px-3 py-2 text-center font-bold">
                          {necropsyFullTable.grandTotal}
                        </td>
                      </tr>

                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-900">
                          % TOTAL
                        </td>

                        {necropsyFullTable.causes.map((cause) => (
                          <td
                            key={`pct-${cause}`}
                            className="border border-slate-300 px-3 py-2 text-center"
                          >
                            {formatNecropsyTablePercent(necropsyFullTable.percentages[cause])}
                          </td>
                        ))}

                        <td className="border border-slate-300 px-3 py-2 text-center font-bold">
                          100%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No hay datos para mostrar en la tabla completa.
                </div>
              )}
            </ModalShell>
            {/* ================= BOTONES ================= */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={saveNecropsyRecord}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 text-sm font-semibold text-white"
              >
                Guardar
              </button>

              <button
                onClick={exportNecropsySheet}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
              >
                Exportar
              </button>
            </div>
          </div>
        )}

        {tab === "resumen" && (
          <div className="space-y-4">
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={downloadFinalReport}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-semibold text-white"
                >
                  <Printer className="h-4 w-4" />
                  Descargar informe final
                </button>
                      

              </div>
            </section>
            <section className="rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Informe integrado</p>
              <h2 className="mt-2 text-xl font-semibold">{selectedVisit.id}</h2>
              <p className="mt-2 text-sm text-white/80">
                {selectedVisit.centro} · {selectedModulo} · {selectedJaula}
              </p>
            </section>

            {/* <ContextSelectorsCard
              title="Contexto del informe"
              subtitle="El informe se arma con el centro, módulo y jaula actualmente seleccionados"
              selectedCentro={selectedCentro}
              selectedModulo={selectedModulo}
              selectedJaula={selectedJaula}
              centerOptions={necropsyCenterOptions}
              moduleOptions={necropsyModuleOptions}
              cageOptions={contextCageOptions}
              onCentroChange={handleCentroChange}
              onModuloChange={handleModuloChange}
              onJaulaChange={setSelectedJaula}
            /> */}

            <AccordionSection title="Visita" subtitle="Datos generales" defaultOpen>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Centro</p>
                  <p className="mt-1 font-semibold text-slate-900">{generatedReport.centro}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Empresa</p>
                  <p className="mt-1 font-semibold text-slate-900">{generatedReport.empresa}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Fecha y hora</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {generatedReport.fecha} · {generatedReport.hora}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Veterinario</p>
                  <p className="mt-1 font-semibold text-slate-900">{generatedReport.veterinario}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Módulo / Jaula</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {generatedReport.modulo} · {generatedReport.jaula}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Estado sanitario</p>
                  <div className="mt-1">
                    <StatusBadge value={generatedReport.estadoSanitario} />
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Tipo de visita</p>
                  <p className="mt-1 text-slate-900">{generatedReport.tipoVisita}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Objetivo</p>
                  <p className="mt-1 text-slate-900">{generatedReport.objetivoVisita}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Frecuencia</p>
                  <p className="mt-1 text-slate-900">{generatedReport.frecuenciaVisita}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Actividades</p>
                  <p className="mt-1 text-slate-900">{generatedReport.actividadesVisita}</p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Diagnóstico" subtitle="Resumen clínico y acciones">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Diagnóstico</p>
                    <p className="mt-1 font-semibold text-slate-900">{generatedReport.diagnostico}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Estado</p>
                    <p className="mt-1 font-semibold text-slate-900">{generatedReport.diagnosticoEstado}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Fuente diagnóstica</p>
                  <p className="mt-1 text-slate-900">{generatedReport.diagnosticoFuente}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Acciones</p>
                  <p className="mt-1 text-slate-900">{generatedReport.acciones}</p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Muestreo" subtitle="Contexto y selección">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Contexto</p>
                  <p className="mt-1 text-slate-900">{generatedReport.contextoMuestreo}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Categoría</p>
                    <p className="mt-1 text-slate-900">{generatedReport.categoriaMuestreo}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Objetivo</p>
                    <p className="mt-1 text-slate-900">{generatedReport.objetivoMuestreo}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Enfermedad</p>
                    <p className="mt-1 text-slate-900">{generatedReport.enfermedadMuestreo}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Tipo de muestra</p>
                    <p className="mt-1 text-slate-900">{generatedReport.tipoMuestra}</p>
                  </div>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Necropsia" subtitle="Tabla de necropsia al final">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Registro base</p>
                    <p className="mt-1 font-semibold text-slate-900">{generatedReport.necropsiaIntegrada.baseRegistro}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Causas registradas</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {generatedReport.necropsiaIntegrada.causasRegistradas.join(", ") || "Sin registros"}
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {generatedReport.necropsiaIntegrada.clasificacionSecundariaDetalle.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Jaula</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Causa</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-700">Cantidad</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {generatedReport.necropsiaIntegrada.clasificacionSecundariaDetalle.flatMap((group) =>
                            group.items.map((item) => (
                              <tr key={`${group.jaula}-${item.causa}`}>
                                <td className="px-4 py-3 text-slate-900">{group.jaula}</td>
                                <td className="px-4 py-3 text-slate-700">{item.causa}</td>
                                <td className="px-4 py-3 text-right font-semibold text-slate-900">{item.cantidad}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p>No hay registros de necropsia por jaula.</p>
                    </div>
                  )}
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Destinatarios y envío" subtitle="Selecciona varios destinatarios y envía">
              <div className="space-y-3">
                {availableRecipients.map((item) => {
                  const checked = selectedReportRecipients.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border p-4 transition",
                        checked ? "border-[#0F6CBD] bg-[#E8F3FC]" : "border-slate-200 bg-white"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleReportRecipient(item.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300"
                      />
                      <div className="min-w-0 flex-1 text-sm text-slate-700">
                        <p className="font-semibold text-slate-900">{item.nombre}</p>
                        <p>{item.cargo}</p>
                        <p className="text-slate-500">{item.centro} · {item.canal}</p>
                      </div>
                    </label>
                  );
                })}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={downloadFinalReport}
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700"
                  >
                    <Printer className="h-4 w-4" />
                    Descargar informe
                  </button>
                  <button
                    onClick={sendToTeams}
                    className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0F6CBD] text-sm font-semibold text-white"
                  >
                    <Send className="h-4 w-4" />
                    Enviar
                  </button>
                </div>
              </div>
            </AccordionSection>
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
