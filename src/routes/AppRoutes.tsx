import { Layout } from "@/components/Layout";
import { NotFound } from "@/components/NotFound";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { AboutPage } from "@/features/about/page/AboutPage";
import { DashboardPage } from "@/features/dashboard/page/DashboardPage";
import LoginPage from "@/features/login/page/LoginPage";
import { NotasPage } from "@/features/notas/page/NotasPage";
import { PresencialidadPage } from "@/features/presencialidad/page/PresencialidadPage";
import { Navigate, Route, Routes } from "react-router-dom";

interface AppRoutesProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function AppRoutes({ isAuthenticated, isLoading }: AppRoutesProps) {
  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <LoadingScreen 
          title="Verificando autenticación..."
          subtitle="Validando credenciales de Google"
          spinnerSize="md"
          spinnerColor="purple"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Si está autenticado, mostrar rutas protegidas con layout
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/presencialidad" element={<Layout><PresencialidadPage /></Layout>} />
      <Route path="/notas" element={<Layout><NotasPage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}