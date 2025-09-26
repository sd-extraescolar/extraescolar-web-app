import { useEffect, useState } from 'react';

export function useGoogleSubmissions(courseId: string | undefined, courseWorkId: string | undefined) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !courseWorkId || !(window as any).gapi) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const response = await (window as any).gapi.client.classroom.courses.courseWork.studentSubmissions.list({
          courseId,
          courseWorkId,
        });
        setSubmissions(response.result.studentSubmissions || []);
      } catch (err: any) {
        setError('Error al obtener entregas de la tarea');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, courseWorkId]);

  return { submissions, loading, error };
}
