import React, { createContext, useState, ReactNode } from 'react';

// Define la interfaz del Usuario
export interface SelectedButon {
  butonSelected: string;
}

// Define la interfaz del contexto
interface SortEntradasContextType {
  selectedButon: SelectedButon | null;
  setSelectedButon: (sortEntradas: SelectedButon | null) => void;
}

// Crea el contexto
const SortEntradasContext = createContext<SortEntradasContextType | undefined>(undefined);

// Define el proveedor
export const SelectedButonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedButon, setSelectedButon] = useState<SelectedButon | null>(null);

  return (
    <SortEntradasContext.Provider value={{ selectedButon: selectedButon, setSelectedButon: setSelectedButon }}>
      {children}
    </SortEntradasContext.Provider>
  );
};

// Hook para usar el contexto
export const useSelectedButon = () => {
  const context = React.useContext(SortEntradasContext);
  if (context === undefined) {
    throw new Error('useSortEntradas debe usarse dentro de un SortEntradas');
  }
  return context;
};