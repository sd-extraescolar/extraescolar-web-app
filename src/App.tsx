import { SEO } from "@/components/SEO";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { AppRoutes } from "@/routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <SEO />
      <AppRoutes isAuthenticated={isAuthenticated} isLoading={isLoading} />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;