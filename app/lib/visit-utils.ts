import type { ElementType } from "react";
import type { ChecklistItem, StoredChecklistItem, Visit, VisitForm, VisitStatus } from "./types";

export function normalizeVisit(raw: Partial<Visit> | null | undefined): Visit {
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

export function restoreChecklist(
  input: unknown,
  defaultChecklist: ChecklistItem[],
  checklistIconMap: Record<string, ElementType>,
  fallbackIcon: ElementType
): ChecklistItem[] {
  if (!Array.isArray(input)) return defaultChecklist;

  return input.map((item) => {
    const row = item as Partial<StoredChecklistItem>;
    return {
      label: row.label ?? "",
      done: Boolean(row.done),
      icon: checklistIconMap[row.label ?? ""] ?? fallbackIcon,
    };
  });
}

export function toForm(visit: Visit): VisitForm {
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

export function createVisitFromForm(
  form: VisitForm,
  existingId?: string,
  currentState?: VisitStatus
): Visit {
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

export function matchesVisit(visit: Visit, query: string) {
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
