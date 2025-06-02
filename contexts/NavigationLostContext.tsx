import React, { createContext, useState, ReactNode } from 'react';

// Define la interfaz del Usuario
export interface NavigationLost {
    isOnToken: boolean;
}

// Define la interfaz del contexto
interface NavigationLostDatesContextType {
  navigationLostDates: NavigationLost | null;
  setNavigationLostDates: (navigationLostDates: NavigationLost | null) => void;
}

// Crea el contexto
const NavigationLostDatesContext = createContext<NavigationLostDatesContextType | undefined>(undefined);

// Define el proveedor
export const NavigationLostDatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializa navigationLostDates con isOnToken en false
  const [navigationLostDates, setNavigationLostDates] = useState<NavigationLost | null>({
    isOnToken: false,
  });

  return (
    <NavigationLostDatesContext.Provider value={{ navigationLostDates, setNavigationLostDates }}>
      {children}
    </NavigationLostDatesContext.Provider>
  );
};

// Hook para usar el contexto
export const useNavigationLostDates = () => {
  const context = React.useContext(NavigationLostDatesContext);
  if (context === undefined) {
    throw new Error('useNavigationLostDates debe usarse dentro de un NavigationLostDatesProvider');
  }
  return context;
};
