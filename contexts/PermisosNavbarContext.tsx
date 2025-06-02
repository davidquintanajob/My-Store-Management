import React, { createContext, useState, ReactNode } from 'react';

// Define la interfaz del Usuario
export interface PermisosUsuario {
    resultProductoView: boolean; //9
    resultProveedorView: boolean; //38
    resultEntradaView: boolean; //13
    resultMovimientoLocalView: boolean; //30
    resultMovimientoGeneralView: boolean; //31
    resultAgregarUsuario: boolean; //1
    resultModificarUsuario: boolean; //2
    resultEliminarUsuario: boolean; //3
    resultAccionesView: boolean; //15
    resultTipoServicio: boolean; // 20, 21, 22
    resultClienteView: boolean; // 16, 17, 18, 19
    resultGarantiaView: boolean; // 32, 33, 34
}

// Define la interfaz del contexto
interface PermisosUsuarioContextType {
  permisosUsuarioNavbar: PermisosUsuario | null;
  setPermisosUsuarioNavbar: (permisosUsuario: PermisosUsuario | null) => void;
}

// Crea el contexto
const PermisosUsuarioContext = createContext<PermisosUsuarioContextType | undefined>(undefined);

// Define el proveedor
export const PermisosUsuarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [permisosUsuario, setPermisosUsuario] = useState<PermisosUsuario | null>(null);

  return (
    <PermisosUsuarioContext.Provider value={{ permisosUsuarioNavbar: permisosUsuario, setPermisosUsuarioNavbar: setPermisosUsuario }}>
      {children}
    </PermisosUsuarioContext.Provider>
  );
};

// Hook para usar el contexto
export const usePermisosUsuario = () => {
  const context = React.useContext(PermisosUsuarioContext);
  if (context === undefined) {
    throw new Error('usePermisosUsuario debe usarse dentro de un PermisosUsuario');
  }
  return context;
};