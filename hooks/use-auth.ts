import { useState, useEffect } from 'react';

// In a real app, you'd want this to be an environment variable
const SANTA_KEY = 'hohoho123';

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
