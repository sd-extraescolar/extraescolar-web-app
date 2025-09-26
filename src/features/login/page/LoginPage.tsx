import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { Logo } from "@/components/logo"
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
    <div className="min-h-screen w-full relative overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />

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
              <span className="text-primary">ExtraScolar</span>
              {"!"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
              Somos una extensión de Google Classroom que facilita
              <br className="hidden sm:block" />
              la gestión y el trackeo los cursos de los profesores
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

        {/* Decorative elements that follow the drawn lines - positioned closer to corners */}
        <div className="absolute left-0 top-8 w-1/4 h-1/3 pointer-events-none hidden lg:block">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 300 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M20 50 Q80 20 120 80 T180 150"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              fill="none"
              className="animate-pulse-glow"
            />
          </svg>
        </div>

        <div className="absolute right-0 top-8 w-1/4 h-1/3 pointer-events-none hidden lg:block">
          <svg
            className="w-full h-full opacity-25"
            viewBox="0 0 300 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="dots-top" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="hsl(var(--primary))" />
              </pattern>
            </defs>
            <rect width="200" height="150" fill="url(#dots-top)" className="animate-pulse-glow" />
            <path
              d="M180 40 L280 60 M200 80 L270 100 M190 120 L260 140"
              stroke="hsl(var(--chart-2))"
              strokeWidth="2"
              strokeDasharray="10,5"
              className="animate-float-geometric"
            />
          </svg>
        </div>

        {/* Bottom corner decorative elements */}
        <div className="absolute left-0 bottom-8 w-1/4 h-1/4 pointer-events-none hidden lg:block">
          <svg
            className="w-full h-full opacity-15"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M20 250 Q60 200 100 240 T160 270"
              stroke="hsl(var(--secondary))"
              strokeWidth="2"
              fill="none"
              className="animate-pulse-glow"
            />
          </svg>
        </div>

        <div className="absolute right-0 bottom-8 w-1/4 h-1/4 pointer-events-none hidden lg:block">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="dots-bottom" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="1.5" fill="hsl(var(--chart-3))" />
              </pattern>
            </defs>
            <rect width="150" height="120" x="150" y="180" fill="url(#dots-bottom)" className="animate-pulse-glow" />
          </svg>
        </div>
      </main>
    </div>
  )
}
