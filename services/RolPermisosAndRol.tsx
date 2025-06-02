import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

export interface RolPermiso{
    id_permiso: string,
    tiene: boolean
}

// Optener todos los roles
export const getAllRol = async (token: string) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Rol`,
      {
        headers: {
          Authorization: `${token}`
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al obtener todos los roles: ", error);
    return false;
  }
};

// Optener toos los permisos de un usuario en específico
export const getPermisosOfRol = async (token: string, id_rol: string) => {
    try {
      const response = await axios.get(
        `${cerverHost}/Rol_permiso/getPermisosbyRol/${id_rol}`,
        {
          headers: {
            Authorization: `${token}`
          },
        }
      );
  
      return response.data as RolPermiso[];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("Login")
      }
      console.log("Error al obtener datos de los productos por el rol: ", error);
      return false;
    }
  };

  // Saver si un rol en especifico tiene hhavilitado un permiso en específico
  export const isPermiso = async (token: string, id_permiso: string, id_usuario: string) => {
    try {
      const response = await axios.get(
        `${cerverHost}/Usuario/tiene_permiso/${id_usuario}/${id_permiso}`,
        {
          headers: {
            Authorization: `${token}`
          },
        }
      );
      
      return response.data.tiene;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("Login")
      }
      console.log("Error al obtener datos de los permisos: ", error);
      return false;
    }
  };