import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  isExpanded?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, isExpanded = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const { handleLogout, isLoading, isAuthenticated, userProfile } = useAuth();
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  // Listen for window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close mobile drawer when transitioning to tablet/desktop
  useEffect(() => {
    if (screenWidth >= 768 && isOpen && onClose) {
      // Close the mobile drawer when transitioning to tablet/desktop
      onClose();
    }
  }, [screenWidth, isOpen, onClose]);
  
  // Simple logic: show text when sidebar is expanded or floating
  const showText = isOpen || isExpanded;

  // User data - using real profile data from Google
  const teacherName = userProfile?.name || (isAuthenticated ? "Usuario" : "No autenticado");
  const teacherEmail = userProfile?.email || "";
  
  // Debug: Log user profile data
  console.log('Navigation - userProfile:', userProfile);
  console.log('Navigation - isAuthenticated:', isAuthenticated);


  const navigationItems = [
    {
      id: "dashboard",
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "text-digital-blue",
      bgColor: "bg-digital-blue-50",
    },
    {
      id: "grades",
      path: "/notas",
      label: "Gestión de Notas",
      icon: BookOpen,
      color: "text-progress-yellow-600",
      bgColor: "bg-progress-yellow-100",
    },
    {
      id: "attendance",
      path: "/presencialidad",
      label: "Presencialidad",
      icon: Users,
      color: "text-alert-red-600",
      bgColor: "bg-alert-red-50",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };



  return (
    <div className={cn(
      "bg-light-blue-gray flex flex-col z-40 w-auto",
      isOpen ? "h-[calc(100vh-4rem)]" : "h-full"
    )}>
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            const handleClick = (e: React.MouseEvent) => {
              // Prevent navigation if already on this page
              if (active) {
                e.preventDefault();
                return;
              }
              
              // Only close the drawer on mobile (when isOpen is true)
              // On desktop, don't expand/collapse when clicking nav items
              if (isOpen && onClose) {
                onClose();
              }
            };

            return (
              <div key={item.id} >
                <Link 
                  to={item.path} 
                  onClick={handleClick}
                  className={cn(
                    "h-12 rounded-full font-normal flex items-center",
                    showText ? "justify-start w-full gap-4 px-4" : "justify-center w-12",
                    // Active states
                    active && item.id === "dashboard" && "bg-digital-blue-50 text-digital-blue hover:bg-digital-blue-100 cursor-default",
                    active && item.id === "grades" && "bg-progress-yellow-100 text-progress-yellow-600 hover:bg-progress-yellow-200 cursor-default",
                    active && item.id === "attendance" && "bg-alert-red-50 text-alert-red-600 hover:bg-alert-red-100 cursor-default",
                    // Inactive states
                    !active && "text-dark-text hover:bg-sidebar-hover cursor-pointer",
                  )}
                >
                  <div className="flex items-center w-5 h-5 flex-shrink-0">
                    <Icon
                      className="h-5 w-5"
                    />
                  </div>
                  {showText && (
                    <span className="flex-shrink-0 whitespace-nowrap ml-2">
                      {item.label}
                    </span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={cn(
            "h-12 rounded-full font-normal flex items-center",
            showText ? "justify-start w-full gap-4 px-4" : "justify-center w-12",
            "text-red-500 bg-red-100 hover:bg-red-200 hover:text-red-600",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center w-5 h-5 flex-shrink-0">
            <LogOut className="h-5 w-5" />
          </div>
          {showText && (
            <span className="flex-shrink-0 whitespace-nowrap ml-2">
              {isLoading ? 'Cerrando...' : 'Cerrar Sesión'}
            </span>
          )}
        </button>

        {/* User Profile Section */}
        <button 
          className={cn(
            "h-12 rounded-full font-normal flex items-center hover:bg-sidebar-hover",
            showText ? "justify-start w-full gap-4 px-4" : "justify-center w-12"
          )}
        >
              <div className="flex items-center w-5 h-5 flex-shrink-0">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={userProfile?.picture || "/teacher-avatar.jpg"} />
                  <AvatarFallback className="bg-education-green text-white font-semibold text-xs">
                    {teacherName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
          {showText && (
            <div className="flex-1 text-left min-w-0 ml-2">
              <p className="font-medium text-dark-text truncate">{teacherName}</p>
              <p className="text-sm text-medium-gray truncate">{teacherEmail}</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
