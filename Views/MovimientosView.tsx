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
  getAllProductos,
  moverProducto,
} from "../services/ProductoServices";
import { ProductoPiker } from "../components/MyDateTableProductos";
import { useModalEntradasDates } from "../contexts/AuxiliarContextModalEntradas";
import { MyDateInput } from "../components/MyDateInput";
import { useSortEntradas } from "../contexts/AuxiliarSortEntradas";
import {
  Movimiento,
  MyDateTableMovimientos,
} from "../components/MyDateTableMovimientos";
import CustomDropdown from "../components/CustomDropDownPicker";
import { ProductoProvider } from "../contexts/ProductoContext";
import {
  deleteMovimiento,
  filtrarMovimientos,
  filtrarMovimientosEspecial,
  getAllMovimientos,
  getMovimientoById,
  ordenarMovimientos,
  updateMovimiento,
} from "../services/MovimientosServices";
import { useSortMovimientosDates } from "../contexts/AuxiliarSortMovimientos";
import { useModalMovimientosDates } from "../contexts/AuxiliarContextModalMovimientos";
import { longPressGestureHandlerProps } from "react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler";
import { getAllUsuarios } from "../services/UsuarioServices";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import CustomRadioButton from "../components/CustomRadioButtonsSearch";

export default function MovimientosView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  // Variables auxiliares para controlar el despliege de los dropDownsPiers
  const [capaPrioridadFechaDesdeSearsh, setCapaPrioridadFechaDesdeSearsh] =
    useState(500);
  const [capaPrioridadFechaHastaSearsh, setCapaPrioridadFechaHastaSearsh] =
    useState(500);
  const [capaPrioridadTiendaOrigenSearsh, setCapaPrioridadTiendaOrigenSearsh] =
    useState(500);
  const [
    capaPrioridadTiendaDestinoSearsh,
    setCapaPrioridadTiendaDestinoSearsh,
  ] = useState(500);
  const [capaPrioridadViewTiendasSearsh, setCapaPrioridadViewTiendasSearsh] =
    useState(500);
  const [capaPrioridadViewFechaSearsh, setCapaPrioridadViewFechaSearsh] =
    useState(500);

  const [capaPrioridadViewFechaDetails, setCapaPrioridadViewFechaDetails] =
    useState(500);
  const [capaPrioridadViewTiendasDetails, setCapaPrioridadViewTiendasDetails] =
    useState(500);
  const [
    capaPrioridadViewProductosDetails,
    setCapaPrioridadViewProductosDetails,
  ] = useState(500);

  // Método para controlar las capas desplegables
  const controlarCapas = (prioridad: string) => {
    if (prioridad === "TiendaOrigenSearsh") {
      setCapaPrioridadTiendaOrigenSearsh(2000);
      setCapaPrioridadTiendaDestinoSearsh(1500);
      setCapaPrioridadFechaHastaSearsh(1500);
      setCapaPrioridadFechaDesdeSearsh(1500);
      setCapaPrioridadViewTiendasSearsh(1000);
      setCapaPrioridadViewFechaSearsh(500);
    } else if (prioridad === "TiendaDestinoSearsh") {
      setCapaPrioridadTiendaOrigenSearsh(1500);
      setCapaPrioridadTiendaDestinoSearsh(2000);
      setCapaPrioridadFechaHastaSearsh(1500);
      setCapaPrioridadFechaDesdeSearsh(1500);
      setCapaPrioridadViewTiendasSearsh(1000);
      setCapaPrioridadViewFechaSearsh(500);
    } else if (prioridad === "FechaDesdeSearsh") {
      setCapaPrioridadTiendaOrigenSearsh(1500);
      setCapaPrioridadTiendaDestinoSearsh(1500);
      setCapaPrioridadFechaHastaSearsh(1500);
      setCapaPrioridadFechaDesdeSearsh(2000);
      setCapaPrioridadViewTiendasSearsh(500);
      setCapaPrioridadViewFechaSearsh(1000);
    } else if (prioridad === "FechaHastaSearsh") {
      setCapaPrioridadTiendaOrigenSearsh(1500);
      setCapaPrioridadTiendaDestinoSearsh(1500);
      setCapaPrioridadFechaHastaSearsh(2000);
      setCapaPrioridadFechaDesdeSearsh(1500);
      setCapaPrioridadViewTiendasSearsh(500);
      setCapaPrioridadViewFechaSearsh(1000);
    }

    if (prioridad === "FechaDetails") {
      setCapaPrioridadViewFechaDetails(2000);
      setCapaPrioridadViewTiendasDetails(1000);
    } else if (prioridad === "TiendasDetails") {
      setCapaPrioridadViewFechaDetails(1000);
      setCapaPrioridadViewTiendasDetails(2000);
      setCapaPrioridadViewProductosDetails(1000);
    } else if (prioridad === "ProductosDetails") {
      setCapaPrioridadViewFechaDetails(1000);
      setCapaPrioridadViewTiendasDetails(1000);
      setCapaPrioridadViewProductosDetails(2000);
    }
  };

  // Datos del usuario que está logueado
  const { usuario, setUsuario } = useUsuario();
  const { modalMovimientosDates, setModalMovimientosDates } =
    useModalMovimientosDates();
  const { SortMovimientosDates, setSortMovimientosDates } =
    useSortMovimientosDates();

  // Opciones de radio burron para la fecha serash
  const [selecterActivoDetails, setSelecterActivoDetails] = useState("");
  const options = [
    { label: "Ayer", value: "ayer" },
    { label: "Hoy", value: "hoy" },
    { label: "Semana", value: "semana" },
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
    if (value === "hoy") {
      fechaDesde = `${year}-${month}-${day}`;
    } else if (value === "ayer") {
      // Restar 1 día a la fecha actual
      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(currentDate.getDate() - 1);
      const yesterdayYear = String(yesterdayDate.getFullYear());
      const yesterdayMonth = String(yesterdayDate.getMonth() + 1).padStart(
        2,
        "0"
      );
      const yesterdayDay = String(yesterdayDate.getDate()).padStart(2, "0");
      fechaDesde = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
    } else if (value === "semana") {
      // Restar 7 días a la fecha actual
      const lastWeekDate = new Date(currentDate);
      lastWeekDate.setDate(currentDate.getDate() - 7);
      const weekYear = String(lastWeekDate.getFullYear());
      const weekMonth = String(lastWeekDate.getMonth() + 1).padStart(2, "0");
      const weekDay = String(lastWeekDate.getDate()).padStart(2, "0");
      fechaDesde = `${weekYear}-${weekMonth}-${weekDay}`;
    } else {
      console.error("Valor no válido para el radio button:", value);
      return; // Manejo de error: si el valor no es válido, no se hace nada
    }

    // llamar al filtrar con los nuevos parametros
    filtrarYOrdenarMovimientos(fechaDesde, `${year}-${month}-${day}`);
  };

  // Constantes para controlar la animación del boton desplegable
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado
  const animationValueOptions = useRef(new Animated.Value(0)).current; // Valor animado

  // Variables para controlar los campos de los formularios de agregar entradass y ver datos
  const [idMovimientoDetails, setIdMovimientoDetails] = useState("");
  const [idUsuarioDetails, setIdUsuarioDetails] = useState("");
  const [nombreUsuarioDetails, setNombreUsuarioDetails] = useState("");
  const [idProductoDetails, setIdProductoDetails] = useState("");
  const [idTiendaOrigenDetails, setIdTiendaOrigenDetails] = useState("");
  const [idTiendaDestinoDetails, setIdTiendaDestinoDetails] = useState("");
  const [cantidadDetails, setCantidadDetails] = useState("");
  const [fechaDiaDetails, setFechaDiaDetails] = useState("");
  const [fechaMesDetails, setFechaMesDetails] = useState("");
  const [fechaAnnoDetails, setFechaAnnoDetails] = useState("");

  const [isMovimientoEditable, setIsMovimientoEditable] = useState(false);
  const [isMovimientoEliminable, setIsMovimientoEliminable] = useState(false);

  const [isDateLoaded, setIsDateLoaded] = useState(false);

  const [idProductoAuxModificarDetails, setIdProductoAuxModificarDetails] =
    useState("");
  const [
    idTiendaOrigenAuxModificarDetails,
    setIdTiendaOrigenAuxModificarDetails,
  ] = useState("");
  const [
    idTiendaDestinoAuxModificarDetails,
    setIdTiendaDestinoAuxModificarDetails,
  ] = useState("");
  const [cantidadAuxModificarDetails, setCantidadAuxModificarDetails] =
    useState("");

  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [modalMensaje, setModalMensaje] = React.useState("");
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);

  const [isModalChekVisible, setIsModalChekVisible] = useState(false);
  const [isModalChekEliminarVisible, setIsModalChekEliminarVisible] =
    useState(false);
  const [mesajeModalChek, setMesajeModalChek] = useState("");
  const [isBotonModalMesajeVisible, setIsBotonModalMesajeVisible] =
    useState(false);

  // Controlar el doble clic del boton
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    
  // Condicionales para mostrar según los permisos
  const [isPermisoEliminarMovimiento, setIsPermisoEliminarMovimiento] =
    React.useState(false);
  const [isPermisoModificarMovimiento, setIsPermisoModificarMovimiento] =
    React.useState(false);
  const [
    isPermisoOpcionesDeCeldaMoverLocal,
    setIsPermisoOpcionesDeCeldaMoverLocal,
  ] = React.useState(false);
  const [
    isPermisoOpcionesDeCeldaMoverGeneral,
    setIsPermisoOpcionesDeCeldaMoverGeneral,
  ] = React.useState(false);

  const checkPermiso = async () => {
    if (usuario?.token) {
      // Verificar y almacenar el permiso de mover local
      if (localStorage.getItem("resultPermisoOptionMoverLocal") === null) {
        const resultPermisoOptionMoverLocal = await isPermiso(
          usuario.token,
          "30",
          usuario.id_usuario
        );
        setIsPermisoOpcionesDeCeldaMoverLocal(resultPermisoOptionMoverLocal);
        localStorage.setItem("resultPermisoOptionMoverLocal", resultPermisoOptionMoverLocal);
      } else {
        setIsPermisoOpcionesDeCeldaMoverLocal(Boolean(localStorage.getItem("resultPermisoOptionMoverLocal")));
      }
  
      // Verificar y almacenar el permiso de mover general
      if (localStorage.getItem("resultPermisoOptionMoverGeneral") === null) {
        const resultPermisoOptionMoverGeneral = await isPermiso(
          usuario.token,
          "31",
          usuario.id_usuario
        );
        setIsPermisoOpcionesDeCeldaMoverGeneral(resultPermisoOptionMoverGeneral);
        localStorage.setItem("resultPermisoOptionMoverGeneral", resultPermisoOptionMoverGeneral);
      } else {
        setIsPermisoOpcionesDeCeldaMoverGeneral(Boolean(localStorage.getItem("resultPermisoOptionMoverGeneral")));
      }
  
      // Establecer permisos fijos (eliminar y modificar movimiento)
      setIsPermisoEliminarMovimiento(true);
      setIsPermisoModificarMovimiento(true);
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
  const [filterItems, setFilterItems] = useState<Movimiento[]>([]);

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

  const [
    optimizacionAbrirPorMovimientosProPrimeraVes,
    setOptimizacionAbrirPorMovimientosProPrimeraVes,
  ] = useState(false);
  const [dropdownItemsNombreUsuario, setDropDownItemsNombreUsuario] = useState<
    ProveedorPiker[]
  >([]);
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
  const [nombreUsuarioSearch, setNombreUsuarioSearch] = useState("");
  const [nombreProductoSearch, setNombreProductoSearch] = useState("");
  const [cantidadSearch, setCantidadSearch] = useState("");
  const [tiendaOrigenSearch, setTiendaOrigenSearch] = useState("");
  const [tiendaDestinoSearch, setTiendaDestinoSearch] = useState("");
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

  const getUsuariosPikerDetails = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllUsuarios(usuario.token);

      if (result && Array.isArray(result)) {
        const usuariosMapeados: TiendaPiker[] = await Promise.all(
          result.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_usuario,
          }))
        );

        // Agregar un valor adicional para el valor inicial
        setDropDownItemsNombreUsuario(usuariosMapeados);
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
        setDropDownItemsNombreTienda([
          { label: "Todos los movimientos", value: "" },
          ...tiendasMapeados,
        ]);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar proovedor
  const callModalAddMovimiento = () => {
    setIdUsuarioDetails("");
    setCantidadDetails("");
    setIdProductoDetails("");

    setModalMovimientosDates({
      id_movimiento: "",
      isAddMovimiento: false,
      isModificarMovimiento: false,
      fileEditable: true,
    });
  };

  const cargarDetailsOfMovimiento = async () => {
    if (usuario?.token && modalMovimientosDates?.id_movimiento) {
      // Reinicia los datos de la fecha antes de realizar la carga de datos
      setIsDateLoaded(false); // Para asegurarte de que el componente no use los datos antiguos

      const result = await getMovimientoById(
        usuario.token,
        modalMovimientosDates.id_movimiento
      );

      if (result) {
        // Extraemos los datos de fecha de result.fecha
        const [year, month, day] = result.fecha.split("T")[0].split("-");

        // Actualizamos los detalles
        setIdMovimientoDetails(result.id_salida);
        setIdUsuarioDetails(result.usuario.id_usuario);
        setIdProductoDetails(result.producto.id_producto);
        setCantidadDetails(result.cantidad);
        setIdTiendaOrigenDetails(result.tienda_origen.id_tienda);
        setIdTiendaDestinoDetails(result.tienda_destino.id_tienda);
        setNombreUsuarioDetails(result.usuario.nombre_usuario);

        // Variables para si es posible eliminar o modificar el movimiento
        setIsMovimientoEditable(
          result.usuario.id_usuario === usuario.id_usuario
            ? true
            : parseInt(usuario.id_rol) === 1
        );
        setIsMovimientoEliminable(
          result.usuario.id_usuario === usuario.id_usuario
            ? true
            : parseInt(usuario.id_rol) === 1
        );

        // Actualizamos las fechas (nuevos datos)
        setFechaDiaDetails(String(parseInt(day)));
        setFechaMesDetails(String(parseInt(month)));
        setFechaAnnoDetails(String(parseInt(year)));

        // Actualizamos los valores auxiliares
        setIdProductoAuxModificarDetails(result.producto.id_producto);
        setIdTiendaDestinoAuxModificarDetails(result.tienda_destino.id_tienda);
        setIdTiendaOrigenAuxModificarDetails(result.tienda_origen.id_tienda);
        setCantidadAuxModificarDetails(result.cantidad);

        // Marcamos los datos como cargados al final del proceso
        setIsDateLoaded(true);
      }
    }
  };

  const auxiliarFunctionFilter = async (
    fechaDesde: string,
    fechaHasta: string
  ): Promise<Movimiento[] | null> => {
    if (usuario?.token) {
      try {
        const resultPermisoOptionMoverGeneral = await isPermiso(
          usuario.token,
          "31",
          usuario.id_usuario
        );

        let result;
        if (resultPermisoOptionMoverGeneral) {
          result = await filtrarMovimientos(
            usuario.token,
            nombreUsuarioSearch,
            nombreProductoSearch,
            cantidadSearch,
            fechaDesde,
            fechaHasta,
            resultPermisoOptionMoverGeneral
              ? tiendaOrigenSearch
              : usuario.id_tienda,
            tiendaDestinoSearch
          );
        } else {
          result = await filtrarMovimientosEspecial(
            usuario.token,
            nombreUsuarioSearch,
            nombreProductoSearch,
            cantidadSearch,
            fechaDesde,
            fechaHasta,
            usuario.id_tienda,
            tiendaOrigenSearch,
            tiendaDestinoSearch
          );
        }

        if (result) {
          const proveedoresMapeados: Movimiento[] = await Promise.all(
            result.map(async (element: any) => {
              return {
                id_Movimiento: element.id_salida,
                id_TiendaOrigen: element.tienda_origen.id_tienda,
                id_TiendaDestino: element.tienda_destino.id_tienda,
                id_Producto: element.producto.id_producto,
                nombreTiendaOrigen: element.tienda_origen.nombre,
                nombreTiendaDestino: element.tienda_destino.nombre,
                nombre_Usuario: element.usuario.nombre,
                nombre_Producto: element.producto.nombre,
                cantidad: element.cantidad,
                fecha: element.fecha,
              };
            })
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
    if (optimizacionAbrirPorMovimientosProPrimeraVes) {
      cargarDetailsOfMovimiento();
    }
  }, [modalMovimientosDates]);
  // Para filtrar y/o ordenar los datos según se halla digitado o seleccionado
  const obtenerTodosLosMovimientos = async () => {
    if (usuario?.token != undefined) {
      try {
        // Obtener proovedores desde la tabla
        const result = await getAllMovimientos(usuario.token);

        if (result && Array.isArray(result)) {
          // Mapeamos los proovedores y obtenemos tanto la cantidadTotal como si tienen opciones
          const proveedoresMapeados: Movimiento[] = await Promise.all(
            result.map(async (element: any) => {
              // Mapeamos a la interfaz Proveedor
              return {
                id_Movimiento: element.id_salida,
                id_TiendaOrigen: element.tienda_origen.id_tienda,
                id_TiendaDestino: element.tienda_destino.id_tienda,
                id_Producto: element.producto.id_producto,
                nombreTiendaOrigen: element.tienda_origen.nombre,
                nombreTiendaDestino: element.tienda_destino.nombre,
                nombre_Usuario: element.usuario.nombre,
                nombre_Producto: element.producto.nombre,
                cantidad: element.cantidad,
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
        getUsuariosPikerDetails();
        getProductosPikerDetails();
        getTiendasPikerDetails();
        filtrarYOrdenarMovimientos(
          `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
          `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
        );
        setOptimizacionAbrirPorMovimientosProPrimeraVes(true);
      };
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  const [auxOrdenar, setAxuOrdenar] = useState(false);
  // Filtrar y ordenar movimientos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarMovimientos = async (
    fechaDesde: string,
    fechaHasta: string
  ) => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let MovimientosFiltradas: Movimiento[] =
          (await auxiliarFunctionFilter(fechaDesde, fechaHasta)) || [];

        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (
          SortMovimientosDates?.criterioOrden &&
          SortMovimientosDates.tipoOrden
        ) {
          MovimientosFiltradas = await ordenarMovimientos(
            usuario.token,
            MovimientosFiltradas,
            SortMovimientosDates.criterioOrden,
            auxOrdenar
          );
        } else {
          MovimientosFiltradas = await ordenarMovimientos(
            usuario.token,
            MovimientosFiltradas,
            "option6",
            auxOrdenar
          );
        }

        // Actualizar el estado con los productos filtrados (y ordenados si corresponde)
        setFilterItems(MovimientosFiltradas);
      }
    } catch (error) {
      console.error("Error al filtrar y ordenar los proovedores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Llamar a la función cuando alguna de las dependencias cambie
    if (optimizacionAbrirPorMovimientosProPrimeraVes) {
      filtrarYOrdenarMovimientos(
        `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
        `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
      );
    }
  }, [SortMovimientosDates, selectedOptionTipoOrden]);
  useEffect(() => {
    // Llamar a la función cuando alguna de las dependencias cambie
    if (optimizacionAbrirPorMovimientosProPrimeraVes) {
      setSelecterActivoDetails("");
    }
  }, [
    fechaDiaDesdeSearch,
    fechaMesDesdeSearch,
    fechaAnnoDesdeSearch,
    fechaDiaHastaSearch,
    fechaMesHastaSearch,
    fechaAnnoHastaSearch,
  ]);

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreProductoSearch("");
    setNombreUsuarioSearch("");
    setCantidadSearch("");
    setTiendaOrigenSearch("");
    setTiendaDestinoSearch("");
    setFechaAnnoDesdeSearch("2024");
    setFechaMesdesdeSearch("1");
    setFechaDiaDesdeSearch("1");
    setFechaAnnoHastaSearch(String(parseInt(year)));
    setFechaMesHastaSearch(String(parseInt(month)));
    setFechaDiaHastaSearch(String(parseInt(day)));
    setSelectedOptionTipoOrden("");
  };

  // Método para agregar un nuevo producto al sistema
  const addNewEntrada = async () => {
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL INGRESAR ENTRADA. Porfavor verifique los siguientes campos:\n";

      if (idUsuarioDetails === "") {
        flag = false;
        validarCampos += "-Seleccione un proveedor.\n";
      }
      if (idProductoDetails === "") {
        flag = false;
        validarCampos += "-Seleccione un producto.\n";
      }
      if (idTiendaOrigenDetails === "") {
        flag = false;
        validarCampos += "-Seleccione una tienda.\n";
      }
      if (cantidadDetails === "") {
        flag = false;
        validarCampos += "-Ingrese una cantidad.\n";
      }

      if (flag) {
        await addEntrada(
          usuario.token,
          costoDetails,
          cantidadDetails,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          parseInt(idUsuarioDetails),
          parseInt(idProductoDetails),
          parseInt(idTiendaOrigenDetails)
        );

        await addProductoEntrada(
          usuario.token,
          parseInt(idTiendaOrigenDetails),
          parseInt(idProductoDetails),
          parseInt(cantidadDetails)
        );
        setModalMensaje(`La entrada fue insertada con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setIdUsuarioDetails("");
        setIdProductoDetails("");
        setIdTiendaOrigenDetails("");
        setCantidadDetails("");
      } else {
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };
  // Función para cuando precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      // Aquí ejecutas la función que deseas
      filtrarYOrdenarMovimientos(
        `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
        `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
      );
    }
  };

  // Método para actualizar los datos de un producto
  const modificarMovimiento = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Modificando movimiento. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL MODIFICAR MOVIMIENTO. Compruebe los siguientes campos:\n";
      const resultOrigen = await isProductoInTienda(
        usuario.token,
        idProductoAuxModificarDetails,
        idTiendaOrigenAuxModificarDetails
      );
      const resultDestino = await isProductoInTienda(
        usuario.token,
        idProductoAuxModificarDetails,
        idTiendaDestinoAuxModificarDetails
      );
      const resultNuevoOrigen = await isProductoInTienda(
        usuario.token,
        idProductoAuxModificarDetails,
        idTiendaOrigenDetails
      );
      const resultNuevoProductoOrigen = await isProductoInTienda(
        usuario.token,
        idProductoDetails,
        idTiendaOrigenAuxModificarDetails
      );
      const resultNuevoProductoNuevoOrigen = await isProductoInTienda(
        usuario.token,
        idProductoDetails,
        idTiendaOrigenDetails
      );
      let cantidadNueva: number = parseInt(cantidadDetails);
      let cantidadVieja: number = parseInt(cantidadAuxModificarDetails);
      let cantidadEnOrigen: number = resultOrigen
        ? parseInt(resultOrigen.cantidad)
        : 0;
      let cantidadEnDestino: number = resultDestino
        ? parseInt(resultDestino.cantidad)
        : 0;
      let cantidadEnNuevoOrigen: number = resultNuevoOrigen
        ? parseInt(resultNuevoOrigen.cantidad)
        : 0;
      let cantidadNPOrigen: number = resultNuevoProductoOrigen
        ? parseInt(resultNuevoProductoOrigen.cantidad)
        : 0;
      let cantidadNPOEnTiendaNuevoOrigen: number =
        resultNuevoProductoNuevoOrigen
          ? parseInt(resultNuevoProductoNuevoOrigen.cantidad)
          : 0;

      // Validar campos
      // Caso solo se halla cambiado la cantidad
      if (
        idTiendaOrigenDetails === idTiendaOrigenAuxModificarDetails &&
        idTiendaDestinoDetails === idTiendaDestinoAuxModificarDetails &&
        idProductoDetails === idProductoAuxModificarDetails &&
        cantidadNueva !== cantidadVieja
      ) {
        // La cantidad aumentó (Hoja: 1)
        if (cantidadNueva >= cantidadVieja) {
          if (cantidadNueva - cantidadVieja > cantidadEnOrigen) {
            flag = false;
            validarCampos +=
              "-Operación inválida. No hay suficientes productos en la tienda origen para agregar a la tienda destino.\n";
          }
          // Si la cantidad disminuyó (Hoja: 2)
        } else {
          if (cantidadVieja - cantidadNueva > cantidadEnDestino) {
            flag = false;
            validarCampos +=
              "-Operación inválida. No hay suficientes productos en la tienda destino para agregar a la tienda origen.\n";
          }
        }
        // Caso que solo se halla cambiado la tiendaDestino
      } else if (
        idTiendaOrigenDetails === idTiendaOrigenAuxModificarDetails &&
        idProductoDetails === idProductoAuxModificarDetails &&
        idTiendaDestinoDetails !== idTiendaDestinoAuxModificarDetails
      ) {
        // Caso en que se halla cambiado la tienda destino y la cantidad
        if (cantidadNueva !== cantidadVieja) {
          // La cantidad aumentó (Hoja: 3)
          // La cantidad disminuyó (Hoja: 4)
          if (cantidadNueva > cantidadEnDestino) {
            flag = false;
            validarCampos +=
              "-Operación inválida. La vieja tienda destino no tiene suficientes productos para darle a la nueva tienda destino.\n";
          }
          // Caso en que solo se halla cambiado la tienda destino sin modificar la cantidad (Hoja: 5)
        } else {
          if (cantidadEnDestino - cantidadVieja < 0) {
            flag = false;
            validarCampos +=
              "-Operación inválida. No hay suficientes productos en la tienda destino vieja para pasarle a la nueva.\n";
          }
        }
        // Caso que solo se halla cambiado la tiendaOrigen
      } else if (
        idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails &&
        idProductoDetails === idProductoAuxModificarDetails &&
        idTiendaDestinoDetails === idTiendaDestinoAuxModificarDetails
      ) {
        // Caso en que se halla cambiado la tienda origen y la cantidad
        if (cantidadNueva !== cantidadVieja) {
          // La cantidad aumentó (Hoja: 6)
          // La cantidad disminuyó (Hoja: 7)
          if (cantidadNueva > cantidadEnOrigen) {
            flag = false;
            validarCampos +=
              "-Operación inválida. La vieja tienda origen no tiene sificientes productos para darle a la nueva tienda destino.\n";
          }
          // Caso en que se halla cambiado la tienda origen sin modificar la camtidad (Hoja: 8)
        } else {
          if (cantidadEnOrigen - cantidadVieja < 0) {
            flag = false;
            validarCampos +=
              "-Operación inválida. No hay suficientes productos en la tienda origen vieja para pasarle a la nueva.\n";
          }
        }
        // Caso que se halla cambiado la tienda origen y la tienda destino
      } else if (
        idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails &&
        idTiendaDestinoDetails !== idTiendaDestinoAuxModificarDetails &&
        idProductoDetails === idProductoAuxModificarDetails
      ) {
        // Caso que se halla cambiado la cantantidad, tienda origen y tienda destino
        if (cantidadNueva !== cantidadVieja) {
          // La cantidad aumentó (Hoja: 9)
          // La cantidad disminuyó (Hoja: 10)
          if (
            cantidadVieja > cantidadEnDestino ||
            cantidadNueva > cantidadEnNuevoOrigen
          ) {
            flag = false;
            validarCampos +=
              "-Operación inválida. No se puede restablecer la cantidad dada de los en las tiendas originales o no hay productos suficientes en la nueva tienda de origen para asignar a la nueva tienda destino.\n";
          }
          // Caso que se halla cambiado tienda origen y tienda destino sin cambiar la cantidad (Hoja: 11)
        } else {
          if (
            cantidadVieja > cantidadEnDestino ||
            cantidadVieja > cantidadEnNuevoOrigen
          ) {
            flag = false;
            validarCampos +=
              "-Operación inválida. No se puede restablecer los prouductos en las tiendas originales o no hay productos suficientes en la tienda de origen para asignar a la nueva tienda destino.\n";
          }
        }
      } else if (idProductoDetails !== idProductoAuxModificarDetails) {
        // Caso en que halla cambiado el producto

        if (cantidadVieja > cantidadNPOrigen) {
          // Esta condición es generica simepre que se modifique algo con el producto
          flag = false;
          validarCampos +=
            "-Operación inválida. No hay suficientes productos viejos en la tienda vieja para modificar el producto a uno nuevo.\n";
        } else {
          if (
            idTiendaOrigenDetails === idTiendaOrigenAuxModificarDetails &&
            idTiendaDestinoDetails === idTiendaDestinoAuxModificarDetails &&
            cantidadNueva === cantidadVieja
          ) {
            if (cantidadVieja > cantidadNPOrigen) {
              // Solamente ha cambido el producto y nada más (Hoja 12)
              flag = false;
              validarCampos +=
                "-Operación inválida. No hay suficientes productos nuevos en la tienda vieja para modificar el producto a uno nuevo.\n";
            }
          } else if (cantidadVieja !== cantidadNueva) {
            if (
              idTiendaOrigenDetails === idTiendaOrigenAuxModificarDetails &&
              idTiendaDestinoDetails === idTiendaDestinoAuxModificarDetails &&
              cantidadNueva !== cantidadVieja
            ) {
              if (cantidadNueva > cantidadNPOrigen) {
                // Cambió solo la cantidad y el producto(Hoja 16)
                flag = false;
                validarCampos +=
                  "-Operación inválida. No hay sificientes productos en la tienda origen con la cantidad dada.\n";
              }
            } else if (
              idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails &&
              idTiendaDestinoDetails === idTiendaDestinoAuxModificarDetails &&
              cantidadNueva !== cantidadVieja
            ) {
              if (cantidadNueva > cantidadNPOEnTiendaNuevoOrigen) {
                // Cambió la cantidad y el origen (Hoja 17)
                flag = false;
                validarCampos +=
                  "-Operación inválida. No hay esa cantidad de productos en la tienda origen especificada.\n";
              }
            } else if (
              idTiendaOrigenDetails === idTiendaOrigenAuxModificarDetails &&
              idTiendaDestinoDetails !== idTiendaDestinoAuxModificarDetails &&
              cantidadNueva !== cantidadVieja
            ) {
              if (cantidadNueva > cantidadNPOrigen) {
                // Cambió la cantidad y el origen (Hoja 19)
                flag = false;
                validarCampos +=
                  "-Operación inválida. No hay esa cantidad de productos en la tienda origen seleccionada.\n";
              }
            } else if (
              idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails &&
              idTiendaDestinoDetails !== idTiendaDestinoAuxModificarDetails &&
              cantidadNueva !== cantidadVieja
            ) {
              if (cantidadNueva > cantidadNPOEnTiendaNuevoOrigen) {
                // Cambió la cantidad, tienda origen, tienda destino, todo (Hoja 18)
                flag = false;
                validarCampos +=
                  "-Operación inválida. No hay esa cantidad de productos en la tienda origen seleccionada.\n";
              }
            }
          } else {
            if (
              idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails ||
              idTiendaDestinoDetails !== idTiendaDestinoAuxModificarDetails
            ) {
              // Se cambió el producto y alguna tienda
              if (
                idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails &&
                idTiendaDestinoDetails !== idTiendaDestinoAuxModificarDetails
              ) {
                // Se cambió la tienda origen y destino y el producto
                if (cantidadVieja > cantidadNPOEnTiendaNuevoOrigen) {
                  // Se cambiaron el origen y el destino (Hoja 13)
                  flag = false;
                  validarCampos +=
                    "-Operación inválida. No hay sificintes productos nuevos en la nueva tienda origen.\n";
                }
              } else if (
                idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails &&
                idTiendaDestinoDetails === idTiendaDestinoAuxModificarDetails
              ) {
                if (cantidadVieja > cantidadNPOEnTiendaNuevoOrigen) {
                  // Se cambió la tienda origen y el producto (Hoja 14)
                  flag = false;
                  validarCampos +=
                    "-Operación inválida. No hay sificintes productos nuevos en la nueva tienda origen.\n";
                }
              } else {
                if (cantidadVieja > cantidadNPOEnTiendaNuevoOrigen) {
                  // Se cambió la tienda destino y el producto (Hoja 15)
                  flag = false;
                  validarCampos +=
                    "-Operación inválida. No hay sificintes productos nuevos en la nueva tienda origen.\n";
                }
              }
            }
          }
        }
      }

      if (idTiendaDestinoDetails === idTiendaOrigenDetails) {
        flag = false;
        validarCampos +=
          "-La tienda origen no puede ser igual a la tienda destino.\n";
      }
      if (idProductoDetails === "") {
        flag = false;
        validarCampos += "-Seleccione un producto.\n";
      }
      if (idTiendaOrigenDetails === "") {
        flag = false;
        validarCampos += "-Seleccione una tienda Origen.\n";
      }
      if (idTiendaDestinoDetails === "") {
        flag = false;
        validarCampos += "-Seleccione una tienda Destino.\n";
      }
      if (cantidadDetails === "") {
        flag = false;
        validarCampos += "-Ingrese una cantidad.\n";
      }

      ///////////////////////////
      if (flag) {
        await updateMovimiento(
          usuario.token,
          idMovimientoDetails,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          idTiendaOrigenDetails,
          idTiendaDestinoDetails,
          cantidadDetails,
          idProductoDetails,
          idUsuarioDetails
        );

        if (
          idTiendaOrigenDetails === idTiendaOrigenAuxModificarDetails &&
          idTiendaDestinoDetails === idTiendaDestinoAuxModificarDetails &&
          idProductoDetails === idProductoAuxModificarDetails &&
          cantidadNueva !== cantidadVieja
        ) {
          // La cantidad aumentó (Hoja: 1)
          // Si la cantidad disminuyó (Hoja: 2)
          await moverProducto(
            usuario.token,
            idProductoAuxModificarDetails,
            idTiendaOrigenAuxModificarDetails,
            idTiendaDestinoAuxModificarDetails,
            String(cantidadNueva - cantidadVieja)
          );

          // Caso que solo se halla cambiado la tiendaDestino
        } else if (
          idTiendaOrigenDetails === idTiendaOrigenAuxModificarDetails &&
          idProductoDetails === idProductoAuxModificarDetails &&
          idTiendaDestinoDetails !== idTiendaDestinoAuxModificarDetails
        ) {
          // La cantidad aumentó (Hoja: 3)
          // La cantidad disminuyó (Hoja: 4)
          await createProductoInTienda(
            usuario.token,
            idProductoDetails,
            idTiendaDestinoDetails
          );
          await moverProducto(
            usuario.token,
            idProductoAuxModificarDetails,
            idTiendaDestinoAuxModificarDetails,
            idTiendaOrigenAuxModificarDetails,
            String(cantidadVieja)
          );

          // Nuevo movimiento
          await moverProducto(
            usuario.token,
            idProductoAuxModificarDetails,
            idTiendaOrigenAuxModificarDetails,
            idTiendaDestinoDetails,
            String(cantidadNueva)
          );

          // Caso que solo se halla cambiado la tiendaOrigen
        } else if (
          idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails &&
          idProductoDetails === idProductoAuxModificarDetails &&
          idTiendaDestinoDetails === idTiendaDestinoAuxModificarDetails
        ) {
          // La cantidad aumentó (Hoja: 6)
          // La cantidad disminuyó (Hoja: 7)
          await moverProducto(
            usuario.token,
            idProductoAuxModificarDetails,
            idTiendaDestinoAuxModificarDetails,
            idTiendaOrigenAuxModificarDetails,
            String(cantidadVieja)
          );

          // Nuevo movimiento
          await moverProducto(
            usuario.token,
            idProductoAuxModificarDetails,
            idTiendaOrigenDetails,
            idTiendaDestinoAuxModificarDetails,
            String(cantidadNueva)
          );

          // Caso que se halla cambiado la tienda origen y la tienda destino
        } else if (
          idTiendaOrigenDetails !== idTiendaOrigenAuxModificarDetails &&
          idTiendaDestinoDetails !== idTiendaDestinoAuxModificarDetails &&
          idProductoDetails === idProductoAuxModificarDetails
        ) {
          // La cantidad aumentó (Hoja: 9)
          // La cantidad disminuyó (Hoja: 10)
          await createProductoInTienda(
            usuario.token,
            idProductoDetails,
            idTiendaDestinoDetails
          );
          await moverProducto(
            usuario.token,
            idProductoAuxModificarDetails,
            idTiendaDestinoAuxModificarDetails,
            idTiendaOrigenAuxModificarDetails,
            String(cantidadVieja)
          );

          // Nuevo movimiento
          await moverProducto(
            usuario.token,
            idProductoDetails,
            idTiendaOrigenDetails,
            idTiendaDestinoDetails,
            String(cantidadNueva)
          );
        } else if (idProductoDetails !== idProductoAuxModificarDetails) {
          // Caso en que halla cambiado el producto
          await createProductoInTienda(
            usuario.token,
            idProductoDetails,
            idTiendaDestinoDetails
          );
          await moverProducto(
            usuario.token,
            idProductoAuxModificarDetails,
            idTiendaDestinoAuxModificarDetails,
            idTiendaOrigenAuxModificarDetails,
            String(cantidadVieja)
          );

          // Nuevo movimiento
          await moverProducto(
            usuario.token,
            idProductoDetails,
            idTiendaOrigenDetails,
            idTiendaDestinoDetails,
            String(cantidadNueva)
          );
        }

        const auxNombreProductoAccion = dropdownItemsNombreproducto.find(
          (element) => {
            return (
              parseInt(element.value) ===
              parseInt(idProductoAuxModificarDetails)
            );
          }
        );
        // Agregar Acción de usuario eliminar producto

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} modificó un movimiento de productos que originalmente tenía un nombre ${auxNombreProductoAccion.lavel}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          2
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`El movimiento se modificó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setModalMovimientosDates(false)
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Método para eliminar proveedor
  const eliminarMovimiento = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Eliminando movimiento. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL TRATAR DE ELIMINAR EL MOVIMIENTO. Motivos:\n";
      const resultDestino = await isProductoInTienda(
        usuario.token,
        idProductoAuxModificarDetails,
        idTiendaDestinoAuxModificarDetails
      );
      let cantidadEnTiendaDestino: number = resultDestino
        ? parseInt(resultDestino.cantidad)
        : 0;
      let cantidadVieja: number = parseInt(cantidadAuxModificarDetails);

      if (cantidadVieja > cantidadEnTiendaDestino) {
        flag = false;
        validarCampos +=
          "-No hay suficientes productos en la tienda destino para devolver la operación.\n";
      }
      if (flag) {
        await moverProducto(
          usuario.token,
          idProductoAuxModificarDetails,
          idTiendaDestinoAuxModificarDetails,
          idTiendaOrigenAuxModificarDetails,
          String(cantidadVieja)
        );

        await deleteMovimiento(usuario.token, idMovimientoDetails);

        const auxNombreProductoAccion = dropdownItemsNombreproducto.find(
          (element) => {
            return (
              parseInt(element.value) ===
              parseInt(idProductoAuxModificarDetails)
            );
          }
        );
        const auxNombreTiendaOrigen = dropdownItemsNombreTienda.find(
          (element) => {
            return parseInt(element.value) === parseInt(idTiendaOrigenDetails);
          }
        );
        const auxNombreTiendaDestino = dropdownItemsNombreTienda.find(
          (element) => {
            return parseInt(element.value) === parseInt(idTiendaDestinoDetails);
          }
        );
        // Agregar Acción de usuario eliminar producto

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó el movimiento del producto ${auxNombreProductoAccion?.label} con cantidad ${cantidadDetails} y tienda origen ${auxNombreTiendaOrigen?.label} y una tienda destino ${auxNombreTiendaDestino?.label}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          2
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(`El movimiento se eliminó con éxito`);
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

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = [
    "Usuario",
    "Producto",
    "Cantidad",
    "Tienda Origen",
    "Tienda Destino",
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
    "Usuario",
    "Producto",
    "Cantidad",
    "Tienda Origen",
    "Tienda Destino",
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
            <MyDateTableMovimientos
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
                  {isPermisoOpcionesDeCeldaMoverGeneral && (
                    <Text style={styles.textSearchMovil}>
                      Nombre del Usuario:
                    </Text>
                  )}
                  {isPermisoOpcionesDeCeldaMoverGeneral && (
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFullMovil}
                      placeholder="Nombre del usuario"
                      value={nombreUsuarioSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={setNombreUsuarioSearch}
                    />
                  )}

                  {isPermisoOpcionesDeCeldaMoverGeneral && (
                    <View style={styles.separatorBlanco} />
                  )}

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

                  <Text style={styles.textSearchMovil}>Cantidad:</Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="Cantidad"
                    value={cantidadSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setCantidadSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      zIndex: capaPrioridadViewTiendasSearsh,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.blanco,
                          fontSize: 22,
                          fontWeight: "bold",
                          textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                          textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                          textShadowRadius: 2, // Difuminado de la sombra
                        }}
                      >
                        Tienda:
                      </Text>
                    </View>

                    {isPermisoOpcionesDeCeldaMoverGeneral && (
                      <Text style={styles.textSearchMovil}>Origen:</Text>
                    )}
                    {isPermisoOpcionesDeCeldaMoverGeneral && (
                      <View
                        style={{
                          width: "100%",
                          zIndex: capaPrioridadTiendaOrigenSearsh,
                          position: "relative",
                        }}
                      >
                        <CustomDropdown
                          value={tiendaOrigenSearch}
                          placeholder="Tienda Origen"
                          setValue={setTiendaOrigenSearch}
                          items={dropdownItemsNombreTienda}
                          searchable={true}
                          onDropdownOpen={() =>
                            controlarCapas("TiendaOrigenSearsh")
                          }
                        />
                      </View>
                    )}

                    <Text style={styles.textSearchMovil}>Destino:</Text>
                    <View
                      style={{
                        width: "100%",
                        zIndex: capaPrioridadTiendaDestinoSearsh,
                        position: "relative",
                      }}
                    >
                      <CustomDropdown
                        value={tiendaDestinoSearch}
                        placeholder="Tienda Destino"
                        setValue={setTiendaDestinoSearch}
                        items={dropdownItemsNombreTienda}
                        searchable={true}
                        onDropdownOpen={() =>
                          controlarCapas("TiendaDestinoSearsh")
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.separatorBlanco} />

                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      width: "60%",
                      marginLeft: "18%",
                      position: "relative"
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
                      zIndex: capaPrioridadViewTiendasSearsh,
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
                          fontSize: 20,
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
                          fontSize: 20,
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
                          filtrarYOrdenarMovimientos(
                            `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
                            `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
                          );
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
          visible={modalMovimientosDates?.isAddMovimiento ?? false}
          animationType="fade"
          onRequestClose={callModalAddMovimiento}
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
                onPress={callModalAddMovimiento}
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
                {modalMovimientosDates?.id_movimiento === ""
                  ? "Agregar Entrada"
                  : "Datos del Movimiento"}
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
                <View style={{ width: "100%" }}>
                  <Text style={styles.labelTextModalMovil}>
                    Nombre del Usuario
                  </Text>
                </View>
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      marginTop: "3%",
                      marginLeft: "6%",
                      fontWeight: "bold",
                      color: Colors.negro, // Color del texto
                      textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                      textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                      textShadowRadius: 2, // Difuminado de la sombra
                    }}
                  >
                    {nombreUsuarioDetails}
                  </Text>
                </View>

                {/* Nombre del Producto */}
                <View
                  style={{ width: "100%", zIndex: 1500, position: "relative" }}
                >
                  <Text style={styles.labelTextModalMovil}>
                    Nombre del Producto
                  </Text>
                </View>
                <View
                  style={{ width: "100%", zIndex: 1500, position: "relative" }}
                >
                  <CustomDropdownDetails
                    value={idProductoDetails}
                    placeholder="Productos"
                    setValue={setIdProductoDetails}
                    items={dropdownItemsNombreproducto}
                    searchable={true}
                    readOnly={!isMovimientoEditable}
                  />
                </View>

                {/* Contenedor Tieda Origen y Teinda Destino */}
                <View
                  style={{ width: "100%", zIndex: 1200, position: "relative" }}
                ></View>

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
                    <Text style={styles.labelTextModalMovil}>
                      Tienda Origen
                    </Text>
                    <CustomDropdownDetails
                      value={idTiendaOrigenDetails}
                      placeholder="Tiendas"
                      setValue={setIdTiendaOrigenDetails}
                      items={dropdownItemsNombreTienda}
                      searchable={true}
                      readOnly={
                        !(
                          isMovimientoEditable &&
                          isPermisoOpcionesDeCeldaMoverGeneral
                        )
                      }
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
                      Tienda Destino
                    </Text>
                    <CustomDropdownDetails
                      value={idTiendaDestinoDetails}
                      placeholder="Tiendas"
                      setValue={setIdTiendaDestinoDetails}
                      items={dropdownItemsNombreTienda}
                      searchable={true}
                      readOnly={!isMovimientoEditable}
                    />
                  </View>
                </View>

                {/* Contenedor para la cantidad*/}
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
                      editable={isPermisoModificarMovimiento}
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
                  ></View>
                </View>
                <View style={{ height: 100 }}>
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
                      isReadOnly={!isMovimientoEditable}
                    />
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
                  {/* Botón para modificar movimiento */}
                  {isPermisoModificarMovimiento &&
                    isMovimientoEditable &&
                    modalMovimientosDates?.id_movimiento !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Oscuro,
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
                        onPress={() => {
                          setIsModalChekVisible(true);
                          setIsModalChekEliminarVisible(false);
                          setMesajeModalChek(
                            `¿Estás seguro que deseas MODIFICAR los datos de este movimiento?`
                          );
                          setModalMovimientosDates({
                            id_movimiento: "",
                            isAddMovimiento: false,
                            isModificarMovimiento: false,
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
                          Modificar Movimiento
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para eliminar movimiento */}
                  {isPermisoEliminarMovimiento &&
                    isMovimientoEliminable &&
                    modalMovimientosDates?.id_movimiento !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.rojo_oscuro,
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
                            `¿Estás seguro que deseas ELIMINAR este movimiento?`
                          );
                          setIsModalChekEliminarVisible(true);
                          setModalMovimientosDates({
                            id_movimiento: "",
                            isAddMovimiento: false,
                            isModificarMovimiento: false,
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
                          Eliminar Movimiento
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
                    isModalChekEliminarVisible
                      ? eliminarMovimiento()
                      : modificarMovimiento()
                  }
                  disabled={isButtonDisabled}
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
            {isPermisoOpcionesDeCeldaMoverGeneral && (
              <Text style={styles.textSearchDesktop}>Nombre del Usuario:</Text>
            )}
            {isPermisoOpcionesDeCeldaMoverGeneral && (
              <CustomTextImputSearch
                style={styles.customTextImputSearchFullDesktop}
                placeholder="Nombre del usuario"
                onKeyPress={handleKeyPress}
                value={nombreUsuarioSearch}
                onChangeText={setNombreUsuarioSearch}
              />
            )}

            {isPermisoOpcionesDeCeldaMoverGeneral && (
              <View style={styles.separatorBlanco} />
            )}

            <Text style={styles.textSearchDesktop}>Nombre del Producto:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del producto"
              value={nombreProductoSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreProductoSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Cantidad:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Cantidad"
              value={cantidadSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setCantidadSearch}
            />

            <View style={styles.separatorBlanco} />

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                zIndex: capaPrioridadViewTiendasSearsh,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: Colors.blanco,
                    fontSize: 18,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                    textShadowRadius: 2, // Difuminado de la sombra
                  }}
                >
                  Tienda:
                </Text>
              </View>

              <Text style={styles.textSearchDesktop}>Origen:</Text>
              <View
                style={{
                  width: "100%",
                  zIndex: capaPrioridadTiendaOrigenSearsh,
                  position: "relative",
                }}
              >
                <CustomDropdown
                  value={tiendaOrigenSearch}
                  placeholder="Tienda Origen"
                  setValue={setTiendaOrigenSearch}
                  items={dropdownItemsNombreTienda}
                  direction="BOTTOM"
                  onDropdownOpen={() => controlarCapas("TiendaOrigenSearsh")}
                />
              </View>

              <Text style={styles.textSearchDesktop}>Destino:</Text>
              <View
                style={{
                  width: "100%",
                  zIndex: capaPrioridadTiendaDestinoSearsh,
                  position: "relative",
                }}
              >
                <CustomDropdown
                  value={tiendaDestinoSearch}
                  placeholder="Tienda Destino"
                  setValue={setTiendaDestinoSearch}
                  items={dropdownItemsNombreTienda}
                  direction="BOTTOM"
                  onDropdownOpen={() => controlarCapas("TiendaDestinoSearsh")}
                />
              </View>
            </View>

            <View style={styles.separatorBlanco} />

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                width: "60%",
                marginLeft: "18%",
                position: "relative"
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
                zIndex: capaPrioridadViewFechaSearsh,
                position: "relative",
                marginTop: "2%",
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
                  onPress={() => {
                    filtrarYOrdenarMovimientos(
                      `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
                      `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
                    );
                  }}
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
            <MyDateTableMovimientos
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
          visible={modalMovimientosDates?.isAddMovimiento ?? false}
          animationType="fade"
          onRequestClose={callModalAddMovimiento}
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
                onPress={callModalAddMovimiento}
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
                {modalMovimientosDates?.id_movimiento === ""
                  ? "Agregar Entrada"
                  : "Datos del Movimiento"}
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
                <View style={{ width: "100%" }}>
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Usuario
                  </Text>
                </View>
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      marginTop: "3%",
                      marginLeft: "6%",
                      fontWeight: "bold",
                      color: Colors.negro, // Color del texto
                      textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                      textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                      textShadowRadius: 2, // Difuminado de la sombra
                    }}
                  >
                    {nombreUsuarioDetails}
                  </Text>
                </View>

                {/* Nombre del Producto */}
                <View
                  style={{
                    width: "100%",
                    zIndex: capaPrioridadViewProductosDetails,
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
                    zIndex: capaPrioridadViewProductosDetails,
                    position: "relative",
                  }}
                >
                  <CustomDropdownDetails
                    value={idProductoDetails}
                    placeholder="Productos"
                    setValue={setIdProductoDetails}
                    items={dropdownItemsNombreproducto}
                    readOnly={!isMovimientoEditable}
                    searchable={true}
                    onDropdownOpen={() => controlarCapas("ProductosDetails")}
                  />
                </View>

                {/* Contenedor Tieda Origen y Teinda Destino */}
                <View
                  style={{ width: "100%", zIndex: 2000, position: "relative" }}
                ></View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    position: "relative",
                    zIndex: capaPrioridadViewTiendasDetails,
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Cantidad */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Tienda Origen
                    </Text>
                    <CustomDropdownDetails
                      value={idTiendaOrigenDetails}
                      placeholder="Tiendas"
                      setValue={setIdTiendaOrigenDetails}
                      items={dropdownItemsNombreTienda}
                      readOnly={
                        !(
                          isMovimientoEditable &&
                          isPermisoOpcionesDeCeldaMoverGeneral
                        )
                      }
                      searchable={true}
                      onDropdownOpen={() => controlarCapas("TiendasDetails")}
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
                      Tienda Destino
                    </Text>
                    <CustomDropdownDetails
                      value={idTiendaDestinoDetails}
                      placeholder="Tiendas"
                      setValue={setIdTiendaDestinoDetails}
                      items={dropdownItemsNombreTienda}
                      readOnly={!isMovimientoEditable}
                      searchable={true}
                      onDropdownOpen={() => controlarCapas("TiendasDetails")}
                    />
                  </View>
                </View>

                {/* Contenedor para la cantidad*/}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    position: "relative",
                    zIndex: capaPrioridadViewFechaDetails,
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
                      editable={isMovimientoEditable}
                      placeholder="Cantidad"
                    />
                  </View>

                  {/* Campo Fecha */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      position: "relative",
                      zIndex: capaPrioridadViewFechaDetails,
                    }}
                  >
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
                        isReadOnly={!isMovimientoEditable}
                        onDropdownOpen={() => controlarCapas("FechaDetails")}
                      />
                    )}
                  </View>
                </View>

                {/*btones para agregar, modificar o elminiar según corresponda */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    width: "100%",
                    justifyContent: "space-between",
                    marginTop: 10, // Espacio superior adicional
                  }}
                >
                  {/* Botón para modificar movimiento */}
                  {isPermisoModificarMovimiento &&
                    isMovimientoEditable &&
                    modalMovimientosDates?.id_movimiento !== "" && (
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
                          setIsModalChekEliminarVisible(false);
                          setMesajeModalChek(
                            `¿Estás seguro que deseas MODIFICAR los datos de este movimiento?`
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Modificar Movimiento
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Botón para eliminar movimiento */}
                  {isPermisoEliminarMovimiento &&
                    isMovimientoEliminable &&
                    modalMovimientosDates?.id_movimiento !== "" && (
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
                          setMesajeModalChek(
                            `¿Estás seguro que deseas ELIMINAR este movimiento?`
                          );
                          setIsModalChekEliminarVisible(true);
                          setModalMovimientosDates({
                            id_movimiento: "",
                            isAddMovimiento: false,
                            isModificarMovimiento: false,
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
                          Eliminar Movimiento
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
                    isModalChekEliminarVisible
                      ? eliminarMovimiento()
                      : modificarMovimiento()
                  }
                  disabled={isButtonDisabled}
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
                      ? navigation.replace("Movimientos")
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
