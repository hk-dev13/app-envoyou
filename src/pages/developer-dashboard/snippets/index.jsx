import React from 'react';
import CodeSnippets from '../../../components/developer/CodeSnippets';

const SnippetsPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Code Snippets</h1>
        <p className="text-muted-foreground mt-2">Ready-to-use code examples for integrating with Envoyou API</p>
      </div>
      <CodeSnippets />
    </div>
  );
};

export default SnippetsPage;