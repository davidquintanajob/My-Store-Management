import React, { createContext, useState, ReactNode } from 'react';
import { UsuarioTabla } from '../components/MyDateTableUsuarios';

// Define la interfaz del Usuario
export interface SortUsuarios {
  items: UsuarioTabla[];
  criterioOrden: string;
  tipoOrden: string;
}

// Define la interfaz del contexto
interface SortUsuariosContextType {
  sortUsuarios: SortUsuarios | null;
  setSortUsuarios: (sortUsuarios: SortUsuarios | null) => void;
}

// Crea el contexto
const SortUsuariosContext = createContext<SortUsuariosContextType | undefined>(undefined);

// Define el proveedor
export const SortUsuariosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortUsuarios, setSortUsuarios] = useState<SortUsuarios | null>(null);

  return (
    <SortUsuariosContext.Provider value={{ sortUsuarios: sortUsuarios, setSortUsuarios: setSortUsuarios }}>
      {children}
    </SortUsuariosContext.Provider>
  );
};

// Hook para usar el contexto
export const useSortUsuarios = () => {
  const context = React.useContext(SortUsuariosContext);
  if (context === undefined) {
    throw new Error('useSortUsuarios debe usarse dentro de un SortUsuarios');
  }
  return context;
};