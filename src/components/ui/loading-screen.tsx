interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  spinnerSize?: 'sm' | 'md' | 'lg';
  spinnerColor?: 'purple' | 'blue' | 'gray';
}

export const LoadingScreen = ({ 
  title = "Cargando...", 
  subtitle = "Obteniendo información",
  spinnerSize = 'md',
  spinnerColor = 'purple'
}: LoadingScreenProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };

  const colorClasses = {
    purple: 'border-purple-200 border-t-purple-600',
    blue: 'border-blue-200 border-t-blue-600',
    gray: 'border-gray-200 border-t-gray-600'
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="mb-6">
          <div className={`${sizeClasses[spinnerSize]} mx-auto mb-4 border-4 ${colorClasses[spinnerColor]} rounded-full animate-spin`}></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {title}
        </h2>
        <p className="text-gray-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
