import { CourseSelector } from "@/components/CourseSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  LogOut,
  Menu,
  School
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { handleLogout, isLoading } = useAuth();

  // Mock data del usuario - en el futuro esto vendrá del contexto de autenticación
  const teacherName = "Prof. María González";
  const teacherEmail = "maria.gonzalez@escuela.edu";

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
          <div className="w-8 h-8 bg-education-green rounded flex items-center justify-center">
            <School className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl text-dark-text font-semibold">Extraescolar</span>
        </div>

        {/* Course Selector */}
        <CourseSelector />
      </div>

      {/* Right Section - User Menu */}
      <div className="ml-auto flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 rounded-lg hover:bg-sidebar-hover transition-all duration-200 ease-in-out">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/teacher-avatar.jpg" />
                <AvatarFallback className="bg-education-green text-white font-semibold text-sm">
                  {teacherName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <div className="p-3 border-b">
              <p className="font-medium">{teacherName}</p>
              <p className="text-sm text-medium-gray">{teacherEmail}</p>
            </div>
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-alert-red focus:text-alert-red cursor-pointer"
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};