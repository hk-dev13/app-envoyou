import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useDarkMode } from '../../hooks/useDarkMode.js';
import DeveloperSidebar from './DeveloperSidebar';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';

const DeveloperLayout = ({ children }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <DeveloperSidebar
          user={user}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50 bg-transparent backdrop-blur-sm border border-slate-800"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-slate-800">
          <DeveloperSidebar
            user={user}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeveloperLayout;