import React, { createContext, useState, ReactNode } from 'react';
import { Producto } from '../components/MyDateTableProductos';

// Define la interfaz del Usuario
export interface SortProductos {
  items: Producto[];
  criterioOrden: string;
  tipoOrden: string;
}

// Define la interfaz del contexto
interface SortProductosContextType {
  sortProductos: SortProductos | null;
  setSortProductos: (sortProductos: SortProductos | null) => void;
}

// Crea el contexto
const SortProductosContext = createContext<SortProductosContextType | undefined>(undefined);

// Define el proveedor
export const SortProductosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortProductos, setSortProductos] = useState<SortProductos | null>(null);

  return (
    <SortProductosContext.Provider value={{ sortProductos: sortProductos, setSortProductos: setSortProductos }}>
      {children}
    </SortProductosContext.Provider>
  );
};

// Hook para usar el contexto
export const useSortProductos = () => {
  const context = React.useContext(SortProductosContext);
  if (context === undefined) {
    throw new Error('useSortProductos debe usarse dentro de un SortProductos');
  }
  return context;
};