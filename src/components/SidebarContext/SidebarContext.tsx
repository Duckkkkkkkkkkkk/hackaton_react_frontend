import React, { createContext, useState, ReactNode, FC } from 'react';

interface SidebarContextProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const defaultState = {
  isSidebarOpen: false,
  toggleSidebar: () => {},
};

export const SidebarContext = createContext<SidebarContextProps>(defaultState);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
