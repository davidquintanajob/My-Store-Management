import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Obtener todos los tipos de servicios
export const getAllTipoServicios = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Tipo_servicio`, {
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
      "Error al obtener datos de todos los Tipos de Servicios: ",
      error
    );
    return false;
  }
};

// Obtener un tipo de servicio especifico segun el id
export const getTipoServicioByID = async (
  token: String,
  id_TipoServicio: string
) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Tipo_servicio/${id_TipoServicio}`,
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
    console.log(
      "Error al obtener datos de un Tipo de Servicio espesifico segun el ID: ",
      error
    );
    return false;
  }
};

// Agregar tipo de servicio
export const addTipoServicio = async (
  token: string,
  nombre: string,
  costo: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Tipo_servicio/createTipo_servicio`,
      {
        nombre: nombre,
        costo: costo,
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
    console.log("Error incertar el tipo de servicio: ", error);
    return false;
  }
};

// Modificar Tipo de servicio
export const modificarTipoServicio = async (
  token: string,
  id_TipoServicio: string,
  nombre: string,
  costo: string
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Tipo_servicio/updateTipo_servicio/${id_TipoServicio}`,
      {
        nombre: nombre,
        costo: costo,
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
    console.log("Error modificar el tipo de servicio: ", error);
    return false;
  }
};

// Eliminar Tipo de servicio
export const deleteTipoServicio = async (
  token: string,
  id_TipoServicio: string
) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Tipo_servicio/deleteTipo_servicio/${id_TipoServicio}`,
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
    console.log("Error eliminar el tipo de servocio: ", error);
    return false;
  }
};

// Filtrar TipoServicio
export const filtrarTipoSrvicio = async (
  token: string,
  nombre: string,
  costo_liminf: string,
  costo_limsup: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Tipo_servicio/api/filtrar`,
      {
        nombre: nombre,
        costo_liminf: costo_liminf,
        costo_limsup: costo_limsup,
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
    console.log("Error al filtrar los datos: ", error);
    return false;
  }
};
