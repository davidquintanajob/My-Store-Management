import axios from "axios";
import { cerverHost } from "./cerverHost";
import { navigate } from "../contexts/navigationRef";

// Obtener moneda
export const getValorMonedaUSD = async (token: String) => {
    try {
      const response = await axios.get(
        `${cerverHost}/Moneda/obtener/USD`,
        {
          headers: {
            Authorization: `${token}`
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("Login")
      }
      console.log("Error al obtener valor de la moneda USD: ", error);
      return false;
    }
  };

  // cambiar valor de moneda
export const cambiarValorMonedaUSD = async (token: String, valor: String) => {
    try {
      const response = await axios.put(
        `${cerverHost}/Moneda/cambiar/USD/${valor}`,
        {
          
        },
        {
          headers: {
            Authorization: `${token}`
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("Login")
      }
      console.log("Error al cambiar el valor de la monea USD: ", error);
      return false;
    }
  };