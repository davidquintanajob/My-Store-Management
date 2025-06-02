import React, { createContext, useState, ReactNode } from "react";

// Define la interfaz del Usuario
export interface PaginadoProductos {
  page: number;
}

// Define la interfaz del contexto
interface PaginadoProductosContextType {
  paginadoProductos: PaginadoProductos;
  setPaginadoProductos: (paginadoProductos: PaginadoProductos) => void;
}

// Crea el contexto
const PaginadoProductosContext = createContext<
  PaginadoProductosContextType | undefined
>(undefined);

// Define el proveedor
export const PaginadoProductosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [paginadoProductos, setPaginadoProductos] = useState<PaginadoProductos>({
    page: 1, // Valor por defecto
  });

  return (
    <PaginadoProductosContext.Provider
      value={{
        paginadoProductos: paginadoProductos,
        setPaginadoProductos: setPaginadoProductos,
      }}
    >
      {children}
    </PaginadoProductosContext.Provider>
  );
};

// Hook para usar el contexto
export const usePaginadoProductos = () => {
  const context = React.useContext(PaginadoProductosContext);
  if (context === undefined) {
    throw new Error(
      "usePaginadoProductos debe usarse dentro de un PaginadoProductos"
    );
  }
  return context;
};
