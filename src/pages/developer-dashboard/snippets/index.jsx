import React from 'react';
import CodeSnippets from '../../../components/developer/CodeSnippets';

const SnippetsPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">Code Snippets</h1>
          <p className="text-muted-foreground mt-2">Ready-to-use code examples for integrating with Envoyou API</p>
        </div>
      </div>
      <CodeSnippets />
    </div>
  );
};

export default SnippetsPage;