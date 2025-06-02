import React, { createContext, useState, ReactNode } from "react";
import { Movimiento } from "../components/MyDateTableMovimientos";

// Define la interfaz del Usuario
export interface SortMovimientosDates {
    items: Movimiento[];
    criterioOrden: string;
    tipoOrden: string;
}

// Define la interfaz del contexto
interface SortMovimientosDatesContextType {
  SortMovimientosDates: SortMovimientosDates | null;
  setSortMovimientosDates: (
    SortMovimientosDates: SortMovimientosDates | null
  ) => void;
}

// Crea el contexto
const SortMovimientosDatesContext = createContext<
  SortMovimientosDatesContextType | undefined
>(undefined);

// Define el proveedor
export const SortMovimientosDatesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [SortMovimientosDates, setSortMovimientosDates] =
    useState<SortMovimientosDates | null>(null);

  return (
    <SortMovimientosDatesContext.Provider
      value={{
        SortMovimientosDates: SortMovimientosDates,
        setSortMovimientosDates: setSortMovimientosDates,
      }}
    >
      {children}
    </SortMovimientosDatesContext.Provider>
  );
};

// Hook para usar el contexto
export const useSortMovimientosDates = () => {
  const context = React.useContext(SortMovimientosDatesContext);
  if (context === undefined) {
    throw new Error(
      "useModalMovimientosDates debe usarse dentro de un ModalMovimientosDates"
    );
  }
  return context;
};
