export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

export const defaultSEO: SEOProps = {
  title: "Extraescolar - Complemento inteligente para Google Classroom",
  description: "Extraescolar complementa Google Classroom con administración inteligente para profesores, estudiantes y coordinadores. Visualiza progreso académico, gestiona clases y recibe alertas clave.",
  keywords: "google classroom, gestión educativa, progreso académico, administración escolar, profesores, estudiantes, coordinadores, classroom complemento, educación digital, seguimiento estudiantil",
  ogImage: "/extraescolar-icon.png",
  ogUrl: "https://extraescolar.com/",
};