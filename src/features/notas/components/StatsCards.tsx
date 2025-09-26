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
      <div className="bg-education-green-50 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-education-green-700">Total Cursos</span>
          <BookOpen className="h-4 w-4 text-education-green-500" />
        </div>
        <div className="text-2xl font-bold text-education-green-700">{totalCursos}</div>
      </div>
      <div className="bg-digital-blue-50 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-digital-blue-700">Calificaciones</span>
          <CheckCircle className="h-4 w-4 text-education-green-500" />
        </div>
        <div className="text-2xl font-bold text-education-green-700">{calificaciones}</div>
      </div>
      <div className="bg-progress-yellow-50 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-progress-yellow-700">Pendientes</span>
          <Clock className="h-4 w-4 text-progress-yellow-500" />
        </div>
        <div className="text-2xl font-bold text-progress-yellow-700">{pendientes}</div>
      </div>
      <div className="bg-light-gray rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-digital-blue-700">Promedio General</span>
          <TrendingUp className="h-4 w-4 text-digital-blue-500" />
        </div>
        <div className="text-2xl font-bold text-digital-blue-700">{promedio}</div>
      </div>
    </div>
  );
}
