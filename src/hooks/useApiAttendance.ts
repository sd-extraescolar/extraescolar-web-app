/**
 * Hook para manejar asistencia con la API de Extraescolar Core
 */

import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { eventoService } from '@/services/eventoService';
import { apiClient } from '@/services/apiClient';
import type { Evento, CreateEventoRequest, AttendanceUpdateRequest } from '@/data';

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
  
  // Utilidades
  clearError: () => void;
  refreshEventos: () => Promise<void>;
}

export const useApiAttendance = (): UseApiAttendanceReturn => {
  const authContext = useContext(AuthContext);
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
  }, [setupApiClient]);

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
      
      return updatedEvento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar asistencia';
      setError(errorMessage);
      console.error('Error marking attendance:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setupApiClient]);

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
      
      return updatedEvento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al remover asistencia';
      setError(errorMessage);
      console.error('Error removing attendance:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setupApiClient]);

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
  }, [setupApiClient]);

  // Refrescar eventos
  const refreshEventos = useCallback(async (): Promise<void> => {
    if (authContext?.selectedCourse) {
      await getEventosByCohorte(authContext.selectedCourse.id);
    }
  }, [authContext?.selectedCourse, getEventosByCohorte]);

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
    
    // Utilidades
    clearError,
    refreshEventos,
  };
};
