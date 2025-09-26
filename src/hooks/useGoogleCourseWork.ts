import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useGoogleCourseWork(courseId: string | undefined) {
  const [courseWork, setCourseWork] = useState<any[]>([]);
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
        console.log('Obteniendo tareas para el curso:', courseId);
        
        // Verificar que el token esté establecido
        const token = (window as any).gapi.client.getToken();
        if (!token) {
          throw new Error('No hay token de acceso disponible. Por favor, inicia sesión nuevamente.');
        }

        // Obtener todas las tareas sin paginación
        let allCourseWork: any[] = [];
        let nextPageToken: string | undefined = undefined;
        
        do {
          const response = await (window as any).gapi.client.classroom.courses.courseWork.list({
            courseId,
            pageSize: 100, // Máximo permitido por la API
            pageToken: nextPageToken,
          });
          
          const courseWork = response.result.courseWork || [];
          allCourseWork = [...allCourseWork, ...courseWork];
          nextPageToken = response.result.nextPageToken;
          
          console.log(`Obtenidas ${courseWork.length} tareas, total: ${allCourseWork.length}`);
        } while (nextPageToken);
        
        console.log(`Total de tareas obtenidas: ${allCourseWork.length}`);
        setCourseWork(allCourseWork);
      } catch (err: any) {
        console.error('Error obteniendo tareas:', err);
        
        // Manejar diferentes tipos de errores
        if (err.status === 401) {
          setError('No tienes permisos para acceder a este curso. Verifica que seas profesor del curso.');
        } else if (err.status === 403) {
          setError('Acceso denegado. Verifica que tengas permisos de profesor en Google Classroom.');
        } else if (err.status === 404) {
          setError('Curso no encontrado. Verifica que el curso exista y que tengas acceso.');
        } else {
          setError(`Error al obtener tareas del curso: ${err.message || 'Error desconocido'}`);
        }
        
        setCourseWork([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, isAuthenticated, isGapiReady]);

  return { courseWork, loading, error };
}
