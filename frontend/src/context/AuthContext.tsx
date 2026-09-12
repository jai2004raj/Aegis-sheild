import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, Worker, Company } from '../types';

interface AuthContextType {
  user: User | null;
  worker: Worker | null;
  company: Company | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ role: string }>;
  registerUser: (data: any) => Promise<{ role: string }>;
  googleLogin: (googleData: any) => Promise<{ role: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [worker, setWorker] = useState<Worker | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      if (res.data.worker) setWorker(res.data.worker);
      if (res.data.company) setCompany(res.data.company);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      console.error('Failed to fetch user context:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    await fetchCurrentUser();

    return { role: userData.role };
  };

  const registerUser = async (data: any) => {
    const res = await api.post('/auth/register', data);
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    await fetchCurrentUser();

    return { role: userData.role };
  };

  const googleLogin = async (googleData: any) => {
    const res = await api.post('/auth/google', googleData);
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
    await fetchCurrentUser();

    return { role: userData.role };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setWorker(null);
    setCompany(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        worker,
        company,
        token,
        loading,
        login,
        registerUser,
        googleLogin,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
