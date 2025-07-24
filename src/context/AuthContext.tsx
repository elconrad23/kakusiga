import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, userType: 'organizer' | 'user') => Promise<boolean>;
  signup: (email: string, password: string, name: string, userType: 'organizer' | 'user', phone?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
        loading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string, userType: 'organizer' | 'user'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      type: userType,
      phone: userType === 'user' ? '+254712345678' : undefined,
      avatar: `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=150&h=150&fit=crop&crop=face`
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthState({
      isAuthenticated: true,
      user: mockUser,
      loading: false
    });
    
    return true;
  };

  const signup = async (email: string, password: string, name: string, userType: 'organizer' | 'user', phone?: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      type: userType,
      phone,
      avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop&crop=face`
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setAuthState({
      isAuthenticated: true,
      user: mockUser,
      loading: false
    });
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};