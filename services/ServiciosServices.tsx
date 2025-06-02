import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";
import { Servicio } from "../components/MyDateTableServicios";

// Obtener todos los servicios
export const getAllServicios = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Servicio`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login");
    }
    console.log("Error al obtener datos de todos los servicios: ", error);
    return false;
  }
};

// Obtener un servicio según el id específico
export const getServicioByID = async (token: String, id_servicio: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Servicio/${id_servicio}`, {
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
      "Error al obtener datos de un servicio en específico segun el ID: ",
      error
    );
    return false;
  }
};

// Agregar Servicio
export const addServicio = async (
  token: string,
  fecha: string,
  precio: string,
  nota: string,
  descripcion: string,
  id_tienda: string,
  id_tipo_servicio: string,
  costo: string,
  cantidad_transferida: string,
  id_cliente?: string,
  id_garantia?: string,
  id_encargo?: string
) => {
  /*
  console.log("fecha: ",fecha);
  console.log("precio: ",precio);
  console.log("nota: ",nota);
  console.log("descripcion: ",descripcion);
  console.log("id_tienda: ",id_tienda);
  console.log("id_tipo_servicio: ",id_tipo_servicio);
  console.log("costo: ",costo);
  console.log("cantidad_transferida: ",cantidad_transferida);
  console.log("id_cliente: ",id_cliente);
  */
  try {
    const response = await axios.post(
      `${cerverHost}/Servicio/createServicio`,
      {
        fecha: fecha,
        precio: precio,
        nota: nota,
        descripcion: descripcion,
        tienda: { id_tienda: id_tienda },
        tipo_servicio: { id_tipo_servicio: id_tipo_servicio },
        cliente: { id_cliente: id_cliente ?? null },
        costo: costo,
        cantidad_transferida: cantidad_transferida,
        garantia: null,
        deuda: null,
        encargo: null,
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
    console.log("Error agregar servicio: ", error);
    return false;
  }
};

// Modificar Servicio
export const modificarServicio = async (
  token: string,
  id_Servicio: string,
  fecha: string,
  precio: string,
  nota: string,
  id_tienda: string,
  id_tipo_servicio: string,
  costo: string,
  cantidad_transferida: string,
  devuelto: boolean,
  id_cliente?: string,
  id_garantia?: string,
  id_encargo?: string
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Servicio/updateServicio/${id_Servicio}`,
      {
        fecha: fecha,
        precio: precio,
        nota: nota,
        costo: costo,
        cantidad_transferida: cantidad_transferida,
        devuelto: devuelto,
        tienda: { id_tienda: id_tienda },
        tipo_servicio: { id_tipo_servicio: id_tipo_servicio },
        cliente: { id_cliente: id_cliente ?? null }
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
    console.log("Error modificar servicio: ", error);
    return false;
  }
};

// Eliminar Servicio
export const deleteServicio = async (token: string, id_servicio: string) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Servicio/deleteServicio/${id_servicio}`,
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
    console.log("Error al eliminar servicio: ", error);
    return false;
  }
};

// Filtrar Servicio
export const filtrarSrvicio = async (
  token: string,
  nombre_cliente: string,
  id_tipo_servicio: string,
  id_tienda: string,
  precio_liminf: string,
  precio_limsup: string,
  fecha_liminf: string,
  fecha_limsup: string,
  nombre_producto: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Servicio/api/filtrar`,
      {
        nombre_cliente: nombre_cliente,
        id_tipo_servicio: id_tipo_servicio,
        id_tienda: id_tienda,
        precio_liminf: precio_liminf,
        precio_limsup: precio_limsup,
        fecha_liminf: fecha_liminf,
        fecha_limsup: fecha_limsup,
        nombre_producto: nombre_producto
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

// Ordenar servicio
export const ordenarServicios = async (token: string, items: any[], criterio: string, ascendente: boolean) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Servicio/ordenar/all`,
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
    console.log("Error al ordenar las servicios: ", error);
    return false;
  }
};