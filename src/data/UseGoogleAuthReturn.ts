import type { Course } from './Course';

/**
 * Interfaz para el retorno del hook useGoogleAuth
 */
export interface UseGoogleAuthReturn {
  isSignedIn: boolean;
  isLoading: boolean;
  courses: Course[];
  error: string | null;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  isGapiReady: boolean;
}