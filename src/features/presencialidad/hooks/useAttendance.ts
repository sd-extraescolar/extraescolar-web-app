import { AuthContext } from '@/contexts/AuthContext';
import { useCallback, useContext, useEffect, useState } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  status: 'present' | 'absent';
  lastAttendance?: string;
}

export interface AttendanceRecord {
  date: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

export const useAttendance = () => {
  const authContext = useContext(AuthContext);
  
  // Estado para almacenar todos los registros de asistencia
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  
  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Estado para rastrear cambios pendientes por fecha
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});

  // Convertir estudiantes de Google Classroom al formato esperado
  const getBaseStudents = useCallback((): Student[] => {
    if (!authContext?.students || authContext.students.length === 0) {
      // Si no hay estudiantes cargados, devolver array vacío
      return [];
    }
    
    return authContext.students.map(classroomStudent => ({
      id: classroomStudent.userId,
      name: classroomStudent.profile.name.fullName,
      email: classroomStudent.profile.emailAddress,
      status: 'absent' as const
    }));
  }, [authContext?.students]);

  // Actualizar registros existentes cuando cambien los estudiantes
  useEffect(() => {
    if (authContext?.students && authContext.students.length > 0) {
      const newBaseStudents = getBaseStudents();
      
      // Actualizar todos los registros existentes con la nueva lista de estudiantes
      setAttendanceRecords(prev => {
        const updated: Record<string, AttendanceRecord> = {};
        
        Object.entries(prev).forEach(([dateKey, record]) => {
          // Crear un mapa de estudiantes existentes por ID
          const existingStudentsMap = new Map(
            record.students.map(student => [student.id, student])
          );
          
          // Crear nueva lista combinando estudiantes existentes con nuevos
          const updatedStudents = newBaseStudents.map(newStudent => {
            const existingStudent = existingStudentsMap.get(newStudent.id);
            return existingStudent || newStudent;
          });
          
          updated[dateKey] = {
            ...record,
            students: updatedStudents,
            updatedAt: new Date().toISOString()
          };
        });
        
        return updated;
      });
    }
  }, [authContext?.students, getBaseStudents]);

  // Obtener la fecha en formato string para usar como clave
  const getDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Obtener estudiantes para la fecha seleccionada
  const getStudentsForDate = useCallback((date: Date): Student[] => {
    const dateKey = getDateKey(date);
    const record = attendanceRecords[dateKey];
    
    if (record) {
      return record.students;
    }
    
    // Si no hay registro, devolver estudiantes base con status 'absent'
    return getBaseStudents();
  }, [attendanceRecords, getBaseStudents]);

  // Cambiar el estado de un estudiante
  const toggleStudentStatus = useCallback((studentId: string, newStatus: 'present' | 'absent') => {
    const dateKey = getDateKey(selectedDate);
    const currentStudents = getStudentsForDate(selectedDate);
    
    const updatedStudents = currentStudents.map(student => 
      student.id === studentId 
        ? { ...student, status: newStatus }
        : student
    );

    const now = new Date().toISOString();
    
    setAttendanceRecords(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        students: updatedStudents,
        createdAt: prev[dateKey]?.createdAt || now,
        updatedAt: now
      }
    }));
    
    // Marcar cambios pendientes
    setPendingChanges(prev => ({
      ...prev,
      [dateKey]: true
    }));
  }, [selectedDate, getStudentsForDate]);

  // Crear un nuevo registro de asistencia
  const createAttendanceRecord = useCallback(() => {
    const dateKey = getDateKey(selectedDate);
    const now = new Date().toISOString();
    
    setAttendanceRecords(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        students: getBaseStudents(),
        createdAt: now,
        updatedAt: now
      }
    }));
  }, [selectedDate, getBaseStudents]);

  // Obtener estadísticas para la fecha seleccionada
  const getAttendanceStats = useCallback((date: Date): AttendanceStats => {
    const students = getStudentsForDate(date);
    
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const total = students.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      present,
      absent,
      total,
      percentage
    };
  }, [getStudentsForDate]);

  // Verificar si existe un registro para la fecha
  const hasAttendanceRecord = useCallback((date: Date): boolean => {
    const dateKey = getDateKey(date);
    return !!attendanceRecords[dateKey];
  }, [attendanceRecords]);

  // Obtener datos de asistencia para el calendario
  const getCalendarAttendanceData = useCallback(() => {
    const data: Record<string, { present: number; total: number; percentage: number }> = {};
    
    Object.entries(attendanceRecords).forEach(([date]) => {
      const stats = getAttendanceStats(new Date(date));
      data[date] = {
        present: stats.present,
        total: stats.total,
        percentage: stats.percentage
      };
    });
    
    return data;
  }, [attendanceRecords, getAttendanceStats]);

  // Cambiar fecha seleccionada
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Guardar y sincronizar asistencia
  const saveAttendance = useCallback(() => {
    const dateKey = getDateKey(selectedDate);
    const record = attendanceRecords[dateKey];
    
    if (record) {
      // Aquí se haría la llamada a la API para sincronizar
      
      // Simular llamada a API
      // await api.saveAttendance(record);
      
      // Limpiar cambios pendientes
      setPendingChanges(prev => ({
        ...prev,
        [dateKey]: false
      }));
      
      // Por ahora solo mostramos un mensaje
      alert(`Asistencia guardada para ${selectedDate.toLocaleDateString('es-ES')}`);
    }
  }, [selectedDate, attendanceRecords]);

  // Obtener estudiantes actuales para la fecha seleccionada
  const currentStudents = getStudentsForDate(selectedDate);
  
  // Obtener estadísticas actuales
  const currentStats = getAttendanceStats(selectedDate);
  
  // Verificar si existe registro actual
  const hasCurrentRecord = hasAttendanceRecord(selectedDate);

  // Seleccionar todos los estudiantes para la fecha actual
  const selectAll = useCallback(() => {
    const dateKey = getDateKey(selectedDate);
    const currentStudents = getStudentsForDate(selectedDate);
    
    // Crear nuevo array con todos los estudiantes como 'present'
    const updatedStudents = currentStudents.map(student => ({
      ...student,
      status: 'present' as const
    }));
    
    // Actualizar el registro
    setAttendanceRecords(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        students: updatedStudents,
        createdAt: prev[dateKey]?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    
    // Marcar cambios pendientes
    setPendingChanges(prev => ({
      ...prev,
      [dateKey]: true
    }));
  }, [selectedDate, getStudentsForDate, getDateKey]);

  // Deseleccionar todos los estudiantes para la fecha actual
  const unselectAll = useCallback(() => {
    const dateKey = getDateKey(selectedDate);
    const currentStudents = getStudentsForDate(selectedDate);
    
    // Crear nuevo array con todos los estudiantes como 'absent'
    const updatedStudents = currentStudents.map(student => ({
      ...student,
      status: 'absent' as const
    }));
    
    // Actualizar el registro
    setAttendanceRecords(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        students: updatedStudents,
        createdAt: prev[dateKey]?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    
    // Marcar cambios pendientes
    setPendingChanges(prev => ({
      ...prev,
      [dateKey]: true
    }));
  }, [selectedDate, getStudentsForDate, getDateKey]);

  return {
    // Estado
    selectedDate,
    currentStudents,
    currentStats,
    hasCurrentRecord,
    
    // Acciones
    selectDate,
    toggleStudentStatus,
    createAttendanceRecord,
    saveAttendance,
    selectAll,
    unselectAll,
    
    // Datos para calendario
    calendarAttendanceData: getCalendarAttendanceData(),
    pendingChanges,
    
    // Utilidades
    getStudentsForDate,
    getAttendanceStats,
    hasAttendanceRecord
  };
};
