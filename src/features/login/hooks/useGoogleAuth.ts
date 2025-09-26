import type { Course, UseGoogleAuthReturn, UserProfile, Student } from '@/data';
import { GoogleAuthUtils } from '@/utils/GoogleAuthStorage';
import { useCallback, useEffect, useState } from 'react';

// Configuración de Google OAuth y Classroom API
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = [
  "https://classroom.googleapis.com/$discovery/rest?version=v1",
];
const SCOPES = 
  "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";

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
            students: {
              list: (params: { courseId: string; pageSize?: number }) => Promise<{
                result: {
                  students?: Student[];
                };
              }>;
            };
          };
        };
      };
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
          };
          currentUser: {
            get: () => {
              getBasicProfile: () => {
                getId: () => string;
                getName: () => string;
                getEmail: () => string;
                getImageUrl: () => string;
              };
            };
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(savedData.userProfile);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  
  // Debug: Log saved data
  console.log('useGoogleAuth - savedData:', savedData);
  console.log('useGoogleAuth - userProfile from storage:', savedData.userProfile);
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
          setStudents([]);
          setCurrentCourseId(null);
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
      }
    };
    
    validatePersistedToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  // Fetch user profile if authenticated but no profile data
  useEffect(() => {
    const fetchUserProfileIfNeeded = async () => {
      if (isSignedIn && accessToken && !userProfile && window.gapi) {
        console.log('User is authenticated but no profile data, fetching using Google Sign-In...');
        try {
          // Establecer el token de acceso en GAPI
          window.gapi.client.setToken({ access_token: accessToken });
          
          // Intentar obtener información del usuario usando Google Sign-In
          const authInstance = window.gapi.auth2.getAuthInstance();
          if (authInstance && authInstance.isSignedIn.get()) {
            const googleUser = authInstance.currentUser.get();
            const profile = googleUser.getBasicProfile();
            
            console.log('Fetched user profile on load using Google Sign-In:', {
              id: profile.getId(),
              name: profile.getName(),
              email: profile.getEmail(),
              imageUrl: profile.getImageUrl()
            });
            
            const userProfile: UserProfile = {
              id: profile.getId(),
              name: profile.getName(),
              email: profile.getEmail(),
              picture: profile.getImageUrl(),
            };
            
            setUserProfile(userProfile);
            // Update storage with the profile
            GoogleAuthUtils.saveSession(accessToken, courses, userProfile);
          } else {
            // Fallback: usar fetch si Google Sign-In no está disponible
            console.log('Google Sign-In not available on load, using fetch fallback...');
            const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });
            
            if (!userResponse.ok) {
              throw new Error('Error al obtener información del usuario');
            }
            
            const userInfo = await userResponse.json();
            console.log('Fetched user info on load using fetch (fallback):', userInfo);
            
            const profile: UserProfile = {
              id: userInfo.id,
              name: userInfo.name,
              email: userInfo.email,
              picture: userInfo.picture,
            };
            
            setUserProfile(profile);
            // Update storage with the profile
            GoogleAuthUtils.saveSession(accessToken, courses, profile);
          }
        } catch (err) {
          console.error('Error fetching user profile on load:', err);
        }
      }
    };
    
    fetchUserProfileIfNeeded();
  }, [isSignedIn, accessToken, userProfile, courses]);

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
        GoogleAuthUtils.saveSession(accessToken, coursesList, userProfile);
      }
    } catch (err) {
      console.error('Error obteniendo cursos:', err);
      setError('Error al obtener los cursos de Google Classroom');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, userProfile]);

  // Función para obtener estudiantes de un curso
  const fetchStudents = useCallback(async (courseId: string) => {
    if (!accessToken || !window.gapi) return;
    
    // Evitar llamadas duplicadas para el mismo curso
    if (currentCourseId === courseId && students.length > 0) {
      console.log(`Estudiantes ya cargados para el curso ${courseId}`);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Establecer el token de acceso
      window.gapi.client.setToken({ access_token: accessToken });
      
      const response = await window.gapi.client.classroom.courses.students.list({
        courseId: courseId,
        pageSize: 100,
      });
      
      const studentsList = response.result.students || [];
      setStudents(studentsList);
      setCurrentCourseId(courseId);
      
      console.log(`Estudiantes obtenidos para el curso ${courseId}:`, studentsList);
    } catch (err) {
      console.error('Error obteniendo estudiantes:', err);
      setError('Error al obtener los estudiantes del curso');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, currentCourseId, students.length]);

  // Callback para el OAuth token
  const handleTokenResponse = useCallback(async (response: { access_token: string }) => {
    console.log('Token recibido:', response);
    setAccessToken(response.access_token);
    setIsSignedIn(true);
    
    // Obtener perfil del usuario usando Google Sign-In
    try {
      console.log('Fetching user profile using Google Sign-In...');
      
      // Establecer el token de acceso en GAPI
      window.gapi.client.setToken({ access_token: response.access_token });
      
      // Obtener información del usuario usando Google Sign-In
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance && authInstance.isSignedIn.get()) {
        const googleUser = authInstance.currentUser.get();
        const profile = googleUser.getBasicProfile();
        
        console.log('User profile from Google Sign-In:', {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          imageUrl: profile.getImageUrl()
        });
        
        const userProfile: UserProfile = {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          picture: profile.getImageUrl(),
        };
        
        console.log('Created profile:', userProfile);
        setUserProfile(userProfile);
        
        // Persistir datos de autenticación
        GoogleAuthUtils.saveSession(response.access_token, [], userProfile);
      } else {
        // Fallback: usar fetch si Google Sign-In no está disponible
        console.log('Google Sign-In not available, using fetch fallback...');
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${response.access_token}`,
          },
        });
        
        if (!userResponse.ok) {
          throw new Error('Error al obtener información del usuario');
        }
        
        const userInfo = await userResponse.json();
        console.log('User info from Google API (fallback):', userInfo);
        
        const profile: UserProfile = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        };
        
        console.log('Created profile (fallback):', profile);
        setUserProfile(profile);
        
        // Persistir datos de autenticación
        GoogleAuthUtils.saveSession(response.access_token, [], profile);
      }
    } catch (err) {
      console.error('Error obteniendo perfil del usuario:', err);
      setError('Error al obtener la información del usuario');
    }
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
        setUserProfile(null);
        setStudents([]);
        setCurrentCourseId(null);
        
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
    userProfile,
    error,
    handleLogin,
    handleLogout,
    isGapiReady,
    students,
    fetchStudents,
  };
}