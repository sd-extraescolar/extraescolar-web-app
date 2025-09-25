import { useGoogleAuth } from "@/features/login/hooks/useGoogleAuth";
import type { ReactNode } from 'react';
import { createContext } from 'react';

interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  enrollmentCode?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  courses: Course[];
  error: string | null;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  isGapiReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isSignedIn,
    isLoading,
    courses,
    error,
    handleLogin,
    handleLogout,
    isGapiReady,
  } = useGoogleAuth();

  const value = {
    isAuthenticated: isSignedIn,
    isLoading: isLoading || !isGapiReady,
    courses,
    error,
    handleLogin,
    handleLogout,
    isGapiReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}