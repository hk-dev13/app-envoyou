import React from 'react';
import AppLayout from '../../../components/layout/AppLayout';
import CodeSnippets from '../../../components/developer/CodeSnippets';

const SnippetsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Code Snippets</h1>
          <p className="text-slate-400 mt-2">Ready-to-use code examples for integrating with Envoyou API</p>
        </div>
        <CodeSnippets />
      </div>
    </AppLayout>
  );
};

export default SnippetsPage;