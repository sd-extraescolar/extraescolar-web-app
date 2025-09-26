import { BookOpen, TrendingUp, Users } from "lucide-react";

interface DashboardCardsProps {
  promedioGlobal: number;
  porcentajeAsistencia: number;
  totalEstudiantes: number;
  totalTareas: number;
}

export function DashboardCards({ 
  promedioGlobal, 
  porcentajeAsistencia, 
  totalEstudiantes, 
  totalTareas 
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-blue-500 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Promedio Global</span>
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{promedioGlobal}</div>
      </div>
      
      <div className="bg-green-500 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Asistencia</span>
          <Users className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{porcentajeAsistencia}%</div>
      </div>
      
      <div className="bg-purple-500 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Estudiantes</span>
          <Users className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{totalEstudiantes}</div>
      </div>
      
      <div className="bg-orange-500 rounded-xl p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm font-medium text-white">Tareas</span>
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <div className="text-2xl font-bold text-white">{totalTareas}</div>
      </div>
    </div>
  );
}
