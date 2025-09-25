import { SEO } from "@/components/SEO";

export const AboutPage = () => {
  return (
    <>
      <SEO 
        title="Acerca de - Extraescolar"
        description="Conoce más sobre Extraescolar, el complemento inteligente para Google Classroom que revoluciona la gestión educativa."
      />
      
      <div className="space-y-12">
        {/* Header */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-dark-text">
            Acerca de Extraescolar
          </h1>
          <p className="text-lg text-medium-gray max-w-3xl mx-auto">
            Nuestra misión es transformar la experiencia educativa mediante 
            tecnología inteligente que conecta profesores, estudiantes y coordinadores.
          </p>
        </section>

        {/* Mission */}
        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-education-green-700">
              Nuestra Misión
            </h2>
            <p className="text-medium-gray leading-relaxed">
              Complementar Google Classroom con herramientas inteligentes que 
              simplifican la gestión educativa, permitiendo que educadores se 
              enfoquen en lo que realmente importa: enseñar y aprender.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-digital-blue-700">
              Nuestra Visión
            </h2>
            <p className="text-medium-gray leading-relaxed">
              Ser la plataforma líder que revoluciona la educación digital, 
              creando un ecosistema donde cada estudiante recibe el seguimiento 
              personalizado que necesita para alcanzar su máximo potencial.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-dark-text">
            Nuestros Valores
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-4 p-6 rounded-lg border border-education-green-200 bg-education-green-50">
              <div className="text-4xl">🎯</div>
              <h3 className="text-lg font-semibold text-education-green-700">
                Enfoque
              </h3>
              <p className="text-sm text-education-green-600">
                Nos centramos en soluciones que realmente impactan el aprendizaje
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-lg border border-digital-blue-200 bg-digital-blue-50">
              <div className="text-4xl">🤝</div>
              <h3 className="text-lg font-semibold text-digital-blue-700">
                Colaboración
              </h3>
              <p className="text-sm text-digital-blue-600">
                Creemos en el poder de la comunidad educativa trabajando unidos
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-lg border border-progress-yellow-200 bg-progress-yellow-50">
              <div className="text-4xl">💡</div>
              <h3 className="text-lg font-semibold text-progress-yellow-700">
                Innovación
              </h3>
              <p className="text-sm text-progress-yellow-600">
                Constantemente mejoramos con tecnología de vanguardia
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
