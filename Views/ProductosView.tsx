import Navbar from "../components/Navbar";
import { Colors } from "../styles/Colors";
import { styles } from "../styles/Styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react"; // userState es un hook que permite manejar el estado en componentes
import {
  ActivityIndicator,
  Animated,
  Button,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import compressImage from "react-native-compressor";
import { LinearGradient } from "expo-linear-gradient";
import CustomTextImputSearch from "../components/CustomTextImputSearch";
import CustomDropdown from "../components/CustomDropDownPicker";
import {
  Producto,
  MyDateTableProductos,
} from "../components/MyDateTableProductos";
import {
  addProducto,
  addProductoAndImagenes,
  addProductoEntrada,
  createProductoInTienda,
  ExelProductoAll,
  expedirExelProductos,
  filterProducts,
  getProductoBySku,
  getProductoCantidadTotal,
  getProductoById,
  getAllProductos,
  importarDataProducto_Tiendas,
  importarDataProductos,
  ordenarProducts,
  updateProducto,
  getAllProductosFromTable,
  expedirExelProductosConColumnas,
} from "../services/ProductoServices";
import { useUsuario } from "../contexts/UsuarioContext";
import {
  getAllTiendas,
  getAllTiendasByProduct,
  getTiendaById,
  isProductoInTienda,
} from "../services/TiendaServices";
import { TiendaPiker } from "../components/MyDateTableTiendas";
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from "react-native-image-picker";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import {
  MyDateTableModalShowDatesTienda,
  TiendaShowModal,
} from "../components/MyDateTableModalShowDatesTienda";
import {
  MyDateTableModalShowDateProveedores,
  ProveedoresShowModal,
} from "../components/MyDateTableModalShowDateProveedores";
import { useModalProductsDates } from "../contexts/AuxiliarContextFromModalProductsDates";
import { useSortProductos } from "../contexts/AuxiliarSortProductos";
import { SortProductos } from "../functions/SortFromPacientesView";
import { isPermiso } from "../services/RolPermisosAndRol";
import axios from "axios";
import { cerverHost, cerverHostImages } from "../services/cerverHost";
import {
  crearimagenUnProducto,
  deleteImagenByProducto,
  getImagenById,
} from "../services/ImageServices";
import {
  addEntrada,
  getAllEntradasByProductoId,
  getEntradaByID,
} from "../services/EntradaServices";
import imageCompression from "browser-image-compression";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import { useNavigationLostDates } from "../contexts/NavigationLostContext";
import { usePaginadoProductos } from "../contexts/AuxiliarContextPaginadoproductos";
import { getValorMonedaUSD } from "../services/MonedaService";
import CustomRadioButton from "../components/CustomRadioButtonsSearch";

export default function ProductosViwe() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  // Datos del usuario que está logueado
  const { usuario } = useUsuario();
  const { sortProductos } = useSortProductos();
  const { modalProductsDates, setModalProductsDates } = useModalProductsDates();
  const { navigationLostDates, setNavigationLostDates } =
    useNavigationLostDates();
  const { paginadoProductos, setPaginadoProductos } = usePaginadoProductos();
  const [cambioMoneda, setCambioMoneda] = useState(0);

  // Constantes para controlar la animación del boton desplegable
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado
  const animationValueOptions = useRef(new Animated.Value(0)).current; // Valor animado

  // Opciones para saber si el producto tiene fecha de vencimiento o o
  const optionsIsFechaVencimiento = [
    { label: "Si", value: "si" },
    { label: "No", value: "no" },
  ];

  // Variables para controlar los campos de los formularios de agregar producto y ver datos
  const [selecterActivoDetails, setSelecterActivoDetails] = useState("no");
  const [idProductoDetails, setIdProductoDetails] = useState("");
  const [nombreProductoDetails, setNombreProductoDetails] = useState("");
  const [precioProductoUSDDetails, setPrecioProductoUSDDetails] = useState("0");
  const [precioProductoCUPDetails, setPrecioProductoCUPDetails] = useState("0");
  const [costoPromedio, setCostopromedio] = useState("");
  const [precioEmpresaProductoDetails, setPrecioEmpresaProductoDetails] =
    useState("");
  const [skuDetails, setSkuDetails] = useState("");
  const [descripcionProductoDetails, setDescripcionProductoDetails] =
    useState("");
  // Estado para almacenar las imágenes seleccionadas
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);
  const [deleteImages, setDeleteImages] = useState<Asset[]>([]);
  const [modificarAddImages, setModificarAddImages] = useState<Asset[]>([]);

  const [isModalMensajeViewExel, setModalMensajeViewExel] =
    React.useState(false);
  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);
  const [isBotonModalMesajeVisible, setIsBotonModalMesajeVisible] =
    useState(false);

  const [
    optimizacionAbrirPorPrimeraVesProductosView,
    setOptimizacionAbrirPorPrimeraVesProductosView,
  ] = useState(false);
  const [controlFiltrarOPaginar, setControlFiltrarOPaginar] = useState(false);

  const [modalMensaje, setModalMensaje] = React.useState("");

  // Controlar el doble clic del boton
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  // Condicionales para mostrar según los permisos
  const [isPermisoButtonAddProducto, setIsPermisoButtonAddProducto] =
    useState(false);
  const [isPermisoHistorialDeProveedores, setIsPermisoHistorialDeProveedores] =
    useState(false);
  let opcionesDeCelda: boolean = false;
  const checkPermiso = async () => {
    if (usuario?.token) {
      const resultPermisoButonAddProducto = await isPermiso(
        usuario.token,
        "6",
        usuario.id_usuario
      );
      const resultPermisoHistorialDeProveedores = await isPermiso(
        usuario.token,
        "38",
        usuario.id_usuario
      );
      const resultPermisoButonOptionModificar = await isPermiso(
        usuario.token,
        "7",
        usuario.id_usuario
      );
      const resultPermisoButonOptionEliminar = await isPermiso(
        usuario.token,
        "8",
        usuario.id_usuario
      );
      const resultPermisoButonOptionMoverLocal = await isPermiso(
        usuario.token,
        "30",
        usuario.id_usuario
      );
      const resultPermisoButonOptionMoverGeneral = await isPermiso(
        usuario.token,
        "31",
        usuario.id_usuario
      );

      // Actualizar cambio de moneda
      setCambioMoneda(await getValorMonedaUSD(usuario.token));

      // Actualiza el estado con los resultado
      opcionesDeCelda =
        resultPermisoButonOptionEliminar ||
        resultPermisoButonOptionModificar ||
        resultPermisoButonOptionMoverLocal ||
        resultPermisoButonOptionMoverGeneral;

      setIsPermisoButtonAddProducto(resultPermisoButonAddProducto);
      setIsPermisoHistorialDeProveedores(resultPermisoHistorialDeProveedores);
    }
  };

  const onDrop = () => {
    // Aquí puedes agregar la lógica para procesar los archivos
  };

  // Función para manejar la expansión/contracción con animación
  const toggleExpansion = () => {
    if (isExpanded) {
      // Si está expandido, animamos para contraer
      Animated.timing(animationValue, {
        toValue: 0, // Altura 0 (cerrado)
        duration: 300, // Duración de la animación en milisegundos
        useNativeDriver: false, // No usar driver nativo porque vamos a animar el tamaño
      }).start(() => setIsExpanded(false)); // Cambia el estado después de la animación
    } else {
      setIsExpanded(true); // Cambia el estado primero para renderizar el contenido
      Animated.timing(animationValue, {
        toValue: 400, // Altura máxima cuando esté expandido
        duration: 300, // Duración de la animación en milisegundos
        useNativeDriver: false, // No usar driver nativo
      }).start();
    }
  };

  // Definir el estilo animado para la altura del componente
  const animatedStyle = {
    height: animationValue,
  };

  // Variable para filtrar items
  const [filterItems, setFilterItems] = useState<Producto[]>([]);
  const [filterItemsLength, setFilterItemsLength] = useState(0);

  const [tiendasByProducto, setTiendasByProducto] = useState<TiendaShowModal[]>(
    []
  );
  const [proveedorByProducto, setProveedorByProducto] = useState<
    ProveedoresShowModal[]
  >([]);

  // Función para cuando precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      // Aquí ejecutas la función que deseas
      filtrarYOrdenarProductos();
    }
  };

  const cargarProveedoresPorProducto = async (id_producto: string) => {
    try {
      if (usuario?.token) {
        // Llamamos a la API para obtener todas las entradas según el producto
        const entradas = await getAllEntradasByProductoId(
          usuario?.token,
          id_producto
        );
        const cantidadTotalProducto = await getProductoCantidadTotal(
          usuario.token,
          id_producto
        );

        if (entradas) {
          // Mapeamos los datos de las entradas para obtener solo la información que necesitamos
          const proveedores = entradas.map((entrada: any) => ({
            id_proveedor: entrada.proveedor.id_proveedor,
            nombre: entrada.proveedor.nombre,
            cantidad: entrada.cantidad,
            costoPorUnidad: entrada.costo,
          }));

          // Actualizamos el estado con los datos obtenidos
          setProveedorByProducto(proveedores);
        }
      }
    } catch (error) {
      console.log("Error al cargar los proveedores por producto:", error);
    }
  };

  const getTiendasByProducto = async (id_producto: string) => {
    if (usuario?.token) {
      const result = await getAllTiendasByProduct(usuario.token, id_producto);

      // Asegurándonos de que `result` es un array y contiene los datos esperados.
      if (Array.isArray(result)) {
        // Mapeamos los datos de tiendas al formato de TiendaShowModal.
        const tiendas: TiendaShowModal[] = result.map((item) => ({
          id_tienda: item.tienda.id_tienda.toString(),
          nombre: item.tienda.nombre,
          cantidad: item.cantidad.toString(), // Aquí usamos `item.cantidad` directamente.
        }));

        // Actualizamos el estado con las tiendas formateadas.
        setTiendasByProducto(tiendas);
      }
    }
  };

  // Método para exportar a exel
  const exportarExel = async () => {
    interface Item {
      sku: string;
      Nombre: string;
      Existencia: string;
      Precio_USD: string;
      Precio_CUP: string;
      Precio_Mayorista: string;
      [key: string]: any; // Permite propiedades adicionales con claves de tipo string
    }

    setModalMensaje(
      "Recopilando datos de todos los productos filtrados para el Exel. Espere un momento por favor."
    );
    setLoadingOfExel(true);
    setModalMensajeViewExel(true);
    if (usuario?.token) {
      if (filterItems.length < filterItemsLength) {
        const resultAllTiendas = await getAllTiendas(usuario.token);
        const resultAllProductos = await filterProducts(
          usuario.token,
          "",
          "",
          "",
          "",
          "",
          ""
        );

        if (
          resultAllTiendas &&
          Array.isArray(resultAllTiendas.data) &&
          resultAllProductos &&
          Array.isArray(resultAllProductos)
        ) {
          let itemsFromExel: Item[] = []; // Cambia el tipo a Item[]
          for (let index of resultAllProductos) {
            const item: Item = {
              sku: index.Sku,
              Nombre: index.nombre,
              Existencia: index.cantidad_total,
              Precio_USD: parseFloat(index.precio).toFixed(5),
              Precio_CUP: (parseFloat(index.precio) * cambioMoneda).toFixed(0),
              Precio_Mayorista: index.precio_empresa,
            };

            const resultProductoTienda = await getAllTiendasByProduct(
              usuario.token,
              index.id_producto
            );
            if (resultProductoTienda && Array.isArray(resultProductoTienda)) {
              for (let elemen of resultProductoTienda) {
                item[elemen.tienda.nombre] = elemen.cantidad ?? 0; // Ahora esto no dará error
              }
              for (let element of resultAllTiendas.data) {
                if (!item[element.nombre]) {
                  item[element.nombre] = 0;
                }
              }
            }

            itemsFromExel.push(item);
          }

          const result = await expedirExelProductosConColumnas(
            usuario.token,
            [],
            itemsFromExel
          );
          if (result) {
            const currentDate = new Date();
            const year = String(currentDate.getFullYear());
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
            const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

            const url = window.URL.createObjectURL(result);

            // Crea un enlace de descarga
            const a = document.createElement("a");
            a.href = url;
            a.download = `Productos_${year}-${month}-${day}.xlsx`; // Nombre del archivo descargado
            document.body.appendChild(a);

            // Haz clic en el enlace para iniciar la descarga
            a.click();

            // Limpia el enlace creado y la URL Blob
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          } else {
            console.error("No se pudo descargar el archivo.");
          }
        }
      } else {
        const resultAllTiendas = await getAllTiendas(usuario.token);

        if (resultAllTiendas && Array.isArray(resultAllTiendas.data)) {
          let itemsFromExel: Item[] = []; // Cambia el tipo a Item[]
          for (let index of filterItems) {
            const item: Item = {
              sku: index.sku,
              Nombre: index.nombre,
              Existencia: index.cantidadTotal,
              Precio_USD: parseFloat(index.precioUSD).toFixed(5),
              Precio_CUP: (parseFloat(index.precioUSD) * cambioMoneda).toFixed(
                0
              ),
              Precio_Mayorista: index.precioEmpresaUSD ?? "0",
            };

            const resultProductoTienda = await getAllTiendasByProduct(
              usuario.token,
              index.id_Producto
            );
            if (resultProductoTienda && Array.isArray(resultProductoTienda)) {
              for (let elemen of resultProductoTienda) {
                item[elemen.tienda.nombre] = elemen.cantidad ?? 0; // Ahora esto no dará error
              }
              for (let element of resultAllTiendas.data) {
                if (!item[element.nombre]) {
                  item[element.nombre] = 0;
                }
              }
            }

            itemsFromExel.push(item);
          }

          const result = await expedirExelProductosConColumnas(
            usuario.token,
            [],
            itemsFromExel
          );
          if (result) {
            const currentDate = new Date();
            const year = String(currentDate.getFullYear());
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
            const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

            const url = window.URL.createObjectURL(result);

            // Crea un enlace de descarga
            const a = document.createElement("a");
            a.href = url;
            a.download = `Productos_${year}-${month}-${day}.xlsx`; // Nombre del archivo descargado
            document.body.appendChild(a);

            // Haz clic en el enlace para iniciar la descarga
            a.click();

            // Limpia el enlace creado y la URL Blob
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          } else {
            console.error("No se pudo descargar el archivo.");
          }
        }
      }
    }

    setLoadingOfExel(false);
  };

  const nombreProductoRef = useRef(null);

  useEffect(() => {
    // Cuando el modal esté visible, enfocar el campo del nombre del producto
    if (modalProductsDates?.isAddProducto) {
      nombreProductoRef.current?.focus();
    }
  }, [modalProductsDates?.isAddProducto]);

  useEffect(() => {
    if (navigationLostDates?.isOnToken) {
      alert(navigationLostDates.isOnToken);
    }
  }, [navigationLostDates?.isOnToken]);

  useEffect(() => {
    if (
      optimizacionAbrirPorPrimeraVesProductosView &&
      paginadoProductos?.page !== undefined &&
      usuario?.token &&
      controlFiltrarOPaginar
    ) {
      const auxiliarPagination = async () => {
        if (usuario?.token != undefined) {
          try {
            // Obtener productos desde la tabla
            const result = await getAllProductosFromTable(
              usuario.token,
              paginadoProductos.page + 1
            );

            setFilterItemsLength(result.cantidad_total_productos);
            if (result && Array.isArray(result.productos)) {
              // Mapeamos los productos y obtenemos tanto la cantidadTotal como si tienen opciones
              const productosMapeados: Producto[] = await Promise.all(
                result.productos.map(async (element: any) => {
                  // Verificar si el producto tiene opciones (en la tienda)
                  let tieneOpciones: boolean = false;

                  for (let index of element.tiendas) {
                    if (usuario.id_tienda === index.id_tienda) {
                      tieneOpciones = true;
                      break;
                    }
                  }

                  // Devolvemos el producto con todas las propiedades mapeadas
                  return {
                    id_Producto: element.id_producto, // Mapea 'id_producto' a 'id_Producto'
                    nombre: element.nombre, // Mapea 'nombre' directamente
                    sku: element.Sku, // Mapea 'Sku' a 'sku'
                    cantidadTotal: element.cantidad_total, // Asigna el valor obtenido para cantidadTotal
                    precioUSD: element.precio.toString(), // Mapea 'precio' a 'precioUSD' y lo convierte a string
                    tieneOpciones: tieneOpciones, // Añade el valor de tieneOpciones
                  };
                })
              );
              // Actualizamos el estado de filterItems con los productos mapeados
              setFilterItems((prevFilterItems) => [
                ...prevFilterItems,
                ...productosMapeados,
              ]);
            } else {
              console.log("No se encontraron productos.");
            }
          } catch (error) {
            console.log(
              "Error al obtener los productos o verificar permisos:",
              error
            );
            alert("Ocurrió un problema al cargar los datos de los productos");
          }
        } else {
          alert(
            "Ocurrió un problema al obtener el token de identificación del usuario para cargar los datos de los productos"
          );
        }
      };

      auxiliarPagination();
    }
  }, [paginadoProductos]);

  const [dropdownItems, setDropDownItems] = useState<TiendaPiker[]>([]);

  //Variables Para los datos de busqueda
  const [nombreProductoSearch, setNombreProductoSearch] = useState("");
  const [sKUSearch, setSKUSearch] = useState("");
  const [cantidadSearch, setCantidadSearch] = useState("");
  const [rangoPrecioDesdeSearch, setRangoPrecioDesdeSearch] = useState("");
  const [rangoPrecioHastaSearch, setRangoPrecioHastaSearch] = useState("");
  const [selectedValueNombreTienda, setSelectedValueNombreTienda] = useState<
    string | null
  >(null);

  const [selectedOptionTipoOrden, setSelectedOptionTipoOrden] = useState<
    string | null
  >(null);

  // Variable visual para la carga de datos en la tabla
  const [loading, setLoading] = useState(false);
  const [loadingOfExel, setLoadingOfExel] = useState(false);

  const getDatesTiendaPiker = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllTiendas(usuario.token);

      if (result && Array.isArray(result.data)) {
        const tiendasMapeados: TiendaPiker[] = await Promise.all(
          result.data.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_tienda,
          }))
        );

        // Agregar un valor adicional para el valor inicial
        setDropDownItems([
          { label: "Seleccione una tienda", value: "" },
          ...tiendasMapeados,
        ]);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar producto
  const callModalAddProducto = () => {
    setModalProductsDates({
      id_producto: "",
      isAddProducto: false,
      isModificarProducto: false,
      fileEditable: true,
      isAddProductoShowProveedoresTiendas: false,
      isAddProductoShowProveedores: false,
    });
  };
  const cargarDetailsOfProducto = async () => {
    if (usuario?.token && modalProductsDates?.id_producto) {
      const result = await getProductoById(
        usuario.token,
        modalProductsDates.id_producto
      );

      if (result) {
        // Establecer los detalles del producto
        setIdProductoDetails(result.id_producto);
        setNombreProductoDetails(result.nombre);
        setPrecioProductoUSDDetails(result.precio);
        setPrecioProductoCUPDetails((result.precio * cambioMoneda).toFixed(0))
        setPrecioEmpresaProductoDetails(result.precio_empresa);
        setSkuDetails(result.Sku);
        setCostopromedio((result.costo_acumulado).toFixed(2));
        setSelecterActivoDetails(result.isFecha_Vencimiento ? "si" : "no");
        setDescripcionProductoDetails(result.descripcion || ""); // Maneja el caso de descripción nula

        // Cargar historial de proveedores y tiendas en el que existe el producto
        getTiendasByProducto(result.id_producto);
        cargarProveedoresPorProducto(result.id_producto);

        // Convertir las imágenes de URL a base64
        const imagesPromises = result.imagenes.map(async (img: any) => {
          let httpImage: string = await img.url;
          let id_image: string = await img.id_imagen;
          let parseHttp = httpImage.substring(1, httpImage.length);
          httpImage = cerverHostImages + parseHttp;
          return { uri: httpImage, id: id_image }; // Almacenar en el formato adecuado
        });

        // Esperar a que todas las promesas se resuelvan
        const images = await Promise.all(imagesPromises);
        setSelectedImages(images);
      }
    }
  };
  const auxiliarFunctionFilter = async (): Promise<Producto[] | null> => {
    if (usuario?.token) {
      try {
        const result = await filterProducts(
          usuario.token,
          nombreProductoSearch,
          sKUSearch,
          rangoPrecioDesdeSearch,
          rangoPrecioHastaSearch,
          cantidadSearch,
          selectedValueNombreTienda ?? ""
        );

        if (result) {
          const productosMapeados: Producto[] = await Promise.all(
            result.map(async (element: any) => ({
              id_Producto: element.id_producto, // Mapea 'id_producto' a 'id_Producto'
              nombre: element.nombre, // Mapea 'nombre' directamente
              sku: element.Sku, // Mapea 'Sku' a 'sku'
              cantidadTotal: element.cantidad_total,
              precioUSD: element.precio.toString(), // Mapea 'precio' a 'precioUSD' y lo convierte a string
              precioEmpresaUSD: element.precio_empresa,
            }))
          );
          return productosMapeados; // Devuelve los productos mapeados
        }
      } catch (error) {
        console.error("Error al filtrar los productos:", error);
        return null;
      }
    }
    return null; // Devuelve null si no hay token o no se pudieron filtrar productos
  };

  useEffect(() => {
    if (optimizacionAbrirPorPrimeraVesProductosView) {
      cargarDetailsOfProducto();
    }
  }, [modalProductsDates]);
  // Para filtrar y/o ordenar los datos según se halla digitado o seleccionado
  const obtenerProductosConPermisosYDatos = async (page: number) => {
    setModalMensajeView(false);
    setLoading(true);
    if (usuario?.token != undefined) {
      try {
        // Obtener productos desde la tabla
        const result = await getAllProductosFromTable(usuario.token, page);

        setFilterItemsLength(result.cantidad_total_productos);
        if (result && Array.isArray(result.productos)) {
          // Mapeamos los productos y obtenemos tanto la cantidadTotal como si tienen opciones
          const productosMapeados: Producto[] = await Promise.all(
            result.productos.map(async (element: any) => {
              // Verificar si el producto tiene opciones (en la tienda)
              let tieneOpciones: boolean = false;

              if (opcionesDeCelda) {
                for (let index of element.tiendas) {
                  if (usuario.id_tienda === index.id_tienda) {
                    tieneOpciones = true;
                    break;
                  }
                }
              }

              // Devolvemos el producto con todas las propiedades mapeadas
              return {
                id_Producto: element.id_producto, // Mapea 'id_producto' a 'id_Producto'
                nombre: element.nombre, // Mapea 'nombre' directamente
                sku: element.Sku, // Mapea 'Sku' a 'sku'
                cantidadTotal: element.cantidad_total, // Asigna el valor obtenido para cantidadTotal
                precioUSD: element.precio.toString(), // Mapea 'precio' a 'precioUSD' y lo convierte a string
                tieneOpciones: tieneOpciones, // Añade el valor de tieneOpciones
              };
            })
          );
          // Actualizamos el estado de filterItems con los productos mapeados
          setFilterItems(productosMapeados);
        } else {
          console.log("No se encontraron productos.");
        }
      } catch (error) {
        console.log(
          "Error al obtener los productos o verificar permisos:",
          error
        );
        alert("Ocurrió un problema al cargar los datos de los productos");
      }
    } else {
      alert(
        "Ocurrió un problema al obtener el token de identificación del usuario para cargar los datos de los productos"
      );
    }
    setLoading(false);
  };

  const consumerKey = "ck_aaae303d49b4ac57c713472aca2f610d4c99e195";
  const consumerSecret = "cs_646f2fd371adc5d405a5a7bb9a464909e94a0c75";

  async function convertImageUrlToBase64(imageUrl: string): Promise<string> {
    try {
      // Codifica las credenciales en base64 para la autenticación básica
      const credentials = btoa(`${consumerKey}:${consumerSecret}`);

      const response = await fetch(imageUrl, {
        method: "GET",
        headers: {
          Authorization: `Basic ${credentials}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener la imagen: ${response.statusText}`);
      }

      const blob = await response.blob();

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = (error) =>
          reject(`Error al convertir la imagen a Base64: ${error}`);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error al descargar y convertir la imagen:", error);
      throw error;
    }
  }

  const runEffects = async () => {
    setOptimizacionAbrirPorPrimeraVesProductosView(false);
    /*
    if (usuario?.token) {
      const resultProducto = await importarDataProductos(
        usuario.token,
        "E:\\Solutel\\Sitio Web De gestión\\Libro1.xlsx"
      );
      if (resultProducto && Array.isArray(resultProducto)) {
        for(let element of resultProducto){
          if (element.nombre) {
            const result = await addProducto(
              usuario.token,
              element.nombre,
              element.Sku,
              element.precio ?? "0",
              element.precio_empresa ?? "0",
              ""
            );
            if (result) {
              console.log("Producto Agregado");
            }else{
              console.log("Error")
            }
          }
        }
      }
    }
    /*
    /*
    (async () => {
      const imageUrl =
        "https://solutelcuba.com/wp-content/uploads/2024/09/ZOSI-C303-Sistema-de-Seguridad-CCTV-8-Camaras-con-Audio-y-DVR-de-1-TB1.jpg";
      try {
        const base64Image = await convertImageUrlToBase64(imageUrl);
        console.log(`Imagen en Base64: ${base64Image}`);
      } catch (error) {
        console.error(error);
      }
    })();
    */
    /*
    if (usuario?.token) {
      const resultProducto = await importarDataProducto_Tiendas(
        usuario.token,
        "E:\\Solutel\\Sitio Web De gestión\\Libro1.xlsx"
      );
      if (resultProducto && Array.isArray(resultProducto)) {
        for (let element of resultProducto) {
          // Condición para producto tienda "element && Object.keys(element).length > 0"
          if (element && Object.keys(element).length > 0) {
            const resultProducto = await getProductoBySku(
              usuario.token,
              element.Sku
            );
            
            if (resultProducto) {
              const currentDate = new Date();
              const year = String(currentDate.getFullYear());
              const month = String(currentDate.getMonth() + 1).padStart(
                2,
                "0"
              ); // Los meses comienzan desde 0, por lo que sumamos 1
              const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

              // Almacen
              if (parseInt(element.Almacen) > 0) {
                await addProductoEntrada(usuario.token, 1, resultProducto.id_producto,element.Almacen);
                await addEntrada(usuario.token, "0", element.Almacen,`${year}-${month}-${day}`,15, resultProducto.id_producto,1);
                await createProductoInTienda(usuario.token, String(resultProducto.id_producto), "1")  
              }
              // Taller_Cell
              if (parseInt(element.Taller_Cell) > 0) {
                await addProductoEntrada(usuario.token, 2, resultProducto.id_producto,element.Taller_Cell);
                await addEntrada(usuario.token, "0", element.Taller_Cell,`${year}-${month}-${day}`,15, resultProducto.id_producto,2);
                await createProductoInTienda(usuario.token, String(resultProducto.id_producto), "2") 
              }
              // Taller_PC
              if (parseInt(element.Taller_PC) > 0) {
                await addProductoEntrada(usuario.token, 3, resultProducto.id_producto,element.Taller_PC);
                await addEntrada(usuario.token, "0", element.Taller_PC,`${year}-${month}-${day}`,15, resultProducto.id_producto,3);
                await createProductoInTienda(usuario.token, String(resultProducto.id_producto), "3")
              }
              // Tienda
              if (parseInt(element.Tienda) > 0) {
                await addProductoEntrada(usuario.token, 4, resultProducto.id_producto,element.Tienda);
                await addEntrada(usuario.token, "0", element.Tienda,`${year}-${month}-${day}`,15, resultProducto.id_producto,4);
                await createProductoInTienda(usuario.token, String(resultProducto.id_producto), "4")  
              }
              console.log(true);
            }
              
          }
        }
      }
    }
    */
    setPaginadoProductos({ page: 1 });
    await checkPermiso();
    await obtenerProductosConPermisosYDatos(paginadoProductos.page);
    await getDatesTiendaPiker();
    setOptimizacionAbrirPorPrimeraVesProductosView(true);
  };

  useFocusEffect(
    useCallback(() => {
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  // Filtrar productos simepre que el usuario seleccione una tienda
  useEffect(() => {
    // Evitar que se ejecute apenas se abre la vista que e filtren los productos solo por primera vez
    if (optimizacionAbrirPorPrimeraVesProductosView) {
      filtrarYOrdenarProductos();
    }
  }, [sortProductos, selectedOptionTipoOrden]);

  useEffect(() => {
    if (
      nombreProductoSearch === "" &&
      sKUSearch === "" &&
      cantidadSearch === "" &&
      rangoPrecioDesdeSearch === "" &&
      rangoPrecioHastaSearch === "" &&
      selectedValueNombreTienda === null
    ) {
      setControlFiltrarOPaginar(true); // No se está filtrando
    } else {
      setControlFiltrarOPaginar(false); //Se está filtrando
    }
  }, [
    nombreProductoSearch,
    sKUSearch,
    cantidadSearch,
    rangoPrecioDesdeSearch,
    rangoPrecioHastaSearch,
    selectedValueNombreTienda,
  ]);

  const [auxOrdenar, setAxuOrdenar] = useState(false);

  // Filtrar y ordenar productos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarProductos = async () => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let productosFiltrados: Producto[] = await auxiliarFunctionFilter();

        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortProductos?.criterioOrden && sortProductos.tipoOrden) {
          productosFiltrados = await ordenarProducts(
            usuario.token,
            productosFiltrados,
            sortProductos.criterioOrden,
            auxOrdenar
          );
        }

        // Actualizar el estado con los productos filtrados (y ordenados si corresponde)
        setFilterItemsLength(productosFiltrados.length);
        setFilterItems(productosFiltrados);
      }
    } catch (error) {
      console.error("Error al filtrar y ordenar los productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const auxSetModalProductsDates = () => {
    setNombreProductoDetails("");
    setPrecioProductoUSDDetails("");
    setPrecioEmpresaProductoDetails("");
    setSkuDetails("");
    setDescripcionProductoDetails("");
    setSelectedImages([]);

    setModalProductsDates({
      id_producto: "",
      isAddProducto: true,
      fileEditable: true,
      isModificarProducto: false,
      isAddProductoShowProveedoresTiendas: false,
      isAddProductoShowProveedores: false,
    });
  };

  // Método para cargar las imágenes
  /*
  const handleImageUpload = () => {
    const options = {
      mediaType: "photo" as const, // Solo fotos
      quality: 1, // Calidad máxima de la imagen
      includeBase64: false, // No incluir en base64
      selectionLimit: 100,
      includeExtra: true,
    };

    // Abre la galería de imágenes
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log("El usuario canceló la selección de la imagen.");
      } else if (response.errorMessage) {
        console.error(
          "Error al seleccionar la imagen: ",
          response.errorMessage
        );
      } else if (response.assets && response.assets.length > 0) {
        // Agregar la nueva imagen al estado
        setSelectedImages((prevImages) => {
          // Calcula cuántas imágenes se pueden agregar sin exceder el límite de 100
          const availableSpace = 100 - prevImages.length; // Espacio disponible en el estado
          const newImages = response.assets.slice(0, availableSpace); // Selecciona solo las imágenes necesarias para no exceder el límite
          return [...prevImages, ...newImages]; // Agrega las nuevas imágenes al estado
        });
      } else {
        console.log("No se seleccionó ninguna imagen.");
      }
    });
  };
  */

  const handleImageUpload = async () => {
    const options = {
      mediaType: "photo" as const,
      quality: 0.8,
      includeBase64: false,
      selectionLimit: 100,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log("El usuario canceló la selección de la imagen.");
        return;
      }

      if (response.errorMessage) {
        console.error(
          "Error al seleccionar la imagen: ",
          response.errorMessage
        );
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const processedImages = await Promise.all(
          response.assets.map(async (asset) => {
            if (asset.uri) {
              const size = await getImageFileSize(asset.uri);

              try {
                if (size > 300 * 1024) {
                  // Compresión de la imagen
                  const fileResponse = await fetch(asset.uri);
                  const blob = await fileResponse.blob();
                  const file = new File([blob], asset.fileName || "image.jpg", {
                    type: blob.type,
                  });

                  const compressedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                  });

                  // Convertir el archivo comprimido en base64
                  const base64 = await convertFileToBase64(compressedFile);

                  return {
                    ...asset,
                    uri: base64, // Guardar como base64
                    isCompressed: true,
                  };
                } else {
                  // Convertir imágenes no comprimidas a base64 desde la URI
                  const base64 = await convertUriToBase64(asset.uri);

                  // Validar que la conversión a base64 fue exitosa
                  if (!base64.startsWith("data:image")) {
                    throw new Error("Conversión incorrecta de la URI a base64");
                  }

                  return { ...asset, uri: base64, isCompressed: false };
                }
              } catch (error) {
                console.error(
                  `Error al procesar la imagen (${
                    asset.fileName || "sin nombre"
                  }):`,
                  error
                );
              }
            }

            return asset; // Si no tiene URI, devolver el asset original
          })
        );

        setSelectedImages(processedImages);
      } else {
        console.log("No se seleccionó ninguna imagen.");
      }
    });
  };

  // Función para convertir un archivo en base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Función para convertir URI en base64
  const convertUriToBase64 = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return convertFileToBase64(
        new File([blob], "image.jpg", { type: blob.type })
      );
    } catch (error) {
      console.error("Error al convertir URI a base64:", error);
      throw error;
    }
  };

  // Función auxiliar para obtener el tamaño de un archivo de imagen desde su URI
  const getImageFileSize = async (uri: string): Promise<number> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob.size;
    } catch (error) {
      console.error("Error al obtener el tamaño del archivo:", error);
      return 0;
    }
  };

  // Función auxiliar para obtener el tamaño de un archivo de imagen desde su URI

  // Función para eliminar una imagen por su índice
  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const deleteImage = selectedImages.filter((_, i) => i === index)[0]; // Obtener el primer elemento del resultado
    setDeleteImages((prevImages) => [...prevImages, deleteImage]);
    //const aux:ImagenesDelete = ImagenesDelete(deleteImages);
    //setImagenesDelete(deleteImages);
    setSelectedImages(updatedImages);
  };

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreProductoSearch("");
    setSKUSearch("");
    setCantidadSearch("");
    setRangoPrecioDesdeSearch("");
    setRangoPrecioHastaSearch("");
    setSelectedOptionTipoOrden("");
    setSelectedValueNombreTienda(null);
  };

  // Método para agregar un nuevo producto al sistema
  const addNewProducto = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Agregando producto. Espere por favor");
    setModalMensajeView(true);
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarMesaje: string =
        "ERROR AL INSERTAR PRODUCTO. Por favor compruebe los siguientes campos:\n";
      const resultAllProductos = await getAllProductos(usuario.token);
      if (resultAllProductos && Array.isArray(resultAllProductos.data)) {
        resultAllProductos.data.forEach((element) => {
          if (element.Sku === skuDetails) {
            (flag = false),
              (validarMesaje += `-El SKU debe ser único. Coincide con el SKU de  ${element.nombre}`);
          }
        });
      }

      // Condiciones para validar campos
      if (nombreProductoDetails.trim() === "") {
        validarMesaje += "-El nombre no puede ser vacío.\n";
        flag = false;
      }
      if (skuDetails.trim() == "") {
        validarMesaje += "-El SKU no puede ser vacío.\n";
        flag = false;
      }
      if (String(precioProductoUSDDetails).trim() === "") {
        validarMesaje += "-El precio en USD del producto no puede ser vacío.\n";
        flag = false;
      }
      if (String(costoPromedio).trim() === "") {
        validarMesaje += "-El costo del producto no puede ser vacío.\n";
        flag = false;
      }
      if (String(precioEmpresaProductoDetails).trim() === "") {
        validarMesaje +=
          "-El precio de la empresa en USD no puede ser vacío.\n";
        flag = false;
      }

      if (flag) {
        const result = await addProducto(
          usuario.token,
          nombreProductoDetails,
          skuDetails,
          precioProductoUSDDetails,
          precioEmpresaProductoDetails,
          descripcionProductoDetails,
          selecterActivoDetails === "si",
          costoPromedio
        );
        if (result) {
          // agregar el nuevo producto a la tabla
          const nuevoProducto: Producto = {
            id_Producto: result.id_producto,
            nombre: nombreProductoDetails,
            sku: skuDetails,
            cantidadTotal: await getProductoCantidadTotal(
              usuario.token,
              result.id_producto
            ),
            precioUSD: precioProductoUSDDetails,
            tieneOpciones: true,
          };
          setFilterItems((prevItems) => [...prevItems, nuevoProducto]);

          let auxDataImagesResponses: any[] = [];
          let imagenes: any[] = [];

          // Cambia forEach por un for...of
          for (const [cont, element] of selectedImages.entries()) {
            const resul = await crearimagenUnProducto(
              usuario.token,
              element,
              `\\${result.id_producto}_${cont}.jpg`
            );
            if (resul) {
              auxDataImagesResponses.push(resul);
            } else {
              alert("Error en algo de las imagenes");
            }
          }

          let i = 0;

          while (i < auxDataImagesResponses.length) {
            imagenes.push({
              id_imagen: auxDataImagesResponses[i].id_imagen,
            });
            i++;
          }

          await addProductoAndImagenes(
            usuario.token,
            result.id_producto,
            imagenes
          );

          // Agregar Acción de usuario mover producto

          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó al sistema el producto ${nombreProductoDetails} a un precio en cup de ${precioProductoUSDDetails} y con un precio de empresa en cup de ${precioEmpresaProductoDetails}`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            1
          );

          setModalMensaje(
            `El Producto ${nombreProductoDetails} fue agregado con éxito`
          );
          setIsBotonModalMesajeVisible(true);
          setModalMensajeView(true);

          setSkuDetails("");
          setNombreProductoDetails("");
          setPrecioProductoUSDDetails("");
          setDescripcionProductoDetails("");
          setPrecioEmpresaProductoDetails("");
          setCostopromedio("");
          setSelectedImages([]);
          setModalProductsDates({
            id_producto: "",
            isAddProducto: false,
            fileEditable: true,
            isModificarProducto: false,
            isAddProductoShowProveedoresTiendas: false,
            isAddProductoShowProveedores: false,
          });
        } else {
          alert("Error al agregar prducto");
        }
      } else {
        setModalMensaje(validarMesaje);
        setModalMensajeView(true);
        setReflechModalMensajeView(false);
        setIsBotonModalMesajeVisible(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Metodo para actualizar los datos de un producto
  const modificarProducto = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Modificando producto. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarMesaje: string =
        "ERROR AL MODIFICAR PRODUCTO. Por favor compruebe los siguientes campos:\n";

      // Condiciones para validar campos
      if (nombreProductoDetails.trim() === "") {
        validarMesaje += "-El nombre no puede ser vacío.\n";
        flag = false;
      }

      if (skuDetails.trim() === "") {
        validarMesaje += "-El SKU no puede ser vacío.\n";
        flag = false;
      }

      if (String(precioProductoUSDDetails).trim() === "") {
        validarMesaje += "-El precio en USD del producto no puede ser vacío.\n";
        flag = false;
      }

      if (String(costoPromedio).trim() === "") {
        validarMesaje += "-El costo del producto no puede ser vacío.\n";
        flag = false;
      }

      if (String(precioEmpresaProductoDetails).trim() === "") {
        validarMesaje +=
          "-El precio de la empresa en USD no puede ser vacío.\n";
        flag = false;
      }

      let auxDataImagesResponses: any[] = [];
      let imagenes: any[] = [];

      if (flag) {
        // Actualizar datos de las imagenes
        for (const [cont, image] of selectedImages.entries()) {
          if (image.id) {
            const resul = await crearimagenUnProducto(
              usuario.token,
              image,
              `\\${idProductoDetails}_${cont}.jpg`
            );
            if (resul) {
              auxDataImagesResponses.push(resul);
            } else {
              alert("Error en algo de las imagenes");
            }
          }
        }

        let i = 0;
        while (i < auxDataImagesResponses.length) {
          imagenes.push({
            id_imagen: auxDataImagesResponses[i].id_imagen,
          });
          i++;
        }

        // Agregar a la relación de imagen producto
        await addProductoAndImagenes(
          usuario.token,
          idProductoDetails,
          imagenes
        );

        // Actualizar datos del producto
        await updateProducto(
          usuario.token,
          idProductoDetails,
          nombreProductoDetails,
          skuDetails,
          precioProductoUSDDetails,
          precioEmpresaProductoDetails,
          descripcionProductoDetails,
          selecterActivoDetails === "si",
          costoPromedio
        );
        // Eliminar imagenes necesarias datos de las imagenes
        deleteImages.forEach(async (image) => {
          if (image.id && image.uri) {
            await deleteImagenByProducto(
              usuario.token,
              image.id,
              image.uri.split("/")[3]
            );
          }
        });

        // Agregar Acción de usuario modificar producto

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} modificó el producto ${nombreProductoDetails}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          1
        );

        setReflechModalMensajeView(true);
        setModalMensaje(
          `El Producto "${nombreProductoDetails}" se modificó con éxito`
        );
        setModalMensajeView(true);
        setIsBotonModalMesajeVisible(true);
      } else {
        setModalMensaje(validarMesaje);
        setIsBotonModalMesajeVisible(true);
        setReflechModalMensajeView(false);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = [
    "SKU",
    "Nombre",
    "CUP",
    "Cantidad",
    " ",
  ];
  const columnasMyDateTableTiendaModal = ["Nombre", "Cantidad"];
  const columnasMyDateTableProveedorModal = ["Nombre", "Cantidad", "Costo"];

  const columnasMyDateTableMovil = [
    "SKU",
    "Nombre",
    "CUP",
    "Cantidad",
    " ",
  ];
  const columnasMyDateTable = isMobile
    ? columnasMyDateTableMovil
    : columnasMyDateTableDesktop;
  // Saver si se está en un movil o en un desktop para cambiar los estilos de los contenedores
  if (isMobile) {
    return (
      <View style={{ flex: 1 }}>
        {/*Barra superior*/}
        <Navbar />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {isPermisoButtonAddProducto && (
            <TouchableOpacity
              onPress={() =>
                setModalProductsDates({
                  id_producto: "",
                  isAddProducto: true,
                  fileEditable: true,
                  isModificarProducto: false,
                  isAddProductoShowProveedoresTiendas: false,
                  isAddProductoShowProveedores: false,
                })
              }
              style={{
                flexDirection: "row",
                height: 40,
                width: "50%",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: Colors.azul_Oscuro, // Color de la sombra
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
                shadowRadius: 14, // Difuminado
                borderColor: Colors.azul_Claro,
                borderWidth: 3,
                padding: 10,
                borderRadius: 10,
                marginRight: "5%",
                backgroundColor: Colors.azul_Claro, // Color de fondo del botón
              }}
            >
              <Text style={styles.radioButtonTextMovil}>Agregar Producto</Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            marginTop: "3%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: Colors.azul_Claro,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 15,
              width: "90%", // Ajusta este valor si es necesario
              height: 60, // Valor fijo para mantener consistencia en la altura
              marginTop: "2%", // Valor más exacto en píxeles
              justifyContent: "center",
              marginRight: "5%",
              shadowColor: "#000",
              shadowOffset: { width: 3, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
            onPress={toggleExpansion}
          >
            <Image
              source={require("../images/loupe.png")}
              style={{ width: 45, height: 45 }}
            />
            <Text style={styles.textNavbarMovil}>Opciones de Filtrado</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {loading ? (
            <ActivityIndicator
              size={100}
              color="#007BFF"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: "15%",
              }}
            />
          ) : (
            <MyDateTableProductos
              isMobile={isMobile}
              items={filterItems}
              columns={columnasMyDateTable}
              columnasMyDateTableProveedorModal={
                columnasMyDateTableProveedorModal
              }
              columnasMyDateTableTiendaModal={columnasMyDateTableTiendaModal}
              tiendasByProducto={tiendasByProducto}
              proveedorByProducto={proveedorByProducto}
              imtemsLength={filterItemsLength}
            />
          )}
          {/*Lista que se despliega para filtrar los productos*/}
          {isExpanded && (
            <Animated.View
              style={[
                { overflow: "hidden", position: "absolute", right: 0 },
                animatedStyle,
              ]}
            >
              <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Llamada a la función para renderizar los botones */}
                {/*Contenedor para las opciones de busqueda del usuario*/}
                <LinearGradient
                  colors={[Colors.azul_Claro, Colors.azul_Oscuro]} // Gradiente de azul oscuro a azul claro
                  start={[0, 0]}
                  end={[1, 0]}
                  style={styles.searchContainerMovil}
                >
                  <Text style={styles.textSearchMovil}>
                    Nombre del Producto:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="Nombre del producto"
                    value={nombreProductoSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setNombreProductoSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <Text style={styles.textSearchMovil}>SKU:</Text>
                    <Text style={styles.textSearchMovil}></Text>
                    <Text style={styles.textSearchMovil}></Text>
                    <Text style={styles.textSearchMovil}></Text>
                    <Text style={styles.textSearchMovil}></Text>
                    <Text style={styles.textSearchMovil}>Cantidad:</Text>
                  </View>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="SKU"
                      value={sKUSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={setSKUSearch}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Cantidad"
                      value={cantidadSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setCantidadSearch(numericValue);
                      }}
                    />
                  </View>

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>
                    Rango de Precio en CUP :
                  </Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Desde"
                      value={rangoPrecioDesdeSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoPrecioDesdeSearch(numericValue);
                      }}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Hasta"
                      value={rangoPrecioHastaSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoPrecioHastaSearch(numericValue);
                      }}
                    />
                  </View>

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>Buscar por Tienda:</Text>
                  <View
                    style={{ position: "relative", zIndex: 500, height: 100 }}
                  >
                    <CustomDropdown
                      value={selectedValueNombreTienda}
                      placeholder="Seleccione un Tiendas"
                      setValue={setSelectedValueNombreTienda}
                      items={dropdownItems}
                    />
                  </View>
                  <View style={{ width: "100%", flexDirection: "row" }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.azul_Oscuro,
                        borderRadius: 15,
                        width: "42.5%", // Ancho fijo para pantallas de escritorio
                        height: 50, // Altura fija para pantallas de escritorio
                        marginLeft: "5%",
                        marginBottom: "7%",
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: Colors.azul_Suave, // Color de la sombra
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
                        shadowRadius: 14, // Difuminado
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.blanco,
                          fontSize: 16,
                          justifyContent: "center",
                          marginLeft: "6%",
                          fontWeight: "bold", // Para negritas
                          textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                          textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                          textShadowRadius: 2, // Difuminado de la sombra
                        }}
                        onPress={clearFields}
                      >
                        Limpiar Campos
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.azul_Suave,
                        borderRadius: 15,
                        width: "42.5%", // Ancho fijo para pantallas de escritorio
                        height: 50, // Altura fija para pantallas de escritorio
                        marginLeft: "5%",
                        marginBottom: "7%",
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: Colors.azul_Suave, // Color de la sombra
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
                        shadowRadius: 14, // Difuminado
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.blanco,
                          fontSize: 16,
                          justifyContent: "center",
                          fontWeight: "bold", // Para negritas
                          textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                          textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                          textShadowRadius: 2, // Difuminado de la sombra
                        }}
                        onPress={() => {
                          filtrarYOrdenarProductos();
                          setIsExpanded(false);
                        }}
                      >
                        Buscar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </ScrollView>
            </Animated.View>
          )}
        </View>
        <Modal
          transparent={true}
          visible={modalProductsDates?.isAddProducto ?? false}
          animationType="fade"
          onRequestClose={callModalAddProducto}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
            }}
          >
            <View
              style={{
                width: "100%",
                height: "90%",
                backgroundColor: Colors.blanco_Suave,
                borderRadius: 15,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              {/* Botón de cerrar en la esquina superior derecha */}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: Colors.rojo_oscuro,
                  borderRadius: 30,
                  marginRight: "3%",
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={callModalAddProducto}
              >
                <Text style={{ color: Colors.blanco_Suave }}>X</Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 26,
                  marginTop: "1%",
                  color: Colors.negro,
                  textShadowColor: "rgba(0, 0, 0, 0.5)",
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                {/*(modalProductsDates?.isModificarProducto ?? false)? "Modificar Producto" : (modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                false */}
                {modalProductsDates?.isModificarProducto ?? false
                  ? "Modificar Producto"
                  : modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                    false
                  ? "Datos del Producto"
                  : "Agregar Producto"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Producto */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Producto
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  value={nombreProductoDetails}
                  onChangeText={setNombreProductoDetails}
                  cursorColor={Colors.azul_Oscuro}
                  editable={modalProductsDates?.fileEditable ? true : false}
                  placeholder="Nombre del producto"
                />

                {/* Contenedor para los campos Precio y Precio de Empresa */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Precio */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    
                  </View>

                  {/* Campo Precio de Empresa */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Precio de empresa en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={precioEmpresaProductoDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setPrecioEmpresaProductoDetails(validNumericValue);
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Precio de empresa en CUP"
                    />
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Precio en CUP*/}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Precio en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={precioProductoCUPDetails}
                      cursorColor={Colors.azul_Oscuro}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;
                        let aux = parseFloat(validNumericValue) / cambioMoneda
                        setPrecioProductoUSDDetails(aux.toFixed(5));
                        setPrecioProductoCUPDetails(validNumericValue)
                      }}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Precio en CUP"
                    />
                  </View>

                  {/* Campo Costo Promedio*/}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    {(isPermisoHistorialDeProveedores) && (
                      <Text style={styles.labelTextModalDesktop}>
                        Costo Promedio
                      </Text>
                    )}
                    {(isPermisoHistorialDeProveedores) && (
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={costoPromedio}
                        cursorColor={Colors.azul_Oscuro}
                        onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;
                          setCostopromedio(validNumericValue);
                      }}
                        editable={modalProductsDates?.fileEditable ? true : false}
                        placeholder="Costo Promedio"
                      />
                    )}
                  </View>
                </View>

                {/* Campo SKU */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>Sku</Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={skuDetails}
                      onChangeText={setSkuDetails}
                      cursorColor={Colors.azul_Oscuro}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Sku"
                    />
                  </View>

                  <View style={{ width: "45%", marginRight: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Descripción
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={descripcionProductoDetails}
                      onChangeText={setDescripcionProductoDetails}
                      cursorColor={Colors.azul_Oscuro}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Descripción"
                    />
                  </View>
                </View>

                {/* Campo Tiene Fecha de Vencimiento*/}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginTop: "3%",
                      color: Colors.negro, // Color del texto
                      textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                      textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                      textShadowRadius: 2, // Difuminado de la sombra
                    }}
                  >
                    ¿Este producto tiene fecha de vencimiento?
                  </Text>
                </View>
                <View
                  style={{
                    padding: 20,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  {optionsIsFechaVencimiento.map((option) => (
                    <CustomRadioButton
                      key={option.value}
                      label={option.label}
                      selected={selecterActivoDetails === option.value}
                      onPress={() => {
                        if (modalProductsDates?.fileEditable) {
                          setSelecterActivoDetails(option.value);
                        }
                      }}
                    />
                  ))}
                </View>

                {modalProductsDates?.isModificarProducto
                  ? false
                  : (modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                      false) && (
                      <View
                        style={{
                          borderColor: Colors.azul_Oscuro,
                          borderWidth: 2,
                          marginTop: "3%",
                          borderRadius: 15,
                          flexDirection: "row",
                          height: 350,
                          width: "90%",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            height: 340,
                            width: "45%",
                          }}
                        >
                          <Text style={styles.labelTextModalMovil}>
                            Tiendas en las que existe el producto
                          </Text>
                          <MyDateTableModalShowDatesTienda
                            columns={columnasMyDateTableTiendaModal}
                            items={tiendasByProducto}
                          />
                        </View>
                        {(modalProductsDates?.isAddProductoShowProveedores ??
                          false) &&
                          isPermisoHistorialDeProveedores && (
                            <View
                              style={{
                                height: 340,
                                width: "45%",
                              }}
                            >
                              <Text style={styles.labelTextModalMovil}>
                                Historial de proveedores
                              </Text>
                              <MyDateTableModalShowDateProveedores
                                columns={columnasMyDateTableProveedorModal}
                                items={proveedorByProducto}
                              />
                            </View>
                          )}
                      </View>
                    )}

                {/* Descripción */}
                {/*<Text
                  style={{
                    fontSize: 20,
                    marginTop: "1%",
                    color: Colors.negro,
                    textShadowColor: "rgba(0, 0, 0, 0.5)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  Descripción
                </Text>
                <CustomTextImputSearch
                  style={{
                    height: 150,
                    borderColor: Colors.azul_Oscuro,
                    borderWidth: 1,
                    shadowColor: Colors.azul_Suave,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 14,
                    width: "90%",
                    textAlignVertical: "top",
                    padding: 10,
                    marginTop: "2%",
                    marginHorizontal: "5%",
                    backgroundColor: Colors.blanco_Suave,
                    borderRadius: 13,
                    fontSize: 18,
                    color: Colors.negro,
                    textShadowColor: "rgba(0, 0, 0, 0.5)",
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 2,
                    fontWeight: "bold",
                    paddingHorizontal: 10,
                  }}
                  cursorColor={Colors.azul_Oscuro}
                  placeholder="Escribe la descripción del producto"
                  multiline={true}
                  value={descripcionProductoDetails}
                  onChangeText={setDescripcionProductoDetails}
                  editable={modalProductsDates?.fileEditable ? true : false}
                  numberOfLines={5}
                  scrollEnabled={true}
                />*/}

                {/* Campo para cargar fotos */}
                <PanGestureHandler onGestureEvent={onDrop}>
                  <View
                    style={{
                      marginTop: 20,
                      width: "90%",
                      borderWidth: 1,
                      borderColor: Colors.azul_Oscuro,
                      borderRadius: 13,
                      padding: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.blanco_Suave,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.negro,
                        marginBottom: "5%",
                      }}
                    >
                      Imágenes del producto
                    </Text>

                    {/* Botón para cargar imágenes */}
                    {(modalProductsDates?.fileEditable ?? false) && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Claro,
                          borderRadius: 15,
                          width: "90%", // Ancho fijo para pantallas de escritorio
                          height: 50, // Altura fija para pantallas de escritorio
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 3, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                        }}
                        onPress={handleImageUpload}
                      >
                        <Text style={{ color: Colors.blanco }}>
                          Seleccionar Imágenes
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Vista para mostrar las imágenes seleccionadas */}
                    {selectedImages.length > 0 && (
                      <ScrollView
                        horizontal={true}
                        style={{
                          marginTop: 10,
                          width: "100%",
                          height: 100, // Ajusta la altura de la vista de imágenes
                        }}
                      >
                        {selectedImages.map((image, index) => (
                          <View
                            key={index}
                            style={{
                              position: "relative",
                              width: 100,
                              height: 100,
                              marginRight: 10,
                            }}
                          >
                            <Image
                              key={index}
                              source={{ uri: image.uri }} // Usa la URI de la imagen
                              style={{
                                width: 100,
                                height: 100,
                                marginRight: 10,
                                borderRadius: 10,
                              }}
                            />
                            <TouchableOpacity
                              style={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                backgroundColor: "red",
                                borderRadius: 15,
                                width: 20,
                                height: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1,
                              }}
                              onPress={() => handleRemoveImage(index)}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 14,
                                }}
                              >
                                X
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                </PanGestureHandler>
                {(modalProductsDates?.fileEditable ?? false) && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.azul_Claro,
                      borderRadius: 15,
                      width: "90%", // Ancho fijo para pantallas de escritorio
                      height: 50, // Altura fija para pantallas de escritorio
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 3, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      marginTop: "3%",
                    }}
                    onPress={() =>
                      modalProductsDates?.isModificarProducto
                        ? modificarProducto()
                        : addNewProducto()
                    }
                    disabled={isButtonDisabled}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                      }}
                    >
                      {modalProductsDates?.isModificarProducto
                        ? "Modificar Producto"
                        : "Agregar Producto"}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/*Modal mensaje */}
        <Modal
          transparent={true}
          visible={isModalMensajeView}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
            }}
          >
            <View
              style={{
                width: 350,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                {modalMensaje}
              </Text>

              {isBotonModalMesajeVisible && (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.azul_Oscuro,
                    padding: 10,
                    borderRadius: 8,
                    width: "48%", // Ajusta el ancho de los botones
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    isReflechModalMensajeView
                      ? obtenerProductosConPermisosYDatos(1)
                      : setModalMensajeView(!isModalMensajeView)
                  }
                >
                  <Text style={{ color: "white" }}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>

        {/*Modal mensaje para el exel */}
        <Modal
          transparent={true}
          visible={isModalMensajeViewExel}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
            }}
          >
            <View
              style={{
                width: 650,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                {modalMensaje}
              </Text>

              {loadingOfExel ? (
                <ActivityIndicator
                  size={100}
                  color="#007BFF"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "15%",
                  }}
                />
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
                  >
                    Datos Recopilados. Espere a que termine la descarga.
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#007BFF", // Cambia esto por Colors.azul_Oscuro si lo tienes definido
                      padding: 10,
                      borderRadius: 8,
                      width: "48%", // Ajusta el ancho del botón
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() =>
                      setModalMensajeViewExel(!isModalMensajeViewExel)
                    } // Llama a la función onClose para cerrar el modal
                  >
                    <Text style={{ color: "white" }}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        {/*Barra superior*/}
        <Navbar />
        {/* Vista animada que se despliega hacia la izquierda */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          {isPermisoButtonAddProducto && (
            <TouchableOpacity
              onPress={() => {
                auxSetModalProductsDates();
              }}
              style={{
                flexDirection: "row",
                height: 30,
                width: "12%",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: Colors.azul_Oscuro, // Color de la sombra
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
                shadowRadius: 14, // Difuminado
                borderColor: Colors.azul_Claro,
                borderWidth: 3,
                padding: 10,
                borderRadius: 10,
                marginHorizontal: "1%",
                marginTop: "1%",
                backgroundColor: Colors.azul_Claro, // Color de fondo del botón
              }}
            >
              <Text
                style={[
                  styles.radioButtonTextDesktop,
                  sortProductos?.criterioOrden === "option1" &&
                    styles.radioButtonSelected &&
                    styles.radioButtonTextSelected,
                ]}
              >
                Agregar Producto
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => exportarExel()}
            style={{
              flexDirection: "row",
              height: 30,
              width: "12%",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: Colors.azul_Oscuro, // Color de la sombra
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
              shadowRadius: 14, // Difuminado
              borderColor: Colors.verde_claro,
              borderWidth: 3,
              padding: 10,
              borderRadius: 10,
              marginHorizontal: "1%",
              marginTop: "1%",
              backgroundColor: Colors.verde_claro, // Color de fondo del botón
            }}
          >
            <Image
              source={require("../images/exel.png")}
              style={{ width: 20, height: 20, marginRight: "10%" }}
            />
            <Text
              style={[
                styles.radioButtonTextDesktop,
                sortProductos?.criterioOrden === "option1" &&
                  styles.radioButtonSelected &&
                  styles.radioButtonTextSelected,
              ]}
            >
              Exportar a Excel
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: "1%",
          }}
        >
          {/*Contenedor para las opciones de busqueda del paciente*/}
          <LinearGradient
            colors={[Colors.azul_Claro, Colors.azul_Oscuro]} // Gradiente de azul oscuro a azul claro
            start={[0, 0]}
            end={[1, 0]}
            style={styles.searchContainerDesktop}
          >
            <Text style={styles.textSearchDesktop}>Nombre del producto:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del producto"
              value={nombreProductoSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreProductoSearch}
            />

            <View style={styles.separatorBlanco} />

            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Text style={styles.textSearchDesktop}>SKU:</Text>
              <Text style={styles.textSearchDesktop}></Text>
              <Text style={styles.textSearchDesktop}></Text>
              <Text style={styles.textSearchDesktop}></Text>
              <Text style={styles.textSearchDesktop}></Text>
              <Text style={styles.textSearchDesktop}>Cantidad:</Text>
            </View>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="SKU"
                onKeyPress={handleKeyPress}
                value={sKUSearch}
                onChangeText={setSKUSearch}
              />
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Cantidad"
                value={cantidadSearch}
                onKeyPress={handleKeyPress}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCantidadSearch(numericValue);
                }}
              />
            </View>

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>
              Rango de Precio en CUP:
            </Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Desde"
                onKeyPress={handleKeyPress}
                value={rangoPrecioDesdeSearch}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoPrecioDesdeSearch(numericValue);
                }}
              />
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Hasta"
                value={rangoPrecioHastaSearch}
                onKeyPress={handleKeyPress}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoPrecioHastaSearch(numericValue);
                }}
              />
            </View>

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Buscar por Tienda:</Text>
            <View style={{ position: "relative", zIndex: 500, height: 100 }}>
              <CustomDropdown
                value={selectedValueNombreTienda}
                placeholder="Seleccione una Tienda"
                setValue={setSelectedValueNombreTienda}
                items={dropdownItems}
              />
            </View>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.azul_Oscuro,
                  borderRadius: 15,
                  width: "42.5%", // Ancho fijo para pantallas de escritorio
                  height: 40, // Altura fija para pantallas de escritorio
                  marginLeft: "5%",
                  marginBottom: "7%",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: Colors.azul_Suave, // Color de la sombra
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
                  shadowRadius: 14, // Difuminado
                }}
              >
                <Text
                  style={{
                    color: Colors.blanco,
                    fontSize: 14,
                    justifyContent: "center",
                    marginLeft: "6%",
                    fontWeight: "bold", // Para negritas
                    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                    textShadowRadius: 2, // Difuminado de la sombra
                  }}
                  onPress={clearFields}
                >
                  Limpiar Campos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.azul_Suave,
                  borderRadius: 15,
                  width: "42.5%", // Ancho fijo para pantallas de escritorio
                  height: 40, // Altura fija para pantallas de escritorio
                  marginLeft: "5%",
                  marginBottom: "7%",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: Colors.azul_Suave, // Color de la sombra
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
                  shadowRadius: 14, // Difuminado
                }}
              >
                <Text
                  style={{
                    color: Colors.blanco,
                    fontSize: 14,
                    justifyContent: "center",
                    fontWeight: "bold", // Para negritas
                    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                    textShadowRadius: 2, // Difuminado de la sombra
                  }}
                  onPress={() => filtrarYOrdenarProductos()}
                >
                  Buscar
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          {loading ? (
            <ActivityIndicator
              size={150}
              color="#007BFF"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: "15%",
              }}
            />
          ) : (
            <MyDateTableProductos
              isMobile={isMobile}
              items={filterItems}
              columns={columnasMyDateTable}
              columnasMyDateTableProveedorModal={
                columnasMyDateTableProveedorModal
              }
              columnasMyDateTableTiendaModal={columnasMyDateTableTiendaModal}
              tiendasByProducto={tiendasByProducto}
              proveedorByProducto={proveedorByProducto}
              imtemsLength={filterItemsLength}
            />
          )}
        </View>
        <Modal
          transparent={true}
          visible={modalProductsDates?.isAddProducto ?? false}
          animationType="fade"
          onRequestClose={callModalAddProducto}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
            }}
          >
            <View
              style={{
                width: "60%",
                height: "90%",
                backgroundColor: Colors.blanco_Suave,
                borderRadius: 15,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              {/* Botón de cerrar en la esquina superior derecha */}
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: Colors.rojo_oscuro,
                  borderRadius: 30,
                  marginRight: "3%",
                  height: 40,
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={callModalAddProducto}
              >
                <Text style={{ color: Colors.blanco_Suave }}>X</Text>
              </TouchableOpacity>

              <View style={styles.separatorNegro} />

              <Text
                style={{
                  fontSize: 26,
                  marginTop: "1%",
                  color: Colors.negro,
                  textShadowColor: "rgba(0, 0, 0, 0.5)",
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                {modalProductsDates?.isModificarProducto ?? false
                  ? "Modificar Producto"
                  : modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                    false
                  ? "Datos del Producto"
                  : "Agregar Producto"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Producto */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Producto
                  </Text>
                </View>
                <CustomTextImputSearch
                  ref={nombreProductoRef}
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={modalProductsDates?.fileEditable}
                  value={nombreProductoDetails}
                  onChangeText={setNombreProductoDetails}
                  placeholder="Nombre del producto"
                />

                {/* Contenedor para los campos Precio y Precio de Empresa */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Precio */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    
                  </View>

                  {/* Campo Precio de Empresa */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Precio de empresa en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={precioEmpresaProductoDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setPrecioEmpresaProductoDetails(validNumericValue);
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Precio de empresa en CUP"
                    />
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Precio en CUP*/}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Precio en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={precioProductoCUPDetails}
                      cursorColor={Colors.azul_Oscuro}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;
                        let aux = parseFloat(validNumericValue) / cambioMoneda
                        setPrecioProductoUSDDetails(aux.toFixed(5));
                        setPrecioProductoCUPDetails(validNumericValue)
                      }}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Precio en CUP"
                    />
                  </View>

                  {/* Campo Precio de Empresa en CUP*/}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    {(isPermisoHistorialDeProveedores) && (
                      <Text style={styles.labelTextModalDesktop}>
                        Costo Promedio
                      </Text>
                    )}
                    {(isPermisoHistorialDeProveedores) && (
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={costoPromedio}
                        cursorColor={Colors.azul_Oscuro}
                        onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;
                          setCostopromedio(validNumericValue);
                      }}
                        editable={modalProductsDates?.fileEditable ? true : false}
                        placeholder="Costo Promedio"
                      />
                    )}
                  </View>
                </View>

                {/* Campo SKU  y Descripcion*/}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>Sku</Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={skuDetails}
                      onChangeText={setSkuDetails}
                      cursorColor={Colors.azul_Oscuro}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Sku"
                    />
                  </View>
                  <View style={{ width: "45%", marginRight: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Descripción
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={descripcionProductoDetails}
                      onChangeText={setDescripcionProductoDetails}
                      cursorColor={Colors.azul_Oscuro}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Descripción"
                    />
                  </View>
                </View>

                {/* Campo Tiene Fecha de Vencimiento*/}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginTop: "3%",
                      color: Colors.negro, // Color del texto
                      textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                      textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                      textShadowRadius: 2, // Difuminado de la sombra
                    }}
                  >
                    ¿Este producto tiene fecha de vencimiento?
                  </Text>
                </View>
                <View
                  style={{
                    padding: 20,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  {optionsIsFechaVencimiento.map((option) => (
                    <CustomRadioButton
                      key={option.value}
                      label={option.label}
                      selected={selecterActivoDetails === option.value}
                      onPress={() => {
                        if (modalProductsDates?.fileEditable) {
                          setSelecterActivoDetails(option.value);
                        }
                      }}
                    />
                  ))}
                </View>
                {/* Descripción */}
                {/*(<Text
                  style={{
                    fontSize: 20,
                    marginTop: "1%",
                    color: Colors.negro,
                    textShadowColor: "rgba(0, 0, 0, 0.5)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  Descripción
                </Text>
                
                <CustomTextImputSearch
                  style={{
                    height: 150,
                    borderColor: Colors.azul_Oscuro,
                    borderWidth: 1,
                    shadowColor: Colors.azul_Suave,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.6,
                    shadowRadius: 14,
                    width: "90%",
                    textAlignVertical: "top",
                    padding: 10,
                    marginTop: "2%",
                    marginHorizontal: "5%",
                    backgroundColor: Colors.blanco_Suave,
                    borderRadius: 13,
                    fontSize: 18,
                    color: Colors.negro,
                    textShadowColor: "rgba(0, 0, 0, 0.5)",
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 2,
                    fontWeight: "bold",
                    paddingHorizontal: 10,
                  }}
                  cursorColor={Colors.azul_Oscuro}
                  placeholder="Escribe la descripción del producto"
                  multiline={true}
                  editable={modalProductsDates?.fileEditable ? true : false}
                  numberOfLines={5}
                  value={descripcionProductoDetails}
                  onChangeText={setDescripcionProductoDetails}
                  scrollEnabled={true}
                />*/}

                {modalProductsDates?.isModificarProducto
                  ? false
                  : (modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                      false) && (
                      <View
                        style={{
                          borderColor: Colors.azul_Oscuro,
                          borderWidth: 2,
                          marginTop: "3%",
                          borderRadius: 15,
                          flexDirection: "row",
                          height: 350,
                          width: "90%",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            height: 350,
                            width: "50%",
                          }}
                        >
                          <Text style={styles.labelTextModalDesktop}>
                            Tiendas en las que existe el producto
                          </Text>
                          <MyDateTableModalShowDatesTienda
                            columns={columnasMyDateTableTiendaModal}
                            items={tiendasByProducto}
                          />
                        </View>
                        {(modalProductsDates?.isAddProductoShowProveedores ??
                          false) &&
                          isPermisoHistorialDeProveedores && (
                            <View
                              style={{
                                height: 350,
                                width: "50%",
                              }}
                            >
                              <Text style={styles.labelTextModalDesktop}>
                                Historial de proveedores
                              </Text>
                              <MyDateTableModalShowDateProveedores
                                columns={columnasMyDateTableProveedorModal}
                                items={proveedorByProducto}
                              />
                            </View>
                          )}
                      </View>
                    )}

                {/* Campo para cargar fotos */}
                <PanGestureHandler onGestureEvent={onDrop}>
                  <View
                    style={{
                      marginTop: 20,
                      width: "90%",
                      borderWidth: 1,
                      borderColor: Colors.azul_Oscuro,
                      borderRadius: 13,
                      padding: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.blanco_Suave,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.negro,
                        marginBottom: "5%",
                      }}
                    >
                      Imágenes del producto
                    </Text>

                    {/* Botón para cargar imágenes */}
                    {(modalProductsDates?.fileEditable ?? false) && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Claro,
                          borderRadius: 15,
                          width: "90%", // Ancho fijo para pantallas de escritorio
                          height: 50, // Altura fija para pantallas de escritorio
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 3, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                        }}
                        onPress={handleImageUpload}
                      >
                        <Text style={{ color: Colors.blanco }}>
                          Seleccionar Imágenes
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Vista para mostrar las imágenes seleccionadas */}
                    {selectedImages.length > 0 && (
                      <ScrollView
                        horizontal={true}
                        style={{
                          marginTop: 10,
                          width: "100%",
                          height: 100, // Ajusta la altura de la vista de imágenes
                        }}
                      >
                        {selectedImages.map((image, index) => (
                          <View
                            key={index}
                            style={{
                              position: "relative",
                              width: 100,
                              height: 100,
                              marginRight: 10,
                            }}
                          >
                            <Image
                              key={index}
                              source={{ uri: image.uri }} // Usa la URI de la imagen
                              style={{
                                width: 100,
                                height: 100,
                                marginRight: 10,
                                borderRadius: 10,
                              }}
                            />
                            {modalProductsDates?.fileEditable && (
                              <TouchableOpacity
                                style={{
                                  position: "absolute",
                                  top: 5,
                                  right: 5,
                                  backgroundColor: "red",
                                  borderRadius: 15,
                                  width: 20,
                                  height: 20,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  zIndex: 1,
                                }}
                                onPress={() => handleRemoveImage(index)}
                              >
                                <Text
                                  style={{
                                    color: "white",
                                    fontSize: 14,
                                  }}
                                >
                                  X
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                </PanGestureHandler>
                {(modalProductsDates?.fileEditable ?? false) && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.azul_Claro,
                      borderRadius: 15,
                      width: "90%", // Ancho fijo para pantallas de escritorio
                      height: 50, // Altura fija para pantallas de escritorio
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 3, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      marginTop: "3%",
                    }}
                    onPress={() =>
                      modalProductsDates?.isModificarProducto
                        ? modificarProducto()
                        : addNewProducto()
                    }
                    disabled={isButtonDisabled}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                      }}
                    >
                      {modalProductsDates?.isModificarProducto
                        ? "Modificar Producto"
                        : "Agregar Producto"}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/*Modal mensaje */}
        <Modal
          transparent={true}
          visible={isModalMensajeView}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
            }}
          >
            <View
              style={{
                width: 650,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                {modalMensaje}
              </Text>

              {isBotonModalMesajeVisible && (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.azul_Oscuro,
                    padding: 10,
                    borderRadius: 8,
                    width: "48%", // Ajusta el ancho de los botones
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    isReflechModalMensajeView
                      ? obtenerProductosConPermisosYDatos(1)
                      : setModalMensajeView(!isModalMensajeView)
                  }
                >
                  <Text style={{ color: "white" }}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>

        {/*Modal mensaje para el exel */}
        <Modal
          transparent={true}
          visible={isModalMensajeViewExel}
          animationType="fade"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
            }}
          >
            <View
              style={{
                width: 650,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                {modalMensaje}
              </Text>

              {loadingOfExel ? (
                <ActivityIndicator
                  size={100}
                  color="#007BFF"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "15%",
                  }}
                />
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
                  >
                    Datos Recopilados. Espere a que termine la descarga.
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#007BFF", // Cambia esto por Colors.azul_Oscuro si lo tienes definido
                      padding: 10,
                      borderRadius: 8,
                      width: "48%", // Ajusta el ancho del botón
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() =>
                      setModalMensajeViewExel(!isModalMensajeViewExel)
                    } // Llama a la función onClose para cerrar el modal
                  >
                    <Text style={{ color: "white" }}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
