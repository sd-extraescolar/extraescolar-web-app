import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarExpanded = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle menu click - different behavior for mobile vs desktop
  const handleMenuClick = () => {
    // On mobile: toggle sidebar open/close
    if (window.innerWidth < 1024) {
      toggleSidebar();
    } else {
      // On desktop: toggle sidebar expanded/collapsed
      toggleSidebarExpanded();
    }
  };

  const handleCohortChange = (cohortId: string) => {
    console.log(`Cambiando a cohorte: ${cohortId}`);
    // Aquí implementarías la lógica para cambiar de cohorte
  };
  
  return (
    <>
      {/* Header */}
      <Header 
        onMenuClick={handleMenuClick}
        onCohortChange={handleCohortChange}
      />
      
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Layout Container - Horizontal Flex with top margin for fixed header */}
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          isExpanded={isSidebarExpanded} 
          onClose={toggleSidebar} 
        />
        
        {/* Main Content */}
        <main className="flex-1 bg-white rounded-tl-3xl overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </>
  );
};
