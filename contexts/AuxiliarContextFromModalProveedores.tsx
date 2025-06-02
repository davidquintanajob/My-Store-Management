import React, { createContext, useState, ReactNode } from 'react';

// Define la interfaz del Usuario
export interface ModalProveedoresDates {
    id_proveedor: string;
    isAddProveedor: boolean;
    isModificarProveedor: boolean;
    fileEditable: boolean;
    isAddProductoShowProveedoresTiendas: boolean;
    isDetallesProveedores: boolean;
}

// Define la interfaz del contexto
interface ModalProductsDatesContextType {
  modalProveedoresDates: ModalProveedoresDates | null;
  setModalProveedoresDates: (modalProveedoresDates: ModalProveedoresDates | null) => void;
}

// Crea el contexto
const ModalProveedoresDatesContext = createContext<ModalProductsDatesContextType | undefined>(undefined);

// Define el proveedor
export const ModalProveedoresDatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalProveedoresDates, setModalProveedoresDates] = useState<ModalProveedoresDates | null>(null);

  return (
    <ModalProveedoresDatesContext.Provider value={{ modalProveedoresDates: modalProveedoresDates, setModalProveedoresDates: setModalProveedoresDates }}>
      {children}
    </ModalProveedoresDatesContext.Provider>
  );
};

// Hook para usar el contexto
export const useModalProveedoresDates = () => {
  const context = React.useContext(ModalProveedoresDatesContext);
  if (context === undefined) {
    throw new Error('useModalProveedoresDates debe usarse dentro de un ModalProveedoresDates');
  }
  return context;
};