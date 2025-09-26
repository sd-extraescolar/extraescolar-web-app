import { useAllGoogleSubmissions } from '@/features/notas/components/useAllGoogleSubmissions';
import { useAttendance } from '@/features/presencialidad/hooks/useAttendance';
import { useAuth } from '@/hooks/useAuth';
import { useGoogleCourseWork } from '@/hooks/useGoogleCourseWork';
import { useGoogleRoster } from '@/hooks/useGoogleRoster';

export function useDashboardData() {
  const { selectedCourse } = useAuth();
  
  // Obtener tareas del curso
  const { courseWork: assignments, loading: loadingAssignments } = useGoogleCourseWork(selectedCourse?.id);
  
  // Obtener estudiantes del curso
  const { students: rosterStudents, loading: loadingRoster } = useGoogleRoster(selectedCourse?.id);
  
  // Obtener todas las entregas
  const { allSubmissions, loading: loadingSubmissions } = useAllGoogleSubmissions(selectedCourse?.id, assignments);
  
  // Obtener datos de asistencia
  const { calendarAttendanceData } = useAttendance();
  
  // Calcular estadísticas
  const totalEstudiantes = rosterStudents.length;
  const totalTareas = assignments.length;
  
  // Calcular promedio global (convertir a escala 0-100)
  const todasLasCalificaciones = Object.values(allSubmissions || {}).flatMap(submissions => 
    submissions
      .filter(s => s.assignedGrade !== undefined && s.assignedGrade !== null)
      .map(s => {
        const assignment = assignments.find(a => allSubmissions[a.id]?.includes(s));
        if (assignment?.maxPoints && assignment.maxPoints > 0) {
          return Math.round((s.assignedGrade! / assignment.maxPoints) * 100);
        }
        return 0;
      })
  );
  
  const promedioGlobal = todasLasCalificaciones.length > 0 
    ? Number((todasLasCalificaciones.reduce((a, b) => (a || 0) + (b || 0), 0) / todasLasCalificaciones.length).toFixed(2))
    : 0;
  
  // Calcular porcentaje de asistencia
  const totalDias = Object.keys(calendarAttendanceData).length;
  const diasConAsistencia = Object.values(calendarAttendanceData).filter(data => data.present > 0).length;
  const porcentajeAsistencia = totalDias > 0 ? Math.round((diasConAsistencia / totalDias) * 100) : 0;
  
  // Gráfico de barras de notas por rangos
  const notasRangos = (() => {
    const rangos = [
      { rango: '0-5', min: 0, max: 5, count: 0 },
      { rango: '6-10', min: 6, max: 10, count: 0 },
      { rango: '11-15', min: 11, max: 15, count: 0 },
      { rango: '16-20', min: 16, max: 20, count: 0 },
      { rango: '21-25', min: 21, max: 25, count: 0 },
      { rango: '26-30', min: 26, max: 30, count: 0 },
      { rango: '31-35', min: 31, max: 35, count: 0 },
      { rango: '36-40', min: 36, max: 40, count: 0 },
      { rango: '41-45', min: 41, max: 45, count: 0 },
      { rango: '46-50', min: 46, max: 50, count: 0 },
      { rango: '51-55', min: 51, max: 55, count: 0 },
      { rango: '56-60', min: 56, max: 60, count: 0 },
      { rango: '61-65', min: 61, max: 65, count: 0 },
      { rango: '66-70', min: 66, max: 70, count: 0 },
      { rango: '71-75', min: 71, max: 75, count: 0 },
      { rango: '76-80', min: 76, max: 80, count: 0 },
      { rango: '81-85', min: 81, max: 85, count: 0 },
      { rango: '86-90', min: 86, max: 90, count: 0 },
      { rango: '91-95', min: 91, max: 95, count: 0 },
      { rango: '96-100', min: 96, max: 100, count: 0 },
    ];

    // Contar estudiantes en cada rango
    Object.values(allSubmissions || {}).flatMap(submissions => 
      submissions
        .filter(s => s.assignedGrade !== undefined && s.assignedGrade !== null)
        .map(s => {
          const assignment = assignments.find(a => allSubmissions[a.id]?.includes(s));
          if (assignment?.maxPoints && assignment.maxPoints > 0) {
            return Math.round((s.assignedGrade! / assignment.maxPoints) * 100);
          }
          return 0;
        })
    ).forEach(nota => {
      const rango = rangos.find(r => nota >= r.min && nota <= r.max);
      if (rango) {
        rango.count++;
      }
    });

    return rangos;
  })();

  const loading = loadingAssignments || loadingRoster || loadingSubmissions;

  return {
    // Datos del dashboard
    promedioGlobal,
    porcentajeAsistencia,
    totalEstudiantes,
    totalTareas,
    notasRangos,
    
    // Estado de carga
    loading,
    
    // Datos adicionales
    selectedCourse,
    assignments,
    rosterStudents,
    allSubmissions,
    calendarAttendanceData,
  };
}
