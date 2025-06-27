"use client";
import React, { createContext, useContext } from "react";

export interface User {
  id: string | null;
  role: string | null;
  email: string | null;
}

const UserContext = createContext<User | null>(null);

export const UserProvider = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
