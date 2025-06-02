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
  getRelacionProductoByTienda,
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
import CustomRadioButtonSingle from "../components/CustomRadioButtonSearch";
import {
  addGarantia,
  deleteGarantia,
  modificarGarantia,
} from "../services/GarantiaServices";
import {
  addEncargo,
  deleteEncargo,
  modificarEncargo,
} from "../services/EncargoServices";
import { Deuda, MyDateTableDeudas } from "../components/MydateTableDeudas";
import {
  deleteDeuda,
  filtrarDeudas,
  getDeudaByID,
} from "../services/DeudasServices";
import {
  MyDateTablePagoDeudaWithButton,
  PagoDeudaShowModal,
} from "../components/MyDateTableShowPagoDeudas";
import { addPagoDeuda, deletePagoDeuda } from "../services/PagoDeudaServices";

export default function DeudasView() {
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
  const [idDeudaDetails, setIdDeudaDetails] = useState("");
  const [idServicioDetails, setIdServicioDetails] = useState("");
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
  const [fechaDiaDetailsEncargo, setFechaDiaDetailsEncargo] = useState("");
  const [fechaMesDetailsEncargo, setFechaMesDetailsEncargo] = useState("");
  const [fechaAnnoDetailsEncargo, setFechaAnnoDetailsEncargo] = useState("");
  const [adelantoEncargo, setAdelantoEncargo] = useState("");
  const [isGarantiaDetails, setIsGarantiaDetails] = useState(false);
  const [isGarantiaDetailsViejo, setIsGarantiaDetailsViejo] = useState(false);
  const [idGarantiaDetails, setIdGarantiaDetails] = useState("");
  const [duracionGarantiaDetails, setDuracionGarantiaDetails] = useState("");
  const [duracionGarantiaDetailsVieja, setDuracionGarantiaDetailsVieja] =
    useState("");
  const [pagoDeudaByDeudaDetails, setPagoDeudaByDeudaDetails] = useState<
    PagoDeudaShowModal[]
  >([]);
  const [idEncargoDetails, setIdEncargoDetails] = useState("");

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
  const [isEncargoProducto, setIsEncargoProducto] = useState<boolean>(false);

  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [isModalAddPagoDeudaView, setIsModalAddPagoDeudaView] =
    React.useState(false);
  const [cantidadUSDAddPagoDeuda, setCantidadUSDAddPagoDeuda] =
    React.useState("");
  const [cantidadCUPAddPagoDeuda, setCantidadCUPAddPagoDeuda] =
    React.useState("");
  const [total_pagado, setTotal_pagado] = React.useState("");
  const [deudaUnitaria, setDeudaUnitaria] = React.useState("");
  const [cantidad_restante, setCantidad_restante] = React.useState("");
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
  const [isPermisoAgregarServicio, setIsPermisoAgregarServicio] =
    React.useState(false);
  const [isPermisoEliminarServicio, setIsPermisoEliminarServicio] =
    React.useState(false);
  const [isPermisoModificarServicio, setIsPermisoModificarServicio] =
    React.useState(false);
  const [isPermisoServicioLocal, setIsPermisoServicioLocal] =
    React.useState(false);
  const [isPermisoServicioGeneral, setIsPermisoServicioGeneral] =
    React.useState(false);

  const [isPermisoVerCostoVenta, setIsPermisoVerCostoVenta] = useState(false);

  const checkPermiso = async () => {
    if (usuario?.token) {
      // Verificar y almacenar el permiso de agregar servicio
      if (localStorage.getItem("resultAgregarServicio") === null) {
        const resultAgregarServicio = await isPermiso(
          usuario.token,
          "26",
          usuario.id_usuario
        );
        setIsPermisoAgregarServicio(resultAgregarServicio);
        localStorage.setItem("resultAgregarServicio", resultAgregarServicio);
      } else {
        setIsPermisoAgregarServicio(Boolean(localStorage.getItem("resultAgregarServicio")));
      }
  
      // Verificar y almacenar el permiso de eliminar servicio
      if (localStorage.getItem("resultEliminarServicio") === null) {
        const resultEliminarServicio = await isPermiso(
          usuario.token,
          "25",
          usuario.id_usuario
        );
        setIsPermisoEliminarServicio(resultEliminarServicio);
        localStorage.setItem("resultEliminarServicio", resultEliminarServicio);
      } else {
        setIsPermisoEliminarServicio(Boolean(localStorage.getItem("resultEliminarServicio")));
      }
  
      // Verificar y almacenar el permiso de modificar servicio
      if (localStorage.getItem("resultModificarServicio") === null) {
        const resultModificarServicio = await isPermiso(
          usuario.token,
          "24",
          usuario.id_usuario
        );
        setIsPermisoModificarServicio(resultModificarServicio);
        localStorage.setItem("resultModificarServicio", resultModificarServicio);
      } else {
        setIsPermisoModificarServicio(Boolean(localStorage.getItem("resultModificarServicio")));
      }
  
      // Verificar y almacenar el permiso de servicio local
      if (localStorage.getItem("resulServicioLocal") === null) {
        const resulServicioLocal = await isPermiso(
          usuario.token,
          "26",
          usuario.id_usuario
        );
        setIsPermisoServicioLocal(resulServicioLocal);
        localStorage.setItem("resulServicioLocal", resulServicioLocal);
      } else {
        setIsPermisoServicioLocal(Boolean(localStorage.getItem("resulServicioLocal")));
      }
  
      // Verificar y almacenar el permiso de servicio general
      if (localStorage.getItem("resultServicioGeneral") === null) {
        const resultServicioGeneral = await isPermiso(
          usuario.token,
          "27",
          usuario.id_usuario
        );
        setIsPermisoServicioGeneral(resultServicioGeneral);
        localStorage.setItem("resultServicioGeneral", resultServicioGeneral);
      } else {
        setIsPermisoServicioGeneral(Boolean(localStorage.getItem("resultServicioGeneral")));
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
  const [filterItems, setFilterItems] = useState<Deuda[]>([]);

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
  const [dropdownItemsNombreproducto, setDropDownItemsNombreProducto] =
    useState<ProductoPiker[]>([]);
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
  const [isDeudaSaldadaSearsh, setIsDeudaSaldadaSearsh] = useState(true);
  const [rangoDeudaDesdeSearch, setRangoPrecioDesdeSearch] = useState("");
  const [rangoDeudaHastaSearch, setRangoPrecioHastaSearch] = useState("");
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
  const [selecterEstadoDeudaSearch, setSelecterEstadoDeudaSearsh] =
    useState("ninguna");

  const options = [
    { label: "Día", value: "dia" },
    { label: "Semana", value: "semana" },
    { label: "Mes", value: "mes" },
  ];

  const optionsEstadoDeuda = [
    { label: "Ninguna", value: "ninguna" },
    { label: "Saldada", value: "saldada" },
    { label: "Sin Saldar", value: "sin_saldar" },
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
    filtrarYOrdenarDeudas(fechaDesde, `${year}-${month}-${day}`);
  };

  // Variable visual para la carga de datos en la tabla
  const [loading, setLoading] = useState(false);

  const getProductosPikerDetails = async () => {
    if (usuario?.token != undefined) {
      let result: any;

      const resultServicioGeneral = await isPermiso(
        usuario.token,
        "27",
        usuario.id_usuario
      );
      const resulServicioLocal = await isPermiso(
        usuario.token,
        "26",
        usuario.id_usuario
      );

      if (resultServicioGeneral) {
        const result = await getRelacionProductoByTienda(
          usuario.token,
          usuario.id_tienda
        );
        if (result && Array.isArray(result)) {
          const productosMapeados: ProductoPiker[] = await Promise.all(
            result.map(async (element: any) => ({
              label: element.producto.nombre,
              value: element.id_producto,
            }))
          );

          // Agregar un valor adicional para el valor inicial
          setDropDownItemsNombreProducto(productosMapeados);
        }
      } else if (resulServicioLocal) {
        const result = await getRelacionProductoByTienda(
          usuario.token,
          usuario.id_tienda
        );
        if (result && Array.isArray(result)) {
          const productosMapeados: ProductoPiker[] = await Promise.all(
            result.map(async (element: any) => ({
              label: element.producto.nombre,
              value: element.id_producto,
            }))
          );

          // Agregar un valor adicional para el valor inicial
          setDropDownItemsNombreProducto(productosMapeados);
        }
      }
    }
  };

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

  // Cargar datos de lprodcut o del servicio de venta
  const cargarDetailsOfProductoVenta = async () => {
    if (usuario?.token) {
      const resultDeuda = await getDeudaByID(
        usuario.token,
        modalEntradasDates.id_entrada
      );

      // Si es un tip de servicios de venta se carga el producto que se halla vendiod o que se esté vendiendo con todos su datos
      if (
        parseInt(idTipoServicioDetails) === 2 ||
        parseInt(idTipoServicioDetails) === 25
      ) {
        const resultventa = await getVentaByIDOfServicio(
          usuario.token,
          idServicioDetails
        );
        // Actualizar variable para mostrar venta de producto
        setIsVentaProducto(true);

        // Comprobar si el servicio era de venta y si es así cargar datos de este
        if (resultventa) {
          // Actualizar variables para la validación de campos
          setIdProductoDetailsViejo(resultventa.producto.id_producto);
          setCantidadProductoDetailsViejo(resultventa.cantidad);
          setIdTiendaDetailsViejo(resultDeuda.deuda.servicio.tienda.id_tienda);

          setIdProductoDetails(resultventa.producto.id_producto);
          setIdFirsTimeProducto(resultventa.producto.id_producto);
          setCantidadProductoDetails(resultventa.cantidad);
          setIdTiendaDetails(resultDeuda.deuda.servicio.tienda.id_tienda);
          setPrecioUSDDetails(resultDeuda.deuda.servicio.precio);
          setPrecioCUPDetails(
            String(parseFloat(resultDeuda.deuda.servicio.precio) * cambioMoneda)
          );
          setCostoPromedioProductoUSDDetails(
            resultventa.producto.costo_acumulado
          );
        } else {
          // Cargar datos vacios para ingrezar un nuevo producto

          // Actualizar variable para mostrar venta de producto
          setIsVentaProducto(true);

          setIdProductoDetails("");
          setCantidadProductoDetails("");
          setPrecioUSDDetails("");
          setPrecioCUPDetails("");
          setCostoPromedioProductoUSDDetails("");
        }
      } else {
        // Actualizar variable para mostrar venta de producto
        setIsVentaProducto(false);
        setPrecioUSDDetails(resultDeuda.deuda.servicio.precio);
        setPrecioCUPDetails(
          String(parseInt(resultDeuda.deuda.servicio.precio) * cambioMoneda)
        );
        setCostoPromedioProductoUSDDetails(resultDeuda.deuda.servicio.costo);
      }
    }
  };

  // Cargar todos los datos de el servicio pro primera ves que se abre el servicio
  const cargarDetailsOfDeuda = async () => {
    setAuxOptimizacion(false);
    if (usuario?.token && modalEntradasDates?.id_entrada) {
      // Reinicia los datos de la fecha antes de realizar la carga de datos
      setIsDateLoaded(false); // Para asegurarte de que el componente no use los datos antiguos

      const result = await getDeudaByID(
        usuario.token,
        modalEntradasDates.id_entrada
      );

      if (result) {
        // Extraemos los datos de fecha de result.fecha
        const [year, month, day] = result.deuda.servicio.fecha
          .split("T")[0]
          .split("-");

        // Actualizamos los detalles
        setIdDeudaDetails(result.deuda.id_deuda);
        setCantidad_restante(result.cantidad_restante);
        setTotal_pagado(result.total_pagado);
        setDeudaUnitaria(result.deuda.deuda);
        setIdServicioDetails(result.deuda.servicio.id_servicio);
        setIdClienteDetails(result.deuda.servicio.cliente.id_cliente);
        setIdTipoServicioDetails(
          result.deuda.servicio.tipo_servicio.id_tipo_servicio
        );
        setNotaDetails(result.deuda.servicio.nota);
        setDescripcionDetails(result.deuda.servicio.descripcion);
        setDevueltoDetails(
          result.deuda.servicio.devuelto ? "devolver" : "sin devolver"
        );
        setIsGarantiaDetails(result.deuda.servicio.garantia !== null);

        // Actualizar variables para la validación de campos
        setIdTipoServicioDetailsViejo(
          result.deuda.servicio.tipo_servicio.id_tipo_servicio
        );
        // Cargar pagos deuda
        setPagoDeudaByDeudaDetails(result.deuda.pagos_deuda);
        // Si es un tip de servicios de venta se carga el producto que se halla vendiod o que se esté vendiendo con todos su datos
        if (
          parseInt(result.deuda.servicio.tipo_servicio.id_tipo_servicio) === 2
        ) {
          const resultventa = await getVentaByIDOfServicio(
            usuario.token,
            idServicioDetails
          );
          // Obtener entradas del produto para calcular datos del producto

          // Comprobar si el servicio era de venta y si es así cargar datos de este
          if (resultventa) {
            // Actualizar variable para mostrar venta de producto
            setIsVentaProducto(true);

            setIdProductoDetails(resultventa.producto.id_producto);
            setCantidadProductoDetails(resultventa.cantidad);
            setIdTiendaDetails(result.deuda.servicio.tienda.id_tienda);
            setPrecioUSDDetails(result.deuda.servicio.precio);
            setPrecioCUPDetails(
              String(parseFloat(result.deuda.servicio.precio) * cambioMoneda)
            );
            setCostoPromedioProductoUSDDetails(
              resultventa.producto.costo_acumulado
            );
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
          setPrecioUSDDetails(result.deuda.servicio.precio);
          setPrecioCUPDetails(
            String(parseInt(result.deuda.servicio.precio) * cambioMoneda)
          );
          setCostoPromedioProductoUSDDetails(result.deuda.servicio.costo);
        }

        // Actualizamos las fechas (nuevos datos)
        setFechaDiaDetails(String(parseInt(day)));
        setFechaMesDetails(String(parseInt(month)));
        setFechaAnnoDetails(String(parseInt(year)));
        // Actualizar fechas para el encargo
        setFechaDiaDetailsEncargo(String(parseInt(day)));
        setFechaMesDetailsEncargo(String(parseInt(month)));
        setFechaAnnoDetailsEncargo(String(parseInt(year)));

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
  ): Promise<Deuda[] | null> => {
    if (usuario?.token) {
      try {
        const result = await filtrarDeudas(
          usuario.token,
          nombreProductoSearsh,
          nombreClienteSearch,
          rangoDeudaDesdeSearch,
          rangoDeudaHastaSearch,
          fechaDesde,
          fechaHasta,
          idTiendaSearch,
          idTipoServicioSearch,
          selecterEstadoDeudaSearch === "ninguna"
            ? undefined
            : selecterEstadoDeudaSearch === "saldada"
            ? true
            : false
        );

        if (result) {
          const serviciosMapeados: Deuda[] = await Promise.all(
            result.map(async (element: any) => ({
              id_Servicio: element.deuda.servicio.id_servicio,
              id_Cliente: element.deuda.servicio.cliente.id_cliente,
              id_Tienda: element.deuda.servicio.tienda.id_tienda,
              id_Tipo_servicio:
                element.deuda.servicio.tipo_servicio.id_tipo_servicio,
              id_Deuda: element.deuda.id_deuda,
              id_Garantia: "",
              fecha: element.deuda.servicio.fecha,
              precio: element.deuda.servicio.precio,
              nota: element.deuda.servicio.nota,
              descripcion: element.deuda.servicio.descripcion,
              nombreCliente: element.deuda.servicio.cliente.nombre,
              nombreTienda: element.deuda.servicio.tienda.nombre,
              nombreTipoServicio: element.deuda.servicio.tipo_servicio.nombre,
              nombreProducto: element.deuda.servicio.venta
                ? element.deuda.servicio.venta.producto.nombre
                : "", // Verifica si 'venta' no es null
              cantidad: element.deuda.servicio.venta
                ? element.deuda.servicio.venta.cantidad
                : "", // Verifica si 'venta' no es null
              devuelto: element.deuda.servicio.devuelto,
              deuda: (element.deuda.deuda * (element.deuda.servicio.venta? element.deuda.servicio.venta.cantidad : 1)),
              pagos_deuda: element.deuda.pagos_deuda,
              total_pagado: element.total_pagado,
              cantidad_restante: element.cantidad_restante,
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
    cargarDetailsOfDeuda();
  }, [modalEntradasDates]);

  // Cargar datos de el producto si es que es seleccioando una venta de algun tipoServicio
  useEffect(() => {
    // Actualizar si es Encargo
    if (parseInt(idTipoServicioDetails) === 26) {
      setIsEncargoProducto(true);
    } else {
      setIsEncargoProducto(false);
    }
    cargarDetailsOfProductoVenta();
  }, [idTipoServicioDetails]);
  useEffect(() => {
    if (auxRedondeo === "PrecioCUP") {
      setPrecioUSDDetails(parseFloat(precioUSDDetails).toFixed(5));
      setAuxRedondeo("");
    } else if (auxRedondeo === "PrecioUSD") {
      setPrecioCUPDetails(parseFloat(precioCUPDetails).toFixed(2));
      setAuxRedondeo("");
    } else if (auxRedondeo === "CostoCUP") {
      setCostoPromedioProductoUSDDetails(
        parseFloat(costoPromedioProductoUSDDetails).toFixed(5)
      );
      setAuxRedondeo("");
    } else if (auxRedondeo === "CostoUSD") {
      setCostoPromedioProductoCUPDetails(
        parseFloat(costoPromedioProductoCUPDetails).toFixed(2)
      );
      setAuxRedondeo("");
    }
    setAuxRedondeo("");
  }, [auxRedondeo]);

  useEffect(() => {
    const auxiliar = async () => {
      if (usuario?.token) {
        const result = await getRelacionProductoByTienda(
          usuario.token,
          idTiendaDetails
        );
        if (result && Array.isArray(result)) {
          const productosMapeados: ProductoPiker[] = await Promise.all(
            result.map(async (element: any) => ({
              label: element.producto.nombre,
              value: element.id_producto,
            }))
          );

          // Agregar un valor adicional para el valor inicial
          setDropDownItemsNombreProducto(productosMapeados);
        }
      }
    };
    auxiliar();
  }, [idTiendaDetails]);
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

  // Funcion para controlar la vicion del campo de costo del servicio y del producto
  const isCampoCostoVisible = async () => {
    if (usuario?.token && usuario?.id_usuario) {
      const resultServicioGeneral = await isPermiso(
        usuario.token,
        "27",
        usuario.id_usuario
      );
      const resultado =
        parseInt(idTipoServicioDetails) === 2 ||
        parseInt(idTipoServicioDetails) === 25
          ? isPermisoServicioGeneral
          : true;
      return resultado;
    }
    return false;
  };
  useFocusEffect(
    useCallback(() => {
      const runEffects = async () => {
        setAuxOptimizacion(false);
        await checkPermiso();
        await getTipoServicioPikerDetails();
        await getClientesPikerDetails();
        await getTiendasPikerDetails();
        await getProductosPikerDetails();
      };
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  const [auxOrdenar, setAxuOrdenar] = useState(false);

  // Filtrar y ordenar productos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarDeudas = async (
    fechaDesde: string,
    fechaHasta: string
  ) => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let deudasFiltradas: Deuda[] =
          (await auxiliarFunctionFilter(fechaDesde, fechaHasta)) || [];

        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortServicios?.criterioOrden && sortServicios.tipoOrden) {
          deudasFiltradas = await ordenarServicios(
            usuario.token,
            deudasFiltradas,
            sortServicios.criterioOrden,
            auxOrdenar
          );
        } else {
          deudasFiltradas = await ordenarServicios(
            usuario.token,
            deudasFiltradas,
            "option3",
            auxOrdenar
          );
        }

        // Actualizar el estado con los productos filtrados (y ordenados si corresponde)
        setFilterItems(deudasFiltradas);
      }
    } catch (error) {
      console.error("Error al filtrar y ordenar los proovedores:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Llamar a la función cuando alguna de las dependencias cambie
    filtrarYOrdenarDeudas(
      `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
      `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
    );
  }, [sortServicios, selectedOptionTipoOrden]);
  useEffect(() => {
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

    setFechaDiaDetailsEncargo(String(parseInt(day)));
    setFechaMesDetailsEncargo(String(parseInt(month)));
    setFechaAnnoDetailsEncargo(String(parseInt(year)));

    setIsDateLoaded(true);
  };

  // Función para cuando precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      // Aquí ejecutas la función que deseas
      filtrarYOrdenarDeudas(
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

  // Metodo para eliminar un pago deuda de una deuda
  const deletePagoDeudaFronTabla = async (item: any) => {
    if (usuario?.token) {
      await deletePagoDeuda(usuario.token, item.id_pago_deuda);
      setPagoDeudaByDeudaDetails((prevPagoDeuda) =>
        prevPagoDeuda.filter(
          (pago) => pago.id_pago_deuda !== item.id_pago_deuda
        )
      );
      setModalMensajeView(true);
      setModalMensaje("Pago de deuda eliminado");
      setReflechModalMensajeView(true);
      setIsBotonModalMesajeVisible(true);
    }
  };
  // Método para agregar un nuevo producto al sistema
  const addNewDeuda = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Agregando Pago de Deuda. Espere por favor");
    setModalMensajeView(true);
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL INGRESAR PAGO DE DEUDA. Por favor verifique los siguientes campos:\n";

      if (flag) {
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

        const resultPagoDeuda = await addPagoDeuda(
          usuario.token,
          cantidadUSDAddPagoDeuda,
          `${year}-${month}-${day}`,
          idDeudaDetails
        );
        pagoDeudaByDeudaDetails.push(resultPagoDeuda);

        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó un pago de deuda de una cantidad de ${cantidadUSDAddPagoDeuda}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          8
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`El Pago de Deuda se agregó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
      } else {
        setModalMensaje(validarCampos);
        setIsBotonModalMesajeVisible(true);
        setModalMensajeView(true);
      }
    }
  };

  // Método para actualizar los datos de un producto
  const modificarServicioFunction = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Modificando servicio. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let cantidadEnTiendaNueva: number = 0;
      const result = await isProductoInTienda(
        usuario.token,
        idProductoDetails,
        idTiendaDetails
      );
      if (result) {
        cantidadEnTiendaNueva = result.cantidad;
      }

      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL MODIFICAR EL SERVICIO. Compruebe los siguientes campos:\n";

      if (idClienteDetails === "") {
        flag = false;
        validarCampos +=
          "-Seleccione un cliente. Si no hay datos del cliente seleccione anonimo\n";
      }
      if (idTipoServicioDetails === "") {
        flag = false;
        validarCampos +=
          "-Seleccione el tipo de servicio que está ofreciendo.\n";
      }
      if (idTiendaDetails === "") {
        flag = false;
        validarCampos += "-Seleccione una tienda.\n";
      }
      if (isGarantiaDetails && duracionGarantiaDetails === "") {
        flag = false;
        validarCampos += "-Defina la duración de la garantía.\n";
      }
      if (costoPromedioProductoUSDDetails === "") {
        flag = false;
        validarCampos += "-Digite el costo del servicio.\n";
      }
      if (precioUSDDetails === "") {
        flag = false;
        validarCampos += "-Defina el precio cobrado al cliente.\n";
      }
      if (isGarantiaDetails && duracionGarantiaDetails === "") {
        flag = false;
        validarCampos += "-Defina la duración de la garantía.\n";
      }
      if (isGarantiaDetails && parseInt(idClienteDetails) === 1) {
        flag = false;
        validarCampos += "-El ciente Anónimo no puede tener garantías";
      }
      // Validacion si es un encargo
      if (parseInt(idTipoServicioDetails) === 26) {
        const fechaBase = new Date(
          `${fechaAnnoDetails}-${fechaMesDetails}-${fechaDiaDetails}`
        );
        const fechaEncargo = new Date(
          `${fechaAnnoDetailsEncargo}-${fechaMesDetailsEncargo}-${fechaDiaDetailsEncargo}`
        );

        if (parseInt(idClienteDetails) === 1) {
          flag = false;
          validarCampos +=
            "-No se puede hacer un encargo al cliente Anónimo.\n";
        }
        if (fechaEncargo < fechaBase) {
          flag = false;
          validarCampos +=
            "-La fecha del encargo no puede ser menor que la fecha del servicio.\n";
        }
      }
      // Validaciones si es una venta
      if (
        parseInt(idTipoServicioDetails) === 2 ||
        parseInt(idTipoServicioDetails) === 25
      ) {
        if (idProductoDetails === "") {
          flag = false;
          validarCampos += "-Seleccione un producto para vender.\n";
        }
        if (cantidadProductoDetails === "") {
          flag = false;
          validarCampos +=
            "-Defina la cantidad que desea vender del producto.\n";
        }
      }
      // validación de campos avanzada
      if (
        cantidadEnTiendaNueva + parseInt(cantidadProductoDetailsViejo) <
        parseInt(cantidadProductoDetails)
      ) {
        flag = false;
        validarCampos +=
          "-La cantidad que desea modificar es mayor que la cantidad que hay en la tienda.\n";
      }
      // se modificó solo la cantidad del producto
      if (
        (cantidadProductoDetails !== cantidadProductoDetailsViejo &&
          idProductoDetails === idProductoDetailsViejo &&
          idTiendaDetails === idTiendaDetailsViejo &&
          parseInt(idTipoServicioDetails) === 2) ||
        parseInt(idTipoServicioDetails) === 25
      ) {
        if (
          cantidadEnTiendaNueva + parseInt(cantidadProductoDetailsViejo) <
          parseInt(cantidadProductoDetailsViejo) -
            parseInt(cantidadProductoDetails)
        ) {
          flag = false;
          validarCampos +=
            "-La cantidad que hay en la tienda no es suficiente para modificar la venta del producto.\n";
        }
      } else if (
        idProductoDetails !== idProductoDetailsViejo ||
        idTiendaDetails !== idTiendaDetailsViejo
      ) {
        if (cantidadEnTiendaNueva < parseInt(cantidadProductoDetails)) {
          flag = false;
          validarCampos +=
            "-La cantidad que hay en la tienda no es suficiente para modificar la venta del producto.\n";
        }
      }
      if (flag) {
        await modificarServicio(
          usuario.token,
          idServicioDetails,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          precioUSDDetails,
          notaDetails,
          idTiendaDetails,
          idTipoServicioDetails,
          devueltoDetails === "devolver",
          idClienteDetails,
          "Not suport yet",
          "not suport yet"
        );

        // Actualizar Garantía
        if (
          isGarantiaDetails !== isGarantiaDetailsViejo ||
          duracionGarantiaDetails !== duracionGarantiaDetailsVieja
        ) {
          if (isGarantiaDetails) {
            if (idGarantiaDetails !== "") {
              await modificarGarantia(
                usuario.token,
                duracionGarantiaDetails,
                idServicioDetails,
                idGarantiaDetails
              );
            } else {
              await addGarantia(
                usuario.token,
                duracionGarantiaDetails,
                idServicioDetails
              );
            }
          } else {
            await deleteGarantia(usuario.token, idGarantiaDetails);
          }
        }
        // Actualizar encargo
        if (
          idTipoServicioDetails !== idTipoServicioDetailsViejo &&
          parseInt(idTipoServicioDetailsViejo) === 26
        ) {
          await deleteEncargo(usuario.token, idEncargoDetails);
        } else if (
          idTipoServicioDetails !== idTipoServicioDetailsViejo &&
          parseInt(idTipoServicioDetails) === 26
        ) {
          await addEncargo(
            usuario.token,
            adelantoEncargo,
            `${fechaAnnoDetailsEncargo}-${fechaMesDetailsEncargo}-${fechaDiaDetailsEncargo}`,
            idServicioDetails
          );
        } else if (
          idTipoServicioDetails === idTipoServicioDetailsViejo &&
          parseInt(idTipoServicioDetails) === 26
        ) {
          await modificarEncargo(
            usuario.token,
            adelantoEncargo,
            `${fechaAnnoDetailsEncargo}-${fechaMesDetailsEncargo}-${fechaDiaDetailsEncargo}`,
            idServicioDetails,
            idEncargoDetails
          );
        }
        // Si se cambio de tipo de servicio venta a otro
        if (
          parseInt(idTipoServicioDetailsViejo) === 2 &&
          parseInt(idTipoServicioDetails) !== 2 &&
          parseInt(idTipoServicioDetails) !== 4
        ) {
          // Se suma la cantidad de la venta pasada en la tienda
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetailsViejo,
            idTiendaDetailsViejo,
            `${parseInt(cantidadProductoDetailsViejo) * -1}`
          );
          // Se elimina la venta
          await deleteVenta(
            usuario.token,
            idProductoDetailsViejo,
            idServicioDetails
          );
        }

        // Comprobar si solamente se cambio la cantidad si es que el tip ode sericio viejo era ya una venta
        if (
          cantidadProductoDetails !== cantidadProductoDetailsViejo &&
          idProductoDetails === idProductoDetailsViejo &&
          idTiendaDetails === idTiendaDetailsViejo
        ) {
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetails,
            idTiendaDetails,
            `${
              parseInt(cantidadProductoDetails) -
              parseInt(cantidadProductoDetailsViejo)
            }`
          );
          // Agregar o sobreescrivir la venta
          await addVenta(
            usuario.token,
            idProductoDetails,
            idServicioDetails,
            cantidadProductoDetails
          );
          // Si no es el caso se modificó el id del producto o l tienda volviendo para atras la venta a la tienda y haciendola denuevo con lso nuevos datos de la venta
        } else if (
          (idTipoServicioDetails !== idTipoServicioDetailsViejo &&
            parseInt(idTipoServicioDetails) === 2) ||
          parseInt(idTipoServicioDetails) === 25
        ) {
          // Agregar o sobreescrivir la venta
          await addVenta(
            usuario.token,
            idProductoDetails,
            idServicioDetails,
            cantidadProductoDetails
          );
          // sumar en la tienda la cantidad vieja del producto para volver atras la venta
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetailsViejo,
            idTiendaDetailsViejo,
            `${parseInt(cantidadProductoDetailsViejo) * -1}`
          );
          // restar en la tienda nueva o vieja donde se este haciendo la venta
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetails,
            idTiendaDetails,
            `${parseInt(cantidadProductoDetails)}`
          );
        } else if (
          idTiendaDetails !== idTiendaDetailsViejo ||
          idProductoDetails !== idProductoDetailsViejo
        ) {
          await addVenta(
            usuario.token,
            idProductoDetails,
            idServicioDetails,
            cantidadProductoDetails
          );
          // sumar en la tienda la cantidad vieja del producto para volver atras la venta
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetailsViejo,
            idTiendaDetailsViejo,
            `${parseInt(cantidadProductoDetailsViejo) * -1}`
          );
          // restar en la tienda nueva o vieja donde se este haciendo la venta
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetails,
            idTiendaDetails,
            `${parseInt(cantidadProductoDetails)}`
          );
        }

        // Si es una devolucion y ademas el tipo de servicio actual es una venta se devuelve la cantidad a la tienda
        if (
          devueltoDetails !== devueltoDetailsViejo &&
          devueltoDetails === "devolver" &&
          (parseInt(idTipoServicioDetails) === 2 ||
            parseInt(idTipoServicioDetails) === 25)
        ) {
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetails,
            idTiendaDetails,
            `${parseInt(cantidadProductoDetails) * -1}`
          );
        } else if (
          devueltoDetails !== devueltoDetailsViejo &&
          devueltoDetails === "sin devolver" &&
          (parseInt(idTipoServicioDetails) === 2 ||
            parseInt(idTipoServicioDetails) === 25)
        ) {
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetails,
            idTiendaDetails,
            `${parseInt(cantidadProductoDetails)}`
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
          7
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`El servicio se modificó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setIdClienteDetails("");
        setPrecioUSDDetails("");
        setIdTipoServicioDetails("");
        setCantidadProductoDetails("");
        setDuracionGarantiaDetails("");

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
  // Método para eliminar los datos de un producto
  const eliminarDeudaFunction = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Eliminando deuda. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL ELIMINAR DEUDA. Compruebe los siguientes parámetros:\n";

      if (flag) {
        const resultDeuda = await getDeudaByID(usuario.token, idDeudaDetails);
        if (
          Array.isArray(resultDeuda.deuda.pagos_deuda) &&
          resultDeuda.deuda.pagos_deuda.length > 0
        ) {
          // Eliminar los pagoDeuda
          resultDeuda.deuda.pagos_deuda.map(async (pagoDeuda: any) => {
            await deletePagoDeuda(usuario.token, pagoDeuda.id_pago_deuda);
          });
        }
        await deleteDeuda(usuario.token, idDeudaDetails);

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó la deuda del tipo de servicio ${resultDeuda.deuda.servicio.tipo_servicio.nombre} el cual devía ${resultDeuda.cantidad_restante} y se había pagado ${resultDeuda.total_pagado}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          8
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`La deuda se eliminó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setIdClienteDetails("");
        setPrecioUSDDetails("");
        setPrecioCUPDetails("");
        setCantidadProductoDetails("");
        setCostoPromedioProductoUSDDetails("");
        setIdTipoServicioDetails("");
        setCantidadProductoDetails("");
        setNotaDetails("");
        setDescripcionDetails("");
        setDuracionGarantiaDetails("");

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
  const columnasMyDateTablePagoDeudaModal = [
    "C.Pagada CUP",
    "Fecha",
  ];
  const columnasMyDateTableDesktop = [
    "Cliente",
    "Tienda",
    "Producto",
    "Deuda CUP",
    "C.Sal CUP",
    "C.Faltnte",
    "Saldada",
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
    "Producto",
    "Deuda CUP",
    "C.Sal CUP",
    "C.Faltnte",
    "Saldada",
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
            <MyDateTableDeudas
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

                  <Text style={styles.textSearchDesktop}>
                    Tipo de Servicio:
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      zIndex: capaPrioridadTipoServicioSearsh,
                      position: "relative",
                    }}
                  >
                    <CustomDropdown
                      value={idTipoServicioSearch}
                      placeholder="Seleccione un tipo de servicio"
                      setValue={setIdTipoServicioSearch}
                      items={dropdownItemsNombreTipoServicio}
                      direction="BOTTOM"
                      onDropdownOpen={() =>
                        controlarCapas("TipoServicioSearsh")
                      }
                    />
                  </View>

                  {isPermisoServicioGeneral && (
                    <View style={styles.separatorBlanco} />
                  )}

                  {isPermisoServicioGeneral && (
                    <Text style={styles.textSearchDesktop}>Tienda:</Text>
                  )}
                  {isPermisoServicioGeneral && (
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
                  )}

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchDesktop}>
                    Rango del monto de la deuda:
                  </Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyDesktop}
                      placeholder="Desde"
                      value={rangoDeudaDesdeSearch}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoPrecioDesdeSearch(numericValue);
                      }}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyDesktop}
                      placeholder="Hasta"
                      value={rangoDeudaHastaSearch}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoPrecioHastaSearch(numericValue);
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
                          filtrarYOrdenarDeudas(
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
                  <CustomDropdownDetails
                    value={idClienteDetails}
                    placeholder="Seleccione un Cliente"
                    setValue={setIdClienteDetails}
                    items={dropdownItemsNombreCliente}
                    searchable={true}
                    readOnly={
                      !(isPermisoModificarServicio || isPermisoServicioLocal)
                    }
                    onDropdownOpen={() => controlarCapas("ClienteDetails")}
                  />
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
                    <CustomDropdownDetails
                      value={idTiendaDetails}
                      placeholder="Seleccione una tienda"
                      setValue={setIdTiendaDetails}
                      items={dropdownItemsNombreTienda}
                      readOnly={
                        !(isPermisoServicioGeneral &&
                        modalEntradasDates?.id_entrada === ""
                          ? true
                          : isPermisoServicioGeneral &&
                            isPermisoModificarServicio)
                      }
                      searchable={true}
                      onDropdownOpen={() =>
                        controlarCapas("TipoServicioDetails")
                      }
                    />
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
                    <CustomDropdownDetails
                      value={idTipoServicioDetails}
                      placeholder="Seleccione un tipo de servicio"
                      setValue={setIdTipoServicioDetails}
                      items={dropdownItemsNombreTipoServicio}
                      readOnly={
                        !(isPermisoModificarServicio || isPermisoServicioLocal)
                      }
                      searchable={true}
                      onDropdownOpen={() =>
                        controlarCapas("TipoServicioDetails")
                      }
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
                  {/* Garantías */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: 100,
                    }}
                  >
                    {true && (
                      <Text style={styles.labelTextModalDesktop}>
                        Tiene Garantía
                      </Text>
                    )}
                    {true && (
                      <CustomRadioButtonSingle
                        onPress={() => setIsGarantiaDetails(!isGarantiaDetails)}
                        selected={isGarantiaDetails}
                        label="Garantía"
                      />
                    )}

                    {/*isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Adelanto del encargo
                      </Text>
                    )*/}
                    {/*isEncargoProducto && (
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={adelantoEncargo}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;
                          setAdelantoEncargo(validNumericValue);
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={true}
                        placeholder="Adelanto del encargo"
                      />
                    )*/}

                    {isGarantiaDetails && (
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
                          editable={
                            isPermisoModificarServicio || isPermisoServicioLocal
                          }
                          placeholder="Duracion En días"
                        />
                      </View>
                    )}
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
                  >
                    {/*isDateLoaded && isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Fecha llegada
                      </Text>
                    )*/}
                    {/*isDateLoaded && isEncargoProducto && (
                      <MyDateInput
                        dayValue={fechaDiaDetailsEncargo}
                        monthValue={fechaMesDetailsEncargo}
                        yearValue={fechaAnnoDetailsEncargo}
                        onDayChange={setFechaDiaDetailsEncargo}
                        onMonthChange={setFechaMesDetailsEncargo}
                        onYearChange={setFechaAnnoDetailsEncargo}
                        style={{ margin: 20 }}
                        styleText={styles.labelTextModalDesktop}
                        onDropdownOpen={() => controlarCapas("FechaDetails")}
                        isReadOnly={
                          !(
                            isPermisoModificarServicio || isPermisoServicioLocal
                          )
                        }
                      />
                    )*/}
                  </View>
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
                    <CustomDropdownDetails
                      value={idProductoDetails}
                      placeholder="Seleccione un produto"
                      setValue={setIdProductoDetails}
                      items={dropdownItemsNombreproducto}
                      searchable={true}
                      readOnly={
                        !(isPermisoModificarServicio || isPermisoServicioLocal)
                      }
                      onDropdownOpen={() => controlarCapas("ProductoDetails")}
                    />
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
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        cursorColor={Colors.azul_Oscuro}
                        value={cantidadProductoDetails}
                        onChangeText={(text) => {
                          // Filtra caracteres no numéricos
                          const numericValue = text.replace(/[^0-9]/g, "");
                          setCantidadProductoDetails(numericValue);
                        }}
                        editable={
                          isPermisoModificarServicio || isPermisoServicioLocal
                        }
                        placeholder="Cantidad del producto"
                      />
                    </View>
                  )}

                  {/* Costo */}
                  {(isVentaProducto ? isPermisoServicioGeneral : true) && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        {isVentaProducto
                          ? "Costo promedio del producto en CUP"
                          : "Costo del servicio en CUP"}
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={costoPromedioProductoUSDDetails}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;

                          if (validNumericValue !== "") {
                            setCostoPromedioProductoCUPDetails(
                              String(
                                (
                                  parseFloat(validNumericValue) * cambioMoneda
                                ).toFixed(2)
                              )
                            );
                          } else {
                            setCostoPromedioProductoCUPDetails("0");
                          }
                          setCostoPromedioProductoUSDDetails(validNumericValue);
                          setAuxRedondeo("CostoUSD");
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          parseInt(idTipoServicioDetails) === 2 ||
                          parseInt(idTipoServicioDetails) === 25
                            ? false
                            : isPermisoModificarServicio ||
                              isPermisoServicioLocal
                        }
                        placeholder="Costo Promedio"
                      />
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
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={costoPromedioProductoCUPDetails}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;

                          if (validNumericValue !== "") {
                            setCostoPromedioProductoUSDDetails(
                              String(
                                parseFloat(validNumericValue) / cambioMoneda
                              )
                            );
                          } else {
                            setCostoPromedioProductoUSDDetails("0");
                          }
                          setCostoPromedioProductoCUPDetails(validNumericValue);
                          setAuxRedondeo("CostoCUP");
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          parseInt(idTipoServicioDetails) === 2 ||
                          parseInt(idTipoServicioDetails) === 25
                            ? false
                            : isPermisoModificarServicio ||
                              isPermisoServicioLocal
                        }
                        placeholder="Costo Promedio"
                      />
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
                    <CustomTextImputSearch
                      style={styles.textImputModalNOEDITABLE}
                      value={precioCUPDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        if (validNumericValue !== "") {
                          setPrecioUSDDetails(
                            String(parseFloat(validNumericValue) / cambioMoneda)
                          );
                        } else {
                          setPrecioUSDDetails("0");
                        }
                        setPrecioCUPDetails(validNumericValue);
                        setAuxRedondeo("PrecioCUP");
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={
                        isPermisoModificarServicio || isPermisoServicioLocal
                      }
                      placeholder="Precio por unidad en cup"
                    />
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
                  <View style={{ width: "90%", marginLeft: "2%" }}>
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
                        isReadOnly={
                          !(
                            isPermisoModificarServicio || isPermisoServicioLocal
                          )
                        }
                      />
                    )}
                  </View>
                </View>

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
                  <View style={{ width: "90%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>Nota</Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={notaDetails}
                      onChangeText={setNotaDetails}
                      editable={
                        isPermisoModificarServicio || isPermisoServicioLocal
                      }
                      placeholder="Nota"
                    />
                  </View>

                  {/* Campo Nota */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      marginTop: "5%",
                    }}
                  ></View>
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
                  placeholder="Escribe la descripción del servicio"
                  multiline={true}
                  editable={
                    isPermisoModificarServicio || isPermisoServicioLocal
                  }
                  numberOfLines={5}
                  value={descripcionDetails}
                  onChangeText={setDescripcionDetails}
                  scrollEnabled={true}
                />

                <View
                  style={{
                    flex: 1,
                    borderColor: Colors.azul_Oscuro,
                    borderWidth: 2,
                    marginTop: "3%",
                    borderRadius: 15,
                    height: 500,
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MyDateTablePagoDeudaWithButton
                    columns={columnasMyDateTablePagoDeudaModal}
                    items={pagoDeudaByDeudaDetails}
                    onButtonPress={(item: any) =>
                      deletePagoDeudaFronTabla(item)
                    }
                  />
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
                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarServicio &&
                    modalEntradasDates?.id_entrada !== "" && (
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
                        onPress={() => {
                          // Sumar todos los valores de 'pagada' en el array
                          const sumaPagada = pagoDeudaByDeudaDetails.reduce(
                            (total, pago) => {
                              return total + parseFloat(pago.pagada);
                            },
                            0
                          );

                          // Usar la suma en la condición
                          if (
                            parseFloat(precioUSDDetails) * parseInt(cantidadProductoDetails) - sumaPagada > 0
                          ) {
                            setIsModalAddPagoDeudaView(true);
                          } else {
                            setModalMensajeView(true);
                            setModalMensaje("La deuda ya está saldada");
                            setReflechModalMensajeView(false);
                            setIsBotonModalMesajeVisible(true);
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar pago a la deuda
                        </Text>
                      </TouchableOpacity>
                    )}
                  {/* Botón para eliminar proveedor */}
                  {isPermisoEliminarServicio &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.rojo_oscuro,
                          borderRadius: 15,
                          width: "45%", // Ancho fijo para pantallas de escritorio
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
                            `¿Estás seguro que deseas ELIMINAR al esta deuda?`
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
                          Eliminar Deuda
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
                  onPress={() => modificarServicioFunction()}
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

        {/* Modal agregar pago deuda*/}
        <Modal
          transparent={true}
          visible={isModalAddPagoDeudaView}
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
                height: 400,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
                justifyContent: "center",
                alignItems: "center", // Cambiar a stretch para ocupar todo el ancho
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
              >
                {`Agregar un pago a la deuda.`}
              </Text>

              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Cantidad a pagar CUP
              </Text>
              <CustomTextImputSearch
                style={{
                  height: 50,
                  borderColor: Colors.azul_Oscuro,
                  borderWidth: 1, // Ajusta el borde a ser más delgado
                  shadowColor: Colors.azul_Suave, // Color de la sombra
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
                  shadowRadius: 14, // Difuminado
                  width: "90%",
                  marginTop: "2%",
                  marginHorizontal: "5%",
                  backgroundColor: Colors.blanco_Suave,
                  borderRadius: 13,
                  fontSize: 16, // Tamaño de letra más grande
                  textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                  textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
                  textShadowRadius: 2, // Difuminado de la sombra
                  fontWeight: "bold", // Letra en negritas
                  paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
                }}
                value={cantidadCUPAddPagoDeuda}
                onChangeText={(text) => {
                  // Permite solo números y un punto decimal
                  const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                  // Asegura que solo haya un punto decimal
                  const validNumericValue =
                    numericValue.split(".").length > 2
                      ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                      : numericValue;

                  setCantidadCUPAddPagoDeuda(validNumericValue);
                  setCantidadUSDAddPagoDeuda(
                    String((validNumericValue / cambioMoneda).toFixed(5))
                  );
                }}
                cursorColor={Colors.azul_Oscuro}
                editable={true}
                placeholder="Cantidad del pago en CUP"
              />

              <TouchableOpacity
                onPress={() => {
                  if (
                    parseFloat(cantidadUSDAddPagoDeuda) <= parseFloat((parseFloat(deudaUnitaria) * parseFloat(cantidadProductoDetails) - parseFloat(total_pagado)).toFixed(5))
                  ) {
                    addNewDeuda();
                  } else {
                    setModalMensaje(
                      `La cantidad de el pago de la deuda ${cantidadUSDAddPagoDeuda} es mayor a la cantidad faltante de la deuda ${((parseFloat(deudaUnitaria) * parseFloat(cantidadProductoDetails) - parseFloat(total_pagado)) * cambioMoneda).toFixed(0)}`
                    );
                    setModalMensajeView(true);
                    setReflechModalMensajeView(false);
                    setIsBotonModalMesajeVisible(true);
                  }
                }}
                style={{
                  backgroundColor: Colors.azul_Claro,
                  borderRadius: 15,
                  marginTop: 30,
                  width: "90%", // Ancho fijo para pantallas de escritorio
                  height: 40, // Altura fija para pantallas de escritorio
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: Colors.blanco_Suave,
                  }}
                >
                  Agregar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setIsModalAddPagoDeudaView(!isModalAddPagoDeudaView)
                }
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
                      ? navigation.replace("Deudas")
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

            <Text style={styles.textSearchDesktop}>Tipo de Servicio:</Text>
            <View
              style={{
                width: "100%",
                zIndex: capaPrioridadTipoServicioSearsh,
                position: "relative",
              }}
            >
              <CustomDropdown
                value={idTipoServicioSearch}
                placeholder="Seleccione un tipo de servicio"
                setValue={setIdTipoServicioSearch}
                items={dropdownItemsNombreTipoServicio}
                direction="BOTTOM"
                onDropdownOpen={() => controlarCapas("TipoServicioSearsh")}
              />
            </View>

            {isPermisoServicioGeneral && (
              <View style={styles.separatorBlanco} />
            )}

            {isPermisoServicioGeneral && (
              <Text style={styles.textSearchDesktop}>Tienda:</Text>
            )}
            {isPermisoServicioGeneral && (
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
            )}

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>
              Rango del monto de la deuda:
            </Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Desde"
                value={rangoDeudaDesdeSearch}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoPrecioDesdeSearch(numericValue);
                }}
              />
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Hasta"
                value={rangoDeudaHastaSearch}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoPrecioHastaSearch(numericValue);
                }}
              />
            </View>

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Estado de deuda:</Text>
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
              {optionsEstadoDeuda.map((option) => (
                <CustomRadioButton
                  key={option.value}
                  label={option.label}
                  selected={selecterEstadoDeudaSearch === option.value}
                  onPress={() => setSelecterEstadoDeudaSearsh(option.value)}
                />
              ))}
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
                    filtrarYOrdenarDeudas(
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
            <MyDateTableDeudas
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
                  ? "Crear Servicio"
                  : "Datos de la Deuda"}
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
                      {dropdownItemsNombreproducto.find(
                        (element) => element.value === idProductoDetails
                      )?.label || "Producto no encontrado"}
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
                  {(isVentaProducto ? isPermisoServicioGeneral : true) && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        {isVentaProducto
                          ? "Costo promedio del producto en CUP"
                          : "Costo del servicio en CUP"}
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
                      {precioCUPDetails}
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

                <View
                  style={{
                    flex: 1,
                    borderColor: Colors.azul_Oscuro,
                    borderWidth: 2,
                    marginTop: "3%",
                    borderRadius: 15,
                    height: 500,
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MyDateTablePagoDeudaWithButton
                    columns={columnasMyDateTablePagoDeudaModal}
                    items={pagoDeudaByDeudaDetails}
                    onButtonPress={(item: any) =>
                      deletePagoDeudaFronTabla(item)
                    }
                  />
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
                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarServicio &&
                    modalEntradasDates?.id_entrada !== "" && (
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
                        onPress={() => {
                          // Sumar todos los valores de 'pagada' en el array
                          const sumaPagada = pagoDeudaByDeudaDetails.reduce(
                            (total, pago) => {
                              return total + parseFloat(pago.pagada);
                            },
                            0
                          );

                          // Usar la suma en la condición
                          if (
                            parseFloat(precioUSDDetails) * parseInt(cantidadProductoDetails) - sumaPagada > 0
                          ) {
                            setIsModalAddPagoDeudaView(true);
                          } else {
                            setModalMensajeView(true);
                            setModalMensaje("La deuda ya está saldada");
                            setReflechModalMensajeView(false);
                            setIsBotonModalMesajeVisible(true);
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar pago a la deuda
                        </Text>
                      </TouchableOpacity>
                    )}
                  {/* Botón para eliminar proveedor */}
                  {isPermisoEliminarServicio &&
                    modalEntradasDates?.id_entrada !== "" && (
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
                            `¿Estás seguro que deseas ELIMINAR al esta deuda?`
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
                          Eliminar Deuda
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
                      ? eliminarDeudaFunction()
                      : modificarServicioFunction()
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

        {/* Modal agregar pago deuda*/}
        <Modal
          transparent={true}
          visible={isModalAddPagoDeudaView}
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
                height: 400,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 5,
                justifyContent: "center",
                alignItems: "center", // Cambiar a stretch para ocupar todo el ancho
              }}
            >

              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Cantidad a pagar CUP
              </Text>
              <CustomTextImputSearch
                style={{
                  height: 50,
                  borderColor: Colors.azul_Oscuro,
                  borderWidth: 1, // Ajusta el borde a ser más delgado
                  shadowColor: Colors.azul_Suave, // Color de la sombra
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
                  shadowRadius: 14, // Difuminado
                  width: "90%",
                  marginTop: "2%",
                  marginHorizontal: "5%",
                  backgroundColor: Colors.blanco_Suave,
                  borderRadius: 13,
                  fontSize: 16, // Tamaño de letra más grande
                  textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                  textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
                  textShadowRadius: 2, // Difuminado de la sombra
                  fontWeight: "bold", // Letra en negritas
                  paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
                }}
                value={cantidadCUPAddPagoDeuda}
                onChangeText={(text) => {
                  // Permite solo números y un punto decimal
                  const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                  // Asegura que solo haya un punto decimal
                  const validNumericValue =
                    numericValue.split(".").length > 2
                      ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                      : numericValue;

                  setCantidadCUPAddPagoDeuda(validNumericValue);
                  setCantidadUSDAddPagoDeuda(
                    String((validNumericValue / cambioMoneda).toFixed(5))
                  );
                }}
                cursorColor={Colors.azul_Oscuro}
                editable={true}
                placeholder="Cantidad del pago en CUP"
              />

              <TouchableOpacity
                onPress={() => {
                  if (
                    parseFloat(cantidadUSDAddPagoDeuda) <= parseFloat((parseFloat(deudaUnitaria) * parseFloat(cantidadProductoDetails) - parseFloat(total_pagado)).toFixed(5))
                  ) {
                    addNewDeuda();
                  } else {
                    setModalMensaje(
                      `La cantidad de el pago de la deuda ${(
                        parseFloat(cantidadUSDAddPagoDeuda) * cambioMoneda
                      ).toFixed(
                        0
                      )} es mayor a la cantidad faltante de la deuda ${((parseFloat(deudaUnitaria) * parseFloat(cantidadProductoDetails) - parseFloat(total_pagado)) * cambioMoneda).toFixed(0)}`
                    );
                    setModalMensajeView(true);
                    setReflechModalMensajeView(false);
                    setIsBotonModalMesajeVisible(true);
                  }
                }}
                style={{
                  backgroundColor: Colors.azul_Claro,
                  borderRadius: 15,
                  marginTop: 30,
                  width: "90%", // Ancho fijo para pantallas de escritorio
                  height: 40, // Altura fija para pantallas de escritorio
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: Colors.blanco_Suave,
                  }}
                >
                  Agregar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setIsModalAddPagoDeudaView(!isModalAddPagoDeudaView)
                }
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
                      ? navigation.replace("Deudas")
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
