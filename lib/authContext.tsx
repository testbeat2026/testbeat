'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  customerPhone: string | null;
  customerName: string | null;
  loginCustomer: (phone: string, name: string) => void;
  logoutCustomer: () => void;
}

const AuthContext = createContext<AuthContextType>({
  customerPhone: null,
  customerName: null,
  loginCustomer: () => {},
  logoutCustomer: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem('tb_customer_phone');
      const n = localStorage.getItem('tb_customer_name');
      if (p) setCustomerPhone(p);
      if (n) setCustomerName(n);
    } catch (e) {}
  }, []);

  const loginCustomer = (phone: string, name: string) => {
    try {
      localStorage.setItem('tb_customer_phone', phone);
      localStorage.setItem('tb_customer_name', name);
    } catch (e) {}
    setCustomerPhone(phone);
    setCustomerName(name);
  };

  const logoutCustomer = () => {
    try {
      localStorage.removeItem('tb_customer_phone');
      localStorage.removeItem('tb_customer_name');
    } catch (e) {}
    setCustomerPhone(null);
    setCustomerName(null);
  };

  return (
    <AuthContext.Provider value={{ customerPhone, customerName, loginCustomer, logoutCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
