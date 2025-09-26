import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { Logo } from "@/components/logo"
import { StaticShapes } from "@/components/static-shapes"
import { CourseList } from "@/features/login/components/CourseList"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const {
    isAuthenticated,
    isLoading,
    courses,
    error,
    handleLogin,
    handleLogout,
    isGapiReady,
  } = useAuth();

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-blue-50">
      <StaticShapes />

      {/* Header */}
      <header className="relative z-10 p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-8">
        <div className="text-center max-w-2xl mx-auto space-y-8 w-full">
          {/* Welcome Message */}
          <div className="space-y-2">
              <p className="font-bold text-2xl text-gray-300 mb-[-8px]">Beta</p>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">
              {"¡Bienvenido a "}
              <span className="text-primary">Extraescolar</span>
              {"!"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
              Somos una extensión de Google Classroom para profesores
              <br className="hidden sm:block" />
              que facilita la gestión y el trackeo de tus cursos
            </p>
          </div>

          {/* Sign In Section */}
          <div className="space-y-4">
            <p className="text-base text-foreground font-medium">Para continuar, inicia sesión</p>
            
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {isAuthenticated && (
              <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-md text-sm">
                ¡Autenticación exitosa! {courses.length > 0 && `Encontrados ${courses.length} cursos.`}
              </div>
            )}
            
            <div className="flex justify-center">
              {!isAuthenticated ? (
                <GoogleSignInButton 
                  onClick={handleLogin}
                  isLoading={isLoading}
                  isDisabled={!isGapiReady}
                />
              ) : (
                <div className="space-y-3">
                  <GoogleSignInButton 
                    onClick={handleLogout}
                    isLoading={isLoading}
                    isDisabled={!isGapiReady}
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Haz clic para cerrar sesión
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course List - shown when authenticated */}
        {isAuthenticated && (
          <CourseList courses={courses} isLoading={isLoading} />
        )}

      </main>
    </div>
  )
}
