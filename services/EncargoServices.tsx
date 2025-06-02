import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Obtener todos los encargos
export const getAllEncargos = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Encargo`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener datos de los encargos: ", error);
    return false;
  }
};

// Obtener un encargo especifica segun el id
export const getEncargoByID = async (token: String, id_encargo: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Encargo/${id_encargo}`, {
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
      "Error al obtener datos de un encargo en específico segun el ID: ",
      error
    );
    return false;
  }
};

// Agregar Encargo
export const addEncargo = async (
  token: string,
  adelanto: string,
  fecha_final: string,
  id_servicio: string
) => {
  console.log(adelanto, fecha_final, id_servicio);
  
  try {
    const response = await axios.post(
      `${cerverHost}/Encargo/createEncargo`,
      {
        adelanto: adelanto,
        fecha_final: fecha_final,
        servicio: { id_servicio: id_servicio }
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
    console.log("Error incertar el encargo: ", error);
    return false;
  }
};

// Modificar Encargo
export const modificarEncargo = async (
    token: string,
    adelanto: string,
    fecha_final: string,
    id_servicio: string,
    id_encargo: string
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Encargo/updateEncargo/${id_encargo}`,
      {
        adelanto: adelanto,
        fecha_final: fecha_final,
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
    console.log("Error modificar el encargo: ", error);
    return false;
  }
};

// Eliminar Encargo
export const deleteEncargo = async (token: string, id_encargo: string) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Encargo/deleteEncargo/${id_encargo}`,
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
    console.log("Error eliminar el encargo: ", error);
    return false;
  }
};
