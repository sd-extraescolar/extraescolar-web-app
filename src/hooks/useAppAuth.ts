import { useGoogleAuth } from "@/features/login/hooks/useGoogleAuth";

export function useAppAuth() {
  const {
    isSignedIn,
    isLoading,
    courses,
    error,
    handleLogin,
    handleLogout,
    isGapiReady,
  } = useGoogleAuth();

  return {
    isAuthenticated: isSignedIn,
    isLoading: isLoading || !isGapiReady, // Considerar loading hasta que GAPI esté listo
    courses,
    error,
    handleLogin,
    handleLogout,
    isGapiReady,
  };
}