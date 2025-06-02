import Navbar from "../components/Navbar";
import { Colors } from "../styles/Colors";
import { styles } from "../styles/Styles";
import "react-datepicker/dist/react-datepicker.css";
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
import { LinearGradient } from "expo-linear-gradient";
import { getAllProveedores } from "../services/ProveedorServices";
import CustomTextImputSearch from "../components/CustomTextImputSearch";

import { useUsuario } from "../contexts/UsuarioContext";
import { getAllTiendas, isProductoInTienda } from "../services/TiendaServices";
import { TiendaPiker } from "../components/MyDateTableTiendas";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { TiendaShowModal } from "../components/MyDateTableModalShowDatesTienda";
import { ProveedoresShowModal } from "../components/MyDateTableModalShowDateProveedores";
import { isPermiso } from "../services/RolPermisosAndRol";
import {
  addEntrada,
  deleteEntrada,
  filtrarEntrada,
  getAllEntradas,
  getEntradaByID,
  modificarEntrada,
  ordenarEntradas,
} from "../services/EntradaServices";
import { ProveedorPiker } from "../components/MyDateTableProveedores";
import CustomDropdownDetails from "../components/CustomDropDownDetails";
import {
  addProductoEntrada,
  createProductoInTienda,
  deleteFromProductoTiendaIn_0,
  getAllProductos,
  getProductoById,
  getProductoCantidadTotal,
  updateProductoCostoAcumulado,
} from "../services/ProductoServices";
import { ProductoPiker } from "../components/MyDateTableProductos";
import { useModalEntradasDates } from "../contexts/AuxiliarContextModalEntradas";
import { MyDateInput } from "../components/MyDateInput";
import { MyDateInputVencimiento } from "../components/MyDateInputVencimiento";
import { useSortEntradas } from "../contexts/AuxiliarSortEntradas";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import CustomRadioButton from "../components/CustomRadioButtonsSearch";
import { getValorMonedaUSD } from "../services/MonedaService";
import { Diario, MyDateTableDiario } from "../components/MyDataTableDiario";

export default function DiarioView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  const [cambioMoneda, setCambioMoneda] = useState(0);

  // Variables para cntrolar las capas visuales de las listas desplegables
  const [capaPrioridadFechaDetails, setCapaPrioridadFechaDetails] =
    useState(1000);
  const [capaPrioridadTiendasDetails, setCapaPrioridadTiendasDetails] =
    useState(1000);
  const [capaPrioridadProductosDetails, setCapaPrioridadProductosDetails] =
    useState(1000);
  const [capaPrioridadProveedoresDetails, setCapaPrioridadProveedoresDetails] =
    useState(1000);

  const [capaPrioridadFechaDesdeSearsh, setCapaPrioridadFechaDesteSearsh] =
    useState(1000);
  const [capaPrioridadFechaHastaSearsh, setCapaPrioridadFechaHastaSearsh] =
    useState(1000);

  // Método para controlar las capas desplegables
  const controlarCapas = (prioridad: string) => {
    // Prioridades para los campos de detalles
    if (prioridad === "FechaDetails") {
      setCapaPrioridadFechaDetails(2000);
      setCapaPrioridadTiendasDetails(1500);
      setCapaPrioridadProductosDetails(1500);
      setCapaPrioridadProveedoresDetails(1500);
    } else if (prioridad === "TiendaDetails") {
      setCapaPrioridadTiendasDetails(2000);
      setCapaPrioridadFechaDetails(1500);
      setCapaPrioridadProductosDetails(1500);
      setCapaPrioridadProveedoresDetails(1500);
    } else if (prioridad === "ProductosDetails") {
      setCapaPrioridadTiendasDetails(1500);
      setCapaPrioridadFechaDetails(1500);
      setCapaPrioridadProductosDetails(2000);
      setCapaPrioridadProveedoresDetails(1500);
    } else if (prioridad === "ProveedoresDetails") {
      setCapaPrioridadTiendasDetails(1500);
      setCapaPrioridadFechaDetails(1500);
      setCapaPrioridadProductosDetails(1500);
      setCapaPrioridadProveedoresDetails(2000);
    }

    // Prioridades para el searsh
    if (prioridad === "FechaDesdeSearsh") {
      setCapaPrioridadFechaDesteSearsh(2000);
      setCapaPrioridadFechaHastaSearsh(1500);
    } else if (prioridad === "FechaHastaSearsh") {
      setCapaPrioridadFechaDesteSearsh(1500);
      setCapaPrioridadFechaHastaSearsh(2000);
    }
  };

  // Datos del usuario que está logueado
  const { usuario, setUsuario } = useUsuario();
  const { modalEntradasDates, setModalEntradasDates } = useModalEntradasDates();
  const { sortEntradas, setSortEntradas } = useSortEntradas();

  // Constantes para controlar la animación del boton desplegable
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado
  const animationValueOptions = useRef(new Animated.Value(0)).current; // Valor animado

  // Variables para controlar los campos de los formularios de agregar entradass y ver datos
  const [idEntradaDetails, setIdEntradaDetails] = useState("");
  const [idProveedorDetails, setIdProveedorDetails] = useState("");
  const [idProductoDetails, setIdProductoDetails] = useState("");
  const [idTiendaDetails, setIdTiendaDetails] = useState("");
  const [cantidadDetails, setCantidadDetails] = useState("");
  const [costoUSDDetails, setCostoUSDDetails] = useState("");
  const [costoCUPDetails, setCostoCUPDetails] = useState("");
  const [fechaDiaDetails, setFechaDiaDetails] = useState("");
  const [fechaMesDetails, setFechaMesDetails] = useState("");
  const [fechaAnnoDetails, setFechaAnnoDetails] = useState("");
  const [fechaVencimientoDiaDetails, setFechaVencimientoDiaDetails] =
    useState("");
  const [fechaVencimientoMesDetails, setFechaVencimientoMesDetails] =
    useState("");
  const [fechaVencimientoAnnoDetails, setFechaVencimientoAnnoDetails] =
    useState("");
  const [isFechaVencimientoDetails, setIsFechaVencimientoDetails] =
    useState(false);

  const [isDateLoaded, setIsDateLoaded] = useState(false);

  const [idProductoAuxModificarDetails, setIdProductoAuxModificarDetails] =
    useState("");
  const [idTiendaAuxModificarDetails, setIdTiendaAuxModificarDetails] =
    useState("");
  const [cantidadAuxModificarDetails, setCantidadAuxModificarDetails] =
    useState("");
  const [costoAuxModificarDetails, setCostoAuxModificarDetails] = useState("");

  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [modalMensaje, setModalMensaje] = React.useState("");
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);

  const [isModalChekEliminarEntrada, setIsModalChekEliminarEntrada] =
    useState(false);
  const [isModalChekVisible, setIsModalChekVisible] = useState(false);
  const [mesajeModalChek, setMesajeModalChek] = useState("");
  const [isBotonModalMesajeVisible, setIsBotonModalMesajeVisible] =
    useState(false);

  // Controlar el doble clic del boton
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Condicionales para mostrar según los permisos
  const [isPermisoAgregarEntrada, setIsPermisoAgregarEntrada] =
    React.useState(false);
  const [isPermisoEliminarEntrada, setIsPermisoEliminarEntrada] =
    React.useState(false);
  const [isPermisoModificarEntrada, setIsPermisoModificarEntrada] =
    React.useState(false);

  const checkPermiso = async () => {
    if (usuario?.token) {
      // Verificar y almacenar el permiso de agregar entrada
      if (localStorage.getItem("isPermisoAgregarEntrada") === null) {
        const resultAgregarEntrada = await isPermiso(
          usuario.token,
          "10",
          usuario.id_usuario
        );
        setIsPermisoAgregarEntrada(resultAgregarEntrada);
        localStorage.setItem("isPermisoAgregarEntrada", resultAgregarEntrada);
      } else {
        setIsPermisoAgregarEntrada(
          Boolean(localStorage.getItem("isPermisoAgregarEntrada"))
        );
      }

      // Verificar y almacenar el permiso de eliminar entrada
      if (localStorage.getItem("isPermisoEliminarEntrada") === null) {
        const resultEliminarEntrada = await isPermiso(
          usuario.token,
          "12",
          usuario.id_usuario
        );
        setIsPermisoEliminarEntrada(resultEliminarEntrada);
        localStorage.setItem("isPermisoEliminarEntrada", resultEliminarEntrada);
      } else {
        setIsPermisoEliminarEntrada(
          Boolean(localStorage.getItem("isPermisoEliminarEntrada"))
        );
      }

      // Verificar y almacenar el permiso de modificar entrada
      if (localStorage.getItem("isPermisoModificarEntrada") === null) {
        const resultModificarEntrada = await isPermiso(
          usuario.token,
          "11",
          usuario.id_usuario
        );
        setIsPermisoModificarEntrada(resultModificarEntrada);
        localStorage.setItem(
          "isPermisoModificarEntrada",
          resultModificarEntrada
        );
      } else {
        setIsPermisoModificarEntrada(
          Boolean(localStorage.getItem("isPermisoModificarEntrada"))
        );
      }

      // Cargar cambio de moneda
      if (localStorage.getItem("cambioMoneda") === null) {
        const cambioMoneda = await getValorMonedaUSD(usuario.token);
        setCambioMoneda(cambioMoneda);
        localStorage.setItem("cambioMoneda", cambioMoneda.toString());
      } else {
        setCambioMoneda(parseFloat(localStorage.getItem("cambioMoneda")));
      }
    }
  };

  const onDrop = (event: PanGestureHandlerGestureEvent) => {
    // Aquí puedes agregar la lógica para procesar los archivos
  };

  // Estado para controlar la opción seleccionada de los RadioButons de filtrado
  const [selectedOptionTipoOrden, setSelectedOptionTipoOrden] = useState<
    string | null
  >(null);

  const [tiendasByProducto, setTiendasByProducto] = useState<TiendaShowModal[]>(
    []
  );

  // Función para manejar la selección de los RadioButins de filtrado
  const handleSelectTipoOrden = (value: string) => {
    setSelectedOptionTipoOrden(value);
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
  const animatedStyleOptions = {
    height: animationValueOptions,
  };

  // Variable para filtrar items
  const [filterItems, setFilterItems] = useState<Diario[]>([]);

  const [proveedorByProducto, setProveedorByProducto] = useState<
    ProveedoresShowModal[]
  >([
    { id_proveedor: "1", nombre: "Pepe", cantidad: "12", costoPorUnidad: 20.3 },
    { id_proveedor: "2", nombre: "Juan", cantidad: "1", costoPorUnidad: 21.3 },
    {
      id_proveedor: "3",
      nombre: "Adolfo",
      cantidad: "100",
      costoPorUnidad: 20.0,
    },
    {
      id_proveedor: "4",
      nombre: "Jailer",
      cantidad: "23",
      costoPorUnidad: 22.3,
    },
    { id_proveedor: "5", nombre: "Ana", cantidad: "42", costoPorUnidad: 18.0 },
    {
      id_proveedor: "6",
      nombre: "Rodrigo",
      cantidad: "11",
      costoPorUnidad: 23.3,
    },
    {
      id_proveedor: "7",
      nombre: "Juan Lís de la Caridad Santos",
      cantidad: "20",
      costoPorUnidad: 20.3,
    },
  ]);

  const [dropdownItemsNombreProveedor, setDropDownItemsNombreProveedor] =
    useState<ProveedorPiker[]>([]);
  const [dropdownItemsNombreproducto, setDropDownItemsNombreProducto] =
    useState<ProductoPiker[]>([]);
  const [dropdownItemsNombreTienda, setDropDownItemsNombreTienda] = useState<
    TiendaPiker[]
  >([]);

  const currentDate = new Date();

  // Extraemos el año, mes y día de la fecha actual
  const year = String(currentDate.getFullYear());
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
  const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

  //Variables Para los datos de busqueda
  const [nombreProveedorSearch, setNombreProveedorSearch] = useState("");
  const [nombreProductoSearch, setNombreProductoSearch] = useState("");
  const [costoDesdeSearch, setCostoDesdeSearch] = useState("");
  const [costoHastaSearch, setCostohastaSearch] = useState("");
  const [fechaDesdeSearch, setFechaDesdeSearch] = useState(new Date());
  const [fechaHastaSearch, setFechaHastaSearch] = useState(new Date());
  const [fechaDiaDesdeSearch, setFechaDiaDesdeSearch] = useState(
    String(parseInt(day))
  );
  const [fechaMesDesdeSearch, setFechaMesdesdeSearch] = useState(
    String(parseInt(month))
  );
  const [fechaAnnoDesdeSearch, setFechaAnnoDesdeSearch] = useState(
    String(parseInt(year))
  );

  const [fechaDiaHastaSearch, setFechaDiaHastaSearch] = useState(
    String(parseInt(day))
  );
  const [fechaMesHastaSearch, setFechaMesHastaSearch] = useState(
    String(parseInt(month))
  );
  const [fechaAnnoHastaSearch, setFechaAnnoHastaSearch] = useState(
    String(parseInt(year))
  );

  // Variable visual para la carga de datos en la tabla
  const [loading, setLoading] = useState(false);

  // Opciones de radio burron para la fecha serash
  const [selecterActivoDetails, setSelecterActivoDetails] = useState("");

  const options = [
    { label: "Día", value: "dia" },
    { label: "Semana", value: "semana" },
    { label: "Mes", value: "mes" },
  ];

  const handleRadioButtonPress = (value: string) => {
    setSelecterActivoDetails(value);

    // Crear una fecha a partir de la fecha actual
    const currentDate = new Date();
    const year = String(currentDate.getFullYear());
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
    const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

    let fechaDesde: string = ``;

    // Asegúrate de que newDate se inicialice en todos los casos
    if (value === "dia") {
      fechaDesde = `${year}-${month}-${day}`;
    } else if (value === "semana") {
      // Restar 7 días a la fecha actual
      const lastWeekDate = new Date(currentDate);
      lastWeekDate.setDate(currentDate.getDate() - 6);
      const weekYear = String(lastWeekDate.getFullYear());
      const weekMonth = String(lastWeekDate.getMonth() + 1).padStart(2, "0");
      const weekDay = String(lastWeekDate.getDate()).padStart(2, "0");
      fechaDesde = `${weekYear}-${weekMonth}-${weekDay}`;
    } else if (value === "mes") {
      // Restar 1 mes a la fecha actual
      const lastMonthDate = new Date(currentDate);
      lastMonthDate.setMonth(currentDate.getMonth() - 1);
      const monthYear = String(lastMonthDate.getFullYear());
      const monthMonth = String(lastMonthDate.getMonth() + 1).padStart(2, "0");
      const monthDay = String(lastMonthDate.getDate()).padStart(2, "0");
      fechaDesde = `${monthYear}-${monthMonth}-${monthDay}`;
    } else {
      console.error("Valor no válido para el radio button:", value);
      return; // Manejo de error: si el valor no es válido, no se hace nada
    }

    // llamar al filtrar con los nuevos parametros
    filtrarYOrdenarEntradas(fechaDesde, `${year}-${month}-${day}`);
  };

  const getProveedoresPikerDetails = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllProveedores(usuario.token);

      if (result && Array.isArray(result.data)) {
        const tiendasMapeados: TiendaPiker[] = await Promise.all(
          result.data.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_proveedor,
          }))
        );

        // Agregar un valor adicional para el valor inicial
        setDropDownItemsNombreProveedor(tiendasMapeados);
      }
    }
  };

  const getProductosPikerDetails = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllProductos(usuario.token);

      if (result && Array.isArray(result.data)) {
        const tiendasMapeados: ProductoPiker[] = await Promise.all(
          result.data.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_producto,
          }))
        );

        // Agregar un valor adicional para el valor inicial
        setDropDownItemsNombreProducto(tiendasMapeados);
      }
    }
  };

  const getTiendasPikerDetails = async () => {
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
        setDropDownItemsNombreTienda([...tiendasMapeados]);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar proovedor
  const callModalAddProveedor = () => {
    setIdProveedorDetails("");
    setCostoUSDDetails("");
    setCantidadDetails("");
    setIdProductoDetails("");
    setIsFechaVencimientoDetails(false);
    setFechaVencimientoDiaDetails("");
    setFechaVencimientoMesDetails("");
    setFechaVencimientoAnnoDetails("");

    setModalEntradasDates({
      id_entrada: "",
      isAddEntrada: false,
      isModificarEntrada: false,
      fileEditable: true,
    });
  };

  const cargarDetailsOfEntradas = async () => {
    if (usuario?.token && modalEntradasDates?.id_entrada) {
      // Reinicia los datos de la fecha antes de realizar la carga de datos
      setIsDateLoaded(false); // Para asegurarte de que el componente no use los datos antiguos

      const result = await getEntradaByID(
        usuario.token,
        modalEntradasDates.id_entrada
      );

      if (result) {
        // Extraemos los datos de fecha de result.fecha
        const [year, month, day] = result.fecha.split("T")[0].split("-");

        // Actualizamos los detalles
        setIdEntradaDetails(result.id_entrada);
        setIdProveedorDetails(result.proveedor.id_proveedor);
        setIdProductoDetails(result.producto.id_producto);
        setCantidadDetails(result.cantidad);
        setIdTiendaDetails(result.tienda.id_tienda);
        setCostoUSDDetails(result.costo);
        setCostoCUPDetails(String((result.costo * cambioMoneda).toFixed(2)));

        // Actualizamos las fechas (nuevos datos)
        setFechaDiaDetails(String(parseInt(day)));
        setFechaMesDetails(String(parseInt(month)));
        setFechaAnnoDetails(String(parseInt(year)));

        if (result.fecha_vencimiento) {
          const [yearVencimiento, monthVencimiento, dayVencimiento] =
            result.fecha_vencimiento.split("T")[0].split("-");
          setFechaVencimientoDiaDetails(String(parseInt(dayVencimiento)));
          setFechaVencimientoMesDetails(String(parseInt(monthVencimiento)));
          setFechaVencimientoAnnoDetails(String(parseInt(yearVencimiento)));
        }

        // Actualizamos los valores auxiliares
        setIdProductoAuxModificarDetails(result.producto.id_producto);
        setIdTiendaAuxModificarDetails(result.tienda.id_tienda);
        setCantidadAuxModificarDetails(result.cantidad);
        setCostoAuxModificarDetails(result.costo);

        // Marcamos los datos como cargados al final del proceso
        setIsDateLoaded(true);
      }
    }
  };

  const auxiliarFunctionFilter = async (
    fechaDesde: string,
    fechaHasta: string
  ): Promise<Diario[] | null> => {
    if (usuario?.token) {
      try {
        const result = await filtrarEntrada(
          usuario.token,
          nombreProveedorSearch,
          nombreProductoSearch,
          costoDesdeSearch,
          costoHastaSearch,
          fechaDesde,
          fechaHasta
        );

        if (result) {
          const proveedoresMapeados: Diario[] = await Promise.all(
            result.map(async (element: any) => ({
              id_Entrada: element.id_entrada,
              id_Proveedor: element.proveedor.id_proveedor,
              id_Producto: element.producto.id_producto,
              nombre_Proveedor: element.proveedor.nombre,
              nombre_Producto: element.producto.nombre,
              cantidad: element.cantidad,
              costo: element.costo,
              fecha: element.fecha,
            }))
          );
          return proveedoresMapeados;
        }
      } catch (error) {
        console.error("Error al filtrar los proveedoress:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    cargarDetailsOfEntradas();
  }, [modalEntradasDates]);
  // Para filtrar y/o ordenar los datos según se halla digitado o seleccionado
  const obtenerTodosLosProveedores = async () => {
    if (usuario?.token != undefined) {
      try {
        // Obtener proovedores desde la tabla
        const result = await getAllEntradas(usuario.token);

        if (result && Array.isArray(result)) {
          // Mapeamos los proovedores y obtenemos tanto la cantidadTotal como si tienen opciones
          const proveedoresMapeados: Diario[] = await Promise.all(
            result.map(async (element: any) => {
              // Mapeamos a la interfaz Proveedor
              return {
                id_Entrada: element.id_entrada,
                id_Proveedor: element.proveedor.id_proveedor,
                id_Producto: element.producto.id_producto,
                nombre_Proveedor: element.proveedor.nombre,
                nombre_Producto: element.producto.nombre,
                cantidad: element.cantidad,
                costo: element.costo,
                fecha: element.fecha,
              };
            })
          );

          // Actualizamos el estado de filterItems con los productos mapeados
          setFilterItems(proveedoresMapeados);
        } else {
          console.log("No se encontraron entradas.");
        }
      } catch (error) {
        console.log(
          "Error al obtener las entradas o verificar permisos:",
          error
        );
        alert("Ocurrió un problema al cargar los datos de las entradas");
      }
    } else {
      alert(
        "Ocurrió un problema al obtener el token de identificación del usuario para cargar los datos de las entradas"
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      const runEffects = async () => {
        await checkPermiso();
        await obtenerTodosLosProveedores();
        getProveedoresPikerDetails();
        getProductosPikerDetails();
        getTiendasPikerDetails();
      };
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  const [auxOrdenar, setAxuOrdenar] = useState(false);

  // Filtrar y ordenar productos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarEntradas = async (
    fechaDesde: string,
    fechaHasta: string
  ) => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let EntradasFiltradas: Diario[] =
          (await auxiliarFunctionFilter(fechaDesde, fechaHasta)) || [];

        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortEntradas?.criterioOrden && sortEntradas.tipoOrden) {
          EntradasFiltradas = await ordenarEntradas(
            usuario.token,
            EntradasFiltradas,
            sortEntradas?.criterioOrden,
            auxOrdenar
          );
        } else {
          EntradasFiltradas = await ordenarEntradas(
            usuario.token,
            EntradasFiltradas,
            "option6",
            auxOrdenar
          );
        }
        // Actualizar el estado con los productos filtrados (y ordenados si corresponde)
        setFilterItems(EntradasFiltradas);
      }
    } catch (error) {
      console.error("Error al filtrar y ordenar los proovedores:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Llamar a la función cuando alguna de las dependencias cambie
    filtrarYOrdenarEntradas(
      `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
      `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
    );
  }, [sortEntradas, selectedOptionTipoOrden]);

  useEffect(() => {
    const obtenerFechaVencimiento = async () => {
      if (idProductoDetails && usuario?.token) {
        const result = await getProductoById(usuario.token, idProductoDetails);
        if (result) {
          if (modalEntradasDates?.id_entrada === "") {
            const currentDate = new Date();

            // Extraemos el año, mes y día de la fecha actual
            const year = String(currentDate.getFullYear());
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
            const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

            setFechaVencimientoDiaDetails(String(parseInt(day)));
            setFechaVencimientoMesDetails(String(parseInt(month)));
            setFechaVencimientoAnnoDetails(String(parseInt(year)));
          }
          setIsFechaVencimientoDetails(result.isFecha_Vencimiento);
        } else {
          setIsFechaVencimientoDetails(false);
        }
      }
    };

    obtenerFechaVencimiento();
  }, [idProductoDetails]);

  useEffect(() => {
    // Llamar a la función cuando alguna de las dependencias cambie
    setSelecterActivoDetails("");
  }, [
    fechaDiaDesdeSearch,
    fechaMesDesdeSearch,
    fechaAnnoDesdeSearch,
    fechaDiaHastaSearch,
    fechaMesHastaSearch,
    fechaAnnoHastaSearch,
  ]);

  const auxSetModalProovedoresDates = () => {
    setIsDateLoaded(false);
    setIdProveedorDetails("");
    setIdProductoDetails("");
    setIdTiendaDetails("");
    setCantidadDetails("");
    setCostoUSDDetails("");

    setModalEntradasDates({
      id_entrada: "",
      isAddEntrada: true,
      fileEditable: true,
      isModificarEntrada: false,
    });

    const currentDate = new Date();

    // Extraemos el año, mes y día de la fecha actual
    const year = String(currentDate.getFullYear());
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
    const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

    setFechaDiaDetails(String(parseInt(day)));
    setFechaMesDetails(String(parseInt(month)));
    setFechaAnnoDetails(String(parseInt(year)));

    setIsDateLoaded(true);
  };

  // Función para cuando precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      // Aquí ejecutas la función que deseas
      filtrarYOrdenarEntradas(
        `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
        `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
      );
    }
  };

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreProveedorSearch("");
    setNombreProductoSearch("");
    setCostoDesdeSearch("");
    setCostohastaSearch("");
    setSelectedOptionTipoOrden("");
  };
  // Retorna el Promedio ponderado
  const calcularCPP = (
    cant_existencia: number,
    CPP_anterior: number,
    cant_i: number,
    costoUnidad_i: number
  ) => {
    const cpp =
      (cant_existencia * CPP_anterior + cant_i * costoUnidad_i) /
      (cant_existencia + cant_i);
    return cpp.toFixed(5);
  };
  const calcularCPPAjustado = (
    cant_existencia: number,
    CPP_anterior: number,
    diferencia: number
  ) => {
    const cpp = (cant_existencia * CPP_anterior + diferencia) / cant_existencia;
    return cpp.toFixed(5);
  };

  // Método para agregar un nuevo producto al sistema
  const addNewEntrada = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Agregando entrada. Espere por favor");
    setModalMensajeView(true);
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL INGRESAR ENTRADA. Por favor verifique los siguientes campos:\n";

      if (idProveedorDetails === "") {
        flag = false;
        validarCampos += "-Seleccione un proveedor.\n";
      }
      if (idProductoDetails === "") {
        flag = false;
        validarCampos += "-Seleccione un producto.\n";
      }
      if (idTiendaDetails === "") {
        flag = false;
        validarCampos += "-Seleccione una tienda.\n";
      }
      if (cantidadDetails === "") {
        flag = false;
        validarCampos += "-Ingrese una cantidad.\n";
      }
      if (costoUSDDetails === "") {
        flag = false;
        validarCampos += "-Ingrese el costo total de la entrada.\n";
      }

      if (flag) {
        await addEntrada(
          usuario.token,
          costoUSDDetails,
          cantidadDetails,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          isFechaVencimientoDetails
            ? `${fechaVencimientoMesDetails}-${fechaVencimientoDiaDetails}-${fechaVencimientoAnnoDetails}`
            : null,
          parseInt(idProveedorDetails),
          parseInt(idProductoDetails),
          parseInt(idTiendaDetails),
          parseFloat(costoCUPDetails)
        );

        setModalMensaje("Actualizando costo promedio ponderado del producto");
        // Actualizar costo promedio ponderado CPP
        // Obtener datos necezarios
        const productoData = await getProductoById(
          usuario.token,
          idProductoDetails
        );
        const cantidadExistencia = await getProductoCantidadTotal(
          usuario.token,
          idProductoDetails
        );
        const cpp = calcularCPP(
          cantidadExistencia,
          productoData.costo_acumulado,
          parseInt(cantidadDetails),
          parseFloat(costoUSDDetails) / parseInt(cantidadDetails)
        );
        await updateProductoCostoAcumulado(
          usuario.token,
          idProductoDetails,
          cpp
        );

        setModalMensaje("Actualizando cantidad en tienda");
        await addProductoEntrada(
          usuario.token,
          parseInt(idTiendaDetails),
          parseInt(idProductoDetails),
          parseInt(cantidadDetails)
        );

        setModalMensaje("Agregando acción");
        // Agregar Acción de usuario agregar proveedor
        const nombreTienda = dropdownItemsNombreTienda.find((element) => {
          return element.value === idTiendaDetails;
        });
        const nombreProducto = dropdownItemsNombreproducto.find((element) => {
          return element.value === idProductoDetails;
        });
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó una entrada de ${cantidadDetails} del producto ${nombreProducto?.label} en la tienda ${nombreTienda?.label}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          4
        );

        await createProductoInTienda(
          usuario.token,
          idProductoDetails,
          idTiendaDetails
        );
        setIdProveedorDetails("");
        setIdProductoDetails("");
        setIdTiendaDetails("");
        setCostoUSDDetails("");
        setCantidadDetails("");
        setModalEntradasDates({
          id_entrada: "",
          isAddEntrada: false,
          fileEditable: true,
          isModificarEntrada: false,
        });
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`La entrada fue insertado con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Método para actualizar los datos de un producto
  const modificarEntradaFunction = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Modificando entrada. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL MODIFICAR ENTRADA. Compruebe los siguientes campos:\n";
      const resultNuevo = await isProductoInTienda(
        usuario.token,
        idProductoDetails,
        idTiendaDetails
      );
      const resultViejo = await isProductoInTienda(
        usuario.token,
        idProductoAuxModificarDetails,
        idTiendaAuxModificarDetails
      );

      if (
        idTiendaAuxModificarDetails !== idTiendaDetails ||
        idProductoAuxModificarDetails !== idProductoDetails
      ) {
        if (
          parseInt(resultViejo.cantidad ?? 0) -
            parseInt(cantidadAuxModificarDetails) <
          0
        ) {
          flag = false;
          validarCampos +=
            "-Operación inválida. No se dispone de sificientes productos para realizar la operoción.";
        }
      }
      if (
        parseInt(cantidadAuxModificarDetails) - parseInt(cantidadDetails) >
        parseInt(resultNuevo.cantidad ?? 0)
      ) {
        flag = false;
        validarCampos += `-Operación inválida. La cantidad del producto excede la cantidad en la tienda\n.`;
      }
      if (idProveedorDetails === "") {
        flag = false;
        validarCampos += "-Seleccione un proveedor.\n";
      }
      if (idProductoDetails === "") {
        flag = false;
        validarCampos += "-Seleccione un producto.\n";
      }
      if (idTiendaDetails === "") {
        flag = false;
        validarCampos += "-Seleccione una tienda.\n";
      }
      if (cantidadDetails === "") {
        flag = false;
        validarCampos += "-Ingrese una cantidad.\n";
      }
      if (costoUSDDetails === "") {
        flag = false;
        validarCampos += "-Ingrese el costo del producto por unidad.\n";
      }

      if (flag) {
        await modificarEntrada(
          usuario.token,
          idEntradaDetails,
          costoUSDDetails,
          cantidadDetails,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          isFechaVencimientoDetails
            ? `${fechaVencimientoMesDetails}-${fechaVencimientoDiaDetails}-${fechaVencimientoAnnoDetails}`
            : null,
          parseInt(idProveedorDetails),
          parseInt(idProductoDetails),
          parseInt(idTiendaDetails),
          parseFloat(costoCUPDetails)
        );

        setModalMensaje("Actualizando costo promedio ponderado del producto");

        // Obtener datos necesarios
        const productoData = await getProductoById(
          usuario.token,
          idProductoDetails
        );

        const cantidadExistencia = await getProductoCantidadTotal(
          usuario.token,
          idProductoDetails
        );

        // Verificar valores de costo unitario
        const costoUnitarioNuevo =
          parseFloat(costoUSDDetails) / parseInt(cantidadDetails);
        const costoUnitarioOriginal =
          parseFloat(costoAuxModificarDetails) /
          parseInt(cantidadAuxModificarDetails);

        // Calcular la diferencia en el costo total
        const diferenciaCostoTotal =
          (costoUnitarioNuevo - costoUnitarioOriginal) *
          parseFloat(cantidadAuxModificarDetails);

        // Ajustar el costo acumulado
        const costoAcumuladoActual =
          cantidadExistencia * productoData.costo_acumulado;

        const nuevoCostoAcumulado = costoAcumuladoActual + diferenciaCostoTotal;

        // Calcular el nuevo CPP
        const nuevoCPP = nuevoCostoAcumulado / cantidadExistencia;

        // Actualizar el CPP en la base de datos
        await updateProductoCostoAcumulado(
          usuario.token,
          idProductoDetails,
          nuevoCPP.toFixed(5)
        );

        if (
          idTiendaAuxModificarDetails !== idTiendaDetails ||
          idProductoAuxModificarDetails !== idProductoDetails
        ) {
          await addProductoEntrada(
            usuario.token,
            parseInt(idTiendaAuxModificarDetails),
            parseInt(idProductoAuxModificarDetails),
            parseInt(cantidadAuxModificarDetails) * -1
          );

          await addProductoEntrada(
            usuario.token,
            parseInt(idTiendaDetails),
            parseInt(idProductoDetails),
            parseInt(cantidadDetails)
          );
        } else if (cantidadAuxModificarDetails !== cantidadDetails) {
          await addProductoEntrada(
            usuario.token,
            parseInt(idTiendaDetails),
            parseInt(idProductoDetails),
            parseInt(cantidadDetails) - parseInt(cantidadAuxModificarDetails)
          );
        }

        // Agregar Acción de usuario agregar proveedor
        const nombreTienda = dropdownItemsNombreTienda.find((element) => {
          return element.value === idTiendaAuxModificarDetails;
        });
        const nombreProducto = dropdownItemsNombreproducto.find((element) => {
          return element.value === idProductoAuxModificarDetails;
        });
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} modificó una entrada de originalmente ${cantidadAuxModificarDetails} del producto ${nombreProducto?.label} en la tienda ${nombreTienda?.label}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          4
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`La entrada se modificó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Método para eliminar los datos de un producto
  const eliminarEntradaFunction = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Eliminando entrada. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL ELIMINAR ENTRADA. Compruebe los siguientes parámetros:\n";
      const resultNuevo = await isProductoInTienda(
        usuario.token,
        idProductoDetails,
        idTiendaDetails
      );

      if (parseInt(cantidadDetails) > parseInt(resultNuevo.cantidad ?? 0)) {
        flag = false;
        validarCampos += `-Operación inválida. La cantidad del producto excede la cantidad en la tienda\n.`;
      }

      if (flag) {
        await deleteEntrada(usuario.token, idEntradaDetails);

        await addProductoEntrada(
          usuario.token,
          parseInt(idTiendaDetails),
          parseInt(idProductoDetails),
          parseInt(cantidadDetails) * -1
        );

        // Actualizar productos en 0 en productoTienda
        await deleteFromProductoTiendaIn_0(usuario.token);

        // Agregar Acción de usuario agregar proveedor

        const nombreTienda = dropdownItemsNombreTienda.find((element) => {
          return element.value === idTiendaAuxModificarDetails;
        });
        const nombreProducto = dropdownItemsNombreproducto.find((element) => {
          return element.value === idProductoAuxModificarDetails;
        });
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó la entrada con una cantidad de ${cantidadAuxModificarDetails} del producto ${nombreProducto?.label} en la tienda ${nombreTienda?.label}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          4
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`La entrada se eliminó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setIdProveedorDetails("");
        setCostoUSDDetails("");
        setIdProductoDetails("");
        setCantidadDetails("");
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = [
    "Nombre Proveedor",
    "Nombre Producto",
    "Cantidad",
    "Costo Total USD",
    "Costo Total CUP",
    "Fecha",
  ];
  const columnasMyDateTableTiendaModal = ["Nombre", "Cantidad"];
  const columnasMyDateTableProveedorModal = [
    "Nombre",
    "Correo",
    "Detalle Bancario",
    "Teléfono",
  ];

  const columnasMyDateTableMovil = [
    "Nombre Proveedor",
    "Nombre Producto",
    "Cantidad",
    "Costo Total USD",
    "Costo Total CUP",
    "Fecha",
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
          {isPermisoAgregarEntrada && (
            <TouchableOpacity
              onPress={() => auxSetModalProovedoresDates()}
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
              <Text style={styles.radioButtonTextMovil}>Agregar Entrada</Text>
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
            <MyDateTableDiario
              isMobile={isMobile}
              items={filterItems}
              columns={columnasMyDateTable}
              columnasMyDateTableEntradaModal={
                columnasMyDateTableProveedorModal
              }
              columnasMyDateTableTiendaModal={columnasMyDateTableTiendaModal}
              tiendasByProducto={tiendasByProducto}
              proveedorByProducto={proveedorByProducto}
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
                  <Text style={styles.textSearchDesktop}>
                    Nombre del Producto:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullDesktop}
                    placeholder="Nombre del Producto"
                    value={nombreProductoSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setNombreProductoSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchDesktop}>
                    Nombre del Proveedor:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullDesktop}
                    placeholder="Nombre del proveedor"
                    onKeyPress={handleKeyPress}
                    value={nombreProveedorSearch}
                    onChangeText={setNombreProveedorSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>
                    Rango de Costo en USD:
                  </Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Desde"
                      value={idProductoDetails}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setIdProductoDetails(numericValue);
                      }}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Hasta"
                      value={idProductoDetails}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setIdProductoDetails(numericValue);
                      }}
                    />
                  </View>

                  <View style={styles.separatorBlanco} />

                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      width: "60%",
                      marginLeft: "18%",
                      position: "relative",
                      zIndex: 1000,
                    }}
                  >
                    {options.map((option) => (
                      <CustomRadioButton
                        key={option.value}
                        label={option.label}
                        selected={selecterActivoDetails === option.value}
                        onPress={() => handleRadioButtonPress(option.value)}
                      />
                    ))}
                  </View>

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      position: "relative",
                      zIndex: 1000,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.blanco,
                        fontSize: 18,
                        justifyContent: "center",
                        marginRight: "25%",
                        fontWeight: "bold", // Para negritas
                        textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                        textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                        textShadowRadius: 2, // Difuminado de la sombra
                      }}
                    >
                      Desde
                    </Text>
                    <Text
                      style={{
                        color: Colors.blanco,
                        fontSize: 18,
                        marginLeft: "12%",
                        justifyContent: "center",
                        fontWeight: "bold", // Para negritas
                        textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                        textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                        textShadowRadius: 2, // Difuminado de la sombra
                      }}
                    >
                      Hasta
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      position: "relative",
                      zIndex: 500,
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: capaPrioridadFechaDesdeSearsh,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.blanco,
                          fontSize: 18,
                          justifyContent: "center",
                          fontWeight: "bold", // Para negritas
                          textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                          textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                          textShadowRadius: 2, // Difuminado de la sombra
                        }}
                      >
                        Desde
                      </Text>
                      <MyDateInput
                        dayValue={fechaDiaDesdeSearch}
                        monthValue={fechaMesDesdeSearch}
                        yearValue={fechaAnnoDesdeSearch}
                        onDayChange={setFechaDiaDesdeSearch}
                        onMonthChange={setFechaMesdesdeSearch}
                        onYearChange={setFechaAnnoDesdeSearch}
                        style={{ margin: 20 }}
                        styleText={styles.textSearchMovil}
                        onDropdownOpen={() =>
                          controlarCapas("FechaDesdeSearsh")
                        }
                      />
                    </View>

                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: capaPrioridadFechaHastaSearsh,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.blanco,
                          fontSize: 18,
                          justifyContent: "center",
                          fontWeight: "bold", // Para negritas
                          textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                          textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                          textShadowRadius: 2, // Difuminado de la sombra
                        }}
                      >
                        Hasta
                      </Text>
                      <MyDateInput
                        dayValue={fechaDiaHastaSearch}
                        monthValue={fechaMesHastaSearch}
                        yearValue={fechaAnnoHastaSearch}
                        onDayChange={setFechaDiaHastaSearch}
                        onMonthChange={setFechaMesHastaSearch}
                        onYearChange={setFechaAnnoHastaSearch}
                        style={{ margin: 20 }}
                        styleText={styles.textSearchMovil}
                        onDropdownOpen={() =>
                          controlarCapas("FechaHastaSearsh")
                        }
                      />
                    </View>
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
          visible={modalEntradasDates?.isAddEntrada ?? false}
          animationType="fade"
          onRequestClose={callModalAddProveedor}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 4000, // Asegúrate de que el zIndex sea alto
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
                onPress={callModalAddProveedor}
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
                {modalEntradasDates?.id_entrada === ""
                  ? "Agregar Entrada"
                  : "Datos de la Entrada"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Proveedor */}
                <View
                  style={{ width: "100%", zIndex: 2000, position: "relative" }}
                >
                  <Text style={styles.labelTextModalMovil}>
                    Nombre del Proveedor
                  </Text>
                </View>
                <View
                  style={{ width: "100%", zIndex: 2000, position: "relative" }}
                >
                  <CustomDropdownDetails
                    value={idProveedorDetails}
                    placeholder="Seleccione un Proveedor"
                    setValue={setIdProveedorDetails}
                    items={dropdownItemsNombreProveedor}
                    searchable={true}
                    onDropdownOpen={() => controlarCapas("ProveedoresDetails")}
                  />
                </View>

                {/* Nombre del Producto */}
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadProductosDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.labelTextModalMovil}>
                    Nombre del Producto
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadProductosDetails,
                    position: "relative",
                  }}
                >
                  <CustomDropdownDetails
                    value={idProductoDetails}
                    placeholder="Seleccione un Producto"
                    setValue={setIdProductoDetails}
                    items={dropdownItemsNombreproducto}
                    searchable={true}
                    onDropdownOpen={() => controlarCapas("ProductosDetails")}
                  />
                </View>

                {/* Nombre de la Tienda */}
                <View
                  style={{ width: "100%", zIndex: 1000, position: "relative" }}
                >
                  <Text style={styles.labelTextModalMovil}>
                    Nombre de la Tienda
                  </Text>
                </View>
                <View
                  style={{ width: "100%", zIndex: 1000, position: "relative" }}
                >
                  <CustomDropdownDetails
                    value={idTiendaDetails}
                    placeholder="Seleccione una Tienda"
                    setValue={setIdTiendaDetails}
                    items={dropdownItemsNombreTienda}
                    searchable={true}
                  />
                </View>

                {/* Contenedor para la cantidad y el costo */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Cantidad */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalMovil}>Cantidad</Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={cantidadDetails}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setCantidadDetails(numericValue);
                      }}
                      editable={isPermisoModificarEntrada ? true : false}
                      placeholder="Cantidad"
                    />
                  </View>

                  {/* Campo Costo */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalMovil}>
                      Costo total de la entrada en USD
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={costoUSDDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setCostoUSDDetails(validNumericValue);
                        const costoCUP =
                          parseFloat(validNumericValue) * cambioMoneda;
                        setCostoCUPDetails(costoCUP.toFixed(2));
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarEntrada ? true : false}
                      placeholder="Costo en USD"
                    />
                  </View>
                </View>

                {/*  */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Costo de cada unidad
                    </Text>
                    <Text style={styles.labelTextModalDesktop}>
                      USD:{" "}
                      {(
                        parseFloat(costoUSDDetails) / parseInt(cantidadDetails)
                      ).toFixed(5)}{" "}
                      CUP:{" "}
                      {(
                        (parseFloat(costoUSDDetails) /
                          parseInt(cantidadDetails)) *
                        cambioMoneda
                      ).toFixed(2)}
                    </Text>
                  </View>

                  {/* Campo Costo */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalMovil}>
                      Costo total de la entrada en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={costoCUPDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setCostoCUPDetails(validNumericValue);
                        const costoUSD =
                          parseFloat(validNumericValue) / cambioMoneda;
                        setCostoUSDDetails(costoUSD.toFixed(5));
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarEntrada ? true : false}
                      placeholder="Costo en CUP"
                    />
                  </View>
                </View>

                <View
                  style={{ width: "90%", marginLeft: "2%", marginRight: "2%" }}
                >
                  <Text style={styles.labelTextModalMovil}>Fecha</Text>
                  {isDateLoaded && (
                    <MyDateInput
                      dayValue={fechaDiaDetails}
                      monthValue={fechaMesDetails}
                      yearValue={fechaAnnoDetails}
                      onDayChange={setFechaDiaDetails}
                      onMonthChange={setFechaMesDetails}
                      onYearChange={setFechaAnnoDetails}
                      style={{ margin: 20 }}
                      styleText={styles.labelTextModalMovil}
                    />
                  )}
                </View>

                {/* Campo fecha vencimiento */}
                {isFechaVencimientoDetails && (
                  <View
                    style={{
                      width: "90%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Fecha vencimiento
                    </Text>
                    {isDateLoaded && (
                      <MyDateInputVencimiento
                        dayValue={fechaVencimientoDiaDetails}
                        monthValue={fechaVencimientoMesDetails}
                        yearValue={fechaVencimientoAnnoDetails}
                        onDayChange={setFechaVencimientoDiaDetails}
                        onMonthChange={setFechaVencimientoMesDetails}
                        onYearChange={setFechaVencimientoAnnoDetails}
                        style={{ margin: 20 }}
                        styleText={styles.labelTextModalDesktop}
                        onDropdownOpen={() => controlarCapas("FechaDetails")}
                      />
                    )}
                  </View>
                )}

                {/*btones para agregar, modificar o elminiar según corresponda */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    width: "100%",
                    justifyContent: "space-between",
                    marginTop: 20, // Espacio superior adicional
                  }}
                >
                  {/* Botón para modificar entrada */}
                  {isPermisoModificarEntrada &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Oscuro,
                          borderRadius: 15,
                          width: "40%", // Ancho fijo para pantallas de escritorio
                          height: 50, // Altura fija para pantallas de escritorio
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "5%",
                          shadowColor: "#000",
                          shadowOffset: { width: 3, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                          marginTop: "3%", // Margen adicional entre botones
                        }}
                        onPress={() => {
                          setIsModalChekVisible(true);
                          setMesajeModalChek(
                            `¿Estás seguro que deseas MODIFICAR los datos de esta entrada?`
                          );
                        }}
                        disabled={isButtonDisabled}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Ajustar Entrada
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar entrada */}
                  {isPermisoAgregarEntrada &&
                    modalEntradasDates?.id_entrada === "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Claro,
                          borderRadius: 15,
                          width: "40%", // Ancho fijo para pantallas de escritorio
                          height: 50, // Altura fija para pantallas de escritorio
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          marginLeft: "5%",
                          shadowOffset: { width: 3, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                          marginTop: "3%", // Margen adicional entre botones
                        }}
                        onPress={() => addNewEntrada()}
                        disabled={isButtonDisabled}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Entrada
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para eliminar proveedor */}
                  {false && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.rojo_oscuro,
                        borderRadius: 15,
                        width: "40%", // Ancho fijo para pantallas de escritorio
                        height: 50, // Altura fija para pantallas de escritorio
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#000",
                        marginRight: "5%",
                        shadowOffset: { width: 3, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        marginTop: "3%", // Margen adicional entre botones
                      }}
                      onPress={() => {
                        setIsModalChekVisible(true);
                        setIsModalChekEliminarEntrada(true);
                        setMesajeModalChek(
                          `¿Estás seguro que deseas ELIMINAR al esta entrada?`
                        );
                        setModalEntradasDates({
                          id_entrada: "",
                          isAddEntrada: false,
                          isModificarEntrada: false,
                          fileEditable: true,
                        });
                      }}
                      disabled={isButtonDisabled}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                        }}
                      >
                        Eliminar Entrada
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal para confimar*/}
        <Modal
          transparent={true}
          visible={isModalChekVisible}
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
                height: 200,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
                justifyContent: "center",
                alignItems: "stretch", // Cambiar a stretch para ocupar todo el ancho
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                {mesajeModalChek}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between", // Espacio entre los botones
                  width: "100%", // Asegurarse de que el contenedor ocupe todo el ancho
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.rojo_oscuro,
                    padding: 10,
                    borderRadius: 8,
                    width: "48%", // Ajusta el ancho de los botones
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => modificarEntradaFunction()}
                >
                  <Text style={{ color: "white" }}>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.azul_Oscuro,
                    padding: 10,
                    borderRadius: 8,
                    width: "48%", // Ajusta el ancho de los botones
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => setIsModalChekVisible(!isModalChekVisible)}
                >
                  <Text style={{ color: "white" }}>No</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setIsModalChekVisible(!isModalChekVisible)}
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
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
                width: 250,
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
                      ? navigation.replace("Entradas")
                      : setModalMensajeView(!isModalMensajeView)
                  }
                >
                  <Text style={{ color: "white" }}>Aceptar</Text>
                </TouchableOpacity>
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
          {isPermisoAgregarEntrada && (
            <TouchableOpacity
              onPress={() => auxSetModalProovedoresDates()}
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
                marginTop: "1%",
                marginHorizontal: "1%",
                backgroundColor: Colors.azul_Claro, // Color de fondo del botón
              }}
            >
              <Text
                style={[
                  styles.radioButtonTextDesktop,
                  selectedOptionTipoOrden === "option1" &&
                    styles.radioButtonSelected &&
                    styles.radioButtonTextSelected,
                ]}
              >
                Agregar Entrada
              </Text>
            </TouchableOpacity>
          )}
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
            <Text style={styles.textSearchDesktop}>Nombre del Producto:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del Producto"
              value={nombreProductoSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreProductoSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Nombre del Proveedor:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del proveedor"
              value={nombreProveedorSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreProveedorSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Rango de Costo en USD:</Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Desde"
                value={costoDesdeSearch}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCostoDesdeSearch(numericValue);
                }}
              />
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Hasta"
                value={costoHastaSearch}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCostohastaSearch(numericValue);
                }}
              />
            </View>

            <View style={styles.separatorBlanco} />

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                width: "60%",
                marginLeft: "18%",
                position: "relative",
                zIndex: 1000,
              }}
            >
              {options.map((option) => (
                <CustomRadioButton
                  key={option.value}
                  label={option.label}
                  selected={selecterActivoDetails === option.value}
                  onPress={() => handleRadioButtonPress(option.value)}
                />
              ))}
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "space-around",
                position: "relative",
                zIndex: 1000,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  zIndex: capaPrioridadFechaDesdeSearsh,
                }}
              >
                <Text
                  style={{
                    color: Colors.blanco,
                    fontSize: 18,
                    justifyContent: "center",
                    fontWeight: "bold", // Para negritas
                    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                    textShadowRadius: 2, // Difuminado de la sombra
                  }}
                >
                  Desde
                </Text>
                <MyDateInput
                  dayValue={fechaDiaDesdeSearch}
                  monthValue={fechaMesDesdeSearch}
                  yearValue={fechaAnnoDesdeSearch}
                  onDayChange={setFechaDiaDesdeSearch}
                  onMonthChange={setFechaMesdesdeSearch}
                  onYearChange={setFechaAnnoDesdeSearch}
                  style={{ margin: 20 }}
                  styleText={styles.textSearchDesktop}
                  onDropdownOpen={() => controlarCapas("FechaDesdeSearsh")}
                />
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  zIndex: capaPrioridadFechaHastaSearsh,
                }}
              >
                <Text
                  style={{
                    color: Colors.blanco,
                    fontSize: 18,
                    justifyContent: "center",
                    fontWeight: "bold", // Para negritas
                    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                    textShadowRadius: 2, // Difuminado de la sombra
                  }}
                >
                  Hasta
                </Text>
                <MyDateInput
                  dayValue={fechaDiaHastaSearch}
                  monthValue={fechaMesHastaSearch}
                  yearValue={fechaAnnoHastaSearch}
                  onDayChange={setFechaDiaHastaSearch}
                  onMonthChange={setFechaMesHastaSearch}
                  onYearChange={setFechaAnnoHastaSearch}
                  style={{ margin: 20 }}
                  styleText={styles.textSearchDesktop}
                  onDropdownOpen={() => controlarCapas("FechaHastaSearsh")}
                />
              </View>
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                position: "relative",
                zIndex: 500,
              }}
            >
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
                  onPress={() =>
                    filtrarYOrdenarEntradas(
                      `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
                      `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
                    )
                  }
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
            <MyDateTableDiario
              isMobile={isMobile}
              items={filterItems}
              columns={columnasMyDateTable}
              columnasMyDateTableEntradaModal={
                columnasMyDateTableProveedorModal
              }
              columnasMyDateTableTiendaModal={columnasMyDateTableTiendaModal}
              tiendasByProducto={tiendasByProducto}
              proveedorByProducto={proveedorByProducto}
            />
          )}
        </View>

        <Modal
          transparent={true}
          visible={modalEntradasDates?.isAddEntrada ?? false}
          animationType="fade"
          onRequestClose={callModalAddProveedor}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 5000, // Asegúrate de que el zIndex sea alto
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
                onPress={callModalAddProveedor}
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
                {modalEntradasDates?.id_entrada === ""
                  ? "Agregar Entrada"
                  : "Datos de la Entrada"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Proveedor */}
                <View
                  style={{ width: "100%", zIndex: 2000, position: "relative" }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Proveedor
                  </Text>
                </View>
                <View
                  style={{ width: "100%", zIndex: 2000, position: "relative" }}
                >
                  <CustomDropdownDetails
                    value={idProveedorDetails}
                    placeholder="Seleccione un Proveedor"
                    setValue={setIdProveedorDetails}
                    items={dropdownItemsNombreProveedor}
                    searchable={true}
                    onDropdownOpen={() => controlarCapas("ProveedoresDetails")}
                  />
                </View>

                {/* Nombre del Producto */}
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadProductosDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Producto
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadProductosDetails,
                    position: "relative",
                  }}
                >
                  <CustomDropdownDetails
                    value={idProductoDetails}
                    placeholder="Seleccione un Producto"
                    setValue={setIdProductoDetails}
                    items={dropdownItemsNombreproducto}
                    searchable={true}
                    onDropdownOpen={() => controlarCapas("ProductosDetails")}
                  />
                </View>

                {/* Nombre de la Tienda */}
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadTiendasDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre de la Tienda
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadTiendasDetails,
                    position: "relative",
                  }}
                >
                  <CustomDropdownDetails
                    value={idTiendaDetails}
                    placeholder="Seleccione una Tienda"
                    setValue={setIdTiendaDetails}
                    items={dropdownItemsNombreTienda}
                    searchable={true}
                    onDropdownOpen={() => controlarCapas("TiendaDetails")}
                  />
                </View>

                {/* Contenedor para la cantidad y el costo */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Cantidad */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>Cantidad</Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={cantidadDetails}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setCantidadDetails(numericValue);
                      }}
                      editable={isPermisoModificarEntrada ? true : false}
                      placeholder="Cantidad"
                    />
                  </View>

                  {/* Campo Costo */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Costo total de la entrada en USD
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={costoUSDDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setCostoUSDDetails(validNumericValue);
                        const costoCUP =
                          parseFloat(validNumericValue) * cambioMoneda;
                        setCostoCUPDetails(costoCUP.toFixed(2));
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarEntrada ? true : false}
                      placeholder="Costo en USD"
                    />
                  </View>
                </View>

                {/* Contenedor para la texto costo por unidad y el costo CUP */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo texto costo por unidad */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Costo de cada unidad
                    </Text>
                    <Text style={styles.labelTextModalDesktop}>
                      USD:{" "}
                      {(
                        parseFloat(costoUSDDetails) / parseInt(cantidadDetails)
                      ).toFixed(5)}{" "}
                      CUP:{" "}
                      {(
                        (parseFloat(costoUSDDetails) /
                          parseInt(cantidadDetails)) *
                        cambioMoneda
                      ).toFixed(5)}
                    </Text>
                  </View>

                  {/* Campo Costo */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Costo total de la entrada en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={costoCUPDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setCostoCUPDetails(validNumericValue);
                        const costoUSD =
                          parseFloat(validNumericValue) / cambioMoneda;
                        setCostoUSDDetails(costoUSD.toFixed(5));
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarEntrada ? true : false}
                      placeholder="Costo en CUP"
                    />
                  </View>
                </View>

                {/* Contenedor para la fecha */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    zIndex: capaPrioridadFechaDetails,
                  }}
                >
                  {/* Campo fecha entrada */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Fecha entrada
                    </Text>
                    {isDateLoaded && (
                      <MyDateInput
                        dayValue={fechaDiaDetails}
                        monthValue={fechaMesDetails}
                        yearValue={fechaAnnoDetails}
                        onDayChange={setFechaDiaDetails}
                        onMonthChange={setFechaMesDetails}
                        onYearChange={setFechaAnnoDetails}
                        style={{ margin: 20 }}
                        styleText={styles.labelTextModalDesktop}
                        onDropdownOpen={() => controlarCapas("FechaDetails")}
                      />
                    )}
                  </View>

                  {/* Campo fecha vencimiento */}
                  {isFechaVencimientoDetails && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        Fecha vencimiento
                      </Text>
                      {isDateLoaded && (
                        <MyDateInputVencimiento
                          dayValue={fechaVencimientoDiaDetails}
                          monthValue={fechaVencimientoMesDetails}
                          yearValue={fechaVencimientoAnnoDetails}
                          onDayChange={setFechaVencimientoDiaDetails}
                          onMonthChange={setFechaVencimientoMesDetails}
                          onYearChange={setFechaVencimientoAnnoDetails}
                          style={{ margin: 20 }}
                          styleText={styles.labelTextModalDesktop}
                          onDropdownOpen={() => controlarCapas("FechaDetails")}
                        />
                      )}
                    </View>
                  )}
                </View>

                {/*btones para agregar, modificar o elminiar según corresponda */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    width: "100%",
                    justifyContent: "space-between",
                    marginTop: 20, // Espacio superior adicional
                  }}
                >
                  {/* Botón para modificar proveedor */}
                  {isPermisoModificarEntrada &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Oscuro,
                          borderRadius: 15,
                          width: "30%", // Ancho fijo para pantallas de escritorio
                          height: 50, // Altura fija para pantallas de escritorio
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: "5%",
                          shadowColor: "#000",
                          shadowOffset: { width: 3, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                          marginTop: "3%", // Margen adicional entre botones
                        }}
                        onPress={() => {
                          setIsModalChekVisible(true);
                          setIsModalChekEliminarEntrada(false);
                          setMesajeModalChek(
                            `¿Estás seguro que deseas MODIFICAR los datos de esta entrada?`
                          );
                        }}
                        disabled={isButtonDisabled}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Ajustar Entrada
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarEntrada &&
                    modalEntradasDates?.id_entrada === "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Claro,
                          borderRadius: 15,
                          width: "30%", // Ancho fijo para pantallas de escritorio
                          height: 50, // Altura fija para pantallas de escritorio
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          marginLeft: "5%",
                          shadowOffset: { width: 3, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                          marginTop: "3%", // Margen adicional entre botones
                        }}
                        onPress={() => addNewEntrada()}
                        disabled={isButtonDisabled}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Entrada
                        </Text>
                      </TouchableOpacity>
                    )}
                  {/* Botón para eliminar proveedor */}
                  {false && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.rojo_oscuro,
                        borderRadius: 15,
                        width: "30%", // Ancho fijo para pantallas de escritorio
                        height: 50, // Altura fija para pantallas de escritorio
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#000",
                        marginRight: "5%",
                        shadowOffset: { width: 3, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        marginTop: "3%", // Margen adicional entre botones
                      }}
                      onPress={() => {
                        setIsModalChekVisible(true);
                        setIsModalChekEliminarEntrada(true);
                        setMesajeModalChek(
                          `¿Estás seguro que deseas ELIMINAR al esta entrada?`
                        );
                        setModalEntradasDates({
                          id_entrada: "",
                          isAddEntrada: false,
                          isModificarEntrada: false,
                          fileEditable: true,
                        });
                      }}
                      disabled={isButtonDisabled}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                        }}
                      >
                        Eliminar Entrada
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal para confimar*/}
        <Modal
          transparent={true}
          visible={isModalChekVisible}
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
                height: 200,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
                justifyContent: "center",
                alignItems: "stretch", // Cambiar a stretch para ocupar todo el ancho
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                {mesajeModalChek}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between", // Espacio entre los botones
                  width: "100%", // Asegurarse de que el contenedor ocupe todo el ancho
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.rojo_oscuro,
                    padding: 10,
                    borderRadius: 8,
                    width: "48%", // Ajusta el ancho de los botones
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    isModalChekEliminarEntrada
                      ? eliminarEntradaFunction()
                      : modificarEntradaFunction()
                  }
                >
                  <Text style={{ color: "white" }}>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.azul_Oscuro,
                    padding: 10,
                    borderRadius: 8,
                    width: "48%", // Ajusta el ancho de los botones
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => setIsModalChekVisible(!isModalChekVisible)}
                >
                  <Text style={{ color: "white" }}>No</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setIsModalChekVisible(!isModalChekVisible)}
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
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
                      ? navigation.replace("Entradas")
                      : setModalMensajeView(!isModalMensajeView)
                  }
                >
                  <Text style={{ color: "white" }}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
