import { useEffect, useState } from 'react';

export function useGoogleCourseWork(courseId: string | undefined) {
  const [courseWork, setCourseWork] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !(window as any).gapi) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const response = await (window as any).gapi.client.classroom.courses.courseWork.list({
          courseId,
          pageSize: 20,
        });
        setCourseWork(response.result.courseWork || []);
      } catch (err: any) {
        setError('Error al obtener tareas del curso');
        setCourseWork([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  return { courseWork, loading, error };
}
