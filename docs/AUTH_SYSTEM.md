# Sistema de Autenticación y Rutas Protegidas

## Arquitectura

La aplicación ahora implementa un sistema completo de autenticación con rutas protegidas:

### 🔐 Flujo de Autenticación

1. **Usuario no autenticado** → Redirige automáticamente a `/login`
2. **Usuario autenticado** → Acceso completo a todas las rutas
3. **Intento de acceso a `/login` estando autenticado** → Redirige a `/`

### 📁 Estructura de Componentes

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación global
├── hooks/
│   ├── useAuth.ts               # Hook para usar el contexto
│   └── useAppAuth.ts            # Hook simplificado (opcional)
├── components/
│   ├── AppRoutes.tsx            # Manejo de rutas protegidas
│   └── Layout.tsx               # Layout con botón de logout
└── features/login/
    ├── hooks/useGoogleAuth.ts   # Lógica de autenticación con Google
    └── page/LoginPage.tsx       # Página de login
```

## 🚀 Componentes Principales

### `AuthContext` y `AuthProvider`

Proporciona estado global de autenticación:

```tsx
// Envuelve tu app
<AuthProvider>
  <App />
</AuthProvider>

// Usa en cualquier componente
const { isAuthenticated, handleLogout } = useAuth();
```

### `AppRoutes`

Maneja la lógica de rutas protegidas:

- **Loading**: Muestra spinner mientras verifica autenticación
- **No autenticado**: Solo permite acceso a `/login`
- **Autenticado**: Acceso completo + redirige `/login` a `/`

### `Layout` Mejorado

Incluye navegación con botón de logout automático.

## 🔄 Estados de la Aplicación

### 1. **Loading** (Verificando autenticación)
```
┌─────────────────────┐
│   Verificando...   │
│     ⏳ Spinner      │
└─────────────────────┘
```

### 2. **No Autenticado**
```
Cualquier ruta → /login
```

### 3. **Autenticado**
```
/login → /  (redirige)
/      → Home con Layout
/about → About con Layout
/*     → 404 con Layout
```

## 📝 Uso en Componentes

### Hook `useAuth`

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const {
    isAuthenticated,    // boolean
    isLoading,         // boolean  
    courses,           // Course[]
    error,             // string | null
    handleLogin,       // () => Promise<void>
    handleLogout,      // () => Promise<void>
    isGapiReady       // boolean
  } = useAuth();

  return (
    <div>
      {isAuthenticated ? 'Logged in!' : 'Please log in'}
    </div>
  );
}
```

### Rutas Protegidas

```tsx
// No necesitas manejar autenticación manualmente
// AppRoutes se encarga automáticamente

function ProtectedPage() {
  // Este componente solo se renderiza si está autenticado
  return <div>Contenido protegido</div>;
}
```

## ⚡ Ventajas

- ✅ **Separación de responsabilidades**: Rutas, auth, y UI separados
- ✅ **Reutilizable**: Hook `useAuth` disponible en toda la app
- ✅ **Automático**: Redirecciones y protección sin código adicional
- ✅ **TypeScript**: Completamente tipado
- ✅ **UX mejorada**: Loading states y manejo de errores
- ✅ **Seguridad**: No hay acceso a rutas sin autenticación

## 🔧 Personalización

Para agregar nuevas rutas protegidas, simplemente edita `AppRoutes.tsx`:

```tsx
// Ruta autenticada
<Route path="/new-page" element={<Layout><NewPage /></Layout>} />

// Ruta pública (raro, pero posible)
<Route path="/public" element={<PublicPage />} />
```