import React from 'react';
import APIKeyManager from '../../../components/developer/APIKeyManager';

const APIKeysPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">API Keys</h1>
          <p className="text-muted-foreground mt-2">Manage your API keys and access permissions</p>
        </div>
      </div>
      <APIKeyManager />
    </div>
  );
};

export default APIKeysPage;