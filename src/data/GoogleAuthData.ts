import type { Course } from './Course';

/**
 * Interfaz específica para datos de Google Auth en localStorage
 */
export interface GoogleAuthData extends Record<string, unknown> {
  accessToken: string | null;
  isAuthenticated: boolean;
  courses: Course[];
  error?: string | null;
}