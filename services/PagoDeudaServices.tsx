import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Obtener todas las pago_deudas
export const getAllPagoDeudas = async (token: String) => {
    try {
      const response = await axios.get(`${cerverHost}/Pago_Deuda`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("Login");
      }
      console.log("Error al obtener datos de todas las pago deudas: ", error);
      return false;
    }
  };
  
  // Obtener una pago_deuda especifica segun el id
  export const getPagoDeudaByID = async (token: String, id_pago_deuda: string) => {
    try {
      const response = await axios.get(`${cerverHost}/Pago_Deuda/${id_pago_deuda}`, {
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
        "Error al obtener datos de una pago deuda en específico segun el ID: ",
        error
      );
      return false;
    }
  };
  
  // Agregar Pago Deuda
  export const addPagoDeuda = async (
    token: string,
    pagada: string,
    fecha: string,
    id_deuda: string
  ) => {
    try {
      const response = await axios.post(
        `${cerverHost}/Pago_Deuda/createPago_Deuda`,
        {
          pagada: pagada,
          fecha: fecha,
          deuda: {"id_deuda": id_deuda}
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
      console.log("Error incertar la pago deuda: ", error);
      return false;
    }
  };
  
  // Modificar Pago Deuda
  export const modificarPagoDeuda = async (
    token: string,
    id_pago_deuda: string,
    pagada: string,
    fecha: string,
    id_deuda: string
  ) => {
    try {
      const response = await axios.put(
        `${cerverHost}/Pago_Deuda/updatePago_Deuda/${id_pago_deuda}`,
        {
            pagada: pagada,
            fecha: fecha,
            deuda: {"id_deuda": id_deuda}
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
      console.log("Error modificar la pago deuda: ", error);
      return false;
    }
  };
  
  // Eliminar Pago Dedua
  export const deletePagoDeuda = async (token: string, id_pago_deuda: string) => {
    try {
      const response = await axios.delete(
        `${cerverHost}/Pago_Deuda/deletePago_Deuda/${id_pago_deuda}`,
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
      console.log("Error eliminar la pago deuda: ", error);
      return false;
    }
  };