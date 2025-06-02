import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Aux para agregar imagen
  export const crearimagenUnProducto = async (token: string, selectedImages: any, nameImagen:string) => {
    try {
        const response = await axios.post(
          `${cerverHost}/Imagen/createImagen`,
          {
            url: nameImagen,
            uri: selectedImages,
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
        console.log(`Error al guardar imagenes en los archivos ${error}`)
        return false;
      }
  };

  // Obtener datos de la imagen pro el id
  export const getImagenById = async (token: string, id_imagen: string) => {
    try {
        const response = await axios.get(
          `${cerverHost}/Imagen/${id_imagen}`,
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
        alert(`Error al obtener imagen ${error}`)
        return false;
      }
  };

  // Axu para eliminar imagen
  export const deleteImagenByProducto = async (token: string, id_imagen: string, nameImagen:string) => {
    try {
        const response = await axios.delete(
          `${cerverHost}/Imagen/deleteImagen/${id_imagen}/${nameImagen}`,
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
        alert(`Error al eliminar la imagenes en los archivos ${error}`)
        return false;
      }
  };