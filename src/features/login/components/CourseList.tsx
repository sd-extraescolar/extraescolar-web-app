import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  enrollmentCode?: string;
}

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
}

export function CourseList({ courses, isLoading }: CourseListProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No se encontraron cursos en tu cuenta de Google Classroom.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Tus Cursos</h2>
      <div className="space-y-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:bg-muted/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-muted-foreground">
                {course.section && (
                  <p><span className="font-medium">Sección:</span> {course.section}</p>
                )}
                {course.room && (
                  <p><span className="font-medium">Aula:</span> {course.room}</p>
                )}
                {course.enrollmentCode && (
                  <p><span className="font-medium">Código:</span> {course.enrollmentCode}</p>
                )}
                <p><span className="font-medium">ID:</span> {course.id}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}