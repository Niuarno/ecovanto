import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAddress {
  id: string;
  title: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface SavedPaymentCard {
  id: string;
  cardholderName: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'card';
  expiryMonth: string;
  expiryYear: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  addresses?: UserAddress[];
  savedCards?: SavedPaymentCard[];
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
  loginWithGoogleData: (profileData: UserProfile) => UserProfile;
  register: (data: { email: string; password?: string; firstName: string; lastName: string; phone?: string }) => Promise<UserProfile>;
  logout: () => void;
  adminLogin: (passcode: string) => boolean;
  adminLogout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addSavedCard: (card: Omit<SavedPaymentCard, 'id'>) => void;
  deleteSavedCard: (id: string) => void;
  setDefaultSavedCard: (id: string) => void;
}

const AUTH_USER_KEY = 'ecovanto_auth_customer_v3';
const ADMIN_AUTH_KEY = 'ecovanto_admin_session_v1';
const ALL_CUSTOMERS_STORAGE_KEY = 'ecovanto_registered_customers_v3';

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

  // Sync current user to customers list in localStorage for Admin CRM
  const syncToCustomersList = (updatedUser: UserProfile) => {
    try {
      const existingStr = localStorage.getItem(ALL_CUSTOMERS_STORAGE_KEY);
      let list: UserProfile[] = existingStr ? JSON.parse(existingStr) : [];
      const index = list.findIndex((c) => c.email.toLowerCase() === updatedUser.email.toLowerCase());
      if (index >= 0) {
        list[index] = { ...list[index], ...updatedUser };
      } else {
        list.unshift(updatedUser);
      }
      localStorage.setItem(ALL_CUSTOMERS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error syncing customer list:', e);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      syncToCustomersList(user);
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    const namePart = email.split('@')[0];
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      lastName: 'Client',
      phone: '',
      createdAt: new Date().toISOString(),
      addresses: [],
      savedCards: [],
    };
    setUser(newUser);
    return true;
  };

  const loginWithGoogleData = (profileData: UserProfile): UserProfile => {
    const enrichedUser: UserProfile = {
      ...profileData,
      addresses: profileData.addresses || [],
      savedCards: profileData.savedCards || [],
    };
    setUser(enrichedUser);
    return enrichedUser;
  };

  const loginWithGmail = async (): Promise<UserProfile> => {
    const gmailUser: UserProfile = {
      id: `usr-gmail-${Date.now()}`,
      email: 'client.atelier@gmail.com',
      firstName: 'Elena',
      lastName: 'Voss',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '',
      isGmailAuth: true,
      createdAt: new Date().toISOString(),
      addresses: [],
      savedCards: [],
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
      addresses: [],
      savedCards: [],
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const adminLogin = (passcode: string): boolean => {
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
    setUser((prev) => {
      const updated = prev ? { ...prev, ...updates } : (updates as UserProfile);
      return updated;
    });
  };

  // Address Book Actions
  const addAddress = (addressData: Omit<UserAddress, 'id'>) => {
    const newAddr: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    setUser((prev) => {
      if (!prev) return null;
      const currentList = prev.addresses || [];
      const updatedList = newAddr.isDefault
        ? [...currentList.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...currentList, newAddr];
      return {
        ...prev,
        addresses: updatedList,
        defaultAddress: newAddr.isDefault || currentList.length === 0 ? newAddr : prev.defaultAddress,
      };
    });
  };

  const updateAddress = (id: string, updates: Partial<UserAddress>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedList = (prev.addresses || []).map((a) => (a.id === id ? { ...a, ...updates } : a));
      const def = updatedList.find((a) => a.isDefault) || updatedList[0];
      return {
        ...prev,
        addresses: updatedList,
        defaultAddress: def,
      };
    });
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedList = (prev.addresses || []).filter((a) => a.id !== id);
      const def = updatedList.find((a) => a.isDefault) || updatedList[0];
      return {
        ...prev,
        addresses: updatedList,
        defaultAddress: def,
      };
    });
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedList = (prev.addresses || []).map((a) => ({ ...a, isDefault: a.id === id }));
      const def = updatedList.find((a) => a.id === id);
      return {
        ...prev,
        addresses: updatedList,
        defaultAddress: def,
      };
    });
  };

  // Saved Payment Methods Actions
  const addSavedCard = (cardData: Omit<SavedPaymentCard, 'id'>) => {
    const newCard: SavedPaymentCard = {
      ...cardData,
      id: `card-${Date.now()}`,
    };
    setUser((prev) => {
      if (!prev) return null;
      const currentCards = prev.savedCards || [];
      const updatedCards = newCard.isDefault
        ? [...currentCards.map((c) => ({ ...c, isDefault: false })), newCard]
        : [...currentCards, newCard];
      return {
        ...prev,
        savedCards: updatedCards,
      };
    });
  };

  const deleteSavedCard = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedCards = (prev.savedCards || []).filter((c) => c.id !== id);
      return {
        ...prev,
        savedCards: updatedCards,
      };
    });
  };

  const setDefaultSavedCard = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedCards = (prev.savedCards || []).map((c) => ({ ...c, isDefault: c.id === id }));
      return {
        ...prev,
        savedCards: updatedCards,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdminAuthenticated,
        login,
        loginWithGmail,
        loginWithGoogleData,
        register,
        logout,
        adminLogin,
        adminLogout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        addSavedCard,
        deleteSavedCard,
        setDefaultSavedCard,
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
