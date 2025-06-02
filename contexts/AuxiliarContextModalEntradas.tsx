import React, { createContext, useState, ReactNode } from "react";

// Define la interfaz del Usuario
export interface ModalEntradasDates {
  id_entrada: string;
  isAddEntrada: boolean;
  isModificarEntrada: boolean;
  fileEditable: boolean;
}

// Define la interfaz del contexto
interface ModalEntradasDatesContextType {
  modalEntradasDates: ModalEntradasDates | null;
  setModalEntradasDates: (
    modalEntradasDates: ModalEntradasDates | null
  ) => void;
}

// Crea el contexto
const ModalEntradasDatesContext = createContext<
  ModalEntradasDatesContextType | undefined
>(undefined);

// Define el proveedor
export const ModalEntradasDatesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalEntradasDates, setModalEntradasDates] =
    useState<ModalEntradasDates | null>(null);

  return (
    <ModalEntradasDatesContext.Provider
      value={{
        modalEntradasDates: modalEntradasDates,
        setModalEntradasDates: setModalEntradasDates,
      }}
    >
      {children}
    </ModalEntradasDatesContext.Provider>
  );
};

// Hook para usar el contexto
export const useModalEntradasDates = () => {
  const context = React.useContext(ModalEntradasDatesContext);
  if (context === undefined) {
    throw new Error(
      "useModalEntradasDates debe usarse dentro de un ModalEntradasDates"
    );
  }
  return context;
};
