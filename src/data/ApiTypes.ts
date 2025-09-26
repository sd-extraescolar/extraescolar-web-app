/**
 * Tipos para la API de Extraescolar Core
 */

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  database: {
    status: string;
    connected: boolean;
  };
}

export interface Cohorte {
  id: string;
  presencialidad_total: number;
  cantidad_clases_total: number;
  profesores: string[];
  alumnos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Evento {
  id: string;
  fk_cohorte_id: string;
  fecha: string;
  alumnos_presentes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventoRequest {
  cohorteId: string;
  fecha: string;
  alumnosPresentes: string[];
}

export interface AttendanceUpdateRequest {
  alumnoIds: string[];
}

export interface AttendanceStats {
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}
