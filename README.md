# Extraescolar

Complemento inteligente para Google Classroom que proporciona administración y visualización avanzada para profesores, estudiantes y coordinadores educativos.

## 🚀 Desarrollo

### Instalación y desarrollo
```bash
npm ci           # Instalar dependencias
npm run dev      # Levantar servidor de desarrollo
```

### Build y preview
```bash
npm run build    # Construir para producción
npm run preview  # Ver preview de la build
```

## 📁 Estructura Recomendada

```
src/
├── features/           # Módulos de funcionalidades
│   └── [feature-name]/
│       ├── components/ # Componentes específicos
│       ├── hooks/      # Hooks personalizados
│       ├── pages/      # Páginas del módulo
│       ├── services/   # Llamadas a APIs
│       ├── types/      # Interfaces y tipos
│       └── utils/      # Utilidades específicas
├── components/         # Componentes globales (SEO, Layout, etc.)
├── ui/                 # Componentes de shadcn/ui
├── lib/                # Utilidades de bibliotecas
├── utils/              # Utilidades globales
└── services/           # Servicios compartidos
```

## 🎨 Branding

Ver documentación completa de colores y diseño en [`BRANDING.md`](./BRANDING.md)