'use client';

import { createContext, useContext } from 'react';

export type AdminSessionUser = {
  id: string;
  email: string;
  displayName: string;
};

const AdminSessionContext = createContext<AdminSessionUser | null>(null);

export function AdminSessionProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AdminSessionUser | null;
}) {
  return <AdminSessionContext.Provider value={user}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  return useContext(AdminSessionContext);
}
