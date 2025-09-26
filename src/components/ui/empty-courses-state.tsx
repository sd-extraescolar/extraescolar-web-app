import React from 'react';

interface EmptyCoursesStateProps {
  title?: string;
  subtitle?: string;
}

export function EmptyCoursesState({ 
  title = "No tenés cursos asignados",
  subtitle = "Para usar la aplicación, unite a un curso"
}: EmptyCoursesStateProps) {
  return (
    <div className="bg-blue-50 h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-blue-500 text-2xl font-bold mb-2">
          {title}
        </h1>
        <p className="text-blue-400 text-lg">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
