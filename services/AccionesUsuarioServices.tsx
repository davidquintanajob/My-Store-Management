import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";
import { Accion } from "../components/MyDateTableAcciones";

// Obtener todas las acciones
export const getAllAcciones = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Accion`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al obtener datos de todas las acciones: ", error);
    return false;
  }
};

// Obtener una accion especifica segun el id
export const getAccionByID = async (token: String, id_accion: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Accion/${id_accion}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log(
      "Error al obtener datos de una acción en específico segun el ID: ",
      error
    );
    return false;
  }
};

// Agregar Traza de usuario
export const addAccionUsuario = async (
  token: string,
  descripcion: string,
  fecha: string,
  id_usuario: string,
  id_tipo_accion: number
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Accion/createAccion`,
      {
        descripcion: descripcion,
        fecha: fecha,
        usuario: {"id_usuario": id_usuario},
        tipo_accion: {"id_tipo_accion": id_tipo_accion},
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error al agregar acción de usuario: ", error);
    return false;
  }
};

// Obtener todos los tipos de accion
export const getAllTiposAccion = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Tipo_accion`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al obtener datos de todas los tipos de acción: ", error);
    return false;
  }
};

// Filtrar acciones
export const filtrarAcciones = async (
  token: string,
  id_tipo_accion: string,
  nombre_usuario: string,
  descripcion: string,
  fecha_limsup: string,
  fecha_liminf: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Accion/api/filtrar`,
      {
        id_tipo_accion: id_tipo_accion,
        nombre_usuario: nombre_usuario,
        descripcion: descripcion,
        fecha_limsup: fecha_liminf,
        fecha_liminf: fecha_limsup,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al filtrar acciones: ", error);
    return false;
  }
};

// Ordenar acciones
export const ordenarAcciones = async (
  token: string,
  items: Accion[],
  criterio: string,
  ascendente: boolean
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Accion/ordenar/all`,
      {
        items: items,
        criterio: criterio,
        ascendente: ascendente,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al ordenar las acciones: ", error);
    return false;
  }
};
