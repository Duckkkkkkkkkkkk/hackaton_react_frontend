import React, { createContext, useContext, useState, ReactNode } from 'react';

export {};
interface LayoutContextProps {
  showHeader: boolean;
  showSidebar: boolean;
  setShowHeader: (show: boolean) => void;
  setShowSidebar: (show: boolean) => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <LayoutContext.Provider value={{ showHeader, showSidebar, setShowHeader, setShowSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
