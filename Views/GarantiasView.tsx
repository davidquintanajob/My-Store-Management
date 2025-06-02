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
import {
  getAllTiendas,
  getCantidadProductoInTiendaEspecifica,
  isProductoInTienda,
  tienda_Realizarventa,
} from "../services/TiendaServices";
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
  getAllEntradasByProductoId,
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
  updateProductoTienda,
} from "../services/ProductoServices";
import { ProductoPiker } from "../components/MyDateTableProductos";
import { useModalEntradasDates } from "../contexts/AuxiliarContextModalEntradas";
import { MyDateInput } from "../components/MyDateInput";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import {
  addServicio,
  deleteServicio,
  filtrarSrvicio,
  getAllServicios,
  getServicioByID,
  modificarServicio,
  ordenarServicios,
} from "../services/ServiciosServices";
import CustomDropdown from "../components/CustomDropDownPicker";
import { getAllTipoServicios } from "../services/TipoServiciosServices";
import { getAllClientes } from "../services/clienteServices";
import {
  addVenta,
  deleteVenta,
  getAllVentas,
  getVentaByIDOfServicio,
} from "../services/ventasServices";
import { useSortServicios } from "../contexts/AuxiliarSortServicios";
import { getValorMonedaUSD } from "../services/MonedaService";
import CustomRadioButton from "../components/CustomRadioButtonsSearch";
import {
  Garantia,
  MyDateTableGarantias,
} from "../components/MyDateTableGarantias";
import {
  deleteGarantia,
  filtrarGarantia,
  getAllGarantias,
  getGarantiaByID,
  modificarGarantia,
} from "../services/GarantiaServices";

export default function GarantiasView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  // Variables para cntrolar las capas visuales de las listas desplegables
  const [capaPrioridadFechaDetails, setCapaPrioridadFechaDetails] =
    useState(1000);
  const [capaPrioridadTiendasDetails, setCapaPrioridadTiendasDetails] =
    useState(1000);
  const [
    capaPrioridadTipoServicioDetails,
    setCapaPrioridadTipoServicioDetails,
  ] = useState(1000);
  const [capaPrioridadProductoDetails, setCapaPrioridadProductoDetails] =
    useState(1000);
  const [capaPrioridadClienteDetails, setCapaPrioridadClienteDetails] =
    useState(1000);

  const [capaPrioridadFechaDesdeSearsh, setCapaPrioridadFechaDesteSearsh] =
    useState(1000);
  const [capaPrioridadFechaHastaSearsh, setCapaPrioridadFechaHastaSearsh] =
    useState(1000);
  const [capaPrioridadTipoServicioSearsh, setCapaPrioridadTipoServicioSearsh] =
    useState(1000);
  const [capaPrioridadTiendaSearsh, setCapaPrioridadTiendaSearsh] =
    useState(1000);

  // Método para controlar las capas desplegables
  const controlarCapas = (prioridad: string) => {
    // Prioridades para los campos de detalles
    if (prioridad === "FechaDetails") {
      setCapaPrioridadFechaDetails(2000);
      setCapaPrioridadTiendasDetails(1500);
    } else if (prioridad === "TiendaDetails") {
      setCapaPrioridadTiendasDetails(2000);
      setCapaPrioridadFechaDetails(1500);
      setCapaPrioridadProductoDetails(1500);
      setCapaPrioridadTipoServicioDetails(2000);
      setCapaPrioridadClienteDetails(1500);
    } else if (prioridad === "TipoServicioDetails") {
      setCapaPrioridadTiendasDetails(2000);
      setCapaPrioridadFechaDetails(1500);
      setCapaPrioridadProductoDetails(1500);
      setCapaPrioridadTipoServicioDetails(2000);
      setCapaPrioridadClienteDetails(1500);
    } else if (prioridad === "ProductoDetails") {
      setCapaPrioridadTiendasDetails(1500);
      setCapaPrioridadFechaDetails(1500);
      setCapaPrioridadProductoDetails(2000);
      setCapaPrioridadTipoServicioDetails(1500);
      setCapaPrioridadClienteDetails(1500);
    } else if (prioridad === "ClienteDetails") {
      setCapaPrioridadClienteDetails(2000);
      setCapaPrioridadTiendasDetails(1500);
      setCapaPrioridadFechaDetails(1500);
      setCapaPrioridadProductoDetails(1500);
      setCapaPrioridadTipoServicioDetails(1500);
    }

    // Prioridades para el searsh
    if (prioridad === "FechaDesdeSearsh") {
      setCapaPrioridadFechaDesteSearsh(2000);
      setCapaPrioridadFechaHastaSearsh(1500);
      setCapaPrioridadTiendaSearsh(1500);
      setCapaPrioridadTipoServicioSearsh(1500);
    } else if (prioridad === "FechaHastaSearsh") {
      setCapaPrioridadFechaDesteSearsh(1500);
      setCapaPrioridadFechaHastaSearsh(2000);
      setCapaPrioridadTiendaSearsh(1500);
      setCapaPrioridadTipoServicioSearsh(1500);
    } else if (prioridad === "TipoServicioSearsh") {
      setCapaPrioridadFechaDesteSearsh(1500);
      setCapaPrioridadFechaHastaSearsh(1500);
      setCapaPrioridadTiendaSearsh(1500);
      setCapaPrioridadTipoServicioSearsh(2000);
    } else if (prioridad === "TiendaSearsh") {
      setCapaPrioridadFechaDesteSearsh(1500);
      setCapaPrioridadFechaHastaSearsh(1500);
      setCapaPrioridadTiendaSearsh(2000);
      setCapaPrioridadTipoServicioSearsh(1500);
    }
  };

  // Datos del usuario que está logueado
  const { usuario, setUsuario } = useUsuario();
  const { modalEntradasDates, setModalEntradasDates } = useModalEntradasDates();
  const { sortServicios, setSortServicios } = useSortServicios();

  // Constantes para controlar la animación del boton desplegable
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado
  const animationValueOptions = useRef(new Animated.Value(0)).current; // Valor animado
  const [cambioMoneda, setCambioMoneda] = useState(0);

  const [idFirstTimeProducto, setIdFirsTimeProducto] = useState("");
  const [auxOptimizacion, setAuxOptimizacion] = useState(false);

  // Variables para controlar los campos de los formularios de agregar entradass y ver datos
  const [idServicioDetails, setIdServicioDetails] = useState("");
  const [idGarantiaDetails, setIdGarantiaDetaisl] = useState("");
  const [idClienteDetails, setIdClienteDetails] = useState("");
  const [idTiendaDetails, setIdTiendaDetails] = useState("");
  const [idTipoServicioDetails, setIdTipoServicioDetails] = useState("");
  const [idProductoDetails, setIdProductoDetails] = useState("");
  const [cantidadProductoDetails, setCantidadProductoDetails] = useState("1");
  const [costoPromedioProductoCUPDetails, setCostoPromedioProductoCUPDetails] =
    useState("0");
  const [costoPromedioProductoUSDDetails, setCostoPromedioProductoUSDDetails] =
    useState("0");
  const [precioUSDDetails, setPrecioUSDDetails] = useState("");
  const [devueltoDetails, setDevueltoDetails] = useState("sin Devolver");
  const [precioCUPDetails, setPrecioCUPDetails] = useState("");
  const [notaDetails, setNotaDetails] = useState("");
  const [descripcionDetails, setDescripcionDetails] = useState("");
  const [fechaDiaDetails, setFechaDiaDetails] = useState("");
  const [fechaMesDetails, setFechaMesDetails] = useState("");
  const [fechaAnnoDetails, setFechaAnnoDetails] = useState("");
  const [duracionGarantiaDetails, setDuracionGarantiaDetails] = useState("");

  // Variable auxiliar para el redondeo de memerio
  const [auxRedondeo, setAuxRedondeo] = useState("");

  // Variables axiliares para lavalidación de campos
  const [idTiendaDetailsViejo, setIdTiendaDetailsViejo] = useState("");
  const [idProductoDetailsViejo, setIdProductoDetailsViejo] = useState("");
  const [cantidadProductoDetailsViejo, setCantidadProductoDetailsViejo] =
    useState("");
  const [idTipoServicioDetailsViejo, setIdTipoServicioDetailsViejo] =
    useState("");
  const [devueltoDetailsViejo, setDevueltoDetailsViejo] =
    useState("sin Devolver");

  const [isDateLoaded, setIsDateLoaded] = useState(false);

  const [idProductoAuxModificarDetails, setIdProductoAuxModificarDetails] =
    useState("");
  const [idTiendaAuxModificarDetails, setIdTiendaAuxModificarDetails] =
    useState("");
  const [cantidadAuxModificarDetails, setCantidadAuxModificarDetails] =
    useState("");

  // Variable que controla si se está haciendo una venta o se hizo una venta
  const [isVentaProducto, setIsVentaProducto] = useState(false);

  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [modalMensaje, setModalMensaje] = React.useState("");
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);
  const [isBotonModalMesajeVisible, setIsBotonModalMesajeVisible] =
    useState(false);

  const [isModalChekEliminarEntrada, setIsModalChekEliminarEntrada] =
    useState(false);
  const [isModalChekVisible, setIsModalChekVisible] = useState(false);
  const [mesajeModalChek, setMesajeModalChek] = useState("");

  // Condicionales para mostrar según los permisos
  const [isPermisoModificarGarantia, setIsPermisoModificarGarantia] =
    React.useState(false);

  const [isPermisoVerCostoVenta, setIsPermisoVerCostoVenta] = useState(false);

  const checkPermiso = async () => {
    if (usuario?.token) {
      const resultModificarGarantia = await isPermiso(
        usuario.token,
        "33",
        usuario.id_usuario
      );

      // cargar cambio de moneda
      setCambioMoneda(await getValorMonedaUSD(usuario.token));

      setIsPermisoModificarGarantia(resultModificarGarantia);
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
  const [filterItems, setFilterItems] = useState<Garantia[]>([]);

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

  const [dropdownItemsNombreCliente, setDropDownItemsNombreCliente] = useState<
    ProveedorPiker[]
  >([]);
  const [nombreProductoVentaDetails, setNombreProductoVentaDetails] =
    useState(String);
  const [dropdownItemsNombreTienda, setDropDownItemsNombreTienda] = useState<
    TiendaPiker[]
  >([]);
  const [dropdownItemsNombreTipoServicio, setDropDownItemsNombreTipoServicio] =
    useState<ProductoPiker[]>([]);

  const currentDate = new Date();

  // Extraemos el año, mes y día de la fecha actual
  const year = String(currentDate.getFullYear());
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
  const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

  //Variables Para los datos de busqueda
  const [nombreClienteSearch, setNombreClienteSearch] = useState("");
  const [nombreProductoSearsh, setNombreProductoSearch] = useState("");
  const [idTipoServicioSearch, setIdTipoServicioSearch] = useState("");
  const [idTiendaSearch, setIdTiendaSearch] = useState("");
  const [rangoPrecioDesdeSearch, setRangoPrecioDesdeSearch] = useState("");
  const [rangoPrecioHastaSearch, setRangoPrecioHastaSearch] = useState("");
  const [rangoDuracionDesdeSearch, setRangoDuracionDesdeSearch] = useState("");
  const [rangoDuracionHastaSearch, setRangoDuracionHastaSearch] = useState("");
  const [fechaDiaDesdeSearch, setFechaDiaDesdeSearch] = useState("1");
  const [fechaMesDesdeSearch, setFechaMesdesdeSearch] = useState("1");
  const [fechaAnnoDesdeSearch, setFechaAnnoDesdeSearch] = useState("2024");

  const [fechaDiaHastaSearch, setFechaDiaHastaSearch] = useState(
    String(parseInt(day))
  );
  const [fechaMesHastaSearch, setFechaMesHastaSearch] = useState(
    String(parseInt(month))
  );
  const [fechaAnnoHastaSearch, setFechaAnnoHastaSearch] = useState(
    String(parseInt(year))
  );

  // Opciones de radio burron para la fecha serash
  const [selecterActivoDetails, setSelecterActivoDetails] = useState("");

  const options = [
    { label: "Día", value: "dia" },
    { label: "Semana", value: "semana" },
    { label: "Mes", value: "mes" },
  ];

  const optionsDevueltoDetails = [
    { label: "Devolver", value: "devolver" },
    { label: "Sin Devolver", value: "sin devolver" },
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
    filtrarYOrdenarGarantias(fechaDesde, `${year}-${month}-${day}`);
  };

  // Variable visual para la carga de datos en la tabla
  const [loading, setLoading] = useState(false);

  const getTipoServicioPikerDetails = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllTipoServicios(usuario.token);

      if (result && Array.isArray(result)) {
        const tipoServiciosMapeados: TiendaPiker[] = await Promise.all(
          result.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_tipo_servicio,
          }))
        );

        // Agregar un valor adicional para el valor inicial
        setDropDownItemsNombreTipoServicio([
          { label: "Todos los tipos de servicios", value: "" },
          ...tipoServiciosMapeados,
        ]);
      }
    }
  };

  const getClientesPikerDetails = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllClientes(usuario.token);

      if (result && Array.isArray(result)) {
        const ClientesMapeados: ProductoPiker[] = await Promise.all(
          result.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_cliente,
          }))
        );

        // Agregar un valor adicional para el valor inicial
        setDropDownItemsNombreCliente(ClientesMapeados);
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
        setDropDownItemsNombreTienda([
          { label: "Todas las tiendas", value: "" },
          ...tiendasMapeados,
        ]);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar proovedor
  const callModalAddProveedor = () => {
    setIdClienteDetails("");
    setPrecioUSDDetails("");
    setCantidadProductoDetails("");
    setIdTipoServicioDetails("");

    setModalEntradasDates({
      id_entrada: "",
      isAddEntrada: false,
      isModificarEntrada: false,
      fileEditable: true,
    });
  };

  // Cargar todos los datos de el servicio pro primera ves que se abre el servicio
  const cargarDetailsOfGarantia = async () => {
    setAuxOptimizacion(false);
    if (usuario?.token && modalEntradasDates?.id_entrada) {
      // Reinicia los datos de la fecha antes de realizar la carga de datos
      setIsDateLoaded(false); // Para asegurarte de que el componente no use los datos antiguos

      const result = await getGarantiaByID(
        usuario.token,
        modalEntradasDates.id_entrada
      );

      if (result) {
        // Extraemos los datos de fecha de result.fecha
        const [year, month, day] = result.servicio.fecha
          .split("T")[0]
          .split("-");

        // Actualizamos los detalles
        setIdServicioDetails(result.servicio.id_servicio);
        setIdGarantiaDetaisl(result.id_garantia);
        setIdClienteDetails(result.servicio.cliente.id_cliente);
        setIdTipoServicioDetails(
          result.servicio.tipo_servicio.id_tipo_servicio
        );
        setNotaDetails(result.servicio.nota);
        setDescripcionDetails(result.servicio.descripcion);
        setDevueltoDetails(
          result.servicio.devuelto ? "devolver" : "sin devolver"
        );
        setDuracionGarantiaDetails(result.duracion);

        // Actualizar variables para la validación de campos
        setDevueltoDetailsViejo(
          result.servicio.devuelto ? "devolver" : "sin devolver"
        );
        // Si es un tip de servicios de venta se carga el producto que se halla vendiod o que se esté vendiendo con todos su datos
        if (
          parseInt(result.servicio.tipo_servicio.id_tipo_servicio) === 2 ||
          parseInt(result.servicio.tipo_servicio.id_tipo_servicio) === 4 ||
          parseInt(result.servicio.tipo_servicio.id_tipo_servicio) === 25
        ) {
          const resultventa = await getVentaByIDOfServicio(
            usuario.token,
            result.servicio.id_servicio
          );
          // Obtener entradas del produto para calcular datos del producto

          // Comprobar si el servicio era de venta y si es así cargar datos de este
          if (resultventa) {
            // Obtener entradas del produto para calcular datos del producto
            const entradas = await getAllEntradasByProductoId(
              usuario?.token,
              resultventa.producto.id_producto
            );
            const cantidadTotalProducto = await getProductoCantidadTotal(
              usuario.token,
              resultventa.producto.id_producto
            );

            // Actualizar variable para mostrar venta de producto
            setIsVentaProducto(true);

            setNombreProductoVentaDetails(resultventa.producto.nombre);
            setIdProductoDetails(resultventa.producto.id_producto);
            setCantidadProductoDetails(resultventa.cantidad);
            setIdTiendaDetails(result.servicio.tienda.id_tienda);
            setPrecioUSDDetails(result.servicio.precio);
            setPrecioCUPDetails(
              String(parseFloat(result.servicio.precio) * cambioMoneda)
            );
            setCostoPromedioProductoUSDDetails(result.producto.costo_acumulado);
          } else {
            // Cargar datos vacios para ingrezar un nuevo producto

            // Actualizar variable para mostrar venta de producto
            setIsVentaProducto(true);

            setIdProductoDetails("");
            setCantidadProductoDetails("");
            setIdTiendaDetails("");
            setPrecioUSDDetails("");
            setPrecioCUPDetails("");
            setCostoPromedioProductoUSDDetails("");
          }
        } else {
          // Actualizar variable para mostrar venta de producto
          setIsVentaProducto(false);
          setPrecioUSDDetails(result.servicio.precio);
          setPrecioCUPDetails(
            String(parseInt(result.servicio.precio) * cambioMoneda)
          );
          setCostoPromedioProductoUSDDetails(result.servicio.costo);
        }

        // Actualizamos las fechas (nuevos datos)
        setFechaDiaDetails(String(parseInt(day)));
        setFechaMesDetails(String(parseInt(month)));
        setFechaAnnoDetails(String(parseInt(year)));

        // Actualizamos los valores auxiliares;

        // Marcamos los datos como cargados al final del proceso
        setIsDateLoaded(true);
      }
    }
    setAuxOptimizacion(true);
  };

  const auxiliarFunctionFilter = async (
    fechaDesde: string,
    fechaHasta: string
  ): Promise<Garantia[] | null> => {
    if (usuario?.token) {
      // FALAT LA TIENDA EN EL FILTRADO
      try {
        const result = await filtrarGarantia(
          usuario.token,
          nombreClienteSearch,
          rangoDuracionHastaSearch,
          rangoDuracionDesdeSearch,
          nombreProductoSearsh,
          fechaDesde,
          fechaHasta,
          idTiendaSearch
        );

        if (result) {
          const serviciosMapeados: Garantia[] = await Promise.all(
            result.map(async (element: any) => ({
              id_Servicio: element.servicio.id_servicio,
              id_Cliente: element.servicio.cliente.id_cliente,
              id_Tienda: element.servicio.tienda.id_tienda,
              id_Tipo_servicio: "",
              id_Deuda: "",
              id_Garantia: element.id_garantia,
              fecha: element.servicio.fecha,
              precio: element.servicio.precio,
              nota: element.servicio.nota,
              descripcion: element.servicio.descripcion,
              nombreCliente: element.servicio.cliente.nombre,
              nombreTienda: element.servicio.tienda.nombre,
              nombreTipoServicio: "",
              nombreProducto: element.servicio.venta
                ? element.servicio.venta.producto.nombre
                : "", // Verifica si 'venta' no es null
              cantidad: element.servicio.venta
                ? element.servicio.venta.cantidad
                : "", // Verifica si 'venta' no es null
              devuelto: element.servicio.devuelto,
              duracion: element.duracion,
            }))
          );
          return serviciosMapeados;
        }
      } catch (error) {
        console.error("Error al filtrar los proveedoress:", error);
        return null;
      }
    }
    return null;
  };

  // Cargar datos del servicio cuando se seleccionado en la tabla
  useEffect(() => {
    cargarDetailsOfGarantia();
  }, [modalEntradasDates]);

  useEffect(() => {
    if (auxRedondeo === "PrecioCUP") {
      setPrecioUSDDetails(parseFloat(precioUSDDetails).toFixed(4));
      setAuxRedondeo("");
    } else if (auxRedondeo === "PrecioUSD") {
      setPrecioCUPDetails(parseFloat(precioCUPDetails).toFixed(0));
      setAuxRedondeo("");
    } else if (auxRedondeo === "CostoCUP") {
      setCostoPromedioProductoUSDDetails(
        parseFloat(costoPromedioProductoUSDDetails).toFixed(4)
      );
      setAuxRedondeo("");
    } else if (auxRedondeo === "CostoUSD") {
      setCostoPromedioProductoCUPDetails(
        parseFloat(costoPromedioProductoCUPDetails).toFixed(0)
      );
      setAuxRedondeo("");
    }
    setAuxRedondeo("");
  }, [auxRedondeo]);

  useEffect(() => {
    if (auxOptimizacion) {
      if (
        idProductoDetails !== "" &&
        idProductoDetails !== idFirstTimeProducto &&
        usuario?.token
      ) {
        setIdFirsTimeProducto(idProductoDetails);
        const auxiliarAsyncFuncion = async () => {
          const resultProdcuto = await getProductoById(
            usuario.token,
            idProductoDetails
          );

          // Cargar el costo promedio del producto seleccionado
          setCostoPromedioProductoUSDDetails(resultProdcuto.costo_acumulado);
          // Cargar precio del producto seleccioando en USD y CUP
          setPrecioUSDDetails(resultProdcuto.precio ?? 0);
          setPrecioCUPDetails(
            String(parseFloat(resultProdcuto.precio) * cambioMoneda) ?? 0
          );
        };
        auxiliarAsyncFuncion();
      } else {
        setIdFirsTimeProducto(idProductoDetails);
      }
    }
  }, [idProductoDetails]);

  useFocusEffect(
    useCallback(() => {
      const runEffects = async () => {
        setAuxOptimizacion(false);
        await checkPermiso();
        await getTipoServicioPikerDetails();
        await getClientesPikerDetails();
        await getTiendasPikerDetails();
      };
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  const [auxOrdenar, setAxuOrdenar] = useState(false);

  // Filtrar y ordenar productos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarGarantias = async (
    fechaDesde: string,
    fechaHasta: string
  ) => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let serviciosFiltradas: Garantia[] =
          (await auxiliarFunctionFilter(fechaDesde, fechaHasta)) || [];

        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortServicios?.criterioOrden && sortServicios.tipoOrden) {
          serviciosFiltradas = await ordenarServicios(
            usuario.token,
            serviciosFiltradas,
            sortServicios.criterioOrden,
            auxOrdenar
          );
        } else {
          serviciosFiltradas = await ordenarServicios(
            usuario.token,
            serviciosFiltradas,
            "option3",
            auxOrdenar
          );
        }

        // Actualizar el estado con los productos filtrados (y ordenados si corresponde)
        setFilterItems(serviciosFiltradas);
      }
    } catch (error) {
      console.error("Error al filtrar y ordenar los proovedores:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Llamar a la función cuando alguna de las dependencias cambie
    filtrarYOrdenarGarantias(
      `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
      `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
    );
  }, [sortServicios, selectedOptionTipoOrden]);
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
    setIdTiendaDetails(usuario?.id_tienda);
    setIdClienteDetails("");
    setPrecioUSDDetails("");
    setPrecioCUPDetails("");
    setCantidadProductoDetails("");
    setCostoPromedioProductoUSDDetails("");
    setIdTipoServicioDetails("");
    setCantidadProductoDetails("");
    setNotaDetails("");
    setDescripcionDetails("");

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
      filtrarYOrdenarGarantias(
        `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
        `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
      );
    }
  };

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreClienteSearch("");
    setSelectedOptionTipoOrden("");
    setIdTiendaSearch("");
    setIdTipoServicioSearch("");
    setRangoPrecioDesdeSearch("");
    setRangoPrecioHastaSearch("");
    setSelecterActivoDetails("");
  };

  // Método para actualizar los datos de un producto
  const modificarGarantiaFunction = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Modificando garantía. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL MODIFICAR EL GARANTÍA. Compruebe los siguientes campos:\n";
      if (duracionGarantiaDetails === "") {
        flag = false;
        validarCampos += "-Defina la duración de la garantía.\n";
      }
      if (flag) {
        await modificarGarantia(
          usuario.token,
          duracionGarantiaDetails,
          idServicioDetails,
          idGarantiaDetails
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`La garantía se modificó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };
  // Método para eliminar los datos de un producto
  const eliminarGarantiaFunction = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Eliminando servicio. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL ELIMINAR SERVICIO. Compruebe los siguientes parámetros:\n";

      if (flag) {
        await deleteGarantia(usuario.token, idGarantiaDetails);

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`La garantía se eliminó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setDuracionGarantiaDetails("");
        setIdClienteDetails("");
        setPrecioUSDDetails("");
        setPrecioCUPDetails("");
        setCantidadProductoDetails("");
        setCostoPromedioProductoUSDDetails("");
        setIdTipoServicioDetails("");
        setCantidadProductoDetails("");
        setNotaDetails("");
        setDescripcionDetails("");

        setModalEntradasDates({
          id_entrada: "",
          isAddEntrada: false,
          fileEditable: true,
          isModificarEntrada: false,
        });
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = [
    "Cliente",
    "Tienda",
    "Duración",
    "USD",
    "CUP",
    "Producto",
    "Cantidad",
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
    "Cliente",
    "Tienda",
    "Duración",
    "USD",
    "CUP",
    "Producto",
    "Cantidad",
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
        ></View>
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
            <MyDateTableGarantias
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
                    placeholder="Nombre del producto"
                    value={nombreProductoSearsh}
                    onKeyPress={handleKeyPress}
                    onChangeText={setNombreProductoSearch}
                  />

                  <Text style={styles.textSearchDesktop}>
                    Nombre del Cliente:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullDesktop}
                    placeholder="Nombre del cliente"
                    value={nombreClienteSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setNombreClienteSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchDesktop}>Tienda:</Text>
                  <View
                    style={{
                      width: "100%",
                      zIndex: capaPrioridadTiendaSearsh,
                      position: "relative",
                    }}
                  >
                    <CustomDropdown
                      value={idTiendaSearch}
                      placeholder="Seleccione un tienda"
                      setValue={setIdTiendaSearch}
                      items={dropdownItemsNombreTienda}
                      direction="BOTTOM"
                      onDropdownOpen={() => controlarCapas("TiendaSearsh")}
                    />
                  </View>

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>
                    Rango de Duración en Dias
                  </Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Desde"
                      value={rangoDuracionDesdeSearch}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoDuracionDesdeSearch(numericValue);
                      }}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Hasta"
                      value={rangoDuracionHastaSearch}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoDuracionHastaSearch(numericValue);
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
                        onDropdownOpen={() =>
                          controlarCapas("FechaDesdeSearsh")
                        }
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
                        onDropdownOpen={() =>
                          controlarCapas("FechaHastaSearsh")
                        }
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
                          filtrarYOrdenarGarantias(
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
                  ? "Crear Servicio"
                  : "Datos del Servicio"}
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
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadClienteDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Cliente
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadClienteDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.textLabelAsInput}>
                    {dropdownItemsNombreCliente.find(
                      (element) => element.value === idClienteDetails
                    )?.label || "Cliente no encontrado"}
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    position: "relative",
                    zIndex: capaPrioridadTipoServicioDetails,
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Tienda dodnde se presto el servicio */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: capaPrioridadTipoServicioDetails,
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Tienda donde se prestó el servicio
                    </Text>
                    <Text style={styles.textLabelAsInput}>
                      {dropdownItemsNombreTienda.find(
                        (element) => element.value === idTiendaDetails
                      )?.label || "Tienda no encontrado"}
                    </Text>
                  </View>

                  {/* Tipo Servicio */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      position: "relative",
                      zIndex: capaPrioridadTipoServicioDetails,
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Tipo de Servicio
                    </Text>
                    <Text style={styles.textLabelAsInput}>
                      {dropdownItemsNombreTipoServicio.find(
                        (element) => element.value === idTipoServicioDetails
                      )?.label || "Tipo de Servicio no encontrado"}
                    </Text>
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
                  {/* Garantías */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: 100,
                    }}
                  >
                    <View style={{ marginTop: "2%" }}>
                      <Text style={styles.labelTextModalDesktop}>
                        Duración en días:
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={duracionGarantiaDetails}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          setDuracionGarantiaDetails(numericValue);
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={isPermisoModificarGarantia}
                        placeholder="Duracion En días"
                      />
                    </View>
                  </View>

                  {/*  */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      position: "relative",
                      zIndex: capaPrioridadTipoServicioDetails,
                    }}
                  ></View>
                </View>

                {isVentaProducto && <View style={styles.separatorNegro} />}

                {/* Nombre Producto */}
                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      zIndex: capaPrioridadProductoDetails,
                      position: "relative",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Producto</Text>
                  </View>
                )}
                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      zIndex: capaPrioridadProductoDetails,
                      position: "relative",
                    }}
                  >
                    <Text style={styles.textLabelAsInput}>
                      {nombreProductoVentaDetails}
                    </Text>
                  </View>
                )}

                {/* Contenedor para la cantidad y - */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo USD */}
                  {isVentaProducto && (
                    <View style={{ width: "45%", marginLeft: "2%" }}>
                      <Text style={styles.labelTextModalDesktop}>
                        Cantidad del Producto
                      </Text>
                      <Text style={styles.textLabelAsInput}>
                        {cantidadProductoDetails}
                      </Text>
                    </View>
                  )}

                  {/* Costo */}
                  {isVentaProducto && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        {isVentaProducto
                          ? "Costo promedio del producto en USD"
                          : "Costo del servicio en USD"}
                      </Text>
                      <Text style={styles.textLabelAsInput}>
                        {costoPromedioProductoUSDDetails}
                      </Text>
                    </View>
                  )}

                  {!isVentaProducto && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        Costo del servicio en CUP
                      </Text>
                      <Text style={styles.textLabelAsInput}>
                        {costoPromedioProductoUSDDetails}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Contenedor para los precios en USD y CUP */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo USD */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      {isVentaProducto
                        ? "Precio por unidad en USD"
                        : "Precio del servicio en USD"}
                    </Text>
                    <Text style={styles.textLabelAsInput}>
                      {precioUSDDetails}
                    </Text>
                  </View>

                  {/* Campo CUP */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      {isVentaProducto
                        ? "Precio por unidad en CUP"
                        : "Precio del servicio en CUP"}
                    </Text>
                    <Text style={styles.textLabelAsInput}>
                      {parseFloat(precioUSDDetails) * cambioMoneda}
                    </Text>
                  </View>
                </View>

                {isVentaProducto && <View style={styles.separatorNegro} />}

                {/* Campo fecha */}
                <View
                  style={{
                    width: "100%",
                    marginLeft: "2%",
                    paddingHorizontal: 10,
                    zIndex: capaPrioridadFechaDetails,
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>Fecha</Text>
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
                      isReadOnly={!false}
                    />
                  )}
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
                  {/* Campo Nota */}
                  <View
                    style={{
                      width: "100%",
                      marginLeft: "2%",
                      marginTop: "5%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Nota</Text>
                    <Text style={styles.textLabelAsInput}>{notaDetails}</Text>
                  </View>
                </View>

                {/* Descripción */}
                <Text
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
                <Text style={styles.textDescroptionLabelAsInput}>
                  {descripcionDetails}
                </Text>

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
                  {isPermisoModificarGarantia &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Oscuro,
                          borderRadius: 15,
                          width: "35%", // Ancho fijo para pantallas de escritorio
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
                          setIsModalChekEliminarEntrada(false);
                          setMesajeModalChek(
                            `¿Estás seguro que deseas MODIFICAR los datos de esta garantía?`
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Modificar Garantía
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Botón para eliminar proveedor */}
                  {isPermisoModificarGarantia &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.rojo_oscuro,
                          borderRadius: 15,
                          width: "35%", // Ancho fijo para pantallas de escritorio
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
                          setIsModalChekEliminarEntrada(true);
                          setMesajeModalChek(
                            `¿Estás seguro que deseas ELIMINAR esta garantía?`
                          );
                          setModalEntradasDates({
                            id_entrada: "",
                            isAddEntrada: false,
                            isModificarEntrada: false,
                            fileEditable: true,
                          });
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Eliminar Garantía
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
                  onPress={() => isModalChekEliminarEntrada
                    ? eliminarGarantiaFunction()
                    : modificarGarantiaFunction()}
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
                      ? navigation.replace("Garantías")
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
        ></View>
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
              placeholder="Nombre del producto"
              value={nombreProductoSearsh}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreProductoSearch}
            />

            <Text style={styles.textSearchDesktop}>Nombre del Cliente:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del cliente"
              value={nombreClienteSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreClienteSearch}
            />

            <View style={styles.separatorBlanco} />
            <Text style={styles.textSearchDesktop}>Tienda:</Text>
            <View
              style={{
                width: "100%",
                zIndex: capaPrioridadTiendaSearsh,
                position: "relative",
              }}
            >
              <CustomDropdown
                value={idTiendaSearch}
                placeholder="Seleccione un tienda"
                setValue={setIdTiendaSearch}
                items={dropdownItemsNombreTienda}
                direction="BOTTOM"
                onDropdownOpen={() => controlarCapas("TiendaSearsh")}
              />
            </View>

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>
              Rango de Duración en Dias
            </Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Desde"
                value={rangoDuracionDesdeSearch}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoDuracionDesdeSearch(numericValue);
                }}
              />
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Hasta"
                value={rangoDuracionHastaSearch}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoDuracionHastaSearch(numericValue);
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
                    filtrarYOrdenarGarantias(
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
            <MyDateTableGarantias
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
                  ? "Crear Garantía"
                  : "Datos del Garantía"}
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
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadClienteDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Cliente
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadClienteDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.textLabelAsInput}>
                    {dropdownItemsNombreCliente.find(
                      (element) => element.value === idClienteDetails
                    )?.label || "Cliente no encontrado"}
                  </Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    position: "relative",
                    zIndex: capaPrioridadTipoServicioDetails,
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Tienda dodnde se presto el servicio */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: capaPrioridadTipoServicioDetails,
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Tienda donde se prestó el servicio
                    </Text>
                    <Text style={styles.textLabelAsInput}>
                      {dropdownItemsNombreTienda.find(
                        (element) => element.value === idTiendaDetails
                      )?.label || "Tienda no encontrado"}
                    </Text>
                  </View>

                  {/* Tipo Servicio */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      position: "relative",
                      zIndex: capaPrioridadTipoServicioDetails,
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Tipo de Servicio
                    </Text>
                    <Text style={styles.textLabelAsInput}>
                      {dropdownItemsNombreTipoServicio.find(
                        (element) => element.value === idTipoServicioDetails
                      )?.label || "Tipo de Servicio no encontrado"}
                    </Text>
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
                  {/* Garantías */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: 100,
                    }}
                  >
                    <View style={{ marginTop: "2%" }}>
                      <Text style={styles.labelTextModalDesktop}>
                        Duración en días:
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={duracionGarantiaDetails}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          setDuracionGarantiaDetails(numericValue);
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={isPermisoModificarGarantia}
                        placeholder="Duracion En días"
                      />
                    </View>
                  </View>

                  {/*  */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      position: "relative",
                      zIndex: capaPrioridadTipoServicioDetails,
                    }}
                  ></View>
                </View>

                {isVentaProducto && <View style={styles.separatorNegro} />}

                {/* Nombre Producto */}
                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      zIndex: capaPrioridadProductoDetails,
                      position: "relative",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Producto</Text>
                  </View>
                )}
                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      zIndex: capaPrioridadProductoDetails,
                      position: "relative",
                    }}
                  >
                    <Text style={styles.textLabelAsInput}>
                      {nombreProductoVentaDetails}
                    </Text>
                  </View>
                )}

                {/* Contenedor para la cantidad y - */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo USD */}
                  {isVentaProducto && (
                    <View style={{ width: "45%", marginLeft: "2%" }}>
                      <Text style={styles.labelTextModalDesktop}>
                        Cantidad del Producto
                      </Text>
                      <Text style={styles.textLabelAsInput}>
                        {cantidadProductoDetails}
                      </Text>
                    </View>
                  )}

                  {/* Costo */}
                  {isVentaProducto && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        {isVentaProducto
                          ? "Costo promedio del producto en USD"
                          : "Costo del servicio en USD"}
                      </Text>
                      <Text style={styles.textLabelAsInput}>
                        {costoPromedioProductoUSDDetails}
                      </Text>
                    </View>
                  )}

                  {!isVentaProducto && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        Costo del servicio en CUP
                      </Text>
                      <Text style={styles.textLabelAsInput}>
                        {costoPromedioProductoUSDDetails}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Contenedor para los precios en USD y CUP */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo USD */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      {isVentaProducto
                        ? "Precio por unidad en USD"
                        : "Precio del servicio en USD"}
                    </Text>
                    <Text style={styles.textLabelAsInput}>
                      {precioUSDDetails}
                    </Text>
                  </View>

                  {/* Campo CUP */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      {isVentaProducto
                        ? "Precio por unidad en CUP"
                        : "Precio del servicio en CUP"}
                    </Text>
                    <Text style={styles.textLabelAsInput}>
                      {parseFloat(precioUSDDetails) * cambioMoneda}
                    </Text>
                  </View>
                </View>

                {isVentaProducto && <View style={styles.separatorNegro} />}

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
                  {/* Campo fecha */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>Fecha</Text>
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
                        isReadOnly={!false}
                      />
                    )}
                  </View>

                  {/* Campo Nota */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      marginTop: "3%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Nota</Text>
                    <Text style={styles.textLabelAsInput}>{notaDetails}</Text>
                  </View>
                </View>

                {/* Descripción */}
                <Text
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
                <Text style={styles.textDescroptionLabelAsInput}>
                  {descripcionDetails}
                </Text>

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
                  {isPermisoModificarGarantia &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Oscuro,
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
                        onPress={() => {
                          setIsModalChekVisible(true);
                          setIsModalChekEliminarEntrada(false);
                          setMesajeModalChek(
                            `¿Estás seguro que deseas MODIFICAR los datos de esta garantía?`
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Modificar Garantía
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para eliminar proveedor */}
                  {isPermisoModificarGarantia &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.rojo_oscuro,
                          borderRadius: 15,
                          width: "30%", // Ancho fijo para pantallas de escritorio
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
                          setIsModalChekEliminarEntrada(true);
                          setMesajeModalChek(
                            `¿Estás seguro que deseas ELIMINAR esta garantía?`
                          );
                          setModalEntradasDates({
                            id_entrada: "",
                            isAddEntrada: false,
                            isModificarEntrada: false,
                            fileEditable: true,
                          });
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Eliminar Garantía
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
                      ? eliminarGarantiaFunction()
                      : modificarGarantiaFunction()
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
                      ? navigation.replace("Garantías")
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
