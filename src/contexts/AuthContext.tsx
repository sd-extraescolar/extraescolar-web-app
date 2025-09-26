import { useGoogleAuth } from "@/features/login/hooks/useGoogleAuth";
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  enrollmentCode?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  courses: Course[];
  selectedCourse: Course | null;
  userProfile: UserProfile | null;
  error: string | null;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  selectCourse: (course: Course) => void;
  clearSelectedCourse: () => void;
  isGapiReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isSignedIn,
    isLoading,
    courses,
    userProfile,
    error,
    handleLogin,
    handleLogout,
    isGapiReady,
  } = useGoogleAuth();

  // Estado para el curso seleccionado
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Auto-seleccionar el primer curso cuando se cargan los cursos
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  }, [courses, selectedCourse]);

  // Método para seleccionar un curso
  const selectCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  // Método para limpiar la selección (ahora selecciona el primer curso disponible)
  const clearSelectedCourse = () => {
    if (courses.length > 0) {
      setSelectedCourse(courses[0]);
    } else {
      setSelectedCourse(null);
    }
  };

  const value = {
    isAuthenticated: isSignedIn,
    isLoading: isLoading || !isGapiReady,
    courses,
    selectedCourse,
    userProfile,
    error,
    handleLogin,
    handleLogout,
    selectCourse,
    clearSelectedCourse,
    isGapiReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}