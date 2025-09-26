interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  iconSize?: 'sm' | 'md' | 'lg';
}

export const EmptyState = ({ 
  title, 
  subtitle, 
  icon,
  iconSize = 'lg'
}: EmptyStateProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const defaultIcon = (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="mb-6">
          <div className={`${sizeClasses[iconSize]} mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center`}>
            {icon || defaultIcon}
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          {title}
        </h2>
        <p className="text-gray-500 text-lg">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
