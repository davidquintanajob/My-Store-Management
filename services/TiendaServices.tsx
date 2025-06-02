import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Obtener Todos los datos de las tiendas
export const getAllTiendas = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Tienda`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al obtener datos de las tiendas: ", error);
    return false;
  }
};

// Agregar tienda
export const addTienda = async (
  token: string,
  nombre: string,
  direccion: string,
  comicion: string,
  hora_apertura: string,
  hora_cierre: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Tienda/createTienda`,
      {
        nombre: nombre,
        direccion: direccion,
        comicion: comicion,
        hora_apertura: hora_apertura,
        hora_cierre: hora_cierre
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
    console.log("Error incertar la tienda: ", error);
    return false;
  }
};

// Realizar venta
export const tienda_Realizarventa = async (
  token: string,
  id_producto: string,
  id_tienda: string,
  cantidadARestar: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto_tienda/realizarVenta`,
      {
        id_producto: id_producto,
        id_tienda: id_tienda,
        cantidad: cantidadARestar,
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
    console.log("Error al realizar venta en producto tienda: ", error);
    return false;
  }
};

// Modiciar Tienda
export const updateTienda = async (
  token: string,
  id_tienda: string,
  nombre: string,
  direccion: string,
  comicion: string,
  hora_apertura: string,
  hora_cierre: string
) => {
  try {
    await axios.put(
      `${cerverHost}/Tienda/updateTienda/${id_tienda}`,
      {
        nombre: nombre,
        direccion: direccion,
        comicion: comicion,
        hora_apertura: hora_apertura,
        hora_cierre: hora_cierre
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error actualizar la tienda: ", error);
    return false;
  }
};

// Eliminar Tienda
export const deleteTienda = async (token: string, id_tienda: string) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Tienda/deleteTienda/${id_tienda}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error eliminar la tienda: ", error);
    return false;
  }
};

// Obtener Tienda segun su identificador
export const getTiendaById = async (token: String, id_tienda: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Tienda/${id_tienda}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al obtener dato de la tienda en específico: ", error);
    return false;
  }
};

// Obtener todas las tiendas en las que se encuentre un producto específico
export const getAllTiendasByProduct = async (
  token: String,
  id_producto: string
) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Producto_tienda/getTiendas/${id_producto}`,
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
      "Error al obtener datos de las tiendas según el producto: ",
      error
    );
    return false;
  }
};

// Saver si un producto en específico está en una tienda específica
export const isProductoInTienda = async (
  token: String,
  id_producto: string,
  id_tienda: string
) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Producto_tiendabyID/${id_producto}/${id_tienda}`,
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
    console.log("Error al obtener datos de las tiendas: ", error);
    return 0;
  }
};

// Obtener la cantidad que hay de un producto en una tienda específica
export const getCantidadProductoInTiendaEspecifica = async (
  token: String,
  id_producto: string,
  id_tienda: string
) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Producto_tiendabyID/${id_producto}/${id_tienda}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data.cantidad;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log(
      "Error al obtener la cantidad del producto en tienda específica: ",
      error
    );
    return 0;
  }
};
