import { CourseSelector } from "@/components/CourseSelector";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-light-blue-gray flex items-center px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-4 ml-2 rounded-lg hover:bg-sidebar-hover transition-all duration-200 ease-in-out"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <img 
            src="/extraescolar-icon.png" 
            alt="Extraescolar Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl text-education-green font-semibold">Extraescolar</span>
        </div>

        {/* Course Selector */}
        <CourseSelector />
      </div>
    </header>
  );
};