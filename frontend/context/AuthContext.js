"use client";
import { API_ENDPOINTS } from '@/lib/api_endpoints';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  user: null,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return null;
      }
      
      const verifiedUser = await verifyToken(token);
      if (verifiedUser) {
        console.log(verifiedUser)
        const userData = await getUser(verifiedUser.user.userId);
        setUser(userData); // This should trigger a re-render
        return userData;
      }
      setUser(null);
      return null;
    } catch (err) {
      setError(err.message);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await refreshUser();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    setIsLoading(true);
    try {
      localStorage.setItem('token', token);
      await refreshUser();
    } catch (err) {
      setError(err.message);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error, 
        login, 
        logout, 
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Helper functions
const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.HOSTNAME}/users/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Token verification failed');
    
    return await response.json();
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

const getUser = async (userId) => {
  const response = await fetch(`${API_ENDPOINTS.HOSTNAME}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user data');
  return await response.json();
};