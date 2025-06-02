import React, { createContext, useState, ReactNode } from 'react';
import { Accion } from '../components/MyDateTableAcciones';

// Define la interfaz del Usuario
export interface SortAcciones {
  items: Accion[];
  criterioOrden: string;
  tipoOrden: string;
}

// Define la interfaz del contexto
interface SortAccionesContextType {
  sortAcciones: SortAcciones | null;
  setSortAcciones: (sortEntradas: SortAcciones | null) => void;
}

// Crea el contexto
const SortAccionesContext = createContext<SortAccionesContextType | undefined>(undefined);

// Define el proveedor
export const SortAccionesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortAcciones, setSortAcciones] = useState<SortAcciones | null>(null);

  return (
    <SortAccionesContext.Provider value={{ sortAcciones: sortAcciones, setSortAcciones: setSortAcciones }}>
      {children}
    </SortAccionesContext.Provider>
  );
};

// Hook para usar el contexto
export const useSortAcciones = () => {
  const context = React.useContext(SortAccionesContext);
  if (context === undefined) {
    throw new Error('useSortAcciones debe usarse dentro de un SortAcciones');
  }
  return context;
};