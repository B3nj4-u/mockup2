"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  ClipboardList,
  Activity,
  Syringe,
  FlaskConical,
  Stethoscope,
  ShieldCheck,
  Bell,
  Search,
  MapPin,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Download,
  Send,
  UserRound,
  Thermometer,
  Camera,
  AudioLines,
  FileText,
  ChevronRight,
  BadgeCheck,
  Filter,
  BarChart3,
  Route,
  Microscope,
  ArrowUpRight,
  Droplets,
  Pill,
  Menu,
  X,
  Home,
  ClipboardCheck,
  WifiOff,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

const visitsSeed = [
  {
    id: "VST-24031",
    centro: "Centro Salmonero Aysén Norte",
    empresa: "AquaChile",
    fecha: "2026-03-20",
    hora: "08:30",
    veterinario: "Pedro Ulloa",
    region: "Aysén",
    estado: "Pendiente",
    prioridad: "Alta",
    biomasa: 1240,
    mortalidad: 1.8,
    temperatura: 11.4,
    oxigeno: 8.2,
    hallazgo: "Lesiones branquiales en evaluación",
    tareas: 4,
    muestrasPendientes: 3,
  },
  {
    id: "VST-24032",
    centro: "Centro Chiloé Canal Sur",
    empresa: "Cermaq",
    fecha: "2026-03-21",
    hora: "10:00",
    veterinario: "Catalina Ruiz",
    region: "Los Lagos",
    estado: "En progreso",
    prioridad: "Media",
    biomasa: 980,
    mortalidad: 0.9,
    temperatura: 12.1,
    oxigeno: 7.9,
    hallazgo: "Control post vacunación",
    tareas: 2,
    muestrasPendientes: 1,
  },
  {
    id: "VST-24033",
    centro: "Centro Magallanes Este",
    empresa: "Multi X",
    fecha: "2026-03-22",
    hora: "14:00",
    veterinario: "Daniel Pacheco",
    region: "Magallanes",
    estado: "Completada",
    prioridad: "Alta",
    biomasa: 1560,
    mortalidad: 2.1,
    temperatura: 9.6,
    oxigeno: 8.6,
    hallazgo: "Necropsia con sospecha bacteriana",
    tareas: 0,
    muestrasPendientes: 0,
  },
  {
    id: "VST-24034",
    centro: "Centro Fiordo Azul",
    empresa: "Australis",
    fecha: "2026-03-23",
    hora: "09:15",
    veterinario: "Ignacia Soto",
    region: "Los Lagos",
    estado: "Pendiente",
    prioridad: "Baja",
    biomasa: 860,
    mortalidad: 0.6,
    temperatura: 11.8,
    oxigeno: 8.0,
    hallazgo: "Chequeo de rutina",
    tareas: 1,
    muestrasPendientes: 0,
  },
];

const trendData = [
  { mes: "Oct", visitas: 42, mortalidad: 1.2, muestras: 26 },
  { mes: "Nov", visitas: 51, mortalidad: 1.5, muestras: 31 },
  { mes: "Dic", visitas: 48, mortalidad: 1.4, muestras: 28 },
  { mes: "Ene", visitas: 63, mortalidad: 1.9, muestras: 39 },
  { mes: "Feb", visitas: 70, mortalidad: 2.1, muestras: 42 },
  { mes: "Mar", visitas: 57, mortalidad: 1.7, muestras: 34 },
];

const weeklyData = [
  { semana: "Sem 10", cerradas: 9, alertas: 5 },
  { semana: "Sem 11", cerradas: 11, alertas: 4 },
  { semana: "Sem 12", cerradas: 8, alertas: 7 },
  { semana: "Sem 13", cerradas: 13, alertas: 3 },
  { semana: "Sem 14", cerradas: 12, alertas: 2 },
];

const alerts = [
  {
    titulo: "Mortalidad sobre umbral",
    descripcion: "Aysén Norte registra 1.8% hoy. Revisar jaulas priorizadas.",
    severidad: "Alta",
    area: "Sanidad",
  },
  {
    titulo: "Muestras por despachar",
    descripcion: "3 muestras deben salir hoy antes de las 17:00.",
    severidad: "Media",
    area: "Laboratorio",
  },
  {
    titulo: "Certificado por vencer",
    descripcion: "Fiordo Azul requiere renovación dentro de 48 horas.",
    severidad: "Baja",
    area: "Documentos",
  },
];

const quickActions = [
  { label: "Iniciar visita", icon: ClipboardCheck },
  { label: "Tomar foto", icon: Camera },
  { label: "Dictar nota", icon: AudioLines },
  { label: "Registrar muestra", icon: FlaskConical },
];

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition border text-left ${
        active
          ? "bg-[#0F6CBD] text-white border-[#0F6CBD] shadow-lg"
          : "bg-white text-slate-700 border-slate-200 hover:border-[#0F6CBD]/40 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    Pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    "En progreso": "bg-sky-50 text-sky-700 border-sky-200",
    Completada: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Alta: "bg-rose-50 text-rose-700 border-rose-200",
    Media: "bg-orange-50 text-orange-700 border-orange-200",
    Baja: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium ${map[value] || map.Baja}`}
    >
      {value}
    </span>
  );
}

function SmallMetric({
  label,
  value,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  icon: any;
  tone?: "blue" | "amber" | "emerald" | "slate";
}) {
  const tones = {
    blue: "bg-[#E8F3FC] text-[#0F6CBD]",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function TopHeader({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="md:hidden h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <div className="grid grid-cols-2 gap-0.5 h-8 w-8 rounded-lg overflow-hidden border border-slate-200">
              <div className="bg-[#F25022]" />
              <div className="bg-[#7FBA00]" />
              <div className="bg-[#00A4EF]" />
              <div className="bg-[#FFB900]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Microsoft ecosystem
              </p>
              <h1 className="text-sm md:text-base font-semibold text-slate-900 truncate">
                Sistema Veterinario 365
              </h1>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
          <div className="w-full relative">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
              placeholder="Buscar centro, visita, muestra o reporte"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="relative h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center bg-white">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
              3
            </span>
          </button>

          <div className="h-10 pl-2 pr-3 rounded-xl border border-slate-200 bg-white flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#0F6CBD] text-white flex items-center justify-center text-xs font-semibold">
              DP
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs text-slate-900 font-medium leading-none">Pedro Ulloa</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-none">Veterinario</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [view, setView] = useState("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visits, setVisits] = useState(visitsSeed);
  const [selectedVisit, setSelectedVisit] = useState(visitsSeed[0]);
  const [form, setForm] = useState({
    observacion:
      "Peces con nado errático, leve palidez branquial y aumento de mortalidad respecto de la semana anterior.",
    diagnostico: "Sospecha de compromiso branquial. Confirmar con laboratorio.",
    accion: "Aumentar monitoreo por jaula, reforzar oxigenación y tomar muestras dirigidas.",
    muestras: "12 histopatológicas, 8 bacteriológicas, 4 PCR",
    proximoPaso: "Revisar evolución en 48 horas y despachar muestras hoy.",
  });

  const stats = useMemo(() => {
    const total = visits.length;
    const completadas = visits.filter((v) => v.estado === "Completada").length;
    const pendientes = visits.filter((v) => v.estado === "Pendiente").length;
    const progreso = visits.filter((v) => v.estado === "En progreso").length;

    return { total, completadas, pendientes, progreso };
  }, [visits]);

  const startVisit = (visit: (typeof visitsSeed)[number]) => {
    setSelectedVisit({ ...visit, estado: "En progreso" });
    setVisits((prev) =>
      prev.map((v) => (v.id === visit.id ? { ...v, estado: "En progreso" } : v))
    );
    setView("registro");
  };

  const finishVisit = () => {
    setVisits((prev) =>
      prev.map((v) => (v.id === selectedVisit.id ? { ...v, estado: "Completada" } : v))
    );
    setSelectedVisit((prev) => ({ ...prev, estado: "Completada" }));
    setView("resumen");
  };

  const navItems = [
    { key: "inicio", label: "Mi día", icon: Home },
    { key: "visitas", label: "Mis visitas", icon: Calendar },
    { key: "registro", label: "Registro", icon: ClipboardList },
    { key: "resumen", label: "Resumen", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900">
      <TopHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex">
        <aside
          className={`fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-[288px] bg-[#F8FAFC] border-r border-slate-200 p-4 transition-all duration-200 ${
            mobileOpen ? "left-0" : "-left-[288px] md:left-0"
          }`}
        >
          <div className="space-y-2">
            {navItems.map((item) => (
              <SidebarItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                active={view === item.key}
                onClick={() => {
                  setView(item.key);
                  setMobileOpen(false);
                }}
              />
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Trabajo sin conexión</p>
                <p className="text-xs text-slate-500 mt-1">Última sincronización hace 8 min</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <WifiOff className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-3 text-sm text-slate-600">
              Puedes registrar hallazgos, fotos y muestras aunque no tengas señal.
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#0F6CBD] to-[#115EA3] p-4 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.18em] text-white/75">Siguiente visita</p>
            <h3 className="mt-2 text-lg font-semibold">{selectedVisit.centro}</h3>
            <div className="mt-4 space-y-2 text-sm text-white/90">
              <div className="flex items-center justify-between">
                <span>Hora</span>
                <span className="font-semibold">{selectedVisit.hora}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prioridad</span>
                <span className="font-semibold">{selectedVisit.prioridad}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Región</span>
                <span className="font-semibold">{selectedVisit.region}</span>
              </div>
            </div>
            <button
              onClick={() => startVisit(selectedVisit)}
              className="mt-4 w-full h-11 rounded-2xl bg-white text-[#0F6CBD] font-medium"
            >
              Abrir visita
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 xl:p-8 md:ml-0 w-full">
          {view === "inicio" && (
            <div className="space-y-6">
              <div className="rounded-[28px] bg-gradient-to-r from-[#0F6CBD] to-[#115EA3] text-white p-6 md:p-8 shadow-xl">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                  <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/70">Mi jornada</p>
                    <h2 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">
                      Todo lo que necesitas para trabajar en terreno, rápido y sin escribir de más.
                    </h2>
                    <p className="mt-4 text-sm md:text-base text-white/85 max-w-2xl">
                      Agenda del día, alertas, registro clínico, fotos, dictado y generación
                      automática del informe dentro del ecosistema Microsoft.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => startVisit(visits[0])}
                        className="h-11 px-4 rounded-2xl bg-white text-[#0F6CBD] font-medium shadow-sm inline-flex items-center gap-2"
                      >
                        <ClipboardList className="h-4 w-4" />
                        Iniciar visita
                      </button>
                      <button className="h-11 px-4 rounded-2xl border border-white/25 bg-white/10 text-white font-medium inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva nota rápida
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 min-w-[300px]">
                    <div className="rounded-3xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
                      <p className="text-sm text-white/70">Visitas hoy</p>
                      <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
                      <p className="text-xs text-white/70 mt-1">2 pendientes, 1 en curso</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
                      <p className="text-sm text-white/70">Alertas</p>
                      <p className="mt-2 text-3xl font-semibold">3</p>
                      <p className="text-xs text-white/70 mt-1">1 alta prioridad</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
                      <p className="text-sm text-white/70">Muestras hoy</p>
                      <p className="mt-2 text-3xl font-semibold">8</p>
                      <p className="text-xs text-white/70 mt-1">3 por despachar</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
                      <p className="text-sm text-white/70">Informes listos</p>
                      <p className="mt-2 text-3xl font-semibold">2</p>
                      <p className="text-xs text-white/70 mt-1">PDF y Teams</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((item) => (
                  <button
                    key={item.label}
                    className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm text-left hover:border-[#0F6CBD]/40 transition"
                  >
                    <div className="h-11 w-11 rounded-2xl bg-[#E8F3FC] text-[#0F6CBD] flex items-center justify-center">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">Acceso rápido</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <SmallMetric label="Pendientes" value={stats.pendientes} icon={Clock3} tone="amber" />
                <SmallMetric
                  label="En progreso"
                  value={stats.progreso}
                  icon={Activity}
                  tone="blue"
                />
                <SmallMetric
                  label="Completadas"
                  value={stats.completadas}
                  icon={CheckCircle2}
                  tone="emerald"
                />
                <SmallMetric label="Con señal débil" value="2 centros" icon={WifiOff} tone="slate" />
              </div>

              <div className="grid grid-cols-1 2xl:grid-cols-[1.25fr_0.75fr] gap-6">
                <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
                  <SectionTitle
                    title="Mis visitas"
                    subtitle="Lo importante primero."
                    action={
                      <button className="h-10 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 inline-flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Hoy
                      </button>
                    }
                  />

                  <div className="space-y-3">
                    {visits.map((visit) => (
                      <div
                        key={visit.id}
                        className="rounded-2xl border border-slate-200 p-4 bg-white hover:border-[#0F6CBD]/40 transition"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900">{visit.centro}</p>
                              <StatusBadge value={visit.estado} />
                              <StatusBadge value={visit.prioridad} />
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {visit.region}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-4 w-4" /> {visit.fecha} · {visit.hora}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <UserRound className="h-4 w-4" /> {visit.veterinario}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{visit.hallazgo}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button className="h-10 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700">
                              Ver ficha
                            </button>
                            <button
                              onClick={() => startVisit(visit)}
                              className="h-10 px-4 rounded-2xl bg-[#0F6CBD] text-white text-sm font-medium inline-flex items-center gap-2"
                            >
                              Abrir
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
                    <SectionTitle title="Alertas del día" subtitle="Para actuar rápido." />
                    <div className="space-y-3">
                      {alerts.map((alert) => (
                        <div
                          key={alert.titulo}
                          className="rounded-2xl border border-slate-200 p-4 bg-slate-50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-slate-900">{alert.titulo}</p>
                              <p className="text-sm text-slate-500 mt-1">{alert.descripcion}</p>
                            </div>
                            <StatusBadge value={alert.severidad} />
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                            <span>{alert.area}</span>
                            <button className="text-[#0F6CBD] font-medium inline-flex items-center gap-1">
                              Ver <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
                    <SectionTitle title="Actividad" subtitle="Últimas semanas" />
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0F6CBD" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#0F6CBD" stopOpacity={0.04} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="#E5E7EB" vertical={false} />
                          <XAxis
                            dataKey="mes"
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="visitas"
                            stroke="#0F6CBD"
                            fill="url(#colorVisitas)"
                            strokeWidth={3}
                          />
                          <Line type="monotone" dataKey="mortalidad" stroke="#D13438" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "visitas" && (
            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Mis visitas</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Agenda simple, clara y lista para terreno.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="h-11 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 inline-flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    Ver ruta
                  </button>
                  <button className="h-11 px-4 rounded-2xl bg-[#0F6CBD] text-white text-sm font-medium inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Nueva visita
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 2xl:grid-cols-[1.2fr_0.8fr] gap-6">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
                  <SectionTitle title="Agenda" subtitle="Centros, prioridades y pendientes." />
                  <div className="grid gap-3">
                    {visits.map((visit) => (
                      <div
                        key={visit.id}
                        className="rounded-2xl border border-slate-200 p-4 hover:border-[#0F6CBD]/40 transition bg-white"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900">{visit.centro}</p>
                              <StatusBadge value={visit.estado} />
                              <StatusBadge value={visit.prioridad} />
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {visit.region}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-4 w-4" /> {visit.fecha} · {visit.hora}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <UserRound className="h-4 w-4" /> {visit.veterinario}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                              <span className="inline-flex rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-medium">
                                {visit.tareas} tareas
                              </span>
                              <span className="inline-flex rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs font-medium">
                                {visit.muestrasPendientes} muestras pendientes
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button className="h-10 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700">
                              Ver ficha
                            </button>
                            <button
                              onClick={() => startVisit(visit)}
                              className="h-10 px-4 rounded-2xl bg-[#0F6CBD] text-white text-sm font-medium"
                            >
                              Iniciar registro
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
                    <SectionTitle title="Visitas cerradas" subtitle="Últimas semanas" />
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                          <CartesianGrid stroke="#E5E7EB" vertical={false} />
                          <XAxis
                            dataKey="semana"
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip />
                          <Bar dataKey="cerradas" fill="#0F6CBD" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
                    <SectionTitle title="Ruta sugerida" subtitle="Menos vueltas, más tiempo en terreno." />
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-sky-100 via-white to-slate-100 border border-slate-200 p-4 relative overflow-hidden">
                        <div
                          className="absolute inset-0 opacity-60"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 20% 20%, rgba(15,108,189,0.12), transparent 24%), radial-gradient(circle at 80% 65%, rgba(17,94,163,0.12), transparent 24%)",
                          }}
                        />
                        <div className="absolute left-[18%] top-[24%] h-4 w-4 rounded-full bg-[#0F6CBD] border-4 border-white shadow" />
                        <div className="absolute left-[52%] top-[45%] h-4 w-4 rounded-full bg-[#0F6CBD] border-4 border-white shadow" />
                        <div className="absolute left-[70%] top-[64%] h-4 w-4 rounded-full bg-[#D13438] border-4 border-white shadow" />
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M18,24 C28,28 40,34 52,45 C59,53 66,58 70,64"
                            fill="none"
                            stroke="#0F6CBD"
                            strokeWidth="2.2"
                            strokeDasharray="4 3"
                          />
                        </svg>
                        <div className="absolute right-4 bottom-4 rounded-2xl bg-white/90 backdrop-blur px-3 py-2 border border-slate-200 text-xs text-slate-600 shadow-sm">
                          3 centros · 128 km · 5h 20m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "registro" && (
            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-semibold text-slate-900">Registro de visita</h2>
                    <StatusBadge value={selectedVisit.estado} />
                    <StatusBadge value={selectedVisit.prioridad} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedVisit.centro} · {selectedVisit.empresa} · {selectedVisit.fecha}{" "}
                    {selectedVisit.hora}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="h-11 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 inline-flex items-center gap-2">
                    <AudioLines className="h-4 w-4" />
                    Dictar
                  </button>
                  <button className="h-11 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 inline-flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Foto
                  </button>
                  <button
                    onClick={finishVisit}
                    className="h-11 px-4 rounded-2xl bg-[#0F6CBD] text-white text-sm font-medium inline-flex items-center gap-2"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Finalizar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 2xl:grid-cols-[1.15fr_0.85fr] gap-6">
                <div className="space-y-6">
                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
                    <SectionTitle title="Contexto rápido" subtitle="Lo esencial del centro." />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <SmallMetric
                        label="Biomasa"
                        value={`${selectedVisit.biomasa} ton`}
                        icon={Activity}
                        tone="blue"
                      />
                      <SmallMetric
                        label="Mortalidad"
                        value={`${selectedVisit.mortalidad}%`}
                        icon={AlertTriangle}
                        tone="amber"
                      />
                      <SmallMetric
                        label="Temperatura"
                        value={`${selectedVisit.temperatura} °C`}
                        icon={Thermometer}
                        tone="slate"
                      />
                      <SmallMetric
                        label="Oxígeno"
                        value={`${selectedVisit.oxigeno} mg/L`}
                        icon={Droplets}
                        tone="emerald"
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 space-y-5">
                    <SectionTitle
                      title="Registro clínico"
                      subtitle="Menos texto, más captura útil."
                    />

                    <div>
                      <label className="text-sm font-medium text-slate-700">Observación</label>
                      <textarea
                        value={form.observacion}
                        onChange={(e) => setForm({ ...form, observacion: e.target.value })}
                        className="mt-2 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                        placeholder="Describe lo observado..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Diagnóstico presuntivo
                        </label>
                        <textarea
                          value={form.diagnostico}
                          onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
                          className="mt-2 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                          placeholder="Escribe o dicta..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">
                          Acción recomendada
                        </label>
                        <textarea
                          value={form.accion}
                          onChange={(e) => setForm({ ...form, accion: e.target.value })}
                          className="mt-2 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                          placeholder="Tratamiento, monitoreo o siguiente paso..."
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700">Muestras</label>
                        <input
                          value={form.muestras}
                          onChange={(e) => setForm({ ...form, muestras: e.target.value })}
                          className="mt-2 w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                          placeholder="Cantidad o tipo de muestra"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-700">Próximo paso</label>
                        <input
                          value={form.proximoPaso}
                          onChange={(e) => setForm({ ...form, proximoPaso: e.target.value })}
                          className="mt-2 w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#0F6CBD] focus:bg-white"
                          placeholder="Seguimiento o envío"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { icon: Stethoscope, label: "Evaluación" },
                        { icon: Microscope, label: "Necropsia" },
                        { icon: FlaskConical, label: "Muestreo" },
                        { icon: Syringe, label: "Vacuna" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 hover:border-[#0F6CBD]/40 transition"
                        >
                          <div className="mx-auto h-10 w-10 rounded-xl bg-[#E8F3FC] text-[#0F6CBD] flex items-center justify-center">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <p className="mt-3">{item.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
                    <SectionTitle title="Checklist" subtitle="Marca lo que ya hiciste." />
                    <div className="space-y-3">
                      {[
                        [Stethoscope, "Evaluación clínica", true],
                        [Microscope, "Necropsia", true],
                        [FlaskConical, "Muestreo", true],
                        [Syringe, "Vacunación", false],
                        [Pill, "Tratamiento", true],
                        [ShieldCheck, "Documentos", true],
                      ].map(([Icon, label, done]: any) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0F6CBD]">
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{label}</span>
                          </div>
                          {done ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Clock3 className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
                    <SectionTitle title="Tendencia del centro" subtitle="Apoyo para decidir." />
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid stroke="#E5E7EB" vertical={false} />
                          <XAxis
                            dataKey="mes"
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="muestras"
                            stroke="#0F6CBD"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#0F172A] text-white shadow-sm p-5 md:p-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50">Automático</p>
                    <h3 className="mt-2 text-lg font-semibold">Al cerrar la visita</h3>
                    <div className="mt-4 space-y-3 text-sm text-white/80">
                      <p>1. Guarda el registro</p>
                      <p>2. Genera el PDF</p>
                      <p>3. Envía aviso por Teams</p>
                      <p>4. Actualiza Power BI</p>
                      <p>5. Respalda en SharePoint</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "resumen" && (
            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Resumen de visita</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Listo para compartir y exportar.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="h-11 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 inline-flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    PDF
                  </button>
                  <button className="h-11 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 inline-flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Teams
                  </button>
                  <button className="h-11 px-4 rounded-2xl bg-[#0F6CBD] text-white text-sm font-medium inline-flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Power BI
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 2xl:grid-cols-[1.15fr_0.85fr] gap-6">
                <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Visita cerrada
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                        {selectedVisit.centro}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        ID {selectedVisit.id} · {selectedVisit.empresa} · {selectedVisit.region}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50 text-right">
                      <p className="text-xs text-slate-500">Estado</p>
                      <p className="text-sm font-semibold text-emerald-700 mt-1">Listo</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6 text-sm">
                    <div>
                      <p className="text-slate-500 font-medium">Observación</p>
                      <p className="mt-2 text-slate-700 leading-7">{form.observacion}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 font-medium">Diagnóstico</p>
                      <p className="mt-2 text-slate-700 leading-7">{form.diagnostico}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 font-medium">Acción</p>
                      <p className="mt-2 text-slate-700 leading-7">{form.accion}</p>
                    </div>

                    <div>
                      <p className="text-slate-500 font-medium">Muestras</p>
                      <p className="mt-2 text-slate-700 leading-7">{form.muestras}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-700">Próximo paso</p>
                    <p className="mt-2 text-sm text-slate-600 leading-7">{form.proximoPaso}</p>
                  </div>

                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    {[
                      ["Veterinario", "Pedro Ulloa", CheckCircle2],
                      ["PDF", "Generado", FileText],
                      ["Power BI", "Actualizado", BarChart3],
                    ].map(([label, value, Icon]: any) => (
                      <div key={label} className="rounded-2xl border border-slate-200 p-4 bg-white">
                        <div className="h-10 w-10 rounded-xl bg-[#E8F3FC] text-[#0F6CBD] flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-3 text-sm text-slate-500">{label}</p>
                        <p className="mt-1 font-semibold text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
                    <SectionTitle title="Acciones realizadas" subtitle="Resumen rápido" />
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Necropsia", value: 8 },
                            { name: "Muestreo", value: 12 },
                            { name: "Trat.", value: 6 },
                            { name: "Docs", value: 9 },
                          ]}
                        >
                          <CartesianGrid stroke="#E5E7EB" vertical={false} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: "#64748B" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip />
                          <Bar dataKey="value" fill="#0F6CBD" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 md:p-6">
                    <SectionTitle title="Se publica en" subtitle="Todo automático" />
                    <div className="space-y-3 text-sm">
                      {[
                        ["SharePoint", "Respaldo documental"],
                        ["Teams", "Aviso al equipo"],
                        ["Outlook", "Envío a responsables"],
                        ["Power BI", "Indicadores"],
                        ["Dataverse", "Registro principal"],
                      ].map(([title, desc]) => (
                        <div
                          key={title}
                          className="rounded-2xl border border-slate-200 p-4 bg-slate-50"
                        >
                          <p className="font-medium text-slate-800">{title}</p>
                          <p className="text-slate-500 mt-1">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}