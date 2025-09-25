import type { GoogleAuthData } from '@/data';
import { AuthStorage } from './AuthStorage';

// Configuración específica para Google Auth
const GOOGLE_AUTH_CONFIG = {
  prefix: 'google_auth',
  keys: {
    accessToken: 'access_token',
    isAuthenticated: 'is_signed_in',
    courses: 'courses',
    error: 'error'
  }
};

// Instancia especializada para Google Auth
export const googleAuthStorage = new AuthStorage<GoogleAuthData>(GOOGLE_AUTH_CONFIG);

// Funciones de conveniencia específicas para Google Auth
export const GoogleAuthUtils = {
  saveSession: (accessToken: string, courses?: GoogleAuthData['courses']) => {
    return googleAuthStorage.save({
      accessToken,
      isAuthenticated: true,
      courses: courses || [],
      error: null
    });
  },

  loadSession: () => {
    const data = googleAuthStorage.load();
    return {
      accessToken: data.accessToken || null,
      isAuthenticated: Boolean(data.isAuthenticated && data.accessToken),
      courses: Array.isArray(data.courses) ? data.courses : [],
      error: data.error || null
    };
  },

  updateCourses: (courses: GoogleAuthData['courses']) => {
    return googleAuthStorage.update({ courses });
  },

  setError: (error: string | null) => {
    return googleAuthStorage.update({ error });
  },

  clearSession: () => {
    return googleAuthStorage.clear();
  },

  hasValidSession: () => {
    return googleAuthStorage.hasValidSession();
  },

  validateSession: async () => {
    return await googleAuthStorage.validateAndCleanup();
  }
};