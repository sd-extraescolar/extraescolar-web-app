
import { useEffect, useState } from 'react';

interface Submission {
  userId: string;
  state: string;
  assignedGrade?: number;
  updateTime?: string;
  // ...otros campos relevantes
}

interface Assignment {
  id: string;
  title: string;
  dueDate?: string;
  maxPoints?: number;
  submissionCount?: number;
  assignedCount?: number;
}

type AllSubmissions = { [assignmentId: string]: Submission[] };

export function useAllGoogleSubmissions(
  courseId: string | undefined,
  assignments: Assignment[]
) {
  const [allSubmissions, setAllSubmissions] = useState<AllSubmissions>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !assignments?.length || !(window as any).gapi) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const results: AllSubmissions = {};
        for (const assignment of assignments) {
          // Obtener todas las entregas de esta tarea sin paginación
          let allSubmissions: Submission[] = [];
          let nextPageToken: string | undefined = undefined;
          
          do {
            const response: any = await (window as any).gapi.client.classroom.courses.courseWork.studentSubmissions.list({
              courseId,
              courseWorkId: assignment.id,
              pageSize: 100, // Máximo permitido por la API
              pageToken: nextPageToken,
            });
            
            const submissions = response.result.studentSubmissions || [];
            allSubmissions = [...allSubmissions, ...submissions];
            nextPageToken = response.result.nextPageToken;
            
          } while (nextPageToken);
          
          results[assignment.id] = allSubmissions;
        }
        if (!cancelled) setAllSubmissions(results);
      } catch (err) {
        if (!cancelled) {
          setError('Error al obtener entregas de todas las tareas');
          setAllSubmissions({});
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [courseId, assignments]);

  return { allSubmissions, loading, error };
}
