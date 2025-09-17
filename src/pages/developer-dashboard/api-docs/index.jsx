import React from 'react';
import APIDocumentation from '../../../components/developer/APIDocumentation';

const APIDocsPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
        <p className="text-muted-foreground mt-2">Complete API reference with interactive examples</p>
      </div>
      <APIDocumentation />
    </div>
  );
};

export default APIDocsPage;