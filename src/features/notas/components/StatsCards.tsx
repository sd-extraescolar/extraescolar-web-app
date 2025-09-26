import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalCursos: number;
  calificaciones: number;
  pendientes: number;
  promedio: number;
}

export function StatsCards({ totalCursos, calificaciones, pendientes, promedio }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  <div className="bg-education-green-400 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Entregas</span>
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{totalCursos}</div>
      </div>
  <div className="bg-digital-blue-400 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Pendientes</span>
          <CheckCircle className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{calificaciones}</div>
      </div>
  <div className="bg-progress-yellow-400 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Promedio</span>
          <Clock className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{pendientes}</div>
      </div>
  <div className="bg-education-green-600 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Aprobación</span>
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{promedio}%</div>
      </div>
    </div>
  );
}
