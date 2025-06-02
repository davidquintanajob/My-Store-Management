import React, { createContext, useState, ReactNode } from 'react';
import { RolPermiso } from "../services/RolPermisosAndRol";

// Define la interfaz del Usuario
export interface Usuario {
  id_usuario: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  carnet_identidad?: string;
  detalles_bancarios?: string;
  nombre_usuario: string;
  email: string;
  token: string;
  id_rol: string;
  nombre_rol: string;
  id_tienda: string;
  nombre_tienda: string;
  permisos: RolPermiso[];
}

// Define la interfaz del contexto
interface UsuarioContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
}

// Crea el contexto
const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

// Define el proveedor
export const UsuarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  return (
    <UsuarioContext.Provider value={{ usuario: usuario, setUsuario: setUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

// Hook para usar el contexto
export const useUsuario = () => {
  const context = React.useContext(UsuarioContext);
  if (context === undefined) {
    throw new Error('useUsuario debe usarse dentro de un ProductoUsuario');
  }
  return context;
};