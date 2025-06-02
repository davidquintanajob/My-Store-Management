import axios from "axios";
import { cerverHost } from "./cerverHost";
import { Entrada } from "../components/MyDateTableEntradas";
import { navigate } from "../contexts/navigationRef";

// Obtener todas las entradas
export const getAllEntradas = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Entrada`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al obtener datos de todas las entradas: ", error);
    return false;
  }
};

// Obtener una entrada especifica segun el id
export const getEntradaByID = async (token: String, id_entrada: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Entrada/${id_entrada}`, {
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
      "Error al obtener datos de una entrada en específico segun el ID: ",
      error
    );
    return false;
  }
};

// Agregar Entrada
export const addEntrada = async (
  token: string,
  costo: string,
  cantidad: string,
  fecha: string,
  fecha_vencimiento: string | null,
  id_proveedor: number,
  id_producto: number,
  id_tienda: number,
  costo_cup: number
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Entrada/createEntrada`,
      {
        costo: costo,
        cantidad: cantidad,
        fecha: fecha,
        costo_cup: costo_cup,
        fecha_vencimiento: fecha_vencimiento,
        proveedor: { id_proveedor: id_proveedor },
        producto: { id_producto: id_producto },
        tienda: { id_tienda: id_tienda },
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
    console.log("Error incertar la entrada: ", error);
    return false;
  }
};

// Obtener todas las entradas segun el id del producto
export const getAllEntradasByProductoId = async (
  token: string,
  id_producto: string
) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Entrada/Producto/${id_producto}`,
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
      "Error al obtener todos las entradas según el producto: ",
      error
    );
    return false;
  }
};

// Obtener todas las entradas segun el id del proveedor
export const getAllEntradasByProveedorId = async (
  token: string,
  id_proveedor: string
) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Entrada/getProveedores/${id_proveedor}`,
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
      "Error al obtener todos las entradas según el proveedor: ",
      error
    );
    return false;
  }
};

// Modificar Entrada
export const modificarEntrada = async (
  token: string,
  id_entrada: string,
  costo: string,
  cantidad: string,
  fecha: string,
  fecha_vencimiento: string | null,
  id_proveedor: number,
  id_producto: number,
  id_tienda: number,
  costo_cup: number
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Entrada/updateEntrada/${id_entrada}`,
      {
        costo: costo,
        cantidad: cantidad,
        fecha: fecha,
        costo_cup: costo_cup,
        fecha_vencimiento: fecha_vencimiento,
        proveedor: { id_proveedor: id_proveedor },
        producto: { id_producto: id_producto },
        tienda: { id_tienda: id_tienda },
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
    console.log("Error modificar la entrada: ", error);
    return false;
  }
};

// Eliminar Entrada
export const deleteEntrada = async (token: string, id_entrada: string) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Entrada/deleteEntrada/${id_entrada}`,
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
    console.log("Error incertar la entrada: ", error);
    return false;
  }
};

// Filtrar Entradas
export const filtrarEntrada = async (
  token: string,
  nombre_proveedor: string,
  nombre_producto: string,
  costo_liminf: string,
  costo_limsup: string,
  fecha_liminf: string,
  fecha_limsup: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Entrada/api/filtrar`,
      {
        nombre_producto: nombre_producto,
        nombre_proveedor: nombre_proveedor,
        costo_liminf: costo_liminf,
        costo_limsup: costo_limsup,
        fecha_liminf: fecha_liminf,
        fecha_limsup: fecha_limsup,
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
// Ordenar entradas
export const ordenarEntradas = async (
  token: string,
  items: Entrada[],
  criterio: string,
  ascendente: boolean
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Entrada/ordenar/all`,
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
      navigate("Login");
    }
    console.log("Error al ordenar las entradas: ", error);
    return false;
  }
};

// Obtener entradas proxims a vencimiento
export const getEntradasPorVencer = async (token: String, fechaLimVencimiento: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Entrada/vencimiento/${fechaLimVencimiento}`, {
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
      "Error al obtener datos de las entradas que estan proximas a vencer ",
      error
    );
    return false;
  }
};