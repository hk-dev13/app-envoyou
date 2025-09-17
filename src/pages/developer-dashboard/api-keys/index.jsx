import React from 'react';
import APIKeyManager from '../../../components/developer/APIKeyManager';

const APIKeysPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">API Keys</h1>
        <p className="text-muted-foreground mt-2">Manage your API keys and access permissions</p>
      </div>
      <APIKeyManager />
    </div>
  );
};

export default APIKeysPage;