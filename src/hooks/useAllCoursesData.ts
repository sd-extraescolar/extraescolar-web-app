import { useAllGoogleSubmissions } from '@/features/notas/components/useAllGoogleSubmissions';
import { useAuth } from './useAuth';
import { useGoogleCourseWork } from './useGoogleCourseWork';
import { useGoogleRoster } from './useGoogleRoster';

export function useAllCoursesData() {
  const { courses } = useAuth();
  
  // Obtener datos de todos los cursos
  const allCoursesData = courses.map(course => {
    const { courseWork: assignments } = useGoogleCourseWork(course.id);
    const { students: rosterStudents } = useGoogleRoster(course.id);
    const { allSubmissions } = useAllGoogleSubmissions(course.id, assignments);
    
    return {
      course,
      assignments,
      rosterStudents,
      allSubmissions,
    };
  });

  // Calcular estadísticas por curso
  const barCelulaData = allCoursesData.map(({ course, assignments, allSubmissions, rosterStudents }) => {
    let corregida = 0;
    let entregada = 0;
    let comenzada = 0;
    let reclamada = 0;

    assignments.forEach(assignment => {
      const submissions = allSubmissions[assignment.id] || [];
      
      submissions.forEach(submission => {
        const student = rosterStudents.find(s => s.id === submission.userId);
        if (!student) return;

        // Determinar estado basado en submission y grade
        if (submission.state === 'TURNED_IN' || submission.state === 'RETURNED' || submission.state === 'CREATED') {
          if (submission.assignedGrade !== undefined && submission.assignedGrade !== null) {
            corregida++;
          } else {
            entregada++;
          }
        } else {
          comenzada++;
        }
      });
    });

    return {
      name: course.name,
      corregida,
      entregada,
      comenzada,
      reclamada,
    };
  });

  return {
    barCelulaData,
    allCoursesData,
  };
}
