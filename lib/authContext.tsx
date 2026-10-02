'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  customerPhone: string | null;
  customerName: string | null;
  adminLoggedIn: boolean;
  adminRole: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | null;
  loginCustomer: (phone: string, name: string) => void;
  logoutCustomer: () => void;
  loginAdmin: (role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF') => void;
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
  const [adminRole, setAdminRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | null>(null);

  useEffect(() => {
    try {
      const cp = localStorage.getItem('tb_phone');
      const cn = localStorage.getItem('tb_name');
      const ar = localStorage.getItem('tb_admin_role');
      if (cp) setCustomerPhone(cp);
      if (cn) setCustomerName(cn);
      if (ar) {
        setAdminLoggedIn(true);
        setAdminRole(ar as any);
      }
    } catch (e) {}
  }, []);

  const loginCustomer = (phone: string, name: string) => {
    try {
      localStorage.setItem('tb_phone', phone);
      localStorage.setItem('tb_name', name);
    } catch (e) {}
    setCustomerPhone(phone);
    setCustomerName(name);
  };

  const logoutCustomer = () => {
    try {
      localStorage.removeItem('tb_phone');
      localStorage.removeItem('tb_name');
    } catch (e) {}
    setCustomerPhone(null);
    setCustomerName(null);
  };

  const loginAdmin = (role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF') => {
    try {
      localStorage.setItem('tb_admin_role', role);
    } catch (e) {}
    setAdminLoggedIn(true);
    setAdminRole(role);
  };

  const logoutAdmin = () => {
    try {
      localStorage.removeItem('tb_admin_role');
    } catch (e) {}
    setAdminLoggedIn(false);
    setAdminRole(null);
  };

  return (
    <AuthContext.Provider value={{ customerPhone, customerName, adminLoggedIn, adminRole, loginCustomer, logoutCustomer, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
