import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";
import { UsuarioTabla } from "../components/MyDateTableUsuarios";

// Función para que iniciar seción a los usuarios
export const iniciarSecionUser = async (userName: String, password: String) => {
    try {
        const response = await axios.post(
          `${cerverHost}/Usuario/auth`,
          {
            nombre_usuario: userName,
            contrasenna: password
          }
        );

        if(response.data.msg === "Usuario encontrado"){
          return response;
        }
      } catch (error) {
        console.log("Error al iniciar seción: ", error);
        return false;
      }
}

// Agregar usuario al sistema
export const addUsuario = async (
  token: string,
  nombre: string,
  nombre_usuario: string,
  contrasenna: string,
  email: string,
  telefono: string,
  direccion: string,
  carnet_identidad: string,
  detalles_bancarios: string,
  rol: string,
  tienda: string,
  salario_CUP: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Usuario/createUsuario`,
      {
        nombre: nombre,
        nombre_usuario: nombre_usuario,
        contrasenna: contrasenna,
        email: email,
        telefono: telefono,
        direccion: direccion,
        carnet_identidad: (carnet_identidad === "")? null : carnet_identidad,
        detalles_bancarios: detalles_bancarios,
        salario_CUP: salario_CUP,
        rol: {"id_rol": rol},
        tienda: {"id_tienda": tienda}
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
    console.log("Error incertar el usuario: ", error);
    return false;
  }
};

// Eliminar Usuario del sistema
export const deleteUsuario = async (token: String, id_usuario:string) => {
  try {
    const response = await axios.delete(`${cerverHost}/Usuario/deleteUsuario/${id_usuario}`,
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
    console.log("Error al eliminar el usuario: ", error);
    return false;
  }
};

// Modificar datos de un usuario conociendo la contraeña nueva
export const actualizarUsuarioConContraseña = async (
  token: string,
  id_usuario: string,
  nombre: string,
  nombre_usuario: string,
  contrasenna: string,
  email: string,
  telefono: string,
  direccion: string,
  carnet_identidad: string,
  detalles_bancarios: string,
  rol: string,
  tienda: string,
  activo: boolean,
  salario_CUP: string
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Usuario/updateUsuario/${id_usuario}`,
      {
        nombre: nombre,
        nombre_usuario: nombre_usuario,
        contrasenna: contrasenna,
        email: email,
        telefono: telefono,
        direccion: direccion,
        carnet_identidad: carnet_identidad,
        detalles_bancarios: detalles_bancarios,
        activo: activo,
        salario_CUP: salario_CUP,
        rol: {"id_rol": rol},
        tienda: {"id_tienda": tienda}
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
    console.log("Error modificar el usuario: ", error);
    return false;
  }
};

// Modificar datos de un usuario sin conociendo la contraeña nueva
export const actualizarUsuarioSinContraseña = async (
  token: string,
  id_usuario: string,
  nombre: string,
  nombre_usuario: string,
  email: string,
  telefono: string,
  direccion: string,
  carnet_identidad: string,
  detalles_bancarios: string,
  rol: string,
  tienda: string,
  activo: boolean,
  salario_CUP: string
  
) => {
  try {
    const response = await axios.put(
      `${cerverHost}/Usuario/updateUsuario/${id_usuario}`,
      {
        nombre: nombre,
        nombre_usuario: nombre_usuario,
        email: email,
        telefono: telefono,
        direccion: direccion,
        carnet_identidad: carnet_identidad,
        detalles_bancarios: detalles_bancarios,
        activo: activo,
        salario_CUP: salario_CUP,
        rol: {"id_rol": rol},
        tienda: {"id_tienda": tienda}
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
    console.log("Error modificar el usuario: ", error);
    return false;
  }
};

// Función para obtener algunos datos de un usuario específico
export const getUsuarioById = async (token: String, id_user: String) => {
  try {
      const response = await axios.get(
        `${cerverHost}/Usuario/${id_user}`,
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Error en la solicitud de datos de el usuario:', error);
      alert(error);
      return false;
    }
}

// Optener todos los datos de todos los usuarios
export const getAllUsuarios = async (token: String) => {
  try {
      const response = await axios.get(
        `${cerverHost}/Usuario`,
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("Login")
      }
      console.error('Error en la solicitud de datos de los usuarios:', error);
      alert(error);
      return false;
    }
}

// Función para obtener los permisos de un usuario específico
export const allPermises = async (token: String, id_user: String) => {
  try {
      const response = await axios.get(
        `${cerverHost}/Usuario/${id_user}`,
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("Login")
      }
      console.error('Error en la solicitud de datos de el usuario:', error);
      alert(error);
      return false;
    }
}

// Filtrar usuarios
export const filtrarUsuario = async (
  token: string,
  nombre_usuario: string,
  email: string,
  telefono: string,
  id_rol: string,
  id_tienda: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Usuario/api/filtrar`,
      {
        nombre_usuario: nombre_usuario,
        email: email,
        telefono: telefono,
        id_rol: id_rol,
        id_tienda: id_tienda
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
    console.log("Error al filtrar usuarios: ", error);
    return false;
  }
};

// Ordenar usuarios
export const ordenarUsuarios = async (
  token: string,
  items: UsuarioTabla[],
  criterio: string,
  ascendente: boolean
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Usuario/ordenar/all`,
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
    console.log("Error al ordenar los usuarios: ", error);
    return false;
  }
};

// Cambiar contraseña
export const cambiarContrasennaUsuarios = async (
  token: string,
  contrasenna_vieja: string,
  contrasenna_nueva1: string,
  contrasenna_nueva2: string,
  nombre_usuario: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Usuario/change/pass`,
      {
        contrasenna_vieja: contrasenna_vieja,
        contrasenna_nueva1: contrasenna_nueva1,
        contrasenna_nueva2: contrasenna_nueva2,
        nombre_usuario: nombre_usuario
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
    console.log("Error al cambiar la contraseña del usuario: ", error);
    return false;
  }
};
