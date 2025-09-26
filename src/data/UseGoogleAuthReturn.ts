import type { Course } from './Course';
import type { UserProfile } from './GoogleAuthData';
import type { Student } from './Student';

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
  students: Student[];
  fetchStudents: (courseId: string) => Promise<void>;
}