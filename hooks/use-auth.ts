import { useState, useEffect } from 'react';

const SANTA_KEY = process.env.NEXT_PUBLIC_SANTA_KEY;

if (!SANTA_KEY) {
  console.warn('NEXT_PUBLIC_SANTA_KEY is not set in environment variables');
}

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if there's a stored auth state
    const storedAuth = localStorage.getItem('santa_auth');
    setIsAdmin(storedAuth === SANTA_KEY);
  }, []);

  const login = (key: string) => {
    if (key === SANTA_KEY) {
      localStorage.setItem('santa_auth', key);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('santa_auth');
    setIsAdmin(false);
  };

  return {
    isAdmin,
    login,
    logout
  };
}
