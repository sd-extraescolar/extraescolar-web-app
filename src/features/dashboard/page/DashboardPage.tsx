import { LoadingScreen } from "@/components/ui/loading-screen";
import { DashboardCards } from "../components/DashboardCards";
import { NotasBarChart } from "../components/NotasBarChart";
import { useDashboardData } from "../hooks/useDashboardData";

export const DashboardPage = () => {
  const { 
    promedioGlobal, 
    porcentajeAsistencia, 
    totalEstudiantes, 
    totalTareas, 
    notasRangos, 
    loading 
  } = useDashboardData();

  if (loading) {
    return (
      <LoadingScreen 
        title="Cargando dashboard..."
        subtitle="Obteniendo información del curso"
        spinnerSize="md"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general del curso seleccionado</p>
      </div>

      {/* Cards de resumen */}
      <DashboardCards
        promedioGlobal={promedioGlobal}
        porcentajeAsistencia={porcentajeAsistencia}
        totalEstudiantes={totalEstudiantes}
        totalTareas={totalTareas}
      />

      {/* Gráfico de barras de notas */}
      <NotasBarChart notasRangos={notasRangos} totalEstudiantes={totalEstudiantes} />
    </div>
  );
};