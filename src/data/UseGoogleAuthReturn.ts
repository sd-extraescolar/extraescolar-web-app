import type { Course } from './Course';
import type { UserProfile } from './GoogleAuthData';

/**
 * Interfaz para el retorno del hook useGoogleAuth
 */
export interface UseGoogleAuthReturn {
  isSignedIn: boolean;
  isLoading: boolean;
  courses: Course[];
  userProfile: UserProfile | null;
  error: string | null;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  isGapiReady: boolean;
}