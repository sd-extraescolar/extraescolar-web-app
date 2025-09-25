import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="dark:from-education-green-950/20 dark:to-digital-blue-950/20 border-b bg-gradient-to-r from-education-green-50 to-digital-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6 text-center">
            <Link to="/">
              <h1 className="bg-gradient-to-r from-education-green-600 to-digital-blue-600 bg-clip-text text-4xl font-bold text-transparent hover:opacity-80 transition-opacity">
                Extraescolar
              </h1>
            </Link>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Complementa{" "}
              <span className="font-semibold text-digital-blue-600">
                Google Classroom
              </span>{" "}
              con una capa de administración y visualización inteligente
            </p>
            <p className="text-sm text-muted-foreground">
              Diseñado especialmente para profesores, estudiantes y
              coordinadores
            </p>
            
            {/* Simple Navigation */}
            <nav className="flex justify-center gap-6 pt-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-education-green text-white'
                    : 'text-education-green-700 hover:bg-education-green-100'
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/about'
                    ? 'bg-digital-blue text-white'
                    : 'text-digital-blue-700 hover:bg-digital-blue-100'
                }`}
              >
                Acerca de
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="mt-auto border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Extraescolar. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
