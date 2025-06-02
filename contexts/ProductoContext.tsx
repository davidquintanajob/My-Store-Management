import React, { createContext, useState, ReactNode } from 'react';

// Define la interfaz del Producto
export interface Producto {
  carnet_identidad: string;
  nombre: string;
  num_cama: number;
  edad: number;
  num_telefono: number;
  fecha_diagnostico: Date;
  id_diagnostico: number;
}

// Define la interfaz del contexto
interface ProductoContextType {
  producto: Producto | null;
  setProducto: (producto: Producto | null) => void;
}

// Crea el contexto
const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

// Define el proveedor
export const ProductoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [producto, setProducto] = useState<Producto | null>(null);

  return (
    <ProductoContext.Provider value={{ producto, setProducto }}>
      {children}
    </ProductoContext.Provider>
  );
};

// Hook para usar el contexto
export const useProducto = () => {
  const context = React.useContext(ProductoContext);
  if (context === undefined) {
    throw new Error('useProducto debe usarse dentro de un ProductoProvider');
  }
  return context;
};
