import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

export interface Permiso {
  id_permiso: string;
  nombre_permiso: string;
  descripcion: string;
}

// Función para que iniciar seción a los usuarios
export const getUsuarioPermisos = async (token: String, id_usuario: String) => {
  try {
    const response = await axios.post(`${cerverHost}/Usuario/auth`, {
      /*
      nombre_usuario: userName,
      contrasenna: password,
      */
    });

    if (response.data.msg === "Usuario encontrado") {
      return response;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al iniciar seción: ", error);
    return false;
  }
};
