import axios from "axios";
import { cerverHost } from "./cerverHost";
import { Proveedor } from "../components/MyDateTableProveedores";
import { navigate } from "../contexts/navigationRef";


// Obtener todos los proveedores
export const getAllProveedores = async (token: String) => {
    try {
      const response = await axios.get(`${cerverHost}/Proveedor`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error al obtener datos de los proveedores: ", error);
      return false;
    }
  };

// Obtener proveedor por el id
export const getProveedorById = async (token: String, id_proveedor: string) => {
  try {
    const response = await axios.get(`${cerverHost}/Proveedor/${id_proveedor}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener datos de el proveedor: ", error);
    return false;
  }
};

// Agregar un nuevo proveedor
export const addProveedor = async (token: String, nombre: string, email: string, telefono:string, direccion:string, nota: string, Cif:string, detalle_bacario:string) => {
  try {
    const response = await axios.post(`${cerverHost}/Proveedor/createProveedor`, {
      nombre: nombre,
      email: email || "",
      direccion: direccion || "",
      nota: nota || "",
      telefono: telefono || "",
      Cif: Cif || "",
      detalle_bacario: detalle_bacario || ""
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al incertar un nuevo proveedor: ", error);
    return false;
  }
};

// Actualizar proveedor
export const actualizarProveedor = async (token: String, id_proveedor:string, nombre: string, email: string, telefono:string, direccion:string, nota: string, Cif:string, detalle_bacario:string) => {
  try {
    const response = await axios.put(`${cerverHost}/Proveedor/updateProveedor/${id_proveedor}`, {
      nombre: nombre,
      email: email || "",
      direccion: direccion || "",
      nota: nota || "",
      telefono: telefono || "",
      Cif: Cif || "",
      detalle_bancario: detalle_bacario || ""
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al actualizar el proveedor: ", error);
    return false;
  }
};

// Eliminar proveedor
export const deleteProveedor = async (token: String, id_proveedor:string) => {
  try {
    const response = await axios.delete(`${cerverHost}/Proveedor/deleteProveedor/${id_proveedor}`,
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
    console.log("Error al eliminar el proveedor: ", error);
    return false;
  }
};

// Filtrar proveedores
export const filtrarProveedor = async (token: String, nombre: string, telefono:string, email: string, detalle_bacario:string) => {
  try {
    const response = await axios.post(`${cerverHost}/Proveedor/api/filtrar`, {
      nombre: nombre,
      email: email || "",
      telefono: telefono || "",
      detalle_bacario: detalle_bacario || ""
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
    console.log("Error al filtrar los proveedores: ", error);
    return false;
  }
};

// Ordenar proveedores
export const ordenarProveedor = async (token: String, items: Proveedor[], criterio:string, ascendente: boolean) => {
  try {
    const response = await axios.post(`${cerverHost}/Proveedor/api/filtrar`, {
      items: items,
      criterio: criterio,
      ascendente: ascendente
    },
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
    console.log("Error al ordenar los proveedores: ", error);
    return false;
  }
};