import { FeatureCard } from "../components/FeatureCard";

export const HomePage = () => {
  const features = [
    {
      icon: "📊",
      title: "Visualización inteligente del progreso",
      description:
        "Identifica rápidamente qué estudiantes están avanzando bien, cuáles necesitan apoyo y quiénes tienen tareas pendientes, todo de manera clara y ordenada.",
    },
    {
      icon: "👩‍🏫",
      title: "Gestión docente simplificada",
      description:
        "Agrupa a los alumnos según sus clases o módulos, evitando el trabajo manual de revisar uno por uno y facilitando la administración diaria.",
    },
    {
      icon: "🗂️",
      title: "Vista consolidada para coordinadores",
      description:
        "Accede a entregas, asistencias, calificaciones y comentarios de los profesores, todo integrado en un solo tablero de control.",
    },
    {
      icon: "🔔",
      title: "Alertas y notificaciones clave",
      description:
        "Recibe notificaciones importantes para evitar la pérdida de información y mejorar la comunicación entre estudiantes y docentes.",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <div className="mx-auto max-w-4xl space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Transforma tu experiencia con Google Classroom
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Extraescolar convierte Google Classroom en una herramienta mucho más{" "}
            <strong>organizada</strong>,<strong> colaborativa</strong> y{" "}
            <strong>eficiente</strong>, ayudando a que cada alumno reciba el
            seguimiento que necesita y cada profesor pueda enfocarse en enseñar.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="mb-2 text-2xl font-semibold">
            Con Extraescolar podés:
          </h3>
          <p className="text-muted-foreground">
            Potencia tu gestión educativa con estas funcionalidades clave
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="dark:from-education-green-950/20 dark:to-digital-blue-950/20 space-y-6 rounded-lg bg-gradient-to-r from-education-green-50 to-digital-blue-50 p-8 text-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-dark-text">
            ¿Listo para optimizar tu gestión educativa?
          </h3>
          <p className="mx-auto max-w-2xl text-medium-gray">
            Únete a los educadores que ya están transformando su experiencia con
            Google Classroom gracias a las herramientas inteligentes de
            Extraescolar.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-lg bg-education-green px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-education-green-600 hover:shadow-lg">
            Comenzar ahora
          </button>
          <button className="rounded-lg border-2 border-digital-blue bg-white px-6 py-3 font-medium text-digital-blue transition-colors hover:bg-digital-blue-50">
            Ver demo
          </button>
        </div>
      </section>

      {/* Target Audience */}
      <section className="grid gap-6 text-center md:grid-cols-3">
        <div className="dark:bg-education-green-950/20 group rounded-lg border border-education-green-200 bg-education-green-50 p-6 transition-all hover:shadow-lg dark:border-education-green-800">
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-education-green text-3xl text-white">
              👨‍🏫
            </div>
            <h4 className="text-lg font-semibold text-education-green-700">
              Para Profesores
            </h4>
            <p className="text-sm text-education-green-600">
              Gestiona tus clases de manera más eficiente y enfócate en lo que
              realmente importa: enseñar.
            </p>
          </div>
        </div>

        <div className="dark:bg-digital-blue-950/20 group rounded-lg border border-digital-blue-200 bg-digital-blue-50 p-6 transition-all hover:shadow-lg dark:border-digital-blue-800">
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-digital-blue text-3xl text-white">
              🎓
            </div>
            <h4 className="text-lg font-semibold text-digital-blue-700">
              Para Estudiantes
            </h4>
            <p className="text-sm text-digital-blue-600">
              Mantente al día con tus tareas y recibe el seguimiento
              personalizado que necesitas.
            </p>
          </div>
        </div>

        <div className="dark:bg-progress-yellow-950/20 group rounded-lg border border-progress-yellow-200 bg-progress-yellow-50 p-6 transition-all hover:shadow-lg dark:border-progress-yellow-800">
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-progress-yellow text-3xl text-dark-text">
              📋
            </div>
            <h4 className="text-lg font-semibold text-progress-yellow-700">
              Para Coordinadores
            </h4>
            <p className="text-sm text-progress-yellow-600">
              Obtén una vista completa del rendimiento académico y toma
              decisiones informadas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
