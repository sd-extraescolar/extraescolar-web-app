/**
 * Hook híbrido que combina el sistema local de asistencia con la API
 */

import { AuthContext } from '@/contexts/AuthContext';
import type { Evento } from '@/data';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/services/apiClient';
import { cohorteService } from '@/services/cohorteService';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useApiAttendance } from './useApiAttendance';

export interface HybridAttendanceRecord {
  id: string;
  fecha: string;
  estudiantes: Array<{
    id: string;
    name: string;
    email: string;
    status: 'present' | 'absent';
  }>;
  eventoId?: string; // ID del evento en la API
  isLocal: boolean; // true si solo existe localmente
  createdAt: string;
  updatedAt: string;
}

export interface UseHybridAttendanceReturn {
  // Estado
  records: HybridAttendanceRecord[];
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  selectDate: (date: Date) => void;
  createRecord: () => Promise<void>;
  toggleStudentStatus: (studentId: string, status: 'present' | 'absent') => void;
  saveRecord: () => Promise<void>;
  deleteRecord: () => Promise<void>;
  selectAll: () => void;
  unselectAll: () => void;
  downloadEventCSV: () => void;
  
  // Utilidades
  getCurrentRecord: () => HybridAttendanceRecord | null;
  getCurrentStudents: () => Array<{ id: string; name: string; email: string; status: 'present' | 'absent' }>;
  getCurrentStats: () => { present: number; absent: number; total: number; percentage: number };
  hasCurrentRecord: boolean;
  clearError: () => void;
  
  // Datos para calendario
  calendarAttendanceData: Record<string, { present: number; total: number; percentage: number }>;
  pendingChanges: Record<string, boolean>;
}

export const useHybridAttendance = (): UseHybridAttendanceReturn => {
  const authContext = useContext(AuthContext);
  const apiAttendance = useApiAttendance();
  const { toast } = useToast();
  
  const [records, setRecords] = useState<HybridAttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedCohorteId, setLoadedCohorteId] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<Record<string, { present: number; total: number; percentage: number }>>({});
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});

  // Obtener la fecha en formato string para usar como clave
  const getDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Convertir evento de API a formato híbrido
  const convertApiEventoToRecord = useCallback((evento: Evento): HybridAttendanceRecord => {
    const estudiantes = authContext?.students?.map(student => ({
      id: student.userId,
      name: student.profile.name.fullName,
      email: student.profile.emailAddress,
      status: evento.alumnos_presentes.includes(student.userId) ? 'present' as const : 'absent' as const
    })) || [];

    return {
      id: evento.id,
      fecha: evento.fecha,
      estudiantes,
      eventoId: evento.id,
      isLocal: false,
      createdAt: evento.createdAt,
      updatedAt: evento.updatedAt
    };
  }, [authContext?.students]);

  // Cargar eventos desde la API cuando cambie el curso seleccionado
  useEffect(() => {
    const loadEventos = async () => {
      const cohorteId = authContext?.selectedCourse?.id;
      
      if (cohorteId && authContext?.accessToken && cohorteId !== loadedCohorteId) {
        try {
          setIsLoading(true);
          setError(null);
          
          // Configurar el token en el cliente API
          apiClient.setAccessToken(authContext.accessToken);
          
          
          // Primero intentar sincronizar la cohorte
          try {
            await cohorteService.syncCohorte(cohorteId);
          } catch (syncErr) {
            // Continuar aunque falle la sincronización
          }
          
          // Luego obtener los eventos
          const eventos = await apiAttendance.getEventosByCohorte(cohorteId);
          
          const hybridRecords = eventos.map(convertApiEventoToRecord);
          setRecords(hybridRecords);
          setLoadedCohorteId(cohorteId);
          
        } catch (err) {
          console.error('Error loading eventos:', err);
          setError('Error al cargar eventos desde la API');
          // No limpiar loadedCohorteId para evitar reintentos inmediatos
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadEventos();
  }, [authContext?.selectedCourse?.id, authContext?.accessToken, loadedCohorteId, apiAttendance, convertApiEventoToRecord]);

  // Actualizar datos del calendario cuando cambien los registros
  useEffect(() => {
    const data: Record<string, { present: number; total: number; percentage: number }> = {};
    
    
    records.forEach(record => {
      const dateKey = getDateKey(new Date(record.fecha));
      const present = record.estudiantes.filter(s => s.status === 'present').length;
      const total = record.estudiantes.length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
      
      data[dateKey] = {
        present,
        total,
        percentage
      };
    });
    
    setCalendarData(data);
  }, [records]);

  // Actualizar cambios pendientes cuando cambien los registros
  useEffect(() => {
    const pending: Record<string, boolean> = {};
    
    records.forEach(record => {
      const dateKey = getDateKey(new Date(record.fecha));
      // Marcar como pendiente si el registro fue modificado recientemente
      const recordDate = new Date(record.updatedAt);
      const now = new Date();
      const timeDiff = now.getTime() - recordDate.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      // Si fue modificado en los últimos 5 minutos, considerarlo pendiente
      pending[dateKey] = minutesDiff < 5;
    });
    
    setPendingChanges(pending);
  }, [records]);

  // Obtener registro actual para la fecha seleccionada
  const getCurrentRecord = useCallback((): HybridAttendanceRecord | null => {
    const dateKey = getDateKey(selectedDate);
    return records.find(record => getDateKey(new Date(record.fecha)) === dateKey) || null;
  }, [records, selectedDate]);

  // Obtener estudiantes actuales
  const getCurrentStudents = useCallback(() => {
    const currentRecord = getCurrentRecord();
    if (currentRecord) {
      return currentRecord.estudiantes;
    }
    
    // Si no hay registro, devolver estudiantes base con status 'absent'
    return authContext?.students?.map(student => ({
      id: student.userId,
      name: student.profile.name.fullName,
      email: student.profile.emailAddress,
      status: 'absent' as const
    })) || [];
  }, [getCurrentRecord, authContext?.students]);

  // Obtener estadísticas actuales
  const getCurrentStats = useCallback(() => {
    const students = getCurrentStudents();
    const present = students.filter(s => s.status === 'present').length;
    const absent = students.filter(s => s.status === 'absent').length;
    const total = students.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, total, percentage };
  }, [getCurrentStudents]);

  // Verificar si existe registro actual
  const hasCurrentRecord = getCurrentRecord() !== null;

  // Cambiar fecha seleccionada
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Crear nuevo registro
  const createRecord = useCallback(async (): Promise<void> => {
    if (!authContext?.selectedCourse) {
      setError('No hay curso seleccionado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Crear evento en la API
      const newEvento = await apiAttendance.createEvento(selectedDate);
      
      if (newEvento) {
        // Convertir a formato híbrido y agregar a la lista local
        const newRecord = convertApiEventoToRecord(newEvento);
        setRecords(prev => [...prev, newRecord]);
        
        // Mostrar notificación de éxito
        toast({
          title: "Evento creado",
          description: `Registro de asistencia creado para ${selectedDate.toLocaleDateString('es-ES')}`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear registro';
      setError(errorMessage);
      
      // Mostrar notificación de error
      toast({
        title: "Error al crear evento",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [authContext?.selectedCourse, selectedDate, apiAttendance, convertApiEventoToRecord, toast]);

  // Cambiar estado de un estudiante
  const toggleStudentStatus = useCallback((studentId: string, status: 'present' | 'absent') => {
    const dateKey = getDateKey(selectedDate);
    const currentRecord = getCurrentRecord();
    
    if (!currentRecord) {
      setError('No hay registro para esta fecha');
      return;
    }

    // Actualizar el registro local
    const updatedStudents = currentRecord.estudiantes.map(student =>
      student.id === studentId ? { ...student, status } : student
    );

    const updatedRecord: HybridAttendanceRecord = {
      ...currentRecord,
      estudiantes: updatedStudents,
      updatedAt: new Date().toISOString()
    };

    setRecords(prev => prev.map(record => 
      getDateKey(new Date(record.fecha)) === dateKey ? updatedRecord : record
    ));
  }, [selectedDate, getCurrentRecord]);

  // Guardar registro
  const saveRecord = useCallback(async (): Promise<void> => {
    const currentRecord = getCurrentRecord();
    
    if (!currentRecord || !currentRecord.eventoId) {
      setError('No hay registro válido para guardar');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Obtener el registro original de la API para comparar
      const originalEvento = await apiAttendance.getEventoById(currentRecord.eventoId);
      if (!originalEvento) {
        setError('No se pudo obtener el registro original');
        return;
      }

      // Obtener IDs de estudiantes presentes actuales
      const alumnosPresentesActuales = currentRecord.estudiantes
        .filter(student => student.status === 'present')
        .map(student => student.id);

      // Obtener IDs de estudiantes que estaban presentes originalmente
      const alumnosPresentesOriginales = originalEvento.alumnos_presentes || [];

      // Encontrar estudiantes que se agregaron (están en actuales pero no en originales)
      const alumnosAgregados = alumnosPresentesActuales.filter(
        id => !alumnosPresentesOriginales.includes(id)
      );

      // Encontrar estudiantes que se removieron (están en originales pero no en actuales)
      const alumnosRemovidos = alumnosPresentesOriginales.filter(
        id => !alumnosPresentesActuales.includes(id)
      );


      // Si hay alumnos agregados, usar markAttendance
      if (alumnosAgregados.length > 0) {
        await apiAttendance.markAttendance(currentRecord.eventoId, alumnosAgregados);
      }

      // Si hay alumnos removidos, usar removeAttendance
      if (alumnosRemovidos.length > 0) {
        await apiAttendance.removeAttendance(currentRecord.eventoId, alumnosRemovidos);
      }

      // Si no hay cambios, no hacer nada
      if (alumnosAgregados.length === 0 && alumnosRemovidos.length === 0) {
        
        // Mostrar notificación informativa
        toast({
          title: "Sin cambios",
          description: "No hay cambios en la asistencia para guardar",
        });
        return;
      }

      // Actualizar el registro local con los datos más recientes de la API
      const updatedEvento = await apiAttendance.getEventoById(currentRecord.eventoId);
      if (updatedEvento) {
        const updatedRecord = convertApiEventoToRecord(updatedEvento);
        setRecords(prev => prev.map(record => 
          record.id === currentRecord.id ? updatedRecord : record
        ));
        
        // Mostrar notificación de éxito
        toast({
          title: "Asistencia guardada",
          description: `Cambios guardados para ${selectedDate.toLocaleDateString('es-ES')}`,
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar registro';
      setError(errorMessage);
      console.error('Error saving record:', err);
      
      // Mostrar notificación de error
      toast({
        title: "Error al guardar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentRecord, apiAttendance, convertApiEventoToRecord, selectedDate, toast]);

  // Eliminar registro
  const deleteRecord = useCallback(async (): Promise<void> => {
    const currentRecord = getCurrentRecord();
    
    if (!currentRecord || !currentRecord.eventoId) {
      setError('No hay registro válido para eliminar');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      
      // Llamar a la API para eliminar el evento
      const success = await apiAttendance.deleteEvento(currentRecord.eventoId);
      
      if (success) {
        // Remover el registro de la lista local inmediatamente
        setRecords(prev => {
          const newRecords = prev.filter(record => record.id !== currentRecord.id);
          return newRecords;
        });
        
        // También actualizar la lista de eventos en el hook de API
        apiAttendance.removeEventoFromList(currentRecord.eventoId);
        
        
        // Mostrar notificación de éxito
        toast({
          title: "Evento eliminado",
          description: `Registro de asistencia eliminado para ${selectedDate.toLocaleDateString('es-ES')}`,
        });
      } else {
        setError('No se pudo eliminar el evento');
        
        // Mostrar notificación de error
        toast({
          title: "Error al eliminar",
          description: "No se pudo eliminar el evento",
          variant: "destructive",
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar registro';
      setError(errorMessage);
      console.error('Error deleting record:', err);
      
      // Mostrar notificación de error
      toast({
        title: "Error al eliminar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentRecord, apiAttendance, selectedDate, toast]);

  // Seleccionar todos los estudiantes
  const selectAll = useCallback(() => {
    const currentRecord = getCurrentRecord();
    if (!currentRecord) return;

    const updatedStudents = currentRecord.estudiantes.map(student => ({
      ...student,
      status: 'present' as const
    }));

    const updatedRecord: HybridAttendanceRecord = {
      ...currentRecord,
      estudiantes: updatedStudents,
      updatedAt: new Date().toISOString()
    };

    setRecords(prev => prev.map(record => 
      record.id === currentRecord.id ? updatedRecord : record
    ));
  }, [getCurrentRecord]);

  // Deseleccionar todos los estudiantes
  const unselectAll = useCallback(() => {
    const currentRecord = getCurrentRecord();
    if (!currentRecord) return;

    const updatedStudents = currentRecord.estudiantes.map(student => ({
      ...student,
      status: 'absent' as const
    }));

    const updatedRecord: HybridAttendanceRecord = {
      ...currentRecord,
      estudiantes: updatedStudents,
      updatedAt: new Date().toISOString()
    };

    setRecords(prev => prev.map(record => 
      record.id === currentRecord.id ? updatedRecord : record
    ));
  }, [getCurrentRecord]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Generar y descargar CSV del evento actual
  const downloadEventCSV = useCallback(() => {
    const currentRecord = getCurrentRecord();
    
    if (!currentRecord) {
      toast({
        title: "Error",
        description: "No hay registro de asistencia para esta fecha",
        variant: "destructive",
      });
      return;
    }

    // Obtener información del cohorte y fecha
    const cohorteName = authContext?.selectedCourse?.name || 'Curso no especificado';
    const fechaFormateada = selectedDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Crear encabezados del CSV
    const headers = ['Cohorte', 'Fecha', 'Nombre', 'Email', 'Estado'];
    
    // Crear filas de datos
    const rows = currentRecord.estudiantes.map(student => [
      cohorteName,
      fechaFormateada,
      student.name,
      student.email,
      student.status === 'present' ? 'Presente' : 'Ausente'
    ]);
    
    // Combinar encabezados y datos
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    // Crear archivo y descargarlo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `asistencia_${selectedDate.toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar notificación de éxito
    toast({
      title: "CSV descargado",
      description: `Archivo de asistencia descargado para ${selectedDate.toLocaleDateString('es-ES')}`,
    });
  }, [getCurrentRecord, selectedDate, authContext?.selectedCourse?.name, toast]);


  return {
    // Estado
    records,
    selectedDate,
    isLoading: isLoading || apiAttendance.isLoading,
    error: error || apiAttendance.error,
    
    // Acciones
    selectDate,
    createRecord,
    toggleStudentStatus,
    saveRecord,
    deleteRecord,
    selectAll,
    unselectAll,
    downloadEventCSV,
    
    // Utilidades
    getCurrentRecord,
    getCurrentStudents,
    getCurrentStats,
    hasCurrentRecord,
    clearError,
    
    // Datos para calendario
    calendarAttendanceData: calendarData,
    pendingChanges: pendingChanges,
  };
};
