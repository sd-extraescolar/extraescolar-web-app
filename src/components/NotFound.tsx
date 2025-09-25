import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-education-green">404</h1>
        <h2 className="text-2xl font-semibold text-dark-text">
          Página no encontrada
        </h2>
        <p className="text-medium-gray max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
      </div>
      
      <Link
        to="/"
        className="rounded-lg bg-education-green px-6 py-3 font-medium text-white transition-colors hover:bg-education-green-600"
      >
        Volver al inicio
      </Link>
    </div>
  );
};
