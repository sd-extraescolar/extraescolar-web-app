import { cn } from "@/lib/utils";
import {
  BookOpen,
  LayoutDashboard,
  Users
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  isExpanded?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, isExpanded = false, onClose }: SidebarProps) => {
  const location = useLocation();
  
  // Simple logic: show text when sidebar is expanded
  const showText = isOpen || isExpanded;

  // Close drawer when route changes (only for mobile)
  useEffect(() => {
    // Only close if the drawer is actually open (mobile state)
    if (isOpen && onClose) {
      onClose();
    }
  }, [location.pathname, isOpen, onClose]);

  const navigationItems = [
    {
      id: "dashboard",
      path: "/dashboard",
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
    }
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`
      bg-light-blue-gray flex flex-col z-40
      transition-all duration-300 ease-in-out w-auto
    `}>
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            const handleClick = () => {
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
                    // Layout based on sidebar state - always justify-start, centering achieved by padding
                    "justify-start w-full",
                    showText ? "gap-4 px-4" : "px-4 min-w-12",
                    // Active states - always show full background when active
                    active && item.id === "dashboard" && "bg-digital-blue-50 text-digital-blue hover:bg-digital-blue-100",
                    active && item.id === "grades" && "bg-progress-yellow-100 text-progress-yellow-600 hover:bg-progress-yellow-200",
                    active && item.id === "attendance" && "bg-alert-red-50 text-alert-red-600 hover:bg-alert-red-100",
                    // Inactive states
                    !active && "text-dark-text hover:bg-sidebar-hover",
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
    </div>
  );
};
