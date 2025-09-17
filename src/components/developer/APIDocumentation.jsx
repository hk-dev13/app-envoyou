import React from 'react';

const APIDocumentation = () => {

  return (
    <div className="max-w-none">
      <div className="bg-card border border-border rounded-lg p-6">
        <h1 className="text-3xl font-bold text-primary-foreground mb-6">Envoyou API Documentation</h1>
        <div className="text-slate-300 mb-6">
          <p className="mb-4">The in-app embedded markdown has been deprecated. Visit the unified documentation portal for the latest guides, authentication details, endpoint reference, data model, and changelog.</p>
          <a
            href="https://docs.envoyou.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 transition-colors text-primary-foreground font-medium px-5 py-2 rounded"
          >
            Open Full Documentation Portal
          </a>
        </div>
        
        <div className="bg-background border border-slate-600 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-primary-foreground mb-4">Why Redirect?</h2>
          <ul className="space-y-2 text-slate-300 list-disc ml-5">
            <li>Single source of truth across platform.</li>
            <li>Versioned & consistently styled documentation.</li>
            <li>Future OpenAPI & interactive reference integration.</li>
            <li>Reduced maintenance of duplicated markdown.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;