import React, { createContext, useState, ReactNode } from 'react';
import { Producto } from '../components/MyDateTableProductos';
import { Asset } from 'react-native-image-picker';

// Define la interfaz del Usuario
export interface ImagenesDelete {
  imagenes: Asset[];
}

// Define la interfaz del contexto
interface ImagenesDeleteContextType {
  imagenesDelete: ImagenesDelete | null;
  setImagenesDelete: (imagenesDelete: ImagenesDelete | null) => void;
}

// Crea el contexto
const ImagenesDeleteContext = createContext<ImagenesDeleteContextType | undefined>(undefined);

// Define el proveedor
export const ImagenesDeleteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [imagenesDelete, setImagenesDelete] = useState<ImagenesDelete | null>(null);

  return (
    <ImagenesDeleteContext.Provider value={{ imagenesDelete: imagenesDelete, setImagenesDelete: setImagenesDelete }}>
      {children}
    </ImagenesDeleteContext.Provider>
  );
};

// Hook para usar el contexto
export const useImagenesDelete = () => {
  const context = React.useContext(ImagenesDeleteContext);
  if (context === undefined) {
    throw new Error('useImagenesDelete debe usarse dentro de un ImagenesDelete');
  }
  return context;
};