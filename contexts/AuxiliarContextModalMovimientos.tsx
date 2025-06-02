import React, { createContext, useState, ReactNode } from "react";

// Define la interfaz del Usuario
export interface ModalMovimientosDates {
  id_movimiento: string;
  isAddMovimiento: boolean;
  isModificarMovimiento: boolean;
  fileEditable: boolean;
}

// Define la interfaz del contexto
interface ModalMovimientosDatesContextType {
  modalMovimientosDates: ModalMovimientosDates | null;
  setModalMovimientosDates: (
    modalMovimientosDates: ModalMovimientosDates | null
  ) => void;
}

// Crea el contexto
const ModalMovimientosDatesContext = createContext<
  ModalMovimientosDatesContextType | undefined
>(undefined);

// Define el proveedor
export const ModalMovimientosDatesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalMovimientosDates, setModalEntradasDates] =
    useState<ModalMovimientosDates | null>(null);

  return (
    <ModalMovimientosDatesContext.Provider
      value={{
        modalMovimientosDates: modalMovimientosDates,
        setModalMovimientosDates: setModalEntradasDates,
      }}
    >
      {children}
    </ModalMovimientosDatesContext.Provider>
  );
};

// Hook para usar el contexto
export const useModalMovimientosDates = () => {
  const context = React.useContext(ModalMovimientosDatesContext);
  if (context === undefined) {
    throw new Error(
      "useModalMovimientosDates debe usarse dentro de un ModalMovimientosDates"
    );
  }
  return context;
};
