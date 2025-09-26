import { useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  enrollmentCode?: string;
}

export function useCourses() {
  const { 
    courses, 
    selectedCourse, 
    selectCourse, 
    clearSelectedCourse 
  } = useAuth();

  // Asegurar que siempre hay un curso seleccionado
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      selectCourse(courses[0]);
    }
  }, [courses, selectedCourse, selectCourse]);

  // Obtener todos los cursos disponibles
  const getCourses = useCallback(() => {
    return courses;
  }, [courses]);

  // Obtener el curso seleccionado
  const getSelectedCourse = useCallback(() => {
    return selectedCourse;
  }, [selectedCourse]);

  // Verificar si hay un curso seleccionado
  const hasSelectedCourse = useCallback(() => {
    return selectedCourse !== null;
  }, [selectedCourse]);

  // Seleccionar un curso por ID
  const selectCourseById = useCallback((courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      selectCourse(course);
      return true;
    }
    return false;
  }, [courses, selectCourse]);

  // Obtener información del curso seleccionado
  const getSelectedCourseInfo = useCallback(() => {
    if (!selectedCourse) return null;
    
    return {
      id: selectedCourse.id,
      name: selectedCourse.name,
      section: selectedCourse.section,
      descriptionHeading: selectedCourse.descriptionHeading,
      room: selectedCourse.room,
      enrollmentCode: selectedCourse.enrollmentCode,
      displayName: selectedCourse.section 
        ? `${selectedCourse.name} - ${selectedCourse.section}`
        : selectedCourse.name
    };
  }, [selectedCourse]);

  // Verificar si un curso específico está seleccionado
  const isCourseSelected = useCallback((courseId: string) => {
    return selectedCourse?.id === courseId;
  }, [selectedCourse]);

  return {
    // Estado
    courses,
    selectedCourse,
    
    // Métodos de obtención
    getCourses,
    getSelectedCourse,
    getSelectedCourseInfo,
    
    // Métodos de verificación
    hasSelectedCourse,
    isCourseSelected,
    
    // Métodos de selección
    selectCourse,
    selectCourseById,
    clearSelectedCourse,
  };
}
