import axios from "axios";
import { cerverHost } from "./cerverHost";
import { Movimiento } from "../components/MyDateTableMovimientos";
import { navigate } from "../contexts/navigationRef";

// Obtener todos los movimientos
export const getAllMovimientos = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Salida`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al obtener todos los datos de los movimientos: ", error);
    return false;
  }
};

// Agregar Movimiento
export const addNewMovimiento = async (
  token: String,
  fecha: string,
  id_tienda_origen: string,
  id_tienda_destino: string,
  cantidad: string,
  id_producto: string,
  id_usuario: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Salida/createSalida`,
      {
        fecha: fecha,
        cantidad: cantidad,
        producto: id_producto,
        tienda_origen: id_tienda_origen,
        tienda_destino: id_tienda_destino,
        usuario: id_usuario,
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
    console.log("Error al crear la salida del producto: ", error);
    return false;
  }
};

// Obtener datos de movimiento por id
export const getMovimientoById = async (
  token: String,
  id_movimiento: string
) => {
  try {
    const response = await axios.get(`${cerverHost}/Salida/${id_movimiento}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener datos del movimiento en específico: ", error);
    return false;
  }
};

// Actualizar movimiento
export const updateMovimiento = async (
  token: String,
  id_movimiento: string,
  fecha: string,
  id_tienda_origen: string,
  id_tienda_destino: string,
  cantidad: string,
  id_producto: string,
  id_usuario: string
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Salida/updateSalida/${id_movimiento}`,
      {
        fecha: fecha,
        cantidad: cantidad,
        producto: id_producto,
        tienda_origen: id_tienda_origen,
        tienda_destino: id_tienda_destino,
        usuario: id_usuario,
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
    console.log("Error al actualizar datos del movimiento: ", error);
    return false;
  }
};

// Eliminar movimiento
export const deleteMovimiento = async (
  token: String,
  id_movimiento: string,
) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Salida/deleteSalida/${id_movimiento}`,
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
    console.log("Error al eliminar el movimiento: ", error);
    return false;
  }
};

// Filtrar Movimiento
export const filtrarMovimientos = async (
  token: String,
  nombreUsuario: string,
  nombreProducto: string,
  cantidad: string,
  fechaDesde: string,
  fechaHasta: string,
  tiendaOrigen: string,
  tiendaDestino: string
) => {
  console.log(tiendaOrigen, tiendaDestino);
  
  try {
    const response = await axios.post(
      `${cerverHost}/Salida/api/filtrar`,
      {
        nombre_usuario: nombreUsuario ?? null,
        nombre_producto: nombreProducto ?? null,
        cantidad: parseInt(cantidad) ?? null,
        fecha_liminf: fechaDesde ?? null,
        fecha_limsup: fechaHasta ?? null,
        id_tienda_origen: tiendaOrigen ?? null,
        id_tienda_destino: tiendaDestino ?? null,
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
    console.log("Error al filtrar movimientos: ", error);
    return false;
  }
};

// Filtrar movimientos especial
export const filtrarMovimientosEspecial = async (
  token: String,
  nombreUsuario: string,
  nombreProducto: string,
  cantidad: string,
  fechaDesde: string,
  fechaHasta: string,
  tiendaUsuario: string,
  tienda_origen: string,
  tienda_destino: string
) => {
  console.log(
    "NombreUsuario: ",nombreUsuario,
    "NombreProducto: ",nombreProducto,
    "Cantidad: ",cantidad,
    "fechaDesde: ",fechaDesde,
    "fechaHasta: ",fechaHasta,
    "TiendaUsuario: ",tiendaUsuario,
    "TiendaOr: ",tienda_origen,
    "tiendaDes: ",tienda_destino
  );
  
  try {
    const response = await axios.post(
      `${cerverHost}/Salida/api/filtrarJT`,
      {
        nombre_usuario: nombreUsuario ?? null,
        nombre_producto: nombreProducto ?? null,
        cantidad: parseInt(cantidad) ?? null,
        fecha_liminf: fechaDesde ?? null,
        fecha_limsup: fechaHasta ?? null,
        id_tienda: tiendaUsuario ?? null,
        id_tienda_origen: tienda_origen ?? null,
        id_tienda_destino: tienda_destino ?? null
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
    console.log("Error al filtrarEspecial movimientos: ", error);
    return false;
  }
};

// Ordenar movimientos
export const ordenarMovimientos = async (token: string, items: Movimiento[], criterio: string, ascendente: boolean) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Salida/ordenar/all`,
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
    console.log("Error al ordenar las entradas: ", error);
    return false;
  }
};
