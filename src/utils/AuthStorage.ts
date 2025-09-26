/**
 * Clase utilitaria genérica para manejar la persistencia de datos de autenticación
 * en localStorage con validación y limpieza automática
 */

export interface AuthData {
  accessToken: string | null;
  isAuthenticated: boolean;
  userData?: Record<string, unknown>;
  courses?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface StorageConfig {
  prefix: string;
  keys: {
    accessToken: string;
    isAuthenticated: string;
    userData?: string;
    courses?: string;
    [key: string]: string | undefined;
  };
}

export class AuthStorage<T extends AuthData = AuthData> {
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  /**
   * Guarda datos de autenticación en localStorage
   */
  save(data: Partial<T>): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        const storageKey = this.config.keys[key];
        if (storageKey) {
          const fullKey = `${this.config.prefix}_${storageKey}`;
          if (typeof value === 'boolean' || typeof value === 'object') {
            localStorage.setItem(fullKey, JSON.stringify(value));
          } else {
            localStorage.setItem(fullKey, String(value));
          }
        }
      });
      return true;
    } catch (error) {
      console.error('Error guardando datos de autenticación:', error);
      return false;
    }
  }

  /**
   * Carga datos de autenticación desde localStorage
   */
  load(): Partial<T> {
    try {
      const data: Partial<T> = {};
      
      Object.entries(this.config.keys).forEach(([key, storageKey]) => {
        if (storageKey) {
          const fullKey = `${this.config.prefix}_${storageKey}`;
          const value = localStorage.getItem(fullKey);
          
          if (value !== null) {
            try {
              // Intentar parsear como JSON, si falla usar como string
              (data as Record<string, unknown>)[key] = JSON.parse(value);
            } catch {
              (data as Record<string, unknown>)[key] = value;
            }
          }
        }
      });

      // Validar integridad: solo considerar autenticado si hay token
      if (data.isAuthenticated && !data.accessToken) {
        data.isAuthenticated = false;
      }

      return data;
    } catch (error) {
      console.error('Error cargando datos de autenticación:', error);
      return {};
    }
  }

  /**
   * Limpia todos los datos de autenticación
   */
  clear(): boolean {
    try {
      Object.values(this.config.keys).forEach(storageKey => {
        if (storageKey) {
          const fullKey = `${this.config.prefix}_${storageKey}`;
          localStorage.removeItem(fullKey);
        }
      });
      return true;
    } catch (error) {
      console.error('Error limpiando datos de autenticación:', error);
      return false;
    }
  }

  /**
   * Verifica si un token de acceso sigue siendo válido
   */
  async isTokenValid(token: string): Promise<boolean> {
    try {
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
      return response.ok;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }

  /**
   * Valida y limpia datos expirados automáticamente
   */
  async validateAndCleanup(): Promise<boolean> {
    const data = this.load();
    
    if (data.accessToken && data.isAuthenticated) {
      const isValid = await this.isTokenValid(data.accessToken);
      if (!isValid) {
        console.log('Token expirado, limpiando datos de autenticación');
        this.clear();
        return false;
      }
    }
    
    return true;
  }

  /**
   * Actualiza solo campos específicos sin sobrescribir todo
   */
  update(partialData: Partial<T>): boolean {
    const currentData = this.load();
    const mergedData = { ...currentData, ...partialData };
    return this.save(mergedData);
  }

  /**
   * Verifica si hay datos de autenticación válidos
   */
  hasValidSession(): boolean {
    const data = this.load();
    return Boolean(data.accessToken && data.isAuthenticated);
  }
}