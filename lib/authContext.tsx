'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthContextType {
  customerPhone: string | null;
  customerName: string | null;
  adminLoggedIn: boolean;
  adminRole: 'SUPER_ADMIN' | 'OPERATIONS' | 'FINANCE' | 'SALES' | null;
  loginCustomer: (phone: string, name: string) => void;
  logoutCustomer: () => void;
  loginAdmin: (role: any) => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  customerPhone: null,
  customerName: null,
  adminLoggedIn: false,
  adminRole: null,
  loginCustomer: () => {},
  logoutCustomer: () => {},
  loginAdmin: () => {},
  logoutAdmin: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<any>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem('tb_customer_phone');
      const n = localStorage.getItem('tb_customer_name');
      const ar = localStorage.getItem('tb_admin_role');
      if (p) setCustomerPhone(p);
      if (n) setCustomerName(n);
      if (ar) {
        setAdminLoggedIn(true);
        setAdminRole(ar);
      }
    } catch (e) {}
  }, []);

  const loginCustomer = (phone: string, name: string) => {
    localStorage.setItem('tb_customer_phone', phone);
    localStorage.setItem('tb_customer_name', name);
    setCustomerPhone(phone);
    setCustomerName(name);
  };

  const logoutCustomer = () => {
    localStorage.removeItem('tb_customer_phone');
    localStorage.removeItem('tb_customer_name');
    setCustomerPhone(null);
    setCustomerName(null);
  };

  const loginAdmin = (role: any) => {
    localStorage.setItem('tb_admin_role', role);
    setAdminLoggedIn(true);
    setAdminRole(role);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('tb_admin_role');
    setAdminLoggedIn(false);
    setAdminRole(null);
  };

  return (
    <AuthContext.Provider value={{
      customerPhone,
      customerName,
      adminLoggedIn,
      adminRole,
      loginCustomer,
      logoutCustomer,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
