import React from 'react';
import AppLayout from '../../../components/layout/AppLayout';
import APIDocumentation from '../../../components/developer/APIDocumentation';

const APIDocsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-white">API Documentation</h1>
          <p className="text-slate-400 mt-2">Complete API reference with interactive examples</p>
        </div>
        <APIDocumentation />
      </div>
    </AppLayout>
  );
};

export default APIDocsPage;