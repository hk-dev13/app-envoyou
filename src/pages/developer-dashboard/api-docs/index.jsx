import React from 'react';
import DeveloperLayout from '../../../components/developer/DeveloperLayout';
import APIDocumentation from '../../../components/developer/APIDocumentation';

const APIDocsPage = () => {
  return (
    <DeveloperLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">API Documentation</h1>
          <p className="text-slate-400 mt-2">Complete API reference with interactive examples</p>
        </div>
        <APIDocumentation />
      </div>
    </DeveloperLayout>
  );
};

export default APIDocsPage;