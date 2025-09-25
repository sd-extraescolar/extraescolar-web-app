import type { Course, UseGoogleAuthReturn } from '@/data';
import { GoogleAuthUtils } from '@/utils/GoogleAuthStorage';
import { useCallback, useEffect, useState } from 'react';

// Configuración de Google OAuth y Classroom API
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = [
  "https://classroom.googleapis.com/$discovery/rest?version=v1",
];
const SCOPES = 
  "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly";

// Declaración de tipos para Google Identity Services y API
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, options: {
            theme?: string;
            size?: string;
            type?: string;
          }) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
    gapi: {
      load: (libraries: string, callback: () => void) => void;
      client: {
        init: (config: {
          apiKey: string;
          discoveryDocs: string[];
        }) => Promise<void>;
        setToken: (token: { access_token: string }) => void;
        classroom: {
          courses: {
            list: (params: { pageSize: number }) => Promise<{
              result: {
                courses?: Course[];
              };
            }>;
          };
        };
      };
    };
  }
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  // Cargar datos persistidos al inicializar usando las nuevas utilidades
  const savedData = GoogleAuthUtils.loadSession();
  
  const [isSignedIn, setIsSignedIn] = useState<boolean>(savedData.isAuthenticated);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>(savedData.courses);
  const [error, setError] = useState<string | null>(savedData.error);
  const [isGapiReady, setIsGapiReady] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(savedData.accessToken);

  // Validar token persistido al cargar
  useEffect(() => {
    const validatePersistedToken = async () => {
      if (savedData.accessToken && savedData.isAuthenticated) {
        const isValid = await GoogleAuthUtils.validateSession();
        if (!isValid) {
          console.log('Token expirado, limpiando datos de autenticación');
          setAccessToken(null);
          setIsSignedIn(false);
          setCourses([]);
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
      }
    };
    
    validatePersistedToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  // Validar variables de entorno
  useEffect(() => {
    if (!CLIENT_ID) {
      setError('VITE_GOOGLE_CLIENT_ID no está configurado en las variables de entorno');
      return;
    }
    if (!API_KEY) {
      setError('VITE_GOOGLE_API_KEY no está configurado en las variables de entorno');
      return;
    }
  }, []);

  // Función para obtener cursos
  const fetchCourses = useCallback(async () => {
    if (!accessToken || !window.gapi) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Establecer el token de acceso
      window.gapi.client.setToken({ access_token: accessToken });
      
      const response = await window.gapi.client.classroom.courses.list({
        pageSize: 10,
      });
      
      const coursesList = response.result.courses || [];
      setCourses(coursesList);
      
      // Persistir cursos si hay token de acceso
      if (accessToken) {
        GoogleAuthUtils.saveSession(accessToken, coursesList);
      }
    } catch (err) {
      console.error('Error obteniendo cursos:', err);
      setError('Error al obtener los cursos de Google Classroom');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // Callback para el OAuth token
  const handleTokenResponse = useCallback((response: { access_token: string }) => {
    console.log('Token recibido:', response);
    setAccessToken(response.access_token);
    setIsSignedIn(true);
    
    // Persistir datos de autenticación
    GoogleAuthUtils.saveSession(response.access_token);
  }, []);

  // Inicializar Google Identity Services y GAPI
  useEffect(() => {
    // No inicializar si hay errores de configuración
    if (error) {
      return;
    }

    // No inicializar si faltan las variables de entorno
    if (!CLIENT_ID || !API_KEY) {
      return;
    }

    const initializeServices = async () => {
      try {
        setIsLoading(true);

        // Esperar a que ambos scripts estén cargados
        const waitForScripts = () => {
          return new Promise<void>((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 segundos máximo

            const checkScripts = () => {
              attempts++;
              
              if (window.google && window.gapi) {
                resolve();
              } else if (attempts >= maxAttempts) {
                reject(new Error('Los scripts de Google no se cargaron correctamente'));
              } else {
                setTimeout(checkScripts, 100);
              }
            };
            
            checkScripts();
          });
        };

        await waitForScripts();

        // Inicializar GAPI Client
        await new Promise<void>((resolve) => {
          window.gapi.load('client', resolve);
        });

        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        });

        setIsGapiReady(true);
        setError(null);
      } catch (err) {
        console.error('Error inicializando servicios de Google:', err);
        setError(`Error al inicializar los servicios de Google: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeServices();
  }, [error]);

  // Efectos para obtener cursos cuando tengamos token
  useEffect(() => {
    if (accessToken && isGapiReady) {
      fetchCourses();
    }
  }, [accessToken, isGapiReady, fetchCourses]);

  // Función para hacer login
  const handleLogin = useCallback(async () => {
    if (!isGapiReady || !window.google) {
      setError('Los servicios de Google no están listos');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Crear cliente OAuth2
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: handleTokenResponse,
      });

      // Solicitar token de acceso
      tokenClient.requestAccessToken();
    } catch (err) {
      console.error('Error al hacer login:', err);
      setError(`Error al iniciar sesión con Google: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setIsLoading(false);
    }
  }, [isGapiReady, handleTokenResponse]);

  // Función para hacer logout
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Revocar el token si existe
      if (accessToken && window.google) {
        // Google Identity Services no tiene una función directa de logout,
        // pero podemos limpiar el estado local
        setAccessToken(null);
        setIsSignedIn(false);
        setCourses([]);
        
        // Limpiar datos persistidos
        GoogleAuthUtils.clearSession();
      }
    } catch (err) {
      console.error('Error al hacer logout:', err);
      setError(`Error al cerrar sesión: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    isSignedIn,
    isLoading,
    courses,
    error,
    handleLogin,
    handleLogout,
    isGapiReady,
  };
}