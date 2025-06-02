import React, { createContext, useState, ReactNode } from 'react';
import { Cliente } from '../components/MyDateTableClientes';

// Define la interfaz del Usuario
export interface SortClientes {
  items: Cliente[];
  criterioOrden: string;
  tipoOrden: string;
}

// Define la interfaz del contexto
interface SortClientesContextType {
  sortClientes: SortClientes | null;
  setSortClientes: (sortClientes: SortClientes | null) => void;
}

// Crea el contexto
const SortClientesContext = createContext<SortClientesContextType | undefined>(undefined);

// Define el proveedor
export const SortClientesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortClientes, setSortClientes] = useState<SortClientes | null>(null);

  return (
    <SortClientesContext.Provider value={{ sortClientes: sortClientes, setSortClientes: setSortClientes }}>
      {children}
    </SortClientesContext.Provider>
  );
};

// Hook para usar el contexto
export const useSortClientes = () => {
  const context = React.useContext(SortClientesContext);
  if (context === undefined) {
    throw new Error('useSortEntradas debe usarse dentro de un SortClientes');
  }
  return context;
};