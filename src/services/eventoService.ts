/**
 * Servicio para manejar eventos de asistencia
 */

import { apiClient } from './apiClient';
import type { Evento, CreateEventoRequest, AttendanceUpdateRequest } from '@/data';

export class EventoService {
  /**
   * Crear un nuevo evento de asistencia
   */
  async createEvento(eventoData: CreateEventoRequest): Promise<Evento> {
    return apiClient.post<Evento>('/eventos', eventoData);
  }

  /**
   * Obtener eventos por cohorte
   */
  async getEventosByCohorte(cohorteId: string): Promise<Evento[]> {
    return apiClient.get<Evento[]>(`/eventos/cohorte/${cohorteId}`);
  }

  /**
   * Marcar asistencia para un evento
   */
  async markAttendance(eventoId: string, attendanceData: AttendanceUpdateRequest): Promise<Evento> {
    return apiClient.post<Evento>(`/eventos/${eventoId}/attendance`, attendanceData);
  }

  /**
   * Remover asistencia de un evento
   */
  async removeAttendance(eventoId: string, attendanceData: AttendanceUpdateRequest): Promise<Evento> {
    return apiClient.delete<Evento>(`/eventos/${eventoId}/attendance`, attendanceData);
  }

  /**
   * Obtener un evento específico por ID
   */
  async getEvento(eventoId: string): Promise<Evento> {
    return apiClient.get<Evento>(`/eventos/${eventoId}`);
  }

  /**
   * Actualizar un evento existente
   */
  async updateEvento(eventoId: string, eventoData: Partial<CreateEventoRequest>): Promise<Evento> {
    return apiClient.put<Evento>(`/eventos/${eventoId}`, eventoData);
  }

  /**
   * Eliminar un evento
   */
  async deleteEvento(eventoId: string): Promise<void> {
    await apiClient.delete<void>(`/eventos/${eventoId}`);
    // La API devuelve 204 (No Content), así que no hay datos que retornar
    return;
  }
}

// Instancia singleton del servicio
export const eventoService = new EventoService();
