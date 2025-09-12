import React from 'react';
import DeveloperLayout from '../../../components/developer/DeveloperLayout';
import APIKeyManager from '../../../components/developer/APIKeyManager';

const APIKeysPage = () => {
  return (
    <DeveloperLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">API Keys</h1>
          <p className="text-slate-400 mt-2">Manage your API keys and access permissions</p>
        </div>
        <APIKeyManager />
      </div>
    </DeveloperLayout>
  );
};

export default APIKeysPage;