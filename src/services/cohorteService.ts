/**
 * Servicio para manejar cohortes
 */

import { apiClient } from './apiClient';
import type { Cohorte, HealthCheckResponse } from '@/data';

export class CohorteService {
  /**
   * Verificar el estado de la API
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    return apiClient.get<HealthCheckResponse>('/health');
  }

  /**
   * Obtener información de una cohorte específica
   */
  async getCohorte(cohorteId: string): Promise<Cohorte> {
    return apiClient.get<Cohorte>(`/cohorte/${cohorteId}`);
  }

  /**
   * Obtener todas las cohortes desde Google Classroom
   */
  async getAllCohortes(): Promise<Cohorte[]> {
    return apiClient.get<Cohorte[]>('/cohortes');
  }

  /**
   * Obtener estudiantes de una cohorte específica
   */
  async getCohorteStudents(cohorteId: string): Promise<any[]> {
    return apiClient.get<any[]>(`/cohorte/${cohorteId}/students`);
  }

  /**
   * Sincronizar cohorte desde Google Classroom
   */
  async syncCohorte(cohorteId: string): Promise<Cohorte> {
    return apiClient.post<Cohorte>(`/cohorte/${cohorteId}/sync`);
  }
}

// Instancia singleton del servicio
export const cohorteService = new CohorteService();
