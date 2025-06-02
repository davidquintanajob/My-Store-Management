import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Obtener todas las garantias
export const getAllGarantias = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Garantia`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener datos de las garantias: ", error);
    return false;
  }
};

// Obtener una garantia especifica segun el id
export const getGarantiaByID = async (token: String, id_garantia: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Garantia/${id_garantia}`, {
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
      "Error al obtener datos de una garantia en específico segun el ID: ",
      error
    );
    return false;
  }
};

// Agregar Garantia
export const addGarantia = async (
  token: string,
  duracion: string,
  id_servicio: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Garantia/createGarantia`,
      {
        duracion: duracion,
        servicio: { id_servicio: id_servicio },
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
    console.log("Error incertar la garantia: ", error);
    return false;
  }
};

// Modificar Garantia
export const modificarGarantia = async (
  token: string,
  duracion: string,
  id_servicio: string,
  id_garantia: string
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Garantia/updateGarantia/${id_garantia}`,
      {
        duracion: duracion,
        servicio: { id_servicio: id_servicio },
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
    console.log("Error modificar la garantia: ", error);
    return false;
  }
};

// Eliminar Garantia
export const deleteGarantia = async (token: string, id_garantia: string) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Garantia/deleteGarantia/${id_garantia}`,
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
    console.log("Error eliminar la garantia: ", error);
    return false;
  }
};

// Filtrar Garantia
export const filtrarGarantia = async (token: string, nombre_cliente: string, duracion_limsup: string, duracion_liminf: string, nombre_producto: string, fecha_liminf: string, fecha_limsup: string, id_tienda: string) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Garantia/api/filtrar`,
      {
          nombre_producto: nombre_producto,
          nombre_cliente: nombre_cliente,
          duracion_liminf: duracion_liminf,
          duracion_limsup: duracion_limsup,
          fecha_liminf: fecha_liminf,
          fecha_limsup: fecha_limsup,
          id_tienda: id_tienda
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
    console.log("Error al filtrar los datos: ", error);
    return false;
  }
};
