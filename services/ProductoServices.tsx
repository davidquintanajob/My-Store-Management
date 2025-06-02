import axios from "axios";
import { cerverHost } from "./cerverHost";
import { Producto } from "../components/MyDateTableProductos";
import { navigate } from "../contexts/navigationRef";
import { getValorMonedaUSD } from "./MonedaService";

export interface ExelProductoAll {
  id_Producto: string;
  nombre: string;
  sku: string;
  cantidadTotal: string;
  precio: number;
  almacen: number;
  taller_cell: number;
  taller_pc: number;
  tienda: number;
  cienfuegos: number;
}

// Obtener todos los productos
export const getAllProductos = async (token: String) => {
  try {
    const response = await axios.get(`${cerverHost}/Producto`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
      console.log("Error al obtener datos de los productos: ", error);
    return false;
  }
};

// Obtener todos los productos con el formato para mostrar
export const getAllProductosFromTable = async (token: String, page: number) => {
  try {
    const response = await axios.get(`${cerverHost}/Producto/getPaginated/${page}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
      console.log("Error al obtener datos de los productos: ", error);
    return false;
  }
};

// Obtener los identificadores de todos los productos que esten en una tienda específica
export const getRelacionProductoByTienda = async (
  token: String,
  id_tienda: string
) => {
  try {
    const response = await axios.get(
      `${cerverHost}/producto_tienda/getProductos/${id_tienda}`,
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
    console.log(
      "Error al obtener datos de los identificadores de  productos con la tienda: ",
      error
    );
    return false;
  }
};

// Obtener la cantidad total de un producto en específico que hay en la empresa
export const getProductoCantidadTotal = async (
  token: string,
  id_Producto: string
) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Producto_tienda/getCantidadTotal/${id_Producto}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data.cantidad_total;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al obtener datos de los productos: ", error);
    return false;
  }
};

// Obtener todos los datos principales de un producto en específico
export const getProductoById = async (
  token: String,
  id_Producto: string
) => {
  try {
    const response = await axios.get(`${cerverHost}/Producto/${id_Producto}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al obtener datos principales de los productos: ", error);
    return false;
  }
};

// Obtener todos las imagenes segun el producto
export const getAllImagenes = async (token: String, id_Producto: string) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Producto/getAllimagenes/${id_Producto}`,
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
    console.log("Error al obtener datos principales de los productos: ", error);
    return false;
  }
};

// Agregar producto
export const addProducto = async (
  token: string,
  nombre: string,
  Sku: string,
  precio: string,
  precio_empresa: string,
  descripcion: string,
  isFecha_Vencimiento: boolean,
  costo_acumulado: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto/createProducto`,
      {
        nombre: nombre,
        Sku: Sku,
        precio: precio,
        precio_empresa: precio_empresa,
        descripcion: descripcion,
        isFecha_Vencimiento: isFecha_Vencimiento,
        costo_acumulado: costo_acumulado
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
    console.log("Error incertar el producto: ", error);
    return false;
  }
};

// Importar Productos del Exel
export const importarDataProductos = async (token: string, path: string) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto/import/excel`,
      {
        path: path
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
    console.log("Error importar productos del exel: ", error);
    return false;
  }
};

// Importar tiendas de productos en exel
export const importarDataProducto_Tiendas = async (token: string, path: string) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto_tienda/import/excel`,
      {
        path: path
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
    console.log("Error importar productos_tiendas del exel: ", error);
    return false;
  }
};

// Obtener producto que coincida con el SKU
export const getProductoBySku = async (token: string, sku: string) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Producto/getSku/${sku}`,
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
    console.log("Error al obtener datos del producto por sku: ", error);
    return false;
  }
};

// Machear datos de un producto en una tienda especifica
export const matchProductoInTienda = async (token: string, id_producto: string, id_tienda: string) => {
  try {
    const response = await axios.get(
      `${cerverHost}/Producto/match/${id_producto}/${id_tienda}`,
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
    console.log("Error al machear el producto: ", error);
    return false;
  }
};

// Agregar entradas a un producto especifico
export const addProductoEntrada = async (
  token: string,
  id_tienda: number,
  id_producto: number,
  cantidad: number
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto_tienda/HacerEntrada`,
      {
        id_producto: id_producto,
        id_tienda: id_tienda,
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
      navigate("Login")
    }
    console.log("Error incertar el la entrada al producto: ", error);
    return false;
  }
};

// Agregar imagenes del producto producto
export const addProductoAndImagenes = async (
  token: string,
  id_producto: string,
  imagenes: any[]
) => {
  console.log(id_producto, imagenes);

  try {
    const response = await axios.post(
      `${cerverHost}/Producto/createProducto`,
      {
        id_producto: id_producto,
        imagenes: imagenes,
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
    console.log("Error incertar el producto: ", error);
    return false;
  }
};

// Modificar Costo acumulado de producto
export const updateProductoCostoAcumulado = async (
  token: string,
  id_producto: string,
  costo_acumulado: string
) => {
  console.log("id_producto: ",id_producto);
  console.log("costo_acumulado: ",costo_acumulado);
  
  try {
    await axios.put(
      `${cerverHost}/Producto/updateProducto/${id_producto}`,
      {
        costo_acumulado: costo_acumulado
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error actualizar el producto: ", error);
    return false;
  }
};

// ModiciarProducto
export const updateProducto = async (
  token: string,
  id_producto: string,
  nombre: string,
  Sku: string,
  precio: string,
  precio_empresa: string,
  descripcion: string,
  isFecha_Vencimiento: boolean,
  costo_acumulado: string
) => {
  try {
    await axios.put(
      `${cerverHost}/Producto/updateProducto/${id_producto}`,
      {
        nombre: nombre,
        Sku: Sku,
        precio: precio,
        precio_empresa: precio_empresa,
        descripcion: descripcion,
        isFecha_Vencimiento: isFecha_Vencimiento,
        costo_acumulado: costo_acumulado
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error actualizar el producto: ", error);
    return false;
  }
};

// Modificar producto tienda
export const updateProductoTienda = async (
  token: string,
  id_producto: string,
  id_tienda: string,
  cantidad: string
) => {
  try {
    await axios.put(
      `${cerverHost}/Producto_tienda/updateProducto_tienda`,
      {
        id_producto: id_producto,
        id_tienda: id_tienda,
        cantidad: cantidad
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error actualizar el producto_tienda: ", error);
    return false;
  }
};

// Agregar relación al producto de la tienda a la hora de hacer la entrada
export const createProductoInTienda = async (
  token: string,
  id_producto: string,
  id_tienda: string
) => {
  try {
    await axios.post(
      `${cerverHost}/Producto/agregar/Tienda`,
      {
        id_tienda: id_tienda,
        id_producto: id_producto,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log(
      "Error crear la relación con la tienda en el producto: ",
      error
    );
    return false;
  }
};

// Eliminar Producto
export const deleteProducto = async (token: string, id_producto: string) => {
  try {
    const response = await axios.delete(
      `${cerverHost}/Producto/deleteProducto/${id_producto}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al obtener datos principales de los productos: ", error);
    return false;
  }
};

// Eliminar Producto
export const deleteFromProductoTiendaIn_0 = async (token: string) => {
  try {
    const response2 = await axios.delete(
      `${cerverHost}/Producto_tienda/DeleteAllTiendas/inProducto`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const response = await axios.delete(
      `${cerverHost}/Producto_tienda/delete/in0`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al eliminar en productos en 0: ", error);
    return false;
  }
};

// Filtrar productos
export const filterProducts = async (
  token: string,
  nombre: string,
  sku: string,
  precio_liminf: string,
  precio_limsup: string,
  cantidad: string,
  id_tienda: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto/api/filtrar`,
      {
        nombre: nombre || "",
        sku: sku || "",
        precio_liminf: precio_liminf || "",
        precio_limsup: precio_limsup || "",
        cantidad: (cantidad === "0")? 0 : parseInt(cantidad),
        id_tienda: id_tienda || null,
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
    console.log("Error al obtener datos principales de los productos: ", error);
    return false;
  }
};

// Filtrar productos_tienda
export const filterProductsEnTienda = async (
  token: string,
  nombre: string,
  sku: string,
  precio_liminf: string,
  precio_limsup: string,
  cantidad: string,
  id_tienda: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto_tienda/api/filtrar`,
      {
        nombre: nombre || "",
        sku: sku || "",
        precio_liminf: precio_liminf || "",
        precio_limsup: precio_limsup || "",
        cantidad: (cantidad === "0")? 0 : parseInt(cantidad),
        id_tienda: parseInt(id_tienda),
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
    console.log("Error al obtener datos principales de los productos: ", error);
    return false;
  }
};

// Ordenar productos
export const ordenarProducts = async (
  token: string,
  items: Producto[],
  criterio: string,
  ascendente: boolean
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto/ordenar/all`,
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
    console.log("Error al ordenar los productos: ", error);
    return false;
  }
};

// Mover producto
export const moverProducto = async (
  token: String,
  id_producto: string,
  id_tienda_origen: string,
  id_tienda_destino: string,
  cantidad: string
) => {
  try {
    const response = await axios.post(
      `${cerverHost}/Producto_tienda/MoverProducto_tienda`,
      {
        id_producto: id_producto,
        id_tienda_origen: id_tienda_origen,
        id_tienda_destino: id_tienda_destino,
        cantidad: cantidad,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al mover el producto: ", error);
    return false;
  }
};

// Expedir docuemnto exel en my tienda
export const expedirExelProductosEnMyTienda = async (token: string, productos: Producto[]) => {
  try {
    // Crear formato para la tabla del exel
    interface ExelTable{
      sku: string;
      nombre: string;
      precioCUP: string;
      precioEmpresaCUP: string;
      cantidad: string;
    }

    const valormoneda = await getValorMonedaUSD(token);
    
    const formatExel: ExelTable[] = productos.map((producto) => ({
      sku: producto.sku,
      nombre: producto.nombre,
      precioCUP: (parseFloat(producto.precioUSD) * valormoneda).toFixed(2), // Convierte a string con dos decimales
      precioEmpresaCUP: producto.precioEmpresaUSD ?? "0",
      cantidad: producto.cantidadTotal ?? "0",
    }));

    const response = await axios.post(
      `${cerverHost}/Producto/to/excel`,
      { productos: formatExel },
      {
        headers: {
          Authorization: `${token}`,
        },
        responseType: 'blob', // Esto asegura que la respuesta sea un Blob
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al crear excel: ", error);
    return false;
  }
};

// Expedir docuemnto exel de todos los productos
// NOTA: Este método solo funciona con las tiendas: (Almacén, Taller Cell, Taller PC, Tienda) ya que son las que se requieren en el model específico
export const expedirExelProductos = async (token: string, productos: ExelProductoAll[]) => {
  try {
    // Crear formato para la tabla del exel
    interface ExelTable{
      Sku: string;
      Nombre: string;
      Existencia: string;
      Precio: number;
      Almacén: number;
      "Taller Cell": number;
      "Taller PC": number;
      Tienda: number;
      Cienfuegos: number;
    }

    const formatExel: ExelTable[] = productos.map((producto) => ({
      Sku: producto.sku,
      Nombre: producto.nombre,
      Existencia: producto.cantidadTotal ?? "0",
      Precio: producto.precio? producto.precio : 0, // Convierte a string con dos decimales
      Almacén: producto.almacen? producto.almacen : 0,
      "Taller Cell":producto.taller_cell? producto.taller_cell : 0,
      "Taller PC": producto.taller_pc? producto.taller_pc : 0,
      Tienda: producto.tienda? producto.tienda : 0,
      Cienfuegos: producto.cienfuegos? producto.cienfuegos : 0
    }));

    const response = await axios.post(
      `${cerverHost}/Producto/to/excel`,
      { productos: formatExel },
      {
        headers: {
          Authorization: `${token}`,
        },
        responseType: 'blob', // Esto asegura que la respuesta sea un Blob
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al crear excel: ", error);
    return false;
  }
};

// Expedir docuemnto exel con columnas especificas
export const expedirExelProductosConColumnas = async (token: string, columnas: string[], productos: any[]) => {
  // productos: any[], columnas: String[]
  try {
    const columnsasxd: any = (["id del producto", "nombre", "precio"]);
    const pepe: any = ([
      { "id del producto": "1", nombre: "Pepe", precio: "12"},
      { "id del producto": "1", nombre: "Pepe", precio: "12"},
      { "id del producto": "1", nombre: "Pepe", precio: "12"},
      { "id del producto": "1", nombre: "Pepe", precio: "12"},
    ]);
    const response = await axios.post(
      `${cerverHost}/Producto/to/excelwithcolumns`,
      { 
        productos: productos,
        columns: columnas
       },
      {
        headers: {
          Authorization: `${token}`,
        },
        responseType: 'blob', // Esto asegura que la respuesta sea un Blob
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate("Login")
    }
    console.log("Error al crear excel: ", error);
    return false;
  }
};
