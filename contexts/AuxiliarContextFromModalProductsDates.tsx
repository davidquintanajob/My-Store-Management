import React, { createContext, useState, ReactNode } from 'react';

// Define la interfaz del Usuario
export interface ModalProductsDates {
    id_producto: string;
    isAddProducto: boolean;
    isModificarProducto: boolean;
    fileEditable: boolean;
    isAddProductoShowProveedoresTiendas: boolean;
    isAddProductoShowProveedores: boolean;
}

// Define la interfaz del contexto
interface ModalProductsDatesContextType {
  modalProductsDates: ModalProductsDates | null;
  setModalProductsDates: (modalProductsDates: ModalProductsDates | null) => void;
}

// Crea el contexto
const ModalProductsDatesContext = createContext<ModalProductsDatesContextType | undefined>(undefined);

// Define el proveedor
export const ModalProductsDatesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalProductsDates, setModalProductsDates] = useState<ModalProductsDates | null>(null);

  return (
    <ModalProductsDatesContext.Provider value={{ modalProductsDates: modalProductsDates, setModalProductsDates: setModalProductsDates }}>
      {children}
    </ModalProductsDatesContext.Provider>
  );
};

// Hook para usar el contexto
export const useModalProductsDates = () => {
  const context = React.useContext(ModalProductsDatesContext);
  if (context === undefined) {
    throw new Error('useModalProductsDates debe usarse dentro de un ModalProductsDates');
  }
  return context;
};