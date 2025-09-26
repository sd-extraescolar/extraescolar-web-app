import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalEntregas: number;
  totalPendientes: number;
  promedio: number;
  porcentajeAprobados: number;
}

export function StatsCards({ totalEntregas, totalPendientes, promedio, porcentajeAprobados }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-green-500 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Entregas</span>
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{totalEntregas}</div>
      </div>
      <div className="bg-yellow-400 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Pendientes</span>
          <CheckCircle className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{totalPendientes}</div>
      </div>
      <div className="bg-blue-500 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Promedio</span>
          <Clock className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{promedio}</div>
      </div>
      <div className="bg-purple-500 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Aprobación</span>
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{porcentajeAprobados}%</div>
      </div>
    </div>
  );
}
