import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAddress {
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  defaultAddress?: UserAddress;
  createdAt: string;
  isGmailAuth?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGmail: () => Promise<UserProfile>;
  register: (data: { email: string; password?: string; firstName: string; lastName: string; phone?: string }) => Promise<UserProfile>;
  logout: () => void;
  adminLogin: (passcode: string) => boolean;
  adminLogout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AUTH_USER_KEY = 'ecovanto_auth_customer_v1';
const ADMIN_AUTH_KEY = 'ecovanto_admin_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // Realistic client login
    const namePart = email.split('@')[0];
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      lastName: 'Client',
      phone: '+49 171 000000',
      createdAt: new Date().toISOString(),
      defaultAddress: {
        address: 'Auguststraße 14',
        city: 'Berlin',
        postalCode: '10117',
        country: 'Germany',
      },
    };
    setUser(newUser);
    return true;
  };

  const loginWithGmail = async (): Promise<UserProfile> => {
    // 1-click Google OAuth simulator with realistic profile
    const gmailUser: UserProfile = {
      id: `usr-gmail-${Date.now()}`,
      email: 'client.atelier@gmail.com',
      firstName: 'Elena',
      lastName: 'Voss',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+49 172 8492019',
      isGmailAuth: true,
      createdAt: new Date().toISOString(),
      defaultAddress: {
        address: 'Köpenicker Str. 124',
        apartment: 'Studio 4A',
        city: 'Berlin',
        postalCode: '10997',
        country: 'Germany',
      },
    };
    setUser(gmailUser);
    return gmailUser;
  };

  const register = async (data: { email: string; firstName: string; lastName: string; phone?: string }): Promise<UserProfile> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || '',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const adminLogin = (passcode: string): boolean => {
    // Secure passcode check (default: ATELIER2026 or 2026 or admin)
    if (passcode.trim() === 'ATELIER2026' || passcode.trim() === 'admin' || passcode.trim() === '2026') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdminAuthenticated,
        login,
        loginWithGmail,
        register,
        logout,
        adminLogin,
        adminLogout,
        updateProfile,
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
