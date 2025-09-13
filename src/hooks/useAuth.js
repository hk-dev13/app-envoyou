import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

// useAuth hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
