# Login Feature - Google Identity Services Integration

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` basado en `.env.example` con las siguientes variables:

```bash
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. Configuración en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Google Classroom API

4. Crea credenciales OAuth 2.0:
   - Ve a "Credentials" > "Create Credentials" > "OAuth client ID"
   - Tipo de aplicación: "Web application"
   - Agrega tu dominio en "Authorized JavaScript origins"
   - Agrega las URIs de redirección autorizadas

5. Copia el Client ID y API Key a tu archivo `.env`

## Migración a Google Identity Services

⚠️ **Importante**: Este proyecto usa las nuevas **Google Identity Services** (GIS) en lugar de las librerías obsoletas `gapi.auth2`. 

### Cambios principales:
- ✅ Migrado de `gapi.auth2` a `google.accounts.oauth2`
- ✅ Uso de tokens de acceso en lugar de sesiones persistentes
- ✅ Mejor manejo de seguridad y privacidad
- ✅ Compatible con las políticas actuales de Google

## Scripts Incluidos

El proyecto carga automáticamente:
```html
<!-- Google Identity Services -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
<!-- Google API Client -->
<script src="https://apis.google.com/js/api.js"></script>
```

## Estructura del Feature

```
src/features/login/
├── hooks/
│   └── useGoogleAuth.ts          # Hook con Google Identity Services
├── components/
│   └── CourseList.tsx            # Lista de cursos de Google Classroom
├── page/
│   └── LoginPage.tsx             # Página principal de login
```

## Uso

### Hook `useGoogleAuth`

```typescript
const {
  isSignedIn,     // Estado de autenticación
  isLoading,      // Estado de carga
  courses,        // Lista de cursos del usuario
  error,          // Errores de autenticación
  handleLogin,    // Función para iniciar sesión
  handleLogout,   // Función para cerrar sesión
  isGapiReady,    // Estado de inicialización de Google API
} = useGoogleAuth();
```

### Componente `GoogleSignInButton`

```typescript
<GoogleSignInButton 
  onClick={handleLogin}
  isLoading={isLoading}
  isDisabled={!isGapiReady}
/>
```

## Funcionalidades

- ✅ Autenticación OAuth 2.0 con Google Identity Services
- ✅ Integración con Google Classroom API
- ✅ Listado de cursos del usuario autenticado
- ✅ Manejo de estados de carga y errores
- ✅ UI responsiva con Tailwind CSS
- ✅ Tipos TypeScript completos
- ✅ Hook reutilizable para otros componentes
- ✅ Compatible con las nuevas políticas de Google

## Permisos Requeridos

El hook solicita los siguientes permisos de Google Classroom:

- `classroom.courses.readonly` - Leer cursos
- `classroom.coursework.me.readonly` - Leer trabajos del usuario

## Notas de Desarrollo

- Los scripts de Google se cargan desde los CDN oficiales
- El hook maneja automáticamente la inicialización de ambos servicios
- Los errores se muestran en la interfaz de usuario
- Los tokens de acceso se manejan de forma segura en memoria
- **Logout**: Limpia el estado local (Google Identity Services no mantiene sesiones persistentes)