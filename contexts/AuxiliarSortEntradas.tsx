import React, { createContext, useState, ReactNode } from 'react';
import { Entrada } from '../components/MyDateTableEntradas';

// Define la interfaz del Usuario
export interface SortEntradas {
  items: Entrada[];
  criterioOrden: string;
  tipoOrden: string;
}

// Define la interfaz del contexto
interface SortEntradasContextType {
  sortEntradas: SortEntradas | null;
  setSortEntradas: (sortEntradas: SortEntradas | null) => void;
}

// Crea el contexto
const SortEntradasContext = createContext<SortEntradasContextType | undefined>(undefined);

// Define el proveedor
export const SortEntradasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortEntradas, setSortEntradas] = useState<SortEntradas | null>(null);

  return (
    <SortEntradasContext.Provider value={{ sortEntradas: sortEntradas, setSortEntradas: setSortEntradas }}>
      {children}
    </SortEntradasContext.Provider>
  );
};

// Hook para usar el contexto
export const useSortEntradas = () => {
  const context = React.useContext(SortEntradasContext);
  if (context === undefined) {
    throw new Error('useSortEntradas debe usarse dentro de un SortEntradas');
  }
  return context;
};