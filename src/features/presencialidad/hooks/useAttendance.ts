import { useCallback, useState } from 'react';

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
  // Estado para almacenar todos los registros de asistencia
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  
  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Estado para rastrear cambios pendientes por fecha
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});

  // Lista base de estudiantes (en el futuro vendrá de la API)
  const baseStudents: Student[] = [
     {
       id: '1',
       name: 'Ana García',
       email: 'ana.garcia@estudiante.com',
       status: 'absent',
     },
     {
       id: '2',
       name: 'Carlos López',
       email: 'carlos.lopez@estudiante.com',
       status: 'absent',
     },
     {
       id: '3',
       name: 'María Rodríguez',
       email: 'maria.rodriguez@estudiante.com',
       status: 'absent',
     },
     {
       id: '4',
       name: 'José Martínez',
       email: 'jose.martinez@estudiante.com',
       status: 'absent',
     },
     {
       id: '5',
       name: 'Laura Sánchez',
       email: 'laura.sanchez@estudiante.com',
       status: 'absent',
     },
     {
       id: '6',
       name: 'Pedro González',
       email: 'pedro.gonzalez@estudiante.com',
       status: 'absent',
     },
     {
       id: '7',
       name: 'Carmen Ruiz',
       email: 'carmen.ruiz@estudiante.com',
       status: 'absent',
     },
     {
       id: '8',
       name: 'Diego Herrera',
       email: 'diego.herrera@estudiante.com',
       status: 'absent',
     }
  ];

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
    return baseStudents.map(student => ({
      ...student,
      status: 'absent' as const
    }));
  }, [attendanceRecords]);

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
         students: baseStudents.map(student => ({
           ...student,
           status: 'absent' as const
         })),
        createdAt: now,
        updatedAt: now
      }
    }));
  }, [selectedDate]);

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
    
    Object.entries(attendanceRecords).forEach(([date, record]) => {
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
      console.log('Saving attendance for date:', dateKey, record);
      
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
