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
  addTienda,
  deleteTienda,
  getAllTiendas,
  getTiendaById,
  isProductoInTienda,
  updateTienda,
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
} from "../services/ProductoServices";
import { ProductoPiker } from "../components/MyDateTableProductos";
import { useModalEntradasDates } from "../contexts/AuxiliarContextModalEntradas";
import { MyDateInput } from "../components/MyDateInput";
import { useSortEntradas } from "../contexts/AuxiliarSortEntradas";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import {
  MyDateTableTiendasView,
  Tienda,
} from "../components/MyDateTableTiendasView";
import CustomDateTimePicker from "../components/CustomDateTimePiker";

export default function TiendasView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  const crearHora = (hora: number, minutos: number) => {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      hora,
      minutos,
      0
    );
  };

  // Variables para cntrolar las capas visuales de las listas desplegables
  const [capaPrioridadFechaDetails, setCapaPrioridadFechaDetails] =
    useState(1000);
  const [capaPrioridadTiendasDetails, setCapaPrioridadTiendasDetails] =
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
    } else if (prioridad === "TiendaDetails") {
      setCapaPrioridadTiendasDetails(2000);
      setCapaPrioridadFechaDetails(1500);
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
  const [idTiendaDetails, setIdTiendaDetails] = useState("");
  const [nombreTiendaDetails, setNombreTiendaDetails] = useState("");
  const [direccionTiendaDetails, setDireccionTiendaDetails] = useState("");
  const [comicionTiendaDetails, setComicionTiendaDetails] = useState("0%");
  const [horaApertura, setHoraApertura] = React.useState(crearHora(9, 0));
  const [horaCierre, setHoraCierre] = React.useState(crearHora(16, 0));
  const nombreProductoRef = useRef(null);

  const [isDateLoaded, setIsDateLoaded] = useState(false);

  const [idProductoAuxModificarDetails, setIdProductoAuxModificarDetails] =
    useState("");
  const [idTiendaAuxModificarDetails, setIdTiendaAuxModificarDetails] =
    useState("");
  const [cantidadAuxModificarDetails, setCantidadAuxModificarDetails] =
    useState("");

  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [modalMensaje, setModalMensaje] = React.useState("");
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);

  const [isModalChekEliminarEntrada, setIsModalChekEliminarEntrada] =
    useState(false);
  const [isModalChekVisible, setIsModalChekVisible] = useState(false);
  const [mesajeModalChek, setMesajeModalChek] = useState("");

  // Condicionales para mostrar según los permisos
  const [isPermisoAgregarEntrada, setIsPermisoAgregarEntrada] =
    React.useState(false);
  const [isPermisoEliminarEntrada, setIsPermisoEliminarEntrada] =
    React.useState(false);
  const [isPermisoModificarEntrada, setIsPermisoModificarEntrada] =
    React.useState(false);

  const checkPermiso = async () => {
    if (usuario?.token) {
      setIsPermisoAgregarEntrada(parseInt(usuario.id_rol) === 1);
      setIsPermisoEliminarEntrada(parseInt(usuario.id_rol) === 1);
      setIsPermisoModificarEntrada(parseInt(usuario.id_rol) === 1);
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
  const [filterItems, setFilterItems] = useState<Tienda[]>([]);

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
  const [fechaDiaDesdeSearch, setFechaDiaDesdeSearch] = useState("1");
  const [fechaMesDesdeSearch, setFechaMesdesdeSearch] = useState("1");
  const [fechaAnnoDesdeSearch, setFechaAnnoDesdeSearch] = useState("2000");

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
        setDropDownItemsNombreTienda([
          { label: "Tiendas", value: "" },
          ...tiendasMapeados,
        ]);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar proovedor
  const callModalAddProveedor = () => {
    setNombreTiendaDetails("");
    setDireccionTiendaDetails("");

    setModalEntradasDates({
      id_entrada: "",
      isAddEntrada: false,
      isModificarEntrada: false,
      fileEditable: true,
    });
  };

  const cargarDetailsOfTienda = async () => {
    if (usuario?.token && modalEntradasDates?.id_entrada) {
      // Reinicia los datos de la fecha antes de realizar la carga de datos
      setIsDateLoaded(false); // Para asegurarte de que el componente no use los datos antiguos

      const result = await getTiendaById(
        usuario.token,
        modalEntradasDates.id_entrada
      );

      if (result) {
        // Actualizamos los detalles
        setIdTiendaDetails(result.id_tienda);
        setNombreTiendaDetails(result.nombre);
        setDireccionTiendaDetails(result.direccion);
        setComicionTiendaDetails(`${result.comicion}%`);

        // Actualizamos las horas de apertura y cierre
        const horaApertura = new Date();
        horaApertura.setHours(parseInt(result.hora_apertura.split(":")[0]));
        horaApertura.setMinutes(parseInt(result.hora_apertura.split(":")[1]));
        horaApertura.setSeconds(parseInt(result.hora_apertura.split(":")[2]));
        setHoraApertura(horaApertura);

        const horaCierre = new Date();
        horaCierre.setHours(parseInt(result.hora_cierre.split(":")[0]));
        horaCierre.setMinutes(parseInt(result.hora_cierre.split(":")[1]));
        horaCierre.setSeconds(parseInt(result.hora_cierre.split(":")[2]));
        setHoraCierre(horaCierre);

        // Marcamos los datos como cargados al final del proceso
        setIsDateLoaded(true);
      }
    }
  };

  const auxiliarFunctionFilter = async (): Promise<Tienda[] | null> => {
    if (usuario?.token) {
      try {
        const result = await filtrarEntrada(
          usuario.token,
          nombreProveedorSearch,
          nombreProductoSearch,
          costoDesdeSearch,
          costoHastaSearch,
          `${fechaAnnoDesdeSearch}-${fechaMesDesdeSearch}-${fechaDiaDesdeSearch}`,
          `${fechaAnnoHastaSearch}-${fechaMesHastaSearch}-${fechaDiaHastaSearch}`
        );

        if (result) {
          const proveedoresMapeados: Tienda[] = await Promise.all(
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
    cargarDetailsOfTienda();
  }, [modalEntradasDates]);
  // Para filtrar y/o ordenar los datos según se halla digitado o seleccionado
  const obtenerTodasLasTiendas = async () => {
    if (usuario?.token != undefined) {
      try {
        // Obtener proovedores desde la tabla
        const result = await getAllTiendas(usuario.token);

        if (result && Array.isArray(result.data)) {
          // Mapeamos los proovedores y obtenemos tanto la cantidadTotal como si tienen opciones
          const TiendasMapeados: Tienda[] = await Promise.all(
            result.data.map(async (element: any) => {
              // Mapeamos a la interfaz Proveedor
              return {
                id_Tienda: element.id_tienda,
                nombre: element.nombre,
                direccion: element.direccion,
                comicion: element.comicion
              };
            })
          );

          // Actualizamos el estado de filterItems con los productos mapeados
          setFilterItems(TiendasMapeados);
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
        await obtenerTodasLasTiendas();
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
  const filtrarYOrdenarEntradas = async () => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let EntradasFiltradas: Tienda[] =
          (await auxiliarFunctionFilter()) || [];

        setAxuOrdenar(auxOrdenar ? false : true);

        /*
        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortEntradas?.criterioOrden && sortEntradas.tipoOrden) {
          EntradasFiltradas = await ordenarEntradas(
            usuario.token,
            EntradasFiltradas,
            sortEntradas.criterioOrden,
            auxOrdenar
          );
        }
        */
        // Actualizar el estado con los productos filtrados (y ordenados si corresponde)
        setFilterItems(EntradasFiltradas);
      }
    } catch (error) {
      console.error("Error al filtrar y ordenar los proovedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const auxSetModalProovedoresDates = () => {
    setIsDateLoaded(false);
    setNombreTiendaDetails("");
    setDireccionTiendaDetails("");
    setIdTiendaDetails("");

    setModalEntradasDates({
      id_entrada: "",
      isAddEntrada: true,
      fileEditable: true,
      isModificarEntrada: false,
    });

    setIsDateLoaded(true);
  };

  // Función para cuando precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      // Aquí ejecutas la función que deseas
      filtrarYOrdenarEntradas();
    }
  };

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreProveedorSearch("");
    setNombreProductoSearch("");
    setCostoDesdeSearch("");
    setSelectedOptionTipoOrden("");
  };

  // Método para agregar un nuevo producto al sistema
  const addNewTienda = async () => {
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL INGRESAR TIENDA. Por favor verifique los siguientes campos:\n";

      if (nombreTiendaDetails.trim() === "") {
        validarCampos += "-El nombre de la tienda no puede ser vacío.\n";
        flag = false;
      }
      if (horaApertura.getTime() > horaCierre.getTime()) {
        validarCampos +=
          "-La hora de apertura no puede ser más tarde que la hora de cierre.\n";
        flag = false;
      }
      if (comicionTiendaDetails.includes("%")) {
        const partes = comicionTiendaDetails.split("%");
        if (partes[0].trim() === "") {
          // No hay nada a la izquierda del %
          validarCampos += "-La comición no puede ser vacío.\n";
          flag = false;
        }
      } else {
        // No hay % en la cadena
        validarCampos += "-Debe poner el % a la derecha de la comición.\n";
        flag = false;
      }

      if (flag) {
        await addTienda(
          usuario.token,
          nombreTiendaDetails,
          direccionTiendaDetails,
          comicionTiendaDetails.split("%")[0],
          horaApertura.toLocaleTimeString(),
          horaCierre.toLocaleTimeString()
        );

        // Agregar Acción de usuario agregar proveedor
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó la tienda ${nombreTiendaDetails}.`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          6
        );

        setModalMensaje(`La tienda fue insertada con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setNombreTiendaDetails("");
        setDireccionTiendaDetails("");
        setIdTiendaDetails("");
      } else {
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };
  // Método para actualizar los datos de un producto
  const modificarEntradaFunction = async () => {
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL MODIFICAR TIENDA. Compruebe los siguientes campos:\n";

      if (nombreTiendaDetails.trim() === "") {
        validarCampos += "-El nombre de la tienda no puede ser vacío.\n";
        flag = false;
      }
      if (horaApertura.getTime() > horaCierre.getTime()) {
        validarCampos +=
          "-La hora de apertura no puede ser más tarde que la hora de cierre.\n";
        flag = false;
      }
      if (comicionTiendaDetails.includes("%")) {
        const partes = comicionTiendaDetails.split("%");
        if (partes[0].trim() === "") {
          // No hay nada a la izquierda del %
          validarCampos += "-La comición no puede ser vacío.\n";
          flag = false;
        }
      } else {
        // No hay % en la cadena
        validarCampos += "-Debe poner el % a la derecha de la comición.\n";
        flag = false;
      }

      if (flag) {
        await updateTienda(
          usuario.token,
          idTiendaDetails,
          nombreTiendaDetails,
          direccionTiendaDetails,
          comicionTiendaDetails.split("%")[0],
          horaApertura.toLocaleTimeString(),
          horaCierre.toLocaleTimeString()
        );

        // Agregar Acción de usuario agregar proveedor

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} modificó la tienda ${nombreTiendaDetails}.`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          6
        );

        setModalMensaje(`La tienda se modificó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setNombreTiendaDetails("");
        setDireccionTiendaDetails("");
      } else {
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
        setReflechModalMensajeView(false);
      }
    }
  };
  // Método para eliminar los datos de un producto
  const eliminarEntradaFunction = async () => {
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL ELIMINAR ENTRADA. Compruebe los siguientes parámetros:\n";

      if (flag) {
        const result = await deleteTienda(usuario.token, idTiendaDetails);

        if (result) {
          // Agregar Acción de usuario agregar proveedor

          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó la tienda ${nombreTiendaDetails}.`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            6
          );

          setModalMensaje(`La tienda se eliminó con éxito`);
          setModalMensajeView(true);
          setReflechModalMensajeView(true);
          setNombreTiendaDetails("");
          setDireccionTiendaDetails("");
        } else {
          validarCampos += "-Ya se han echo operaciones en la tienda.\n";
          setModalMensaje(validarCampos);
          setModalMensajeView(true);
          setReflechModalMensajeView(false);
        }
      } else {
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
        setReflechModalMensajeView(false);
      }
    }
  };

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = ["Nombre", "Dirección", "Comición"];
  const columnasMyDateTableTiendaModal = ["Nombre", "Cantidad",];
  const columnasMyDateTableProveedorModal = [
    "Nombre",
    "Correo",
    "Detalle Bancario",
    "Teléfono",
  ];

  const columnasMyDateTableMovil = ["Nombre", "Dirección", , "Comición"];
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
          {false && isPermisoAgregarEntrada && (
            <TouchableOpacity
              onPress={() =>
                setModalEntradasDates({
                  id_entrada: "",
                  isAddEntrada: true,
                  fileEditable: true,
                  isModificarEntrada: false,
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
              <Text style={styles.radioButtonTextMovil}>Agregar Tienda</Text>
            </TouchableOpacity>
          )}
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
            <MyDateTableTiendasView
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
                {/* Nombre de la tienda */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre de la Tienda
                  </Text>
                </View>
                <CustomTextImputSearch
                  ref={nombreProductoRef}
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={true}
                  value={nombreTiendaDetails}
                  onChangeText={setNombreTiendaDetails}
                  placeholder="Nombre de la tienda"
                />

                {/* Dirección */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Dirección de la Tienda
                  </Text>
                </View>
                <CustomTextImputSearch
                  ref={nombreProductoRef}
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={true}
                  value={direccionTiendaDetails}
                  onChangeText={setDireccionTiendaDetails}
                  placeholder="Dirección de la tienda"
                />

                {/* Comición */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Comición de los trabajadores en %
                  </Text>
                </View>
                <CustomTextImputSearch
                  ref={nombreProductoRef}
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={true}
                  value={comicionTiendaDetails}
                  onChangeText={(text) => {
                    // Permite solo números y un punto decimal
                    const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                    // Asegura que solo haya un punto decimal
                    const validNumericValue =
                      numericValue.split(".").length > 2
                        ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                        : numericValue;

                    // Verifica si el valor numérico es mayor que 100
                    if (parseFloat(validNumericValue) > 100) {
                      return;
                    }

                    // Agrega el símbolo de porcentaje (%) al final del texto
                    const formattedValue = `${validNumericValue}%`;

                    // Verifica si el usuario está intentando borrar el símbolo de porcentaje (%)
                    if (text.length < comicionTiendaDetails.length) {
                      const newValue = comicionTiendaDetails.slice(0, -1);
                      setComicionTiendaDetails(newValue);
                    } else {
                      setComicionTiendaDetails(formattedValue);
                    }
                  }}
                  placeholder="Comición de los trabajadores en %"
                />

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
                  {/* Campo Hora apertura */}
                  <View style={{ width: "45%", marginLeft: "5%" }}>
                    <Text style={styles.labelTextModalDesktop}>Apertura</Text>
                    <CustomDateTimePicker
                      selected={horaApertura}
                      onChange={setHoraApertura}
                      style={{
                        width: "100%",
                        height: 40,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderColor: "rgba(0, 0, 0, 0.2)",
                        borderWidth: 1,
                        shadowColor: "rgba(0, 0, 0, 0.2)",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                      }}
                      placeholder="Selecciona una hora"
                      editable={true}
                      cursorColor="rgba(0, 0, 0, 0.8)"
                    />
                  </View>

                  {/* Campo Hora cierre */}
                  <View
                    style={{
                      width: "45%",
                      marginRight: "5%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Cierre</Text>
                    <CustomDateTimePicker
                      selected={horaCierre}
                      onChange={setHoraCierre}
                      style={{
                        width: "100%",
                        height: 40,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderColor: "rgba(0, 0, 0, 0.2)",
                        borderWidth: 1,
                        shadowColor: "rgba(0, 0, 0, 0.2)",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                      }}
                      placeholder="Selecciona una hora"
                      editable={true}
                      cursorColor="rgba(0, 0, 0, 0.8)"
                    />
                  </View>
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
                  {modalEntradasDates?.id_entrada !== "" && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.azul_Oscuro,
                        borderRadius: 15,
                        width: "40%", // Ancho fijo para pantallas de escritorio
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
                          `¿Estás seguro que deseas MODIFICAR los datos de esta tienda?`
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
                        Modificar Tienda
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Botón para agregar proveedor */}
                  {modalEntradasDates?.id_entrada === "" && (
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
                      onPress={() => addNewTienda()}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                        }}
                      >
                        Agregar Tienda
                      </Text>
                    </TouchableOpacity>
                  )}
                  {/* Botón para eliminar proveedor */}
                  {modalEntradasDates?.id_entrada !== "" && (
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
                          `¿Estás seguro que deseas ELIMINAR al esta tienda?`
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
                        Eliminar Tienda
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
                    ? navigation.replace("Tiendas")
                    : setModalMensajeView(!isModalMensajeView)
                }
              >
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>
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
          {false && isPermisoAgregarEntrada && (
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
                Agregar Tienda
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
          ></LinearGradient>
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
            <MyDateTableTiendasView
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
                  ? "Agregar Tienda"
                  : "Datos de la Tienda"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre de la tienda */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre de la Tienda
                  </Text>
                </View>
                <CustomTextImputSearch
                  ref={nombreProductoRef}
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={true}
                  value={nombreTiendaDetails}
                  onChangeText={setNombreTiendaDetails}
                  placeholder="Nombre de la tienda"
                />

                {/* Dirección */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Dirección de la Tienda
                  </Text>
                </View>
                <CustomTextImputSearch
                  ref={nombreProductoRef}
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={true}
                  value={direccionTiendaDetails}
                  onChangeText={setDireccionTiendaDetails}
                  placeholder="Dirección de la tienda"
                />

                {/* Comición */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Comición de los trabajadores en %
                  </Text>
                </View>
                <CustomTextImputSearch
                  ref={nombreProductoRef}
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={true}
                  value={comicionTiendaDetails}
                  onChangeText={(text) => {
                    // Permite solo números y un punto decimal
                    const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                    // Asegura que solo haya un punto decimal
                    const validNumericValue =
                      numericValue.split(".").length > 2
                        ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                        : numericValue;

                    // Verifica si el valor numérico es mayor que 100
                    if (parseFloat(validNumericValue) > 100) {
                      return;
                    }

                    // Agrega el símbolo de porcentaje (%) al final del texto
                    const formattedValue = `${validNumericValue}%`;

                    // Verifica si el usuario está intentando borrar el símbolo de porcentaje (%)
                    if (text.length < comicionTiendaDetails.length) {
                      const newValue = comicionTiendaDetails.slice(0, -1);
                      setComicionTiendaDetails(newValue);
                    } else {
                      setComicionTiendaDetails(formattedValue);
                    }
                  }}
                  placeholder="Comición de los trabajadores en %"
                />

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
                  {/* Campo Hora apertura */}
                  <View style={{ width: "45%", marginLeft: "5%" }}>
                    <Text style={styles.labelTextModalDesktop}>Apertura</Text>
                    <CustomDateTimePicker
                      selected={horaApertura}
                      onChange={setHoraApertura}
                      style={{
                        width: "100%",
                        height: 40,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderColor: "rgba(0, 0, 0, 0.2)",
                        borderWidth: 1,
                        shadowColor: "rgba(0, 0, 0, 0.2)",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                      }}
                      placeholder="Selecciona una hora"
                      editable={true}
                      cursorColor="rgba(0, 0, 0, 0.8)"
                    />
                  </View>

                  {/* Campo Hora cierre */}
                  <View
                    style={{
                      width: "45%",
                      marginRight: "5%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Cierre</Text>
                    <CustomDateTimePicker
                      selected={horaCierre}
                      onChange={setHoraCierre}
                      style={{
                        width: "100%",
                        height: 40,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 5,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderColor: "rgba(0, 0, 0, 0.2)",
                        borderWidth: 1,
                        shadowColor: "rgba(0, 0, 0, 0.2)",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                      }}
                      placeholder="Selecciona una hora"
                      editable={true}
                      cursorColor="rgba(0, 0, 0, 0.8)"
                    />
                  </View>
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
                  {modalEntradasDates?.id_entrada !== "" && (
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
                          `¿Estás seguro que deseas MODIFICAR los datos de esta tienda?`
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
                        Modificar Tienda
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Botón para agregar proveedor */}
                  {modalEntradasDates?.id_entrada === "" && (
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
                      onPress={() => addNewTienda()}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                        }}
                      >
                        Agregar Tienda
                      </Text>
                    </TouchableOpacity>
                  )}
                  {/* Botón para eliminar proveedor */}
                  {modalEntradasDates?.id_entrada !== "" && (
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
                          `¿Estás seguro que deseas ELIMINAR al esta tienda?`
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
                        Eliminar Tienda
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
                    ? navigation.replace("Tiendas")
                    : setModalMensajeView(!isModalMensajeView)
                }
              >
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
