import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

export function useGoogleRoster(courseId: string | undefined) {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isGapiReady } = useAuth();

  useEffect(() => {
    // No hacer nada si no hay courseId, no está autenticado, o GAPI no está listo
    if (!courseId || !isAuthenticated || !isGapiReady || !(window as any).gapi) {
      return;
    }

    setLoading(true);
    setError(null);
    
    (async () => {
      try {
        console.log('Obteniendo roster del curso:', courseId);
        
        // Verificar que el token esté establecido
        const token = (window as any).gapi.client.getToken();
        if (!token) {
          throw new Error('No hay token de acceso disponible. Por favor, inicia sesión nuevamente.');
        }

        // Obtener todos los estudiantes del curso sin paginación
        let allStudents: any[] = [];
        let nextPageToken: string | undefined = undefined;
        
        do {
          const response = await (window as any).gapi.client.classroom.courses.students.list({
            courseId,
            pageSize: 100, // Máximo permitido por la API
            pageToken: nextPageToken,
          });
          
          const students = response.result.students || [];
          allStudents = [...allStudents, ...students];
          nextPageToken = response.result.nextPageToken;
          
          console.log(`Obtenidos ${students.length} estudiantes, total: ${allStudents.length}`);
        } while (nextPageToken);
        
        console.log(`Total de estudiantes obtenidos: ${allStudents.length}`);
        
        const studentsWithProfiles: StudentProfile[] = allStudents.map((student: any) => ({
          id: student.userId,
          name: student.profile?.name?.fullName || student.profile?.name?.givenName || 'Estudiante',
          email: student.profile?.emailAddress || '',
          photoUrl: student.profile?.photoUrl,
        }));
        
        setStudents(studentsWithProfiles);
      } catch (err: any) {
        console.error('Error obteniendo roster:', err);
        
        // Manejar diferentes tipos de errores
        if (err.status === 401) {
          setError('No tienes permisos para acceder al roster del curso. Verifica que seas profesor del curso.');
        } else if (err.status === 403) {
          setError('Acceso denegado al roster. Verifica que tengas permisos de profesor en Google Classroom.');
        } else if (err.status === 404) {
          setError('Curso no encontrado. Verifica que el curso exista y que tengas acceso.');
        } else {
          setError(`Error al obtener la lista de estudiantes: ${err.message || 'Error desconocido'}`);
        }
        
        setStudents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, isAuthenticated, isGapiReady]);

  return { students, loading, error };
}
