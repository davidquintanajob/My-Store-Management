import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";
import { Cliente } from "../components/MyDateTableClientes";

// Obtener todos los clientes
export const getAllClientes = async (token: String) => {
    try {
      const response = await axios.get(`${cerverHost}/cliente`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("Login");
      }
      console.log("Error al obtener datos de todos los Clientes: ", error);
      return false;
    }
  };

// Obtener cliente por el id
export const getClienteById = async (token: String, id_cliente: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Cliente/${id_cliente}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener datos del cliente: ", error);
    return false;
  }
};

// Agregar un nuevo cliente
export const addCliente = async (token: String, nombre: string, email: string, telefono:string, descripcion :string, nota: string, Cif:string, detalles_bancarios:string) => {
  try {
    const response = await axios.post(`${cerverHost}/Cliente/createCliente`, {
      nombre: nombre,
      email: email || "",
      descripcion: descripcion || "",
      nota: nota || "",
      telefono: telefono || "",
      Cif: Cif || "",
      detalles_bancarios: detalles_bancarios || ""
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al incertar un nuevo cliente: ", error);
    return false;
  }
};

// Actualizar cliente
export const actualizarCliente = async (token: String, id_cliente: string, nombre: string, email: string, telefono:string, descripcion :string, nota: string, Cif:string, detalles_bancarios:string) => {
  try {
    const response = await axios.put(`${cerverHost}/Cliente/updateCliente/${id_cliente}`, {
      nombre: nombre,
      email: email || "",
      descripcion: descripcion || "",
      nota: nota || "",
      telefono: telefono || "",
      Cif: Cif || "",
      detalles_bancarios: detalles_bancarios || ""
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al actualizar el cliente: ", error);
    return false;
  }
};

// Eliminar cliente
export const deleteCliente = async (token: String, id_cliente:string) => {
  try {
    const response = await axios.delete(`${cerverHost}/Cliente/deleteCliente/${id_cliente}`,
    {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al eliminar el cliente: ", error);
    return false;
  }
};

// Filtrar clientes
export const filtrarCliente = async (token: String, nombre: string, telefono:string, cif: string, detalle_bacario:string) => {
  try {
    const response = await axios.post(`${cerverHost}/Cliente/api/filtrar`, {
      nombre: nombre || "",
      cif: cif || "",
      telefono: telefono || "",
      detalles_bancarios: detalle_bacario || ""
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al filtrar los clientes: ", error);
    return false;
  }
};

// Ordenar clientes
export const ordenarClientes = async (token: string, items: Cliente[], criterio: string, ascendente: boolean) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Cliente/ordenar/all`,
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
    console.log("Error al ordenar los clientes: ", error);
    return false;
  }
};