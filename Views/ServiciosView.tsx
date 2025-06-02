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
  FlatList,
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
  matchProductoInTienda,
  updateProductoTienda,
} from "../services/ProductoServices";
import { ProductoPiker } from "../components/MyDateTableProductos";
import { useModalEntradasDates } from "../contexts/AuxiliarContextModalEntradas";
import { MyDateInput } from "../components/MyDateInput";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import {
  MyDateTableServicios,
  Servicio,
} from "../components/MyDateTableServicios";
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
import {
  addDeuda,
  deleteDeuda,
  getDeudaByID,
} from "../services/DeudasServices";
import { addPagoDeuda, deletePagoDeuda } from "../services/PagoDeudaServices";

export default function ServiciosView() {
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

  // variables para agregar multiples servicios al mismo tiempo
  const [isModalChekVisible, setIsModalChekVisible] = useState(false);
  const [isModalAddMultiServicio, setIsModalAddMultiServicio] = useState(false);
  const [isModalAddMultiServicioSingle, setIsModalAddMultiServicioSingle] =
    useState(false);
  const [multiServiciosItems, setMltiServiciosItems] = useState<any[]>([]);
  const [idClienteMutiDetails, setIdClienteMultiDetails] = useState("");
  const [idTiendaMultiDetails, setIdTiendaMultiDetails] = useState(
    usuario?.id_tienda
  );

  // Variables para controlar los campos de los formularios de agregar entradass y ver datos
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
  const [precioUSDDetailsAuxVal, setPrecioUSDDetailsAuxVal] = useState("");
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
  const [isDeudaDetails, setIsDeudaDetails] = useState(false);
  const [isGarantiaDetailsViejo, setIsGarantiaDetailsViejo] = useState(false);
  const [idGarantiaDetails, setIdGarantiaDetails] = useState("");
  const [duracionGarantiaDetails, setDuracionGarantiaDetails] = useState("");
  const [cantidadTransferencia, setCantidadTransferencia] = useState("0");
  const [adelantoUSDDeudaDetails, setAdelantoUSDDeudaDetails] = useState("0");
  const [adelantoCUPDeudaDetails, setAdelantoCUPDeudaDetails] = useState("0");
  const [duracionGarantiaDetailsVieja, setDuracionGarantiaDetailsVieja] =
    useState("");
  const [idEncargoDetails, setIdEncargoDetails] = useState("");
  const [idDeudaDetails, setIdDeudaDetails] = useState("");

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
  const [modalMensaje, setModalMensaje] = React.useState("");
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);
  const [isBotonModalMesajeVisible, setIsBotonModalMesajeVisible] =
    useState(false);

  const [isModalChekEliminarEntrada, setIsModalChekEliminarEntrada] =
    useState(false);

  const [mesajeModalChek, setMesajeModalChek] = useState("");

  // Controlar el doble clic del boton
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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

  const mensajeSumaVenta = () => {
    let mensaje = `Se debe cobrar CUP: ${(
      parseFloat(precioCUPDetails) * parseFloat(cantidadProductoDetails)
    ).toFixed(
      0
    )} y se pagará por transferencia una cantidad de ${cantidadTransferencia}`;

    return mensaje;
  };
  const checkPermiso = async () => {
    if (usuario?.token) {
      if (localStorage.getItem("isPermisoAgregarServicio") === null) {
        const resultAgregarServicio = await isPermiso(
          usuario.token,
          "26",
          usuario.id_usuario
        );
        setIsPermisoAgregarServicio(resultAgregarServicio);
        localStorage.setItem("isPermisoAgregarServicio", resultAgregarServicio);
      } else {
        setIsPermisoAgregarServicio(
          Boolean(localStorage.getItem("isPermisoAgregarServicio"))
        );
      }
      if (localStorage.getItem("isPermisoEliminarServicio") === null) {
        const resultEliminarServicio = await isPermiso(
          usuario.token,
          "25",
          usuario.id_usuario
        );
        setIsPermisoEliminarServicio(resultEliminarServicio);
        localStorage.setItem(
          "isPermisoEliminarServicio",
          resultEliminarServicio
        );
      } else {
        setIsPermisoEliminarServicio(
          Boolean(localStorage.getItem("isPermisoEliminarServicio"))
        );
      }
      if (localStorage.getItem("sPermisoModificarServicio") === null) {
        const resultModificarServicio = await isPermiso(
          usuario.token,
          "24",
          usuario.id_usuario
        );
        setIsPermisoModificarServicio(resultModificarServicio);
        localStorage.setItem(
          "isPermisoModificarServicio",
          resultModificarServicio
        );
      } else {
        setIsPermisoModificarServicio(
          Boolean(localStorage.getItem("isPermisoModificarServicio"))
        );
      }
      if (localStorage.getItem("isPermisoServicioLocal") === null) {
        const resulServicioLocal = await isPermiso(
          usuario.token,
          "26",
          usuario.id_usuario
        );
        setIsPermisoServicioLocal(resulServicioLocal);
        localStorage.setItem("isPermisoServicioLocal", resulServicioLocal);
      } else {
        setIsPermisoServicioLocal(
          Boolean(localStorage.getItem("isPermisoServicioLocal"))
        );
      }
      if (localStorage.getItem("isPermisoServicioGeneral") === null) {
        const resultServicioGeneral = await isPermiso(
          usuario.token,
          "27",
          usuario.id_usuario
        );
        setIsPermisoServicioGeneral(resultServicioGeneral);
        localStorage.setItem("isPermisoServicioGeneral", resultServicioGeneral);
      } else {
        setIsPermisoServicioGeneral(
          Boolean(localStorage.getItem("isPermisoServicioGeneral"))
        );
      }

      // cargar cambio de moneda
      if (localStorage.getItem("cambioMoneda") === null) {
        setCambioMoneda(await getValorMonedaUSD(usuario.token));
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
  const [filterItems, setFilterItems] = useState<Servicio[]>([]);

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
  const [rangoPrecioDesdeSearch, setRangoPrecioDesdeSearch] = useState("");
  const [rangoPrecioHastaSearch, setRangoPrecioHastaSearch] = useState("");
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
    filtrarYOrdenarServicios(fechaDesde, `${year}-${month}-${day}`);
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
    setCantidadTransferencia("0");
    setIdTipoServicioDetails("");
    setIsDeudaDetails(false);
    setIsEncargoProducto(false);
    setAdelantoCUPDeudaDetails("0");
    setAdelantoUSDDeudaDetails("0");

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
      const resultServicio = await getServicioByID(
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
          setIdTiendaDetailsViejo(resultServicio.tienda.id_tienda);

          setIdProductoDetails(resultventa.producto.id_producto);
          setIdFirsTimeProducto(resultventa.producto.id_producto);
          setCantidadProductoDetails(resultventa.cantidad);
          setIdTiendaDetails(resultServicio.tienda.id_tienda);
          setPrecioUSDDetails(resultServicio.precio);
          setPrecioCUPDetails(
            String(
              (parseFloat(resultServicio.precio) * cambioMoneda).toFixed(0)
            )
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
        setPrecioUSDDetails(resultServicio.precio);
        setPrecioCUPDetails(
          String((parseInt(resultServicio.precio) * cambioMoneda).toFixed(0))
        );
        setCostoPromedioProductoUSDDetails(resultServicio.costo);
      }
    }
  };

  // Cargar todos los datos de el servicio pro primera ves que se abre el servicio
  const cargarDetailsOfServicio = async () => {
    setAuxOptimizacion(false);
    if (usuario?.token && modalEntradasDates?.id_entrada) {
      // Reinicia los datos de la fecha antes de realizar la carga de datos
      setIsDateLoaded(false); // Para asegurarte de que el componente no use los datos antiguos

      const result = await getServicioByID(
        usuario.token,
        modalEntradasDates.id_entrada
      );

      if (result) {
        // Extraemos los datos de fecha de result.fecha
        const [year, month, day] = result.fecha.split("T")[0].split("-");

        // Actualizamos los detalles
        setIdServicioDetails(result.id_servicio);
        setIdClienteDetails(result.cliente.id_cliente);
        setIdTipoServicioDetails(result.tipo_servicio.id_tipo_servicio);
        setNotaDetails(result.nota);
        setDescripcionDetails(result.descripcion);
        setDevueltoDetails(result.devuelto ? "devolver" : "sin devolver");
        setIsGarantiaDetails(result.garantia !== null);
        setCantidadTransferencia(result.cantidad_transferida);
        setDuracionGarantiaDetails(
          result.garantia !== null ? result.garantia.duracion : ""
        );
        setIdGarantiaDetails(
          result.garantia !== null ? result.garantia.id_garantia : ""
        );
        setIdEncargoDetails(
          result.encargo !== null ? result.encargo.id_encargo : ""
        );
        setAdelantoEncargo(
          result.encargo !== null ? result.encargo.adelanto : ""
        );
        setIdDeudaDetails(result.deuda !== null ? result.deuda.id_deuda : "");
        if (result.encargo !== null) {
          const partes: string[] = String(result.encargo.fecha).split("-");

          // Asignar las partes a variables separadas
          const anio: string = partes[0]; // "2024"
          const mes: string = partes[1]; // "12"
          const dia: string = partes[2]; // "16"
          setFechaAnnoDetailsEncargo(String(parseInt(anio)));
          setFechaMesDetailsEncargo(String(parseInt(mes)));
          setFechaDiaDetailsEncargo(String(parseInt(dia)));
        }

        // Actualizar variables para la validación de campos
        setIdTipoServicioDetailsViejo(result.tipo_servicio.id_tipo_servicio);
        setDevueltoDetailsViejo(result.devuelto ? "devolver" : "sin devolver");
        setDuracionGarantiaDetailsVieja(
          result.garantia !== null ? result.garantia.duracion : ""
        );
        setIsGarantiaDetailsViejo(result.garantia !== null);

        // Si es un tip de servicios de venta se carga el producto que se halla vendiod o que se esté vendiendo con todos su datos
        if (parseInt(result.tipo_servicio.id_tipo_servicio) === 2) {
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
            setIdTiendaDetails(result.tienda.id_tienda);
            setPrecioUSDDetails(result.precio);
            setPrecioCUPDetails(
              String((parseFloat(result.precio) * cambioMoneda).toFixed(0))
            );
            setCostoPromedioProductoUSDDetails(result.costo_acumulado);
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
          setPrecioUSDDetails(result.precio);
          setPrecioCUPDetails(
            String((parseInt(result.precio) * cambioMoneda).toFixed(0))
          );
          setCostoPromedioProductoUSDDetails(result.costo);
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
  ): Promise<Servicio[] | null> => {
    if (usuario?.token) {
      const resultServicioGeneral = await isPermiso(
        usuario.token,
        "27",
        usuario.id_usuario
      );

      try {
        const result = await filtrarSrvicio(
          usuario.token,
          nombreClienteSearch,
          idTipoServicioSearch,
          resultServicioGeneral ? idTiendaSearch : usuario.id_tienda,
          rangoPrecioDesdeSearch,
          rangoPrecioHastaSearch,
          fechaDesde,
          fechaHasta,
          nombreProductoSearsh
        );

        if (result) {
          const serviciosMapeados: Servicio[] = await Promise.all(
            result.map(async (element: any) => ({
              id_Servicio: element.id_servicio,
              id_Cliente: element.cliente.id_cliente,
              id_Tienda: element.tienda.id_tienda,
              id_Tipo_servicio: element.tipo_servicio.id_tipo_servicio,
              id_Deuda: "",
              id_Garantia: "",
              fecha: element.fecha,
              precio: element.precio,
              nota: element.nota,
              descripcion: element.descripcion,
              nombreCliente: element.cliente.nombre,
              nombreTienda: element.tienda.nombre,
              nombreTipoServicio: element.tipo_servicio.nombre,
              nombreProducto: element.venta
                ? element.venta.producto.nombre
                : "", // Verifica si 'venta' no es null
              cantidad: element.venta ? element.venta.cantidad : "", // Verifica si 'venta' no es null
              devuelto: element.devuelto,
              costo: element.costo,
              cantidad_transferida: element.cantidad_transferida,
              costo_tipo_servicio: element.tipo_servicio.costo,
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
    xº;
  };

  // Cargar datos del servicio cuando se seleccionado en la tabla
  useEffect(() => {
    cargarDetailsOfServicio();
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
          setPrecioUSDDetailsAuxVal(resultProdcuto.precio ?? 0);
          setPrecioCUPDetails(
            String(
              (parseFloat(resultProdcuto.precio) * cambioMoneda).toFixed(0)
            ) ?? 0
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
  const filtrarYOrdenarServicios = async (
    fechaDesde: string,
    fechaHasta: string
  ) => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let serviciosFiltradas: Servicio[] =
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
    filtrarYOrdenarServicios(
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

  const auxSetModalServicioSingleDates = () => {
    setIsVentaProducto(true);
    setIdProductoDetails("");
    setAuxOptimizacion(true);

    setIsDateLoaded(false);
    setIdTiendaDetails(usuario?.id_tienda);
    setIdTipoServicioDetails("");
    setIdClienteDetails("");
    setIdProductoDetails("");
    setIdProductoAuxModificarDetails("");
    setIdProductoDetailsViejo("");
    setPrecioUSDDetails("");
    setPrecioCUPDetails("");
    setCantidadProductoDetails("");
    setCostoPromedioProductoUSDDetails("");
    setCantidadProductoDetails("");
    setNotaDetails("");
    setDescripcionDetails("");

    setIsModalAddMultiServicioSingle(!isModalAddMultiServicioSingle);

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
  const auxSetModalProovedoresDates = () => {
    setIsDateLoaded(false);
    setIdTiendaDetails(usuario?.id_tienda);
    setIdTipoServicioDetails("");
    setIdClienteDetails("");
    setPrecioUSDDetails("");
    setPrecioCUPDetails("");
    setCantidadProductoDetails("");
    setCostoPromedioProductoUSDDetails("");
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
      filtrarYOrdenarServicios(
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

  // Agregar miltiples servicios al sistema
  const addNewMultiServicio = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Agregando multiples ventas. Espere por favor");
    setModalMensajeView(true);
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      // Validar que se halla seleccionado un Cliente y una Tienda
      if (
        idClienteMutiDetails === "" ||
        idTiendaMultiDetails === "" ||
        multiServiciosItems.length === 0
      ) {
        setModalMensaje(
          "Debe seleccionar un Cliente y una Tienda para continuar o no hay ventas que agregar."
        );
        setIsBotonModalMesajeVisible(true);
        setModalMensajeView(true);
        setIsButtonDisabled(false);
        return;
      }

      let sumaTransferencias: number = 0;
      let sumaPreciosTotales: number = 0;
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL AGREGAR VENTAS. Por favor verifique las siguientes ventas:\n";
      for (let i = 0; i < multiServiciosItems.length; i++) {
        const item = multiServiciosItems[i];
        const auxIsProductoInTienda = await isProductoInTienda(
          usuario.token,
          item.idProductoDetails,
          idTiendaMultiDetails || ""
        );
        let validarCamposSingle = "-" + item.nombreProducto + ":\n";
        let auxFlag = true;

        // Validar campos
        if (item.isGarantiaDetails && parseInt(idClienteMutiDetails) === 1) {
          auxFlag = false;
          validarCamposSingle +=
            "-  La venta del producto " +
            item.nombreProducto +
            " tiene garantía por lo que el cliente no puede ser anónimo.\n";
        }
        if (auxIsProductoInTienda) {
          if (
            parseInt(auxIsProductoInTienda.cantidad) <
            parseInt(item.cantidadProductoDetails)
          ) {
            auxFlag = false;
            validarCamposSingle +=
              "-  La cantidad que desea vender del producto " +
              item.nombreProducto +
              " es mayor que la cantidad que hay en la tienda.\n";
          }
        }
        if (item.isDeudaDetails) {
          if (parseInt(idClienteMutiDetails) === 1) {
            auxFlag = false;
            validarCamposSingle +=
              "-  La venta el producto " +
              item.nombreProducto +
              " genera una deuda por tanto, el cliente no puede ser anónimo.\n";
          }
        }

        if (!auxFlag) {
          flag = false;
          validarCampos += validarCamposSingle;
        }

        // Obtener la Sumatoria de los precios y las transferencias
        sumaPreciosTotales += parseFloat(((item.precioUSDDetails) * cambioMoneda).toFixed(0)) * parseInt(item.cantidadProductoDetails);
        sumaTransferencias += parseFloat(item.cantidadTransferencia);
      }

      // Validar y asignar transferencia
      if (sumaPreciosTotales < sumaTransferencias) {
        flag = false;
        validarCampos += "-La suma de las transferencias es mayor que la suma de los precios.\n";
      } else {
          // Ordenar los items por precio de mayor a menor
          const itemsOrdenados = [...multiServiciosItems].sort((a, b) =>
            parseFloat(b.precioUSDDetails) * b.cantidadProductoDetails - parseFloat(a.precioUSDDetails) * a.cantidadProductoDetails
          );

          let transferenciaRestante = sumaTransferencias;

          // Redistribuir las transferencias
          for (let i = 0; i < itemsOrdenados.length; i++) {
            const item = itemsOrdenados[i];
            const precioItem = parseFloat(((item.precioUSDDetails) * cambioMoneda).toFixed(0)) * parseInt(item.cantidadProductoDetails);

            // Si es el último item, asignar todo lo que queda
            if (i === itemsOrdenados.length - 1) {
              item.cantidadTransferencia = transferenciaRestante;
            } else {
              // Asignar la transferencia máxima posible sin exceder el precio
              item.cantidadTransferencia = Math.min(transferenciaRestante, precioItem);
            }

            // Actualizar la transferencia restante
            transferenciaRestante -= item.cantidadTransferencia;
          }

          // Actualizar los items originales con las nuevas transferencias
          setMltiServiciosItems(multiServiciosItems.map(item => {
            const itemActualizado = itemsOrdenados.find(i => i.idProductoDetails === item.idProductoDetails);
            return itemActualizado ? { ...item, cantidadTransferencia: itemActualizado.cantidadTransferencia } : item;
          }));
      }

      if (flag) {
        for (let i = 0; i < multiServiciosItems.length; i++) {
          const item = multiServiciosItems[i];
          const resultAddServicio = await addServicio(
            usuario.token,
            item.fecha,
            item.precioUSDDetails,
            item.notaDetails,
            item.descripcionDetails,
            idTiendaMultiDetails,
            2,
            item.costoPromedioProductoUSDDetails,
            item.cantidadTransferencia,
            idClienteMutiDetails,
            "Not suport yet",
            "not suport yet"
          );
          /*
          if (resultAddServicio === false) {
            setModalMensaje(
              "Ha ocurrido un ERROR al agregar el servicio. Es posible que el error haya ocurrido por problemas de conexión. Si el problema persiste contacte al administrador."
            );
            setIsBotonModalMesajeVisible(true);
            setModalMensajeView(true);
            setIsButtonDisabled(false);
            return;
          }
            */

          //Agregar Garantía si es que hay
          if (item.isGarantiaDetails) {
            await addGarantia(
              usuario.token,
              duracionGarantiaDetails,
              resultAddServicio.id_servicio
            );
          }
          // Agregar Deuda y pago de deuda si es que existen
          if (item.isDeudaDetails) {
            const resultDeuda = await addDeuda(
              usuario.token,
              item.precioUSDDetails,
              resultAddServicio.id_servicio,
              undefined
            );
            if (
              item.adelantoUSDDeudaDetails &&
              parseFloat(item.adelantoUSDDeudaDetails) > 0
            ) {
              await addPagoDeuda(
                usuario.token,
                item.adelantoUSDDeudaDetails,
                item.fecha,
                resultDeuda.id_deuda
              );
            }
          }

          //Agregar venta
          await addVenta(
            usuario.token,
            item.idProductoDetails,
            resultAddServicio.id_servicio,
            item.cantidadProductoDetails
          );
          await tienda_Realizarventa(
            usuario.token,
            item.idProductoDetails,
            idTiendaMultiDetails,
            `${parseInt(item.cantidadProductoDetails)}`
          );

          // Machear producto
          await matchProductoInTienda(usuario.token, item.idProductoDetails, idTiendaMultiDetails);

          // Agregar Acción de usuario agregar servicio normal
          const nombreCliente = dropdownItemsNombreCliente.find((element) => {
            return element.value === idClienteMutiDetails;
          });
          const nombreTipoServicio = dropdownItemsNombreTipoServicio.find(
            (element) => {
              return parseInt(element.value) === 2;
            }
          );
          const nombreProducto = dropdownItemsNombreproducto.find((element) => {
            return element.value === item.idProductoDetails;
          });
          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó un servicio del tipo de servicio ${nombreTipoServicio?.label} al cliente ${nombreCliente?.label}. Se vendió una cantidad de ${item.cantidadProductoDetails} del producto ${nombreProducto?.label} a un precio de ${(parseFloat(item.precioUSDDetails) * cambioMoneda).toFixed(0)} CUP`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            7
          );
          await createProductoInTienda(
            usuario.token,
            idTipoServicioDetails,
            idTiendaMultiDetails
          );
        }

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`Las Ventas se agregaron con exito`);
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
      } else {
        setModalMensaje(validarCampos);
        setIsBotonModalMesajeVisible(true);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Agregar servicio a la lista de servoicio a la lista para venta multiples
  const addNewMultiServicioToList = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Agregando servicio a la lista. Espere por favor");
    setModalMensajeView(true);
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL INGRESAR SERVICIO. Por favor verifique los siguientes campos:\n";

      if (
        costoPromedioProductoUSDDetails === "" ||
        costoPromedioProductoUSDDetails === undefined
      ) {
        flag = false;
        validarCampos += "-Digite el costo del servicio.\n";
      }
      if (
        parseFloat(precioUSDDetails) !== parseFloat(precioUSDDetailsAuxVal) &&
        descripcionDetails === ""
      ) {
        flag = false;
        validarCampos +=
          "-Si cambia el precio original del producto debe proporcionar una descripcipón del porque.\n";
      }
      if (
        precioUSDDetails === "" ||
        costoPromedioProductoUSDDetails === undefined
      ) {
        flag = false;
        validarCampos += "-Defina el precio cobrado al cliente.\n";
      }
      if (isGarantiaDetails && duracionGarantiaDetails === "") {
        flag = false;
        validarCampos += "-Defina la duración de la garantía.\n";
      }
      if (idTiendaDetails === "") {
        flag = false;
        validarCampos += "-Seleccione una tienda.\n";
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
      // Validacion de deuda
      if (isDeudaDetails && !isEncargoProducto) {
        if (
          parseFloat(adelantoUSDDeudaDetails) >
          parseFloat(precioUSDDetails) * cambioMoneda
        ) {
          flag = false;
          validarCampos +=
            "-El adelanto inicial de la deuda es mayor que el monto a cobrar por el servicio.\n";
        }
        if (parseInt(idClienteDetails) === 1) {
          flag = false;
          validarCampos += "-El cliente Anónimo no puede tener deudas";
        }
      }

      if (flag) {
        let detallesSingleServiceItem: any = {
          fecha: `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          precioUSDDetails: precioUSDDetails,
          notaDetails: notaDetails,
          descripcionDetails: descripcionDetails,
          costoPromedioProductoUSDDetails: costoPromedioProductoUSDDetails,
          id:
            multiServiciosItems.length === 0
              ? 1
              : Math.max(...multiServiciosItems.map((item) => item.id)) + 1,
          cantidadTransferencia:
            cantidadTransferencia === "" ? "0" : cantidadTransferencia,
        };
        //Agregar Garantía si es que hay
        if (isGarantiaDetails) {
          detallesSingleServiceItem = {
            ...detallesSingleServiceItem,
            isGarantiaDetails: isGarantiaDetails,
            duracionGarantiaDetails: duracionGarantiaDetails,
          };
        }

        // Agregar Deuda y pago de deuda si es que existen
        if (isDeudaDetails) {
          detallesSingleServiceItem = {
            ...detallesSingleServiceItem,
            isDeudaDetails: isDeudaDetails,
          };
          if (
            adelantoUSDDeudaDetails &&
            parseFloat(adelantoUSDDeudaDetails) > 0
          ) {
            detallesSingleServiceItem = {
              ...detallesSingleServiceItem,
              adelantoUSDDeudaDetails: adelantoUSDDeudaDetails,
            };
          }
        }

        //Agregar venta
        const nombreProducto = dropdownItemsNombreproducto.find((element) => {
          return element.value === idProductoDetails;
        });
        detallesSingleServiceItem = {
          ...detallesSingleServiceItem,
          idProductoDetails: idProductoDetails,
          cantidadProductoDetails: cantidadProductoDetails,
          nombreProducto: nombreProducto?.label,
        };
        setMltiServiciosItems([
          ...multiServiciosItems,
          detallesSingleServiceItem,
        ]);

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`El servicio se agregó a la lista`);
        setModalMensajeView(true);
        setReflechModalMensajeView(false);
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
        setIdProductoDetails("");
      } else {
        setModalMensaje(validarCampos);
        setIsBotonModalMesajeVisible(true);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Método para agregar un nuevo producto al sistema
  const addNewServicio = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Agregando servicio. Espere por favor");
    setModalMensajeView(true);
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      const auxIsProductoInTienda = await isProductoInTienda(
        usuario.token,
        idProductoDetails,
        idTiendaDetails
      );
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL INGRESAR SERVICIO. Por favor verifique los siguientes campos:\n";

      if (
        costoPromedioProductoUSDDetails === "" ||
        costoPromedioProductoUSDDetails === undefined
      ) {
        flag = false;
        validarCampos += "-Digite el costo del servicio.\n";
      }
      if (
        parseFloat(precioUSDDetails) !== parseFloat(precioUSDDetailsAuxVal) &&
        descripcionDetails === ""
      ) {
        flag = false;
        validarCampos +=
          "-Si cambia el precio original del producto debe proporcionar una descripcipón del porque.\n";
      }
      if (
        precioUSDDetails === "" ||
        costoPromedioProductoUSDDetails === undefined
      ) {
        flag = false;
        validarCampos += "-Defina el precio cobrado al cliente.\n";
      }
      if (idClienteDetails === "") {
        flag = false;
        validarCampos +=
          "-Seleccione un cliente. Si no hay datos del cliente seleccione anónimo\n";
      }
      if (idTipoServicioDetails === "") {
        flag = false;
        validarCampos +=
          "-Seleccione el tipo de servicio que está ofreciendo.\n";
      }
      if (isGarantiaDetails && duracionGarantiaDetails === "") {
        flag = false;
        validarCampos += "-Defina la duración de la garantía.\n";
      }
      if (isGarantiaDetails && parseInt(idClienteDetails) === 1) {
        flag = false;
        validarCampos += "-El ciente Anónimo no puede tener garantías";
      }
      if (idTiendaDetails === "") {
        flag = false;
        validarCampos += "-Seleccione una tienda.\n";
      }
      if (
        parseFloat(cantidadTransferencia) >
        parseFloat(precioCUPDetails) * parseInt(cantidadProductoDetails)
      ) {
        flag = false;
        validarCampos +=
          "-La cantidad de la transferencia es mayor que el precio del producto. \n";
      }
      if (auxIsProductoInTienda) {
        if (
          parseInt(auxIsProductoInTienda.cantidad) <
          parseInt(cantidadProductoDetails)
        ) {
          flag = false;
          validarCampos +=
            "-La cantidad que desea vender es mayor que la cantidad que hay en la tienda.\n";
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
      // Validacion de deuda
      if (isDeudaDetails && !isEncargoProducto) {
        if (
          parseFloat(adelantoUSDDeudaDetails) > parseFloat(precioUSDDetails)
        ) {
          flag = false;
          validarCampos +=
            "-El adelanto inicial de la deuda es mayor que el monto a cobrar por el servicio.\n";
        }
        if (parseInt(idClienteDetails) === 1) {
          flag = false;
          validarCampos += "-El cliente Anónimo no puede tener deudas";
        }
      }

      if (flag) {
        const resultAddServicio = await addServicio(
          usuario.token,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          precioUSDDetails,
          notaDetails,
          descripcionDetails,
          idTiendaDetails,
          idTipoServicioDetails,
          costoPromedioProductoUSDDetails,
          cantidadTransferencia === "" ? "0" : cantidadTransferencia,
          idClienteDetails,
          "Not suport yet",
          "not suport yet"
        );


        if (resultAddServicio === false) {
          setModalMensaje(
            "Ha ocurrido un ERROR al agregar el servicio. Es posible que el error haya ocurrido por problemas de conexión. Si el problema persiste contacte al administrador."
          );
          setIsBotonModalMesajeVisible(true);
          setModalMensajeView(true);
          setIsButtonDisabled(false);
          return;
        }

        //Agregar Garantía si es que hay
        if (isGarantiaDetails) {
          await addGarantia(
            usuario.token,
            duracionGarantiaDetails,
            resultAddServicio.id_servicio
          );
        }
        // Agregar Deuda y pago de deuda si es que existen
        if (isDeudaDetails) {
          const resultDeuda = await addDeuda(
            usuario.token,
            precioUSDDetails,
            resultAddServicio.id_servicio,
            undefined
          );
          if (
            adelantoUSDDeudaDetails &&
            parseFloat(adelantoUSDDeudaDetails) > 0
          ) {
            await addPagoDeuda(
              usuario.token,
              adelantoUSDDeudaDetails,
              `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
              resultDeuda.id_deuda
            );
          }
        }

        //Agregar venta si es que es necezario
        if (
          parseInt(idTipoServicioDetails) === 2 ||
          parseInt(idTipoServicioDetails) === 25
        ) {
          await addVenta(
            usuario.token,
            idProductoDetails,
            resultAddServicio.id_servicio,
            cantidadProductoDetails
          );
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetails,
            idTiendaDetails,
            `${parseInt(cantidadProductoDetails)}`
          );

          // Mcahear datos de la cantidad del producto
          await matchProductoInTienda(usuario.token, idProductoDetails, idTiendaDetails);

          // Agregar Acción de usuario agregar servicio normal
          const nombreCliente = dropdownItemsNombreCliente.find((element) => {
            return element.value === idClienteDetails;
          });
          const nombreTipoServicio = dropdownItemsNombreTipoServicio.find(
            (element) => {
              return element.value === idTipoServicioDetails;
            }
          );
          const nombreProducto = dropdownItemsNombreproducto.find((element) => {
            return element.value === idProductoDetails;
          });
          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó un servicio del tipo de servicio ${nombreTipoServicio?.label} al cliente ${nombreCliente?.label}. Se vendió una cantidad de ${cantidadProductoDetails} del producto ${nombreProducto?.label} a un precio de ${(parseFloat(precioUSDDetails) * cambioMoneda).toFixed(0)} CUP`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            7
          );
        } else {
          // Si no es venta de ningun tipo comprobar si es encargo
          if (parseInt(idTipoServicioDetails) === 26) {
            await addEncargo(
              usuario.token,
              adelantoEncargo,
              `${fechaAnnoDetailsEncargo}-${fechaMesDetailsEncargo}-${fechaDiaDetailsEncargo}`,
              resultAddServicio.id_servicio
            );
          }

          // Agregar Acción de usuario agregar servicio normal
          const nombreCliente = dropdownItemsNombreCliente.find((element) => {
            return element.value === idClienteDetails;
          });
          const nombreTipoServicio = dropdownItemsNombreTipoServicio.find(
            (element) => {
              return element.value === idTipoServicioDetails;
            }
          );
          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó un servicio del tipo de servicio ${nombreTipoServicio?.label} a un precio de ${(parseFloat(precioUSDDetails) * cambioMoneda).toFixed(0)} USD al cliente ${nombreCliente?.label}`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            7
          );
        }

        await createProductoInTienda(
          usuario.token,
          idTipoServicioDetails,
          idTiendaDetails
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`El servicio se agregó con éxito`);
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
        setIdProductoDetails("");

        setModalEntradasDates({
          id_entrada: "",
          isAddEntrada: false,
          fileEditable: true,
          isModificarEntrada: false,
        });
      } else {
        setModalMensaje(validarCampos);
        setIsBotonModalMesajeVisible(true);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Método para actualizar los datos de un producto
  const modificarServicioFunction = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

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
          "-Seleccione un cliente. Si no hay datos del cliente seleccione anónimo\n";
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
      if (
        parseFloat(cantidadTransferencia) >
        parseFloat(precioCUPDetails) * parseInt(cantidadProductoDetails)
      ) {
        flag = false;
        validarCampos +=
          "-La cantidad de la transferencia es mayor que el precio del producto. \n";
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
          costoPromedioProductoUSDDetails,
          cantidadTransferencia === "" ? "0" : cantidadTransferencia,
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
            `${parseInt(cantidadProductoDetails) -
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
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} modificó un servicio de originalmente ${cantidadAuxModificarDetails} del producto ${nombreProducto?.label} en la tienda ${nombreTienda?.label}`;
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
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Método para eliminar los datos de un producto
  const eliminarServicioFunction = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Eliminando servicio. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL ELIMINAR SERVICIO. Compruebe los siguientes parámetros:\n";

      if (flag) {
        const resultServicio = await getServicioByID(
          usuario.token,
          idServicioDetails
        );
        const resultventa = await getVentaByIDOfServicio(
          usuario.token,
          idServicioDetails
        );
        // Eliminar Garantía si es que existe
        if (isGarantiaDetailsViejo) {
          await deleteGarantia(usuario.token, idGarantiaDetails);
        }
        // Eliminar deuda
        if (idDeudaDetails !== "") {
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
        }
        // Eliminar Encargo
        // Actualizar encargo
        if (parseInt(idTipoServicioDetailsViejo) === 26) {
          await deleteEncargo(usuario.token, idEncargoDetails);
        }
        // Eliminar la venta y sumar en proucto tienda si es que era una venta y no se havia echo devolución
        if (
          (parseInt(idTipoServicioDetails) === 2 ||
            parseInt(idTipoServicioDetails) === 25) &&
          devueltoDetailsViejo === "sin devolver"
        ) {
          await deleteVenta(
            usuario.token,
            resultventa.producto.id_producto,
            resultServicio.id_servicio
          );
          await tienda_Realizarventa(
            usuario.token,
            resultventa.producto.id_producto,
            resultServicio.tienda.id_tienda,
            `${parseInt(resultventa.cantidad) * -1}`
          );
        } else if (
          (parseInt(idTipoServicioDetails) === 2 ||
            parseInt(idTipoServicioDetails) === 25) &&
          devueltoDetailsViejo === "devolver"
        ) {
          // Solo se elimina la venta porque ya se sumó en producto tienda si es devolución
          await deleteVenta(
            usuario.token,
            resultventa.producto.id_producto,
            resultServicio.id_servicio
          );
        }
        await deleteServicio(usuario.token, idServicioDetails);

        if (parseInt(idServicioDetails) === 2) {
          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó la el servicio de venta de la tienda ${resultServicio.tienda.nombre}. La venta eliminada fue del producto ${nombreClienteSearch}, se sumo una canidad de ${resultventa.cantidad} nuevamente en la tienda cuyo producto valía ${(resultventa.precio * cambioMoneda).toFixed(0)} y se vendió una cantidad de ${resultventa.cantidad}.`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            7
          );
        } else {
          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó la un servicio de la tienda ${resultServicio.tienda.nombre} por el cual se había cobrado ${(resultServicio.precio * cambioMoneda).toFixed(0)} y tenía un costo de ${resultServicio.costo}`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            7
          );
        }

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`El servicio se eliminó con éxito`);
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
  const columnasMyDateTableDesktop = [
    "Nombre Cliente",
    "Tienda",
    "Tipo de Servicio",
    "Producto",
    "Cantidad",
    "P.Unitario",
    "P.total CUP",
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
    "Nombre Cliente",
    "Tienda",
    "Tipo de Servicio",
    "Producto",
    "Cantidad",
    "P.Unitario",
    "P.total CUP",
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
          {isPermisoAgregarServicio && (
            <TouchableOpacity
              onPress={() =>
                setIsModalAddMultiServicio(!isModalAddMultiServicio)
              }
              style={{
                flexDirection: "row",
                height: 40,
                width: "40%",
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
                marginRight: "5%",
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
                Agregar Multiples Ventas
              </Text>
            </TouchableOpacity>
          )}
          {isPermisoAgregarServicio && (
            <TouchableOpacity
              onPress={() => auxSetModalProovedoresDates()}
              style={{
                flexDirection: "row",
                height: 40,
                width: "40%",
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
              <Text style={styles.radioButtonTextMovil}>Agregar Venta</Text>
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
            <MyDateTableServicios
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
                    Rango de Precio en CUP:
                  </Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyDesktop}
                      placeholder="Desde"
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
                          filtrarYOrdenarServicios(
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

        {/*Multi add servicio */}
        <Modal
          transparent={true}
          visible={isModalAddMultiServicio}
          animationType="fade"
          onRequestClose={() => {
            setIsModalAddMultiServicio(!isModalAddMultiServicio);
          }}
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
                onPress={() => {
                  setIsModalAddMultiServicio(!isModalAddMultiServicio);
                }}
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
                  ? "Crear Venta"
                  : "Datos de las Ventas"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Cliente */}
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
                    value={idClienteMutiDetails}
                    placeholder="Seleccione un Cliente"
                    setValue={setIdClienteMultiDetails}
                    items={dropdownItemsNombreCliente}
                    searchable={true}
                    readOnly={
                      !(isPermisoModificarServicio || isPermisoServicioLocal)
                    }
                    onDropdownOpen={() => controlarCapas("ClienteDetails")}
                  />
                </View>

                {/* Nombre de la Tienda */}
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadTipoServicioDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Tienda donde se creará la venta
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadTipoServicioDetails,
                    position: "relative",
                  }}
                >
                  <CustomDropdownDetails
                    value={idTiendaMultiDetails}
                    placeholder="Seleccione una tienda"
                    setValue={setIdTiendaMultiDetails}
                    items={dropdownItemsNombreTienda}
                    readOnly={
                      !(isPermisoServicioGeneral &&
                        modalEntradasDates?.id_entrada === ""
                        ? true
                        : isPermisoServicioGeneral &&
                        isPermisoModificarServicio)
                    }
                    searchable={true}
                    onDropdownOpen={() => controlarCapas("TipoServicioDetails")}
                  />
                </View>

                {/* Lista de servicios */}
                <View
                  style={{
                    width: "90%",
                    zIndex: 500,
                    position: "relative",
                    marginTop: "2%",
                  }}
                >
                  {/*Boton para agregar un servicio a la lista */}
                  <TouchableOpacity
                    onPress={() => auxSetModalServicioSingleDates()}
                    style={{
                      flexDirection: "row",
                      height: 10,
                      width: 100,
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
                      marginBottom: "2%",
                      backgroundColor: Colors.azul_Claro, // Color de fondo del botón
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color: Colors.blanco,
                        textShadowColor: "rgba(0, 0, 0, 0.5)",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                        marginBottom: "10%",
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      width: "100%",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.gris_claro,
                      backgroundColor: Colors.gris_claro,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Producto
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Precio
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Cantidad
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      ></Text>
                    </View>
                  </View>
                  {multiServiciosItems.length > 0 ? (
                    <FlatList
                      data={multiServiciosItems}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          onPress={() => console.log(multiServiciosItems)}
                        >
                          <View
                            style={{
                              width: "100%",
                              padding: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: Colors.gris_claro,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: "10%",
                                  color: Colors.negro,
                                  width: "43%", // Establece un ancho fijo para el nombre del producto
                                  ellipsizeMode: "tail", // Trunca el texto si es demasiado largo
                                }}
                              >
                                {item.nombreProducto}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: "10%",
                                  color: Colors.negro,
                                  width: "35%", // Establece un ancho fijo para el precio del producto
                                }}
                              >
                                {(item.precioUSDDetails * cambioMoneda).toFixed(
                                  0
                                )}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: "10%",
                                  color: Colors.negro,
                                  marginRight: "10%",
                                  width: "10%", // Establece un ancho fijo para la cantidad del producto
                                }}
                              >
                                {item.cantidadProductoDetails}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  marginTop: "10%",
                                  color: Colors.negro,
                                  marginRight: "5%",
                                  width: "10%", // Establece un ancho fijo para el precio del producto
                                }}
                              >
                                {(
                                  item.precioUSDDetails *
                                  item.cantidadProductoDetails *
                                  cambioMoneda
                                ).toFixed(0)}
                              </Text>
                              <TouchableOpacity
                                style={{
                                  backgroundColor: "red",
                                  padding: 10,
                                  marginTop: "10%",
                                  borderRadius: 5,
                                }}
                                onPress={() => {
                                  const index = multiServiciosItems.findIndex(
                                    (item) => item.id === item.id
                                  );
                                  if (index !== -1) {
                                    multiServiciosItems.splice(index, 1);
                                    setMltiServiciosItems([
                                      ...multiServiciosItems,
                                    ]);
                                  }
                                }}
                              >
                                <Image
                                  source={require("../images/delete.png")}
                                  style={{
                                    width: 15,
                                    height: 15,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  ) : (
                    <Text style={{ fontSize: 12, color: Colors.negro }}></Text>
                  )}
                  <View
                    style={{
                      width: "100%",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.gris_claro,
                      backgroundColor: Colors.gris_claro,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      ></Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Total Transferencia:{" "}
                        {multiServiciosItems.reduce(
                          (total, item) =>
                            total + parseFloat(item.cantidadTransferencia),
                          0
                        )}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Total Efectivo:{" "}
                        {(
                          multiServiciosItems.reduce(
                            (total, item) =>
                              total +
                              parseFloat(item.precioUSDDetails) *
                              parseInt(item.cantidadProductoDetails),
                            0
                          ) *
                          cambioMoneda -
                          multiServiciosItems.reduce(
                            (total, item) =>
                              total + parseFloat(item.cantidadTransferencia),
                            0
                          )
                        ).toFixed(0)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Total:{" "}
                        {(
                          multiServiciosItems.reduce(
                            (total, item) =>
                              total +
                              item.precioUSDDetails *
                              item.cantidadProductoDetails,
                            0
                          ) * cambioMoneda
                        ).toFixed(0)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      ></Text>
                    </View>
                  </View>

                  {/*Boton para agregar un servicio a la lista */}
                  <TouchableOpacity
                    onPress={() => addNewMultiServicio()}
                    style={{
                      flexDirection: "row",
                      height: 15,
                      width: 210,
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
                      marginTop: "2%",
                      backgroundColor: Colors.azul_Claro, // Color de fondo del botón
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.blanco,
                        textShadowColor: "rgba(0, 0, 0, 0.5)",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      Agregar Ventas al Sistema
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/*Modal para agregar multiples servicios de uno en uno  */}
        <Modal
          transparent={true}
          visible={isModalAddMultiServicioSingle}
          animationType="fade"
          onRequestClose={auxSetModalServicioSingleDates}
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
                onPress={auxSetModalServicioSingleDates}
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
                {"Agregar Venta a la Lista"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    zIndex: 500,
                  }}
                >
                  {/* Garantías */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: 500,
                    }}
                  >
                    {isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Adelanto del encargo
                      </Text>
                    )}
                    {isEncargoProducto && (
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
                    )}

                    <View style={{ marginTop: "2%" }}>
                      <Text style={styles.labelTextModalDesktop}>
                        Cantidad Pagada por Transferencia CUP
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={cantidadTransferencia}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;
                          setCantidadTransferencia(validNumericValue);
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          isPermisoModificarServicio || isPermisoServicioLocal
                        }
                        placeholder="Cantidad Pagada por Transferencia CUP"
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
                  >
                    {true && (
                      <Text style={styles.labelTextModalDesktop}>
                        Genera Deuda
                      </Text>
                    )}
                    {true && (
                      <CustomRadioButtonSingle
                        onPress={() => setIsDeudaDetails(!isDeudaDetails)}
                        selected={isDeudaDetails}
                        label="Deuda"
                      />
                    )}

                    {isDateLoaded && isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Fecha llegada
                      </Text>
                    )}
                    {isDateLoaded && isEncargoProducto && (
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
                    )}


                    {!isEncargoProducto && isDeudaDetails && (
                      <Text style={styles.labelTextModalDesktop}>
                        Adelanto inicial de la deuda en CUP:
                      </Text>
                    )}
                    {!isEncargoProducto && isDeudaDetails && (
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={adelantoCUPDeudaDetails}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;

                          setAdelantoCUPDeudaDetails(validNumericValue);
                          const costoUSD =
                            parseFloat(validNumericValue) / cambioMoneda;
                          setAdelantoUSDDeudaDetails(costoUSD.toFixed(5));
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          isPermisoModificarServicio || isPermisoServicioLocal
                        }
                        placeholder="Adelanto"
                      />
                    )}
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
                          ? "Costo promedio del producto"
                          : "Costo del servicio en USD"}
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
                                ).toFixed(0)
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
                          parseInt(idTipoServicioDetails) === 2 || parseInt(idTipoServicioDetails) === 25 ? ((parseInt(usuario?.id_usuario) === 1 || parseInt(usuario?.id_usuario) === 2) ? true : false) : isPermisoModificarServicio || isPermisoServicioLocal}
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
                            String(
                              (
                                parseFloat(validNumericValue) / cambioMoneda
                              ).toFixed(5)
                            )
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

                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center", // Para separar los campos de forma uniforme
                      alignItems: "center",
                      flexDirection: "row",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text>{mensajeSumaVenta()}</Text>
                  </View>
                )}

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
                  {true && (
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
                      onPress={() => addNewMultiServicioToList()}
                      disabled={isButtonDisabled}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                        }}
                      >
                        Agregar Venta a la lista
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/*Agregar un unico servicio */}
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
                  ? "Crear Venta"
                  : "Datos de la Venta"}
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
                    zIndex: 500,
                  }}
                >
                  {/* Pago por ptransferencia */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: 500,
                    }}
                  >
                    {isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Adelanto del encargo
                      </Text>
                    )}
                    {isEncargoProducto && (
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
                    )}

                    <View style={{ marginTop: "2%" }}>
                      <Text style={styles.labelTextModalDesktop}>
                        Cantidad Pagada por Transferencia CUP
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={cantidadTransferencia}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;
                          setCantidadTransferencia(validNumericValue);
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          isPermisoModificarServicio || isPermisoServicioLocal
                        }
                        placeholder="Cantidad Pagada por Transferencia CUP"
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
                  >
                    {!isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Genera Deuda
                      </Text>
                    )}
                    {!isEncargoProducto && (
                      <CustomRadioButtonSingle
                        onPress={() => setIsDeudaDetails(!isDeudaDetails)}
                        selected={isDeudaDetails}
                        label="Deuda"
                      />
                    )}

                    {isDateLoaded && isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Fecha llegada
                      </Text>
                    )}
                    {isDateLoaded && isEncargoProducto && (
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
                    )}

                    {!isEncargoProducto &&
                      isDeudaDetails &&
                      modalEntradasDates?.id_entrada === "" && (
                        <Text style={styles.labelTextModalDesktop}>
                          Adelanto inicial de la deuda en CUP:
                        </Text>
                      )}
                    {!isEncargoProducto &&
                      isDeudaDetails &&
                      modalEntradasDates?.id_entrada === "" && (
                        <CustomTextImputSearch
                          style={styles.textImputModal}
                          value={adelantoCUPDeudaDetails}
                          onChangeText={(text) => {
                            // Permite solo números y un punto decimal
                            const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                            // Asegura que solo haya un punto decimal
                            const validNumericValue =
                              numericValue.split(".").length > 2
                                ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                                : numericValue;

                            setAdelantoCUPDeudaDetails(validNumericValue);
                            const costoUSD =
                              parseFloat(validNumericValue) / cambioMoneda;
                            setAdelantoUSDDeudaDetails(costoUSD.toFixed(5));
                          }}
                          cursorColor={Colors.azul_Oscuro}
                          editable={
                            isPermisoModificarServicio || isPermisoServicioLocal
                          }
                          placeholder="Adelanto"
                        />
                      )}
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
                          ? "Costo promedio del producto"
                          : "Costo del servicio en USD"}
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
                                ).toFixed(0)
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
                          parseInt(idTipoServicioDetails) === 2 || parseInt(idTipoServicioDetails) === 25 ? ((parseInt(usuario?.id_usuario) === 1 || parseInt(usuario?.id_usuario) === 2) ? true : false) : isPermisoModificarServicio || isPermisoServicioLocal}
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
                            String(
                              (
                                parseFloat(validNumericValue) / cambioMoneda
                              ).toFixed(5)
                            )
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

                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center", // Para separar los campos de forma uniforme
                      alignItems: "center",
                      flexDirection: "row",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text>{mensajeSumaVenta()}</Text>
                  </View>
                )}

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
                  {isPermisoModificarServicio &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Oscuro,
                          borderRadius: 15,
                          width: "45%", // Ancho fijo para pantallas de escritorio
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
                            `¿Estás seguro que deseas MODIFICAR los datos de este servicio?`
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
                          Modificar Servicio
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarServicio &&
                    modalEntradasDates?.id_entrada === "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Claro,
                          borderRadius: 15,
                          width: "45%", // Ancho fijo para pantallas de escritorio
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
                        onPress={() => addNewServicio()}
                        disabled={isButtonDisabled}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Venta
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
                            `¿Estás seguro que deseas ELIMINAR al este servicio?`
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
                          Eliminar Servicio
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
                      ? eliminarServicioFunction()
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
                      ? navigation.replace("Ventas")
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
          {isPermisoAgregarServicio && (
            <TouchableOpacity
              onPress={() =>
                setIsModalAddMultiServicio(!isModalAddMultiServicio)
              }
              style={{
                flexDirection: "row",
                height: 30,
                width: "15%",
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
                Agregar Multiples Ventas
              </Text>
            </TouchableOpacity>
          )}

          {isPermisoAgregarServicio && (
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
                Agregar Venta
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
              Rango de Precio en CUP:
            </Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Desde"
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
                    filtrarYOrdenarServicios(
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
            <MyDateTableServicios
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

        {/*Multi add servicio */}
        <Modal
          transparent={true}
          visible={isModalAddMultiServicio}
          animationType="fade"
          onRequestClose={() => {
            setIsModalAddMultiServicio(!isModalAddMultiServicio);
          }}
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
                onPress={() => {
                  setIsModalAddMultiServicio(!isModalAddMultiServicio);
                }}
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
                  ? "Crear Venta"
                  : "Datos de las Ventas"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Cliente */}
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
                    value={idClienteMutiDetails}
                    placeholder="Seleccione un Cliente"
                    setValue={setIdClienteMultiDetails}
                    items={dropdownItemsNombreCliente}
                    searchable={true}
                    readOnly={
                      !(isPermisoModificarServicio || isPermisoServicioLocal)
                    }
                    onDropdownOpen={() => controlarCapas("ClienteDetails")}
                  />
                </View>

                {/* Nombre de la Tienda */}
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadTipoServicioDetails,
                    position: "relative",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Tienda donde se creará la venta
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadTipoServicioDetails,
                    position: "relative",
                  }}
                >
                  <CustomDropdownDetails
                    value={idTiendaMultiDetails}
                    placeholder="Seleccione una tienda"
                    setValue={setIdTiendaMultiDetails}
                    items={dropdownItemsNombreTienda}
                    readOnly={
                      !(isPermisoServicioGeneral &&
                        modalEntradasDates?.id_entrada === ""
                        ? true
                        : isPermisoServicioGeneral &&
                        isPermisoModificarServicio)
                    }
                    searchable={true}
                    onDropdownOpen={() => controlarCapas("TipoServicioDetails")}
                  />
                </View>

                {/* Lista de servicios */}
                <View
                  style={{
                    width: "90%",
                    zIndex: 500,
                    position: "relative",
                    marginTop: "2%",
                  }}
                >
                  {/*Boton para agregar un servicio a la lista */}
                  <TouchableOpacity
                    onPress={() => auxSetModalServicioSingleDates()}
                    style={{
                      flexDirection: "row",
                      height: 10,
                      width: 100,
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
                      marginBottom: "2%",
                      backgroundColor: Colors.azul_Claro, // Color de fondo del botón
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                        color: Colors.blanco,
                        textShadowColor: "rgba(0, 0, 0, 0.5)",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                        marginBottom: "10%",
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      width: "100%",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.gris_claro,
                      backgroundColor: Colors.gris_claro,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Producto
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Precio
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Cantidad
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      ></Text>
                    </View>
                  </View>
                  {multiServiciosItems.length > 0 ? (
                    <FlatList
                      data={multiServiciosItems}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          onPress={() => console.log(multiServiciosItems)}
                        >
                          <View
                            style={{
                              width: "100%",
                              padding: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: Colors.gris_claro,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 18,
                                  color: Colors.negro,
                                  width: "43%", // Establece un ancho fijo para el nombre del producto
                                  ellipsizeMode: "tail", // Trunca el texto si es demasiado largo
                                }}
                              >
                                {item.nombreProducto}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.negro,
                                  width: "35%", // Establece un ancho fijo para el precio del producto
                                }}
                              >
                                {(item.precioUSDDetails * cambioMoneda).toFixed(
                                  0
                                )}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.negro,
                                  marginRight: "10%",
                                  width: "10%", // Establece un ancho fijo para la cantidad del producto
                                }}
                              >
                                {item.cantidadProductoDetails}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.negro,
                                  marginRight: "5%",
                                  width: "10%", // Establece un ancho fijo para el precio del producto
                                }}
                              >
                                {(
                                  item.precioUSDDetails *
                                  item.cantidadProductoDetails *
                                  cambioMoneda
                                ).toFixed(0)}
                              </Text>
                              <TouchableOpacity
                                style={{
                                  backgroundColor: "red",
                                  padding: 10,
                                  borderRadius: 5,
                                }}
                                onPress={() => {
                                  const index = multiServiciosItems.findIndex(
                                    (item) => item.id === item.id
                                  );
                                  if (index !== -1) {
                                    multiServiciosItems.splice(index, 1);
                                    setMltiServiciosItems([
                                      ...multiServiciosItems,
                                    ]);
                                  }
                                }}
                              >
                                <Image
                                  source={require("../images/delete.png")}
                                  style={{
                                    width: 20,
                                    height: 20,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  ) : (
                    <Text style={{ fontSize: 18, color: Colors.negro }}></Text>
                  )}
                  <View
                    style={{
                      width: "100%",
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: Colors.gris_claro,
                      backgroundColor: Colors.gris_claro,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      ></Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Total Transferencia:{" "}
                        {multiServiciosItems.reduce(
                          (total, item) =>
                            total + parseFloat(item.cantidadTransferencia),
                          0
                        )}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Total Efectivo:{" "}
                        {(
                          multiServiciosItems.reduce(
                            (total, item) =>
                              total +
                              parseFloat(item.precioUSDDetails) *
                              parseInt(item.cantidadProductoDetails),
                            0
                          ) *
                          cambioMoneda -
                          multiServiciosItems.reduce(
                            (total, item) =>
                              total + parseFloat(item.cantidadTransferencia),
                            0
                          )
                        ).toFixed(0)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      >
                        Total:{" "}
                        {(
                          multiServiciosItems.reduce(
                            (total, item) =>
                              total +
                              item.precioUSDDetails *
                              item.cantidadProductoDetails,
                            0
                          ) * cambioMoneda
                        ).toFixed(0)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.negro,
                          fontWeight: "bold",
                        }}
                      ></Text>
                    </View>
                  </View>

                  {/*Boton para agregar un servicio a la lista */}
                  <TouchableOpacity
                    onPress={() => addNewMultiServicio()}
                    style={{
                      flexDirection: "row",
                      height: 15,
                      width: 210,
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
                      marginTop: "2%",
                      backgroundColor: Colors.azul_Claro, // Color de fondo del botón
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.blanco,
                        textShadowColor: "rgba(0, 0, 0, 0.5)",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      Agregar Ventas al Sistema
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/*Modal para agregar multiples servicios de uno en uno  */}
        <Modal
          transparent={true}
          visible={isModalAddMultiServicioSingle}
          animationType="fade"
          onRequestClose={auxSetModalServicioSingleDates}
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
                onPress={auxSetModalServicioSingleDates}
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
                {"Agregar Venta a la Lista"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    zIndex: 500,
                  }}
                >
                  {/* Garantías */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: 500,
                    }}
                  >
                    {isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Adelanto del encargo
                      </Text>
                    )}
                    {isEncargoProducto && (
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
                    )}

                    <View style={{ marginTop: "2%" }}>
                      <Text style={styles.labelTextModalDesktop}>
                        Cantidad Pagada por Transferencia CUP
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={cantidadTransferencia}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;
                          setCantidadTransferencia(validNumericValue);
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          isPermisoModificarServicio || isPermisoServicioLocal
                        }
                        placeholder="Cantidad Pagada por Transferencia CUP"
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
                  >
                    {true && (
                      <Text style={styles.labelTextModalDesktop}>
                        Genera Deuda
                      </Text>
                    )}
                    {true && (
                      <CustomRadioButtonSingle
                        onPress={() => setIsDeudaDetails(!isDeudaDetails)}
                        selected={isDeudaDetails}
                        label="Deuda"
                      />
                    )}

                    {isDateLoaded && isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Fecha llegada
                      </Text>
                    )}
                    {isDateLoaded && isEncargoProducto && (
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
                    )}

                    {!isEncargoProducto && isDeudaDetails && (
                      <Text style={styles.labelTextModalDesktop}>
                        Adelanto inicial de la deuda en CUP:
                      </Text>
                    )}
                    {!isEncargoProducto && isDeudaDetails && (
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={adelantoCUPDeudaDetails}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;

                          setAdelantoCUPDeudaDetails(validNumericValue);
                          const costoUSD =
                            parseFloat(validNumericValue) / cambioMoneda;
                          setAdelantoUSDDeudaDetails(costoUSD.toFixed(5));
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          isPermisoModificarServicio || isPermisoServicioLocal
                        }
                        placeholder="Adelanto"
                      />
                    )}
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
                          ? "Costo promedio del producto"
                          : "Costo del servicio en USD"}
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
                                ).toFixed(0)
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
                          parseInt(idTipoServicioDetails) === 2 || parseInt(idTipoServicioDetails) === 25 ? ((parseInt(usuario?.id_usuario) === 1 || parseInt(usuario?.id_usuario) === 2) ? true : false) : isPermisoModificarServicio || isPermisoServicioLocal}
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
                            String(
                              (
                                parseFloat(validNumericValue) / cambioMoneda
                              ).toFixed(5)
                            )
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

                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center", // Para separar los campos de forma uniforme
                      alignItems: "center",
                      flexDirection: "row",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text>{mensajeSumaVenta()}</Text>
                  </View>
                )}

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
                        isReadOnly={
                          !(
                            isPermisoModificarServicio || isPermisoServicioLocal
                          )
                        }
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
                  {true && (
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
                      onPress={() => addNewMultiServicioToList()}
                      disabled={isButtonDisabled}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                        }}
                      >
                        Agregar Venta a la lista
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/*Modal para agregar un unico servicio  */}
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
                  ? "Crear Venta"
                  : "Datos de la Venta"}
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
                    zIndex: 500,
                  }}
                >
                  {/* Garantías */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: 500,
                    }}
                  >
                    {isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Adelanto del encargo
                      </Text>
                    )}
                    {isEncargoProducto && (
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
                    )}

                    <View style={{ marginTop: "2%" }}>
                      <Text style={styles.labelTextModalDesktop}>
                        Cantidad Pagada por Transferencia CUP
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={cantidadTransferencia}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;
                          setCantidadTransferencia(validNumericValue);
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          isPermisoModificarServicio || isPermisoServicioLocal
                        }
                        placeholder="Cantidad Pagada por Transferencia CUP"
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
                  >
                    {!isEncargoProducto &&
                      modalEntradasDates?.id_entrada === "" && (
                        <Text style={styles.labelTextModalDesktop}>
                          Genera Deuda
                        </Text>
                      )}
                    {!isEncargoProducto &&
                      modalEntradasDates?.id_entrada === "" && (
                        <CustomRadioButtonSingle
                          onPress={() => setIsDeudaDetails(!isDeudaDetails)}
                          selected={isDeudaDetails}
                          label="Deuda"
                        />
                      )}

                    {isDateLoaded && isEncargoProducto && (
                      <Text style={styles.labelTextModalDesktop}>
                        Fecha llegada
                      </Text>
                    )}
                    {isDateLoaded && isEncargoProducto && (
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
                    )}

                    {!isEncargoProducto && isDeudaDetails && (
                      <Text style={styles.labelTextModalDesktop}>
                        Adelanto inicial de la deuda en CUP:
                      </Text>
                    )}
                    {!isEncargoProducto && isDeudaDetails && (
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        value={adelantoCUPDeudaDetails}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;

                          setAdelantoCUPDeudaDetails(validNumericValue);
                          const costoUSD =
                            parseFloat(validNumericValue) / cambioMoneda;
                          setAdelantoUSDDeudaDetails(costoUSD.toFixed(5));
                        }}
                        cursorColor={Colors.azul_Oscuro}
                        editable={
                          isPermisoModificarServicio || isPermisoServicioLocal
                        }
                        placeholder="Adelanto"
                      />
                    )}
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
                          ? "Costo promedio del producto"
                          : "Costo del servicio en USD"}
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
                                ).toFixed(0)
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
                          parseInt(idTipoServicioDetails) === 2 || parseInt(idTipoServicioDetails) === 25 ? ((parseInt(usuario?.id_usuario) === 1 || parseInt(usuario?.id_usuario) === 2) ? true : false) : isPermisoModificarServicio || isPermisoServicioLocal}
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
                            String(
                              (
                                parseFloat(validNumericValue) / cambioMoneda
                              ).toFixed(5)
                            )
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

                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center", // Para separar los campos de forma uniforme
                      alignItems: "center",
                      flexDirection: "row",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text>{mensajeSumaVenta()}</Text>
                  </View>
                )}

                {/*Campo de los check bootom */}
                {modalEntradasDates?.id_entrada !== "" && (
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
                      Hacer Devolución
                    </Text>
                  </View>
                )}
                {modalEntradasDates?.id_entrada !== "" && (
                  <View
                    style={{
                      padding: 20,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    {optionsDevueltoDetails.map((option) => (
                      <CustomRadioButton
                        key={option.value}
                        label={option.label}
                        selected={devueltoDetails === option.value}
                        onPress={() => {
                          if (
                            modalEntradasDates?.id_entrada === ""
                              ? true
                              : isPermisoModificarServicio
                          ) {
                            setDevueltoDetails(option.value);
                          }
                        }}
                      />
                    ))}
                  </View>
                )}

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
                        isReadOnly={
                          !(
                            isPermisoModificarServicio || isPermisoServicioLocal
                          )
                        }
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
                  {isPermisoModificarServicio &&
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
                            `¿Estás seguro que deseas MODIFICAR los datos de este servicio?`
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
                          Modificar Servicio
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarServicio &&
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
                        onPress={() => addNewServicio()}
                        disabled={isButtonDisabled}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Venta
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
                            `¿Estás seguro que deseas ELIMINAR al este servicio?`
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
                          Eliminar Servicio
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
                      ? eliminarServicioFunction()
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
                      ? navigation.replace("Ventas")
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

