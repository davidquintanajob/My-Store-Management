import React, { createContext, useState, ReactNode } from 'react';
import { Servicio } from '../components/MyDateTableServicios';

// Define la interfaz del Usuario
export interface SortServicios {
  items: Servicio[];
  criterioOrden: string;
  tipoOrden: string;
}

// Define la interfaz del contexto
interface SortServiciosContextType {
  sortServicios: SortServicios | null;
  setSortServicios: (sortServicios: SortServicios | null) => void;
}

// Crea el contexto
const SortServiciosContext = createContext<SortServiciosContextType | undefined>(undefined);

// Define el proveedor
export const SortServiciosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortServicios, setSortServicios] = useState<SortServicios | null>(null);

  return (
    <SortServiciosContext.Provider value={{ sortServicios: sortServicios, setSortServicios: setSortServicios }}>
      {children}
    </SortServiciosContext.Provider>
  );
};

// Hook para usar el contexto
export const useSortServicios = () => {
  const context = React.useContext(SortServiciosContext);
  if (context === undefined) {
    throw new Error('useSortServicios debe usarse dentro de un SortServicios');
  }
  return context;
};