import React from 'react';
import APIDocumentation from '../../../components/developer/APIDocumentation';

const APIDocsPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">API Documentation</h1>
          <p className="text-muted-foreground mt-2">Complete API reference with interactive examples</p>
        </div>
      </div>
      <APIDocumentation />
    </div>
  );
};

export default APIDocsPage;