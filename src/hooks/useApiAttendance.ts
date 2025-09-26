/**
 * Hook para manejar asistencia con la API de Extraescolar Core
 */

import { AuthContext } from '@/contexts/AuthContext';
import type { AttendanceUpdateRequest, CreateEventoRequest, Evento } from '@/data';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/services/apiClient';
import { eventoService } from '@/services/eventoService';
import { useCallback, useContext, useState } from 'react';

export interface ApiAttendanceRecord {
  id: string;
  fecha: string;
  alumnosPresentes: string[];
  cohorteId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UseApiAttendanceReturn {
  // Estado
  eventos: Evento[];
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  createEvento: (fecha: Date) => Promise<Evento | null>;
  getEventosByCohorte: (cohorteId: string) => Promise<Evento[]>;
  markAttendance: (eventoId: string, alumnoIds: string[]) => Promise<Evento | null>;
  removeAttendance: (eventoId: string, alumnoIds: string[]) => Promise<Evento | null>;
  getEventoById: (eventoId: string) => Promise<Evento | null>;
  deleteEvento: (eventoId: string) => Promise<boolean>;
  
  // Utilidades
  clearError: () => void;
  refreshEventos: () => Promise<void>;
  removeEventoFromList: (eventoId: string) => void;
}

export const useApiAttendance = (): UseApiAttendanceReturn => {
  const authContext = useContext(AuthContext);
  const { toast } = useToast();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Configurar el token de acceso en el cliente API
  const setupApiClient = useCallback(() => {
    if (authContext?.accessToken) {
      apiClient.setAccessToken(authContext.accessToken);
    }
  }, [authContext?.accessToken]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Crear un nuevo evento
  const createEvento = useCallback(async (fecha: Date): Promise<Evento | null> => {
    if (!authContext?.selectedCourse) {
      setError('No hay curso seleccionado');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      setupApiClient();

      const eventoData: CreateEventoRequest = {
        cohorteId: authContext.selectedCourse.id,
        fecha: fecha.toISOString(),
        alumnosPresentes: []
      };

      const newEvento = await eventoService.createEvento(eventoData);
      
      // Actualizar la lista local de eventos
      setEventos(prev => [...prev, newEvento]);
      
      return newEvento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear evento';
      setError(errorMessage);
      console.error('Error creating evento:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [authContext?.selectedCourse, setupApiClient]);

  // Obtener eventos por cohorte
  const getEventosByCohorte = useCallback(async (cohorteId: string): Promise<Evento[]> => {
    try {
      setIsLoading(true);
      setError(null);
      setupApiClient();

      const eventosData = await eventoService.getEventosByCohorte(cohorteId);
      setEventos(eventosData);
      
      return eventosData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener eventos';
      setError(errorMessage);
      console.error('Error getting eventos:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [setupApiClient, toast]);

  // Marcar asistencia
  const markAttendance = useCallback(async (eventoId: string, alumnoIds: string[]): Promise<Evento | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setupApiClient();

      const attendanceData: AttendanceUpdateRequest = {
        alumnoIds
      };

      const updatedEvento = await eventoService.markAttendance(eventoId, attendanceData);
      
      // Actualizar el evento en la lista local
      setEventos(prev => prev.map(evento => 
        evento.id === eventoId ? updatedEvento : evento
      ));
      
      // Mostrar notificación de éxito
      toast({
        title: "Asistencia marcada",
        description: `Se marcó asistencia para ${alumnoIds.length} estudiante(s)`,
      });
      
      return updatedEvento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar asistencia';
      setError(errorMessage);
      console.error('Error marking attendance:', err);
      
      // Mostrar notificación de error
      toast({
        title: "Error al marcar asistencia",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setupApiClient, toast]);

  // Remover asistencia
  const removeAttendance = useCallback(async (eventoId: string, alumnoIds: string[]): Promise<Evento | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setupApiClient();

      const attendanceData: AttendanceUpdateRequest = {
        alumnoIds
      };

      const updatedEvento = await eventoService.removeAttendance(eventoId, attendanceData);
      
      // Actualizar el evento en la lista local
      setEventos(prev => prev.map(evento => 
        evento.id === eventoId ? updatedEvento : evento
      ));
      
      // Mostrar notificación de éxito
      toast({
        title: "Asistencia removida",
        description: `Se removió asistencia para ${alumnoIds.length} estudiante(s)`,
      });
      
      return updatedEvento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al remover asistencia';
      setError(errorMessage);
      console.error('Error removing attendance:', err);
      
      // Mostrar notificación de error
      toast({
        title: "Error al remover asistencia",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setupApiClient, toast]);

  // Obtener evento por ID
  const getEventoById = useCallback(async (eventoId: string): Promise<Evento | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setupApiClient();

      const evento = await eventoService.getEvento(eventoId);
      return evento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener evento';
      setError(errorMessage);
      console.error('Error getting evento:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setupApiClient, toast]);

  // Eliminar evento
  const deleteEvento = useCallback(async (eventoId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      setupApiClient();

      await eventoService.deleteEvento(eventoId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar evento';
      setError(errorMessage);
      console.error('Error deleting evento:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setupApiClient, toast]);

  // Refrescar eventos
  const refreshEventos = useCallback(async (): Promise<void> => {
    if (authContext?.selectedCourse) {
      await getEventosByCohorte(authContext.selectedCourse.id);
    }
  }, [authContext?.selectedCourse, getEventosByCohorte]);

  // Remover evento de la lista local
  const removeEventoFromList = useCallback((eventoId: string) => {
    setEventos(prev => prev.filter(evento => evento.id !== eventoId));
  }, []);

  return {
    // Estado
    eventos,
    isLoading,
    error,
    
    // Acciones
    createEvento,
    getEventosByCohorte,
    markAttendance,
    removeAttendance,
    getEventoById,
    deleteEvento,
    
    // Utilidades
    clearError,
    refreshEventos,
    removeEventoFromList,
  };
};
