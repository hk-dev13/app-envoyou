import React from 'react';
import DeveloperNavigation from './DeveloperNavigation';

const DeveloperLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <DeveloperNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DeveloperLayout;