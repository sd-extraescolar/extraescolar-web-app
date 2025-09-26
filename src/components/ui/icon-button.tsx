import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComponentType } from "react";

interface IconButtonProps {
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
  tooltip?: string;
  size?: "sm" | "default" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
  className?: string;
}

export const IconButton = ({ 
  onClick, 
  icon: Icon,
  tooltip,
  size = "default",
  variant = "primary",
  disabled = false,
  className = ""
}: IconButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-education-green-50 hover:bg-education-green-200 text-education-green-700";
      case "secondary":
        return "bg-digital-blue-100 hover:bg-digital-blue-200 text-digital-blue-700";
      case "outline":
        return "border-education-green-200 hover:bg-education-green-50 text-education-green-700";
      case "ghost":
        return "hover:bg-light-gray text-medium-gray";
      case "destructive":
        return "bg-alert-red-100 hover:bg-alert-red-200 text-alert-red-700";
      default:
        return "bg-education-green-100 hover:bg-education-green-200 text-education-green-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2";
      case "default":
        return "px-4 py-3";
      case "lg":
        return "px-6 py-4";
      default:
        return "px-4 py-3";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "default":
        return "w-5 h-5";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-5 h-5";
    }
  };

  const buttonElement = (
    <Button
      onClick={onClick}
      disabled={disabled}
      size={size}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-lg transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <Icon className={getIconSize()} />
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonElement}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonElement;
};
