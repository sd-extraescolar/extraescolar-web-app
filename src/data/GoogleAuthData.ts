import type { Course } from './Course';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

/**
 * Interfaz específica para datos de Google Auth en localStorage
 */
export interface GoogleAuthData extends Record<string, unknown> {
  accessToken: string | null;
  isAuthenticated: boolean;
  courses: Course[];
  userProfile: UserProfile | null;
  error?: string | null;
}