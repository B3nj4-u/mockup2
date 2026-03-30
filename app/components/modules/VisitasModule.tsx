import React from "react";
import { Plus } from "lucide-react";
import type { FilterKey, Visit } from "../../lib/types";

type VisitasModuleProps = {
  openCreateModal: () => void;
  filter: FilterKey;
  setFilter: (filter: FilterKey) => void;
  cn: (...classes: Array<string | false | undefined>) => string;
  SearchBox: React.ComponentType<{ value: string; onChange: (value: string) => void; onClear: () => void }>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filteredVisits: Visit[];
  VisitCard: React.ComponentType<{
    visit: Visit;
    onOpen: (visit: Visit) => void;
    onEdit: (visit: Visit) => void;
    onDelete: (visit: Visit) => void;
  }>;
  openVisit: (visit: Visit) => void;
  openEditModal: (visit: Visit) => void;
  deleteVisit: (visit: Visit) => void;
};

export default function VisitasModule(props: VisitasModuleProps) {
  const {
    openCreateModal,
    filter,
    setFilter,
    cn,
    SearchBox,
    search,
    setSearch,
    filteredVisits,
    VisitCard,
    openVisit,
    openEditModal,
    deleteVisit,
  } = props;

  return (
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
          {(["Todas", "Hoy", "Pendientes", "En progreso", "Completadas"] as const).map((item) => (
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
            <VisitCard key={visit.id} visit={visit} onOpen={openVisit} onEdit={openEditModal} onDelete={deleteVisit} />
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
  );
}
