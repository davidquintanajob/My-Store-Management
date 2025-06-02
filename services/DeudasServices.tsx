import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Obtener todas las deudas
export const getAllDeudas = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Deuda`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al obtener datos de todas las deudas: ", error);
    return false;
  }
};

// Obtener una deuda especifica segun el id
export const getDeudaByID = async (token: String, id_deuda: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Deuda/${id_deuda}`, {
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
      "Error al obtener datos de una deuda en específico segun el ID: ",
      error
    );
    return false;
  }
};

// Agregar Deuda
export const addDeuda = async (
  token: string,
  deuda: string,
  id_servicio: string,
  id_pagos_deuda?: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Deuda/createDeuda`,
      {
        deuda: deuda,
        pago_deuda: { id_pago_deuda: id_pagos_deuda },
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
    console.log("Error incertar la deuda: ", error);
    return false;
  }
};

// Modificar Deuda
export const modificarDeuda = async (
  token: string,
  id_deuda: string,
  deuda: string,
  id_pagos_deuda: string,
  id_servicio: string
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Deuda/updateDeuda/${id_deuda}`,
      {
        deuda: deuda,
        pago_deuda: { id_pago_deuda: id_pagos_deuda },
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
    console.log("Error modificar la deuda: ", error);
    return false;
  }
};

// Eliminar Dedua
export const deleteDeuda = async (token: string, id_deuda: string) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Deuda/deleteDeuda/${id_deuda}`,
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
    console.log("Error eliminar la deuda: ", error);
    return false;
  }
};

// Filtrar Deudas
export const filtrarDeudas = async (
  token: string,
  nombre_producto: string,
  nombre_cliente: string,
  deuda_liminf: string,
  deuda_limsup: string,
  fecha_liminf: string,
  fecha_limsup: string,
  id_tienda: string,
  id_tipo_servicio: string,
  saldada?: boolean
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Deuda/api/filtrar`,
      {
        nombre_producto: nombre_producto,
        nombre_cliente: nombre_cliente,
        deuda_liminf: deuda_liminf,
        deuda_limsup: deuda_limsup,
        id_tienda: id_tienda,
        id_tipo_servicio: id_tipo_servicio,
        fecha_liminf: fecha_liminf,
        fecha_limsup: fecha_limsup,
        saldada: saldada
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
