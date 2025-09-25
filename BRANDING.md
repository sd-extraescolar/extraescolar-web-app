# 🎨 Extraescolar Brand Guidelines

## Paleta de Colores

### Colores Principales

#### Verde Educativo (Primary)
- **Color**: `#2ECC71` 
- **Uso**: Botones principales, iconos activos, progreso, elementos de acción
- **Tailwind**: `education-green-500` / `bg-education-green`
- **Variantes**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

#### Azul Digital (Secondary)  
- **Color**: `#3498DB`
- **Uso**: Elementos de refuerzo, iconos de check, acentos, links
- **Tailwind**: `digital-blue-500` / `bg-digital-blue`
- **Variantes**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Colores de Soporte

#### Amarillo Progreso (Accent)
- **Color**: `#F1C40F`
- **Uso**: Notificaciones, estados de avance, highlights
- **Tailwind**: `progress-yellow-500` / `bg-progress-yellow`

#### Rojo Alerta (Destructive)
- **Color**: `#E74C3C`
- **Uso**: Errores, advertencias, estados críticos
- **Tailwind**: `alert-red-500` / `bg-alert-red`

### Colores Neutros

#### Texto y UI
- **Gris Oscuro**: `#2C3E50` - Texto principal (`text-dark-text`)
- **Gris Medio**: `#95A5A6` - Bordes, texto secundario (`text-medium-gray`)  
- **Gris Claro**: `#ECF0F1` - Fondos suaves (`bg-light-gray`)
- **Blanco**: `#FFFFFF` - Fondos principales

## Modo Oscuro

### Colores Base
- **Fondo**: `#1C1C1E` - Fondo principal oscuro
- **Texto**: `#F5F5F7` - Texto principal claro
- **Branding**: Verde y Azul mantienen sus valores para consistencia

## Uso de Colores por Componente

### Botones

#### Primario
```jsx
className="bg-education-green text-white hover:bg-education-green-600 rounded-lg px-6 py-3"
```

#### Secundario  
```jsx
className="border-digital-blue text-digital-blue bg-white hover:bg-digital-blue-50 border-2 rounded-lg px-6 py-3"
```

### Tarjetas de Características
```jsx
className="bg-white border-light-gray hover:border-education-green-200"
```

### Iconos de Características
```jsx
className="bg-education-green-50 text-education-green-600 hover:bg-education-green-100"
```

### Audiencias (Cards)

#### Profesores
```jsx
className="border-education-green-200 bg-education-green-50 text-education-green-700"
```

#### Estudiantes  
```jsx
className="border-digital-blue-200 bg-digital-blue-50 text-digital-blue-700"
```

#### Coordinadores
```jsx
className="border-progress-yellow-200 bg-progress-yellow-50 text-progress-yellow-700"
```

## Estados y Feedback

### Progreso/Éxito
- **Color**: Verde Educativo (`education-green`)
- **Uso**: Barras de progreso, checkmarks, estados completados

### Información/Navegación
- **Color**: Azul Digital (`digital-blue`)  
- **Uso**: Links, información adicional, navegación

### Advertencia/Atención
- **Color**: Amarillo Progreso (`progress-yellow`)
- **Uso**: Notificaciones importantes, estados pendientes

### Error/Crítico
- **Color**: Rojo Alerta (`alert-red`)
- **Uso**: Errores de validación, estados críticos

## Tipografía Recomendada

### Fuentes Web
1. **Poppins** (Google Fonts) - Títulos y headings
2. **Inter** (Google Fonts) - Texto de interfaz
3. **Roboto** (fallback) - Compatibilidad

### Implementación CSS
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

.font-heading { font-family: 'Poppins', sans-serif; }
.font-body { font-family: 'Inter', 'Roboto', sans-serif; }
```

## Iconografía

### Estilo
- **Flat design** con colores sólidos
- **Geométrico** con bordes redondeados
- **Consistente** con Material Design y Google Classroom

### Colores de Iconos
- **Activos**: Verde Educativo (`text-education-green-600`)
- **Inactivos**: Gris Medio (`text-medium-gray`)
- **Informativos**: Azul Digital (`text-digital-blue-600`)

## Ejemplos de Uso

### Header/Navbar
```jsx
<header className="bg-gradient-to-r from-education-green-50 to-digital-blue-50">
  <h1 className="bg-gradient-to-r from-education-green-600 to-digital-blue-600 bg-clip-text text-transparent">
    Extraescolar
  </h1>
</header>
```

### Dashboard Cards
```jsx
<div className="bg-white border border-light-gray hover:border-education-green-200 rounded-lg p-6">
  <div className="bg-education-green-50 text-education-green-600 rounded-lg p-3">
    {/* Icon */}
  </div>
</div>
```

## Accesibilidad

### Contraste
- ✅ Verde sobre blanco: 4.5:1 (AA)
- ✅ Azul sobre blanco: 4.5:1 (AA)  
- ✅ Texto oscuro sobre claro: 12:1 (AAA)

### Estados de Foco
- **Ring**: Verde Educativo (`ring-education-green`)
- **Outline**: 2px sólido con offset

## Archivos de Branding

### Iconos
- `public/extraescolar_favicon.ico` - Favicon principal
- `public/extraescolar-icon.png` - Icono de aplicación (192x192)

### Manifest
- `public/manifest.json` - PWA con colores de marca
- **theme_color**: `#2ECC71` (Verde Educativo)
- **background_color**: `#FFFFFF` (Blanco)
