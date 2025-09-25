import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { Logo } from "@/components/logo"

export default function LoginPage() {
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
          <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-[-3]">Beta</p>
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
            <div className="flex justify-center">
              <GoogleSignInButton />
            </div>
          </div>
        </div>

        {/* Decorative elements that follow the drawn lines */}
        <div className="absolute left-0 top-1/4 w-1/3 h-1/2 pointer-events-none hidden lg:block">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 300 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M50 100 Q150 50 200 150 T300 250"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              fill="none"
              className="animate-pulse-glow"
            />
          </svg>
        </div>

        <div className="absolute right-0 top-1/3 w-1/3 h-1/2 pointer-events-none hidden lg:block">
          <svg
            className="w-full h-full opacity-25"
            viewBox="0 0 300 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="hsl(var(--primary))" />
              </pattern>
            </defs>
            <rect width="300" height="400" fill="url(#dots)" className="animate-pulse-glow" />
            <path
              d="M50 80 L250 120 M80 200 L280 240 M60 320 L240 360"
              stroke="hsl(var(--chart-2))"
              strokeWidth="2"
              strokeDasharray="10,5"
              className="animate-float-geometric"
            />
          </svg>
        </div>
      </main>
    </div>
  )
}
