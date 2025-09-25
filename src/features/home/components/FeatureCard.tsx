import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "group rounded-lg border border-light-gray bg-white p-6 shadow-sm transition-all hover:border-education-green-200 hover:shadow-lg dark:border-border dark:bg-card",
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-education-green-50 text-2xl text-education-green-600 transition-colors group-hover:bg-education-green-100"
          role="img"
          aria-label={title}
        >
          {icon}
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-dark-text transition-colors group-hover:text-education-green-600">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-medium-gray">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
