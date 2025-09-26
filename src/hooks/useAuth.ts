import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);
  console.log(context?.courses);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}