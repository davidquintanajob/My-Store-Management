import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Obtener todas las ventas
export const getAllVentas = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Venta`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al obtener datos de todas las ventas: ", error);
    return false;
  }
};

// Obtener una venta especifica por id
export const getVentaByID = async (token: String, id_venta: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Venta/${id_venta}`, {
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
      "Error al obtener datos de una venta especifica segun el ID: ",
      error
    );
    return false;
  }
};

// Agregar Venta
export const addVenta = async (
  token: string,
  id_producto: string,
  id_servicio: string,
  cantidad: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Venta/createVenta`,
      {
        producto: { id_producto: id_producto },
        servicio: { id_servicio: id_servicio },
        cantidad: cantidad,
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
    console.log("Error agregar venta: ", error);
    return false;
  }
};

// Modificar Venta
export const modificarVenta = async (
  token: string,
  id_venta: string,
  id_producto: string,
  id_servicio: string,
  cantidad: string
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Venta/updateVenta/${id_venta}`,
      {
        producto: { id_producto: id_producto },
        servicio: { id_servicio: id_servicio },
        cantidad: cantidad,
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
    console.log("Error modificar venta: ", error);
    return false;
  }
};

// Eliminar Venta
export const deleteVenta = async (token: string, id_producto: string, id_servicio: string) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Venta/deleteVenta/${id_producto}/${id_servicio}`,
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
    console.log("Error al eliminar venta: ", error);
    return false;
  }
};

// Obtener venta según el id del servicio
export const getVentaByIDOfServicio = async (token: String, id_servicio: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Venta/getbyServicio/${id_servicio}`, {
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
      "Error al obtener datos de la venta segun el id del servicio: ",
      error
    );
    return false;
  }
};