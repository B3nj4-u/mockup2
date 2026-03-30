import type {
  AutoReportRecipient,
  CageMortalityRecord,
  MedicalEvent,
  NecropsyRecord,
  Visit,
  VisitForm,
} from "./types";

export const STORAGE_KEYS = {
  visits: "mockup-visits-v4",
  selectedVisitId: "mockup-selected-visit-id-v4",
  clinicalState: "mockup-clinical-state-v4",
  historyFilters: "mockup-history-filters-v4",
  samplingFlow: "mockup-sampling-flow-v4",
  necropsyState: "mockup-necropsy-state-v4",
  diagnosisModuleState: "mockup-diagnosis-module-state-v1",
};

export const visitsSeed: Visit[] = [
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

export const alertsSeed = [
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

export const diagnosisOptions = ["PGD", "SRS", "HSMI", "Branquial", "Bacteriano", "Parasitológico", "Otras"];

export const actionOptions = [
  "Tomar muestras",
  "Aplicar tratamiento",
  "Emitir receta",
  "Reforzar monitoreo",
  "Despachar a laboratorio",
  "Revisar en 48 h",
];

export const visitTypeOptions = [
  "Programa Sanitario Específico",
  "Monitoreo de Rutina o Preventiva",
  "Sospecha Sanitaria o Brote Activo",
  "Supervisión o Auditoría Interna",
  "Toma de Muestras Específicas",
  "Inspección Regulatoria",
  "Evaluación Pre-Cosecha",
  "Solicitada por el Cliente",
];

export const visitObjectiveOptions = [
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

export const visitFrequencyOptions = [
  "Semanal",
  "Quincenal",
  "Mensual",
  "Bimensual",
  "Según calendario establecido",
  "Según política de la empresa",
  "A solicitud",
];

export const visitChartNoAxesCombinedOptions = [
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

export const visitSpecificProgramOptions = ["Programa SRS", "Programa ISA", "BKD", "IPN", "PD", "Otro"];

export const samplingCategoryOptions = [
  "Por Programa Sanitario",
  "Monitoreo de Rutina",
  "Sospecha o Brote Clínico",
  "Análisis Microbiológico y Parasitológico",
  "Muestra Ambiental",
  "Muestras Genéticas o Histopatologías",
  "Muestras para Auditoría Interna o requisitos de cliente",
];

export const samplingObjectiveOptions = [
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

export const samplingDiseaseOptions = [
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

export const samplingTypeOptions = [
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

export const samplingEnvironmentOptions = [
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

export const placeholderModules = [
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

export const defaultForm: VisitForm = {
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

export const mortalityPrimaryOptions = ["SCA", "DaF", "DEF", "Rez", "TC", "Otras"];

export const necropsyMotiveOptions: NecropsyRecord["motivo"][] = [
  "Rutina",
  "Sospecha",
  "Brote",
  "Seguimiento tratamiento",
];

export const necropsySeed: NecropsyRecord[] = [
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

export const medicalHistorySeed: MedicalEvent[] = [
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

export const mortalityDistributionSeed: CageMortalityRecord[] = [
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

export const recipientsSeed: Record<string, AutoReportRecipient> = {
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
