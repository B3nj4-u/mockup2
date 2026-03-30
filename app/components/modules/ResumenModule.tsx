import React from "react";
import { Download, Send } from "lucide-react";
import type { Visit } from "../../lib/types";

type ResumenModuleProps = {
  selectedVisit: Visit;
  selectedModulo: string;
  selectedJaula: string;
  AccordionSection: React.ComponentType<{
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }>;
  generatedReport: {
    tipoVisita: string;
    objetivoVisita: string;
    categoriaMuestreo: string;
    tipoMuestra: string;
    necropsiaIntegrada: {
      diagnosticoPresuntivo: string;
      clasificacionPrimaria: string;
      clasificacionSecundaria: string;
    };
  };
  aggregatedByCause: Array<{ causa: string; total: number }>;
  recipient: { nombre: string; cargo: string; canal: string };
  exportSummary: () => void;
  sendToTeams: () => void;
};

export default function ResumenModule(props: ResumenModuleProps) {
  const {
    selectedVisit,
    selectedModulo,
    selectedJaula,
    AccordionSection,
    generatedReport,
    aggregatedByCause,
    recipient,
    exportSummary,
    sendToTeams,
  } = props;

  return (
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
              {generatedReport.necropsiaIntegrada.clasificacionPrimaria} / {generatedReport.necropsiaIntegrada.clasificacionSecundaria}
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
  );
}
