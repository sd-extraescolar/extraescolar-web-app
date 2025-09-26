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

  // Handle menu click - different behavior for mobile vs tablet vs desktop
  const handleMenuClick = () => {
    const width = window.innerWidth;
    
    if (width < 768) {
      // Mobile: toggle sidebar open/close (absolute overlay)
      toggleSidebar();
    } else if (width < 1024) {
      // Tablet: do nothing (drawer stays closed)
      return;
    } else {
      // Desktop: toggle sidebar expanded/collapsed
      toggleSidebarExpanded();
    }
  };


  return (
    <>
      {/* Header */}
      <Header 
        onMenuClick={handleMenuClick}
      />
      
      {/* Backdrop for mobile only */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Layout Container - Horizontal Flex with top margin for fixed header */}
      <div className="flex h-screen pt-16">
        {/* Sidebar - Absolute on mobile, hidden on tablet, normal on desktop */}
        <div className={`
          ${isSidebarOpen ? 'fixed top-16 bottom-0 left-0 z-50 md:hidden' : 'hidden md:block lg:block'}
        `}>
          <Sidebar 
            isOpen={isSidebarOpen} 
            isExpanded={isSidebarExpanded} 
            onClose={toggleSidebar} 
          />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-white rounded-tl-3xl overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </>
  );
};
