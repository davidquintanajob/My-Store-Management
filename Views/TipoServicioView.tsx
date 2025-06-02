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
import { ProveedorPiker } from "../components/MyDateTableProveedores";
import {
  getAllProductos,
} from "../services/ProductoServices";
import { ProductoPiker } from "../components/MyDateTableProductos";
import { useModalEntradasDates } from "../contexts/AuxiliarContextModalEntradas";
import { useSortEntradas } from "../contexts/AuxiliarSortEntradas";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import {
  MyDateTableTipoServicio,
  TipoServicio,
} from "../components/MyDateTableTipoServicio";
import {
  addTipoServicio,
  deleteTipoServicio,
  filtrarTipoSrvicio,
  getAllTipoServicios,
  getTipoServicioByID,
  modificarTipoServicio,
} from "../services/TipoServiciosServices";

export default function TipoServicioView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

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
  const [idTipoServicioDetails, setIdTipoServicioDetails] = useState("");
  const [nombreTipoServicioDetails, setNombreTipoServicioDetails] =
    useState("");
  const [costoDetails, setCostoDetails] = useState("");

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
  const [isBotonModalMesajeVisible, setIsBotonModalMesajeVisible] = useState(false);

  // Condicionales para mostrar según los permisos
  const [isPermisoAgregarTipoServicio, setIsPermisoAgregarTipoServicio] =
    React.useState(false);
  const [isPermisoEliminarTipoServicio, setIsPermisoEliminarTipoServicio] =
    React.useState(false);
  const [isPermisoModificarTipoServicio, setIsPermisoModificarTipoServicio] =
    React.useState(false);

  const checkPermiso = async () => {
    if (usuario?.token) {
      const resultAgregarTipoServicioView = await isPermiso(
        usuario.token,
        "20",
        usuario.id_usuario
      );
      const resultModificarTipoServicioView = await isPermiso(
        usuario.token,
        "21",
        usuario.id_usuario
      );
      const resultEliminarTipoServicioView = await isPermiso(
        usuario.token,
        "22",
        usuario.id_usuario
      );

      setIsPermisoAgregarTipoServicio(resultAgregarTipoServicioView);
      setIsPermisoEliminarTipoServicio(resultEliminarTipoServicioView);
      setIsPermisoModificarTipoServicio(resultModificarTipoServicioView);
    }
  };

  const onDrop = (event: PanGestureHandlerGestureEvent) => {
    // Aquí puedes agregar la lógica para procesar los archivos
  };

  // Estado para controlar la opción seleccionada de los RadioButons de filtrado
  const [selectedOptionTipoOrden, setSelectedOptionTipoOrden] = useState<string | null>(null);

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
  const [filterItems, setFilterItems] = useState<TipoServicio[]>([]);

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
  const [nombreTipoServicioSearch, setNombreTipoServicioSearch] = useState("");
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
        setDropDownItemsNombreTienda([...tiendasMapeados]);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar proovedor
  const callModalAddProveedor = () => {
    setNombreTipoServicioDetails("");
    setCostoDetails("");
    setCostoDetails("");

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

      const result = await getTipoServicioByID(
        usuario.token,
        modalEntradasDates.id_entrada
      );

      if (result) {
        // Actualizamos los detalles
        setIdTipoServicioDetails(result.id_tipo_servicio);
        setNombreTipoServicioDetails(result.nombre);
        setCostoDetails(result.costo);

        // Actualizamos los valores auxiliares
        setIdProductoAuxModificarDetails(result.producto.id_producto);
        setIdTiendaAuxModificarDetails(result.tienda.id_tienda);
        setCantidadAuxModificarDetails(result.cantidad);

        // Marcamos los datos como cargados al final del proceso
        setIsDateLoaded(true);
      }
    }
  };

  const auxiliarFunctionFilter = async (): Promise<TipoServicio[] | null> => {
    if (usuario?.token) {
      try {
        const result = await filtrarTipoSrvicio(
          usuario.token,
          nombreTipoServicioSearch,
          costoDesdeSearch,
          costoHastaSearch
        );

        if (result) {
          const proveedoresMapeados: TipoServicio[] = await Promise.all(
            result.map(async (element: any) => ({
              id_TipoServicio: element.id_tipo_servicio,
              nombre_TipoServicio: element.nombre,
              costo: element.costo,
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
  const obtenerTodosLosTipoServicios = async () => {
    if (usuario?.token != undefined) {
      try {
        // Obtener tipos de servicios
        const result = await getAllTipoServicios(usuario.token);

        if (result && Array.isArray(result)) {
          // Mapeamos los proovedores y obtenemos tanto la cantidadTotal como si tienen opciones
          const proveedoresMapeados: TipoServicio[] = await Promise.all(
            result.map(async (element: any) => {
              // Mapeamos a la interfaz Proveedor
              return {
                id_TipoServicio: element.id_tipo_servicio,
                nombre_TipoServicio: element.nombre,
                costo: element.costo,
              };
            })
          );

          setFilterItems(proveedoresMapeados);
        } else {
          console.log("No se encontraron Tipos de Servicios.");
        }
      } catch (error) {
        console.log(
          "Error al obtener los Tipos de Servicios o verificar permisos:",
          error
        );
        alert(
          "Ocurrió un problema al cargar los datos de lo Tipos de Servicios"
        );
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
        await obtenerTodosLosTipoServicios();
      };
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  const [auxOrdenar, setAxuOrdenar] = useState(false);

  // Filtrar y ordenar productos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarTipoServicio = async () => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let EntradasFiltradas: TipoServicio[] =
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
  useEffect(() => {
    // Llamar a la función cuando alguna de las dependencias cambie
    filtrarYOrdenarTipoServicio();
  }, [
    fechaDiaDesdeSearch,
    fechaMesDesdeSearch,
    fechaAnnoDesdeSearch,
    fechaDiaHastaSearch,
    fechaMesHastaSearch,
    fechaAnnoHastaSearch,
    sortEntradas,
    selectedOptionTipoOrden,
  ]);

  const auxSetModalProovedoresDates = () => {
    setIsDateLoaded(false);
    setNombreTipoServicioDetails("");
    setCostoDetails("0");

    setModalEntradasDates({
      id_entrada: "",
      isAddEntrada: true,
      fileEditable: true,
      isModificarEntrada: false,
    });

    const currentDate = new Date();

    setIsDateLoaded(true);
  };

  // Función para cuando precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      // Aquí ejecutas la función que deseas
      filtrarYOrdenarTipoServicio();
    }
  };

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreTipoServicioSearch("");
    setNombreProductoSearch("");
    setCostoDesdeSearch("");
    setCostohastaSearch("");
    setSelectedOptionTipoOrden("");
  };

  // Método para agregar un nuevo producto al sistema
  const addNewTipoServicio = async () => {
    setIsBotonModalMesajeVisible(false)
    setModalMensaje("Agregando tipo de servicio. Espere por favor")
    setModalMensajeView(true)
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL INGRESAR TIPO DE SERVICIO. Por favor verifique los siguientes campos:\n";

      if (nombreTipoServicioDetails.trim() === "") {
        flag = false;
        validarCampos +=
          "-El nombre del tipo de servicio no puede ser vacio.\n";
      }
      if (costoDetails.trim() === "") {
        flag = false;
        validarCampos += "-El costo del tipo de servicio no puede ser vacio.\n";
      }

      if (flag) {
        await addTipoServicio(
          usuario.token,
          nombreTipoServicioDetails,
          costoDetails
        );

        // Agregar Acción de usuario agregar proveedor
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó un nuevo tipo de servicio: ${nombreTipoServicioDetails} con un costo de ${costoDetails}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          7
        );

        setIsBotonModalMesajeVisible(true)
        setModalMensaje(
          `Se ha creado el tipo de servicio ${nombreTipoServicioDetails}`
        );
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setNombreTipoServicioDetails("");
        setCostoDetails("");
      } else {
        setIsBotonModalMesajeVisible(true)
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };
  // Método para actualizar los datos de un tipo de servicio
  const modificarTipoServicioFunction = async () => {
    setIsBotonModalMesajeVisible(false)
    setModalMensaje("Modificando tipo de servicio. Espere por favor")
    setModalMensajeView(true)
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL MODIFICAR TIPO DE SERVICIO. Compruebe los siguientes campos:\n";

      if (nombreTipoServicioDetails.trim() === "") {
        flag = false;
        validarCampos +=
          "-El nombre del tipo de servicio no puede ser vacio.\n";
      }
      if (costoDetails === "") {
        flag = false;
        validarCampos += "-El costo del tipo de servicio no puede ser vacio.\n";
      }

      if (flag) {
        await modificarTipoServicio(
          usuario.token,
          idTipoServicioDetails,
          nombreTipoServicioDetails,
          costoDetails
        );

        // Agregar Acción de usuario agregar proveedor
        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} modificó el tipo de servicio: ${nombreTipoServicioDetails} con un costo de ${costoDetails}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          7
        );

        setIsBotonModalMesajeVisible(true)
        setModalMensaje(`El tipo de servicio se modificó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
      } else {
        setIsBotonModalMesajeVisible(true)
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };
  // Método para elimºinar los datos de un producto
  const eliminarEntradaFunction = async () => {
    setIsBotonModalMesajeVisible(false)
    setModalMensaje("Eliminando tipo de servicio. Espere por favor")
    setModalMensajeView(true)
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL ELIMINAR TIPO DE SERVICIO. Compruebe los siguientes parámetros:\n";

      // Combrovar tipos de servicios longevos
      
      if (
        parseInt(idTipoServicioDetails) === 2 ||
        parseInt(idTipoServicioDetails) === 25 ||
        parseInt(idTipoServicioDetails) === 26
      ) {
        flag = false;
        validarCampos +=
          "-No es posible eliminar este tipo de servicio ya que se usa en la lógica del software.\n";
      }

      if (flag) {
        const resultDelete = await deleteTipoServicio(
          usuario.token,
          idTipoServicioDetails
        );
        if (resultDelete) {
          // Agregar Acción de usuario agregar proveedor
          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó el tipo de servicio ${nombreTipoServicioDetails}.`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            7
          );

          setIsBotonModalMesajeVisible(true)
          setModalMensaje(`El tipo de servicio se eliminó con éxito`);
          setModalMensajeView(true);
          setReflechModalMensajeView(true);
          setNombreTipoServicioDetails("");
          setCostoDetails("");
        } else {
          setModalMensaje(validarCampos);
          setModalMensajeView(true);
        }
      } else {
        setIsBotonModalMesajeVisible(true)
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = ["Tipo de Servicio", "Costo"];
  const columnasMyDateTableTiendaModal = ["Nombre", "Cantidad"];
  const columnasMyDateTableProveedorModal = [
    "Nombre",
    "Correo",
    "Detalle Bancario",
    "Teléfono",
  ];

  const columnasMyDateTableMovil = ["Tipo de Servicio", "Costo"];
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
          {isPermisoAgregarTipoServicio && (
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
              <Text style={styles.radioButtonTextMovil}>
                Agregar Tipo de Servicio
              </Text>
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
            <MyDateTableTipoServicio
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
                  <Text style={styles.textSearchMovil}>
                    Nombre del tipo de Servicio:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="Nombre del tipo de Servicio"
                    value={nombreTipoServicioSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setNombreTipoServicioSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>Rango de Costo:</Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Desde"
                      value={costoDesdeSearch}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setCostoDesdeSearch(numericValue);
                      }}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Hasta"
                      value={costoHastaSearch}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setCostohastaSearch(numericValue);
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      position: "relative",
                      marginTop: "10%",
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
                        onPress={() => filtrarYOrdenarTipoServicio()}
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
              backgroundColor: "rgba(0, 0, 0, 0.5)"
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
                  ? "Agregar Tipo de Servicio"
                  : "Datos del Tipo de Servicio"}
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
                    marginLeft: "2%",
                    marginRight: "2%",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre Tipo de Servicio
                  </Text>
                  <CustomTextImputSearch
                    style={styles.textImputModal}
                    value={nombreTipoServicioDetails}
                    onChangeText={(text) => {
                      setNombreTipoServicioDetails(text);
                    }}
                    cursorColor={Colors.azul_Oscuro}
                    editable={isPermisoModificarTipoServicio ? true : false}
                    placeholder="Nombre Tipo de Servicio"
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
                    <Text style={styles.labelTextModalDesktop}>Costo</Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={costoDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setCostoDetails(validNumericValue);
                      }}
                      editable={isPermisoModificarTipoServicio ? true : false}
                      placeholder="Costo"
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
                  {isPermisoModificarTipoServicio &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Oscuro,
                          borderRadius: 15,
                          width: "43%", // Ancho fijo para pantallas de escritorio
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
                            `¿Estás seguro que deseas MODIFICAR los datos de este Tipo de Servicio?`
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Modificar Tipo de Servicio
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarTipoServicio &&
                    modalEntradasDates?.id_entrada === "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Claro,
                          borderRadius: 15,
                          width: "43%", // Ancho fijo para pantallas de escritorio
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
                        onPress={() => addNewTipoServicio()}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Tipo de Servicio
                        </Text>
                      </TouchableOpacity>
                    )}
                  {/* Botón para eliminar proveedor */}
                  {isPermisoEliminarTipoServicio &&
                    modalEntradasDates?.id_entrada !== "" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.rojo_oscuro,
                          borderRadius: 15,
                          width: "43%", // Ancho fijo para pantallas de escritorio
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
                            `¿Estás seguro que deseas ELIMINAR este Tipo de Servicio?`
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
                          Eliminar Tipo de Servicio
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
                  onPress={() => modificarTipoServicioFunction()}
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

              {isBotonModalMesajeVisible && (<TouchableOpacity
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
                    ? navigation.replace("Tipo de Servicio")
                    : setModalMensajeView(!isModalMensajeView)
                }
              >
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>)}
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
          {isPermisoAgregarTipoServicio && (
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
                Agregar Tipo de Servicio
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
            <Text style={styles.textSearchDesktop}>
              Nombre del tipo de Servicio:
            </Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del tipo de Servicio"
              value={nombreTipoServicioSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreTipoServicioSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Rango de Costo:</Text>
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

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                position: "relative",
                marginTop: "10%",
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
                  onPress={() => filtrarYOrdenarTipoServicio()}
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
            <MyDateTableTipoServicio
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
              backgroundColor: "rgba(0, 0, 0, 0.5)"
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
                  ? "Agregar Tipo de Servicio"
                  : "Datos del Tipo de Servicio"}
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
                    marginLeft: "2%",
                    marginRight: "2%",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre Tipo de Servicio
                  </Text>
                  <CustomTextImputSearch
                    style={styles.textImputModal}
                    value={nombreTipoServicioDetails}
                    onChangeText={(text) => {
                      setNombreTipoServicioDetails(text);
                    }}
                    cursorColor={Colors.azul_Oscuro}
                    editable={isPermisoModificarTipoServicio ? true : false}
                    placeholder="Nombre Tipo de Servicio"
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
                    <Text style={styles.labelTextModalDesktop}>Costo</Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={costoDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setCostoDetails(validNumericValue);
                      }}
                      editable={isPermisoModificarTipoServicio ? true : false}
                      placeholder="Costo"
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
                  {isPermisoModificarTipoServicio &&
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
                            `¿Estás seguro que deseas MODIFICAR los datos de este Tipo de Servicio?`
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Modificar Tipo de Servicio
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarTipoServicio &&
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
                        onPress={() => addNewTipoServicio()}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Tipo de Servicio
                        </Text>
                      </TouchableOpacity>
                    )}
                  {/* Botón para eliminar proveedor */}
                  {isPermisoEliminarTipoServicio &&
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
                            `¿Estás seguro que deseas ELIMINAR este Tipo de Servicio?`
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
                          Eliminar Tipo de Servicio
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
                      : modificarTipoServicioFunction()
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

              {isBotonModalMesajeVisible && (<TouchableOpacity
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
                    ? navigation.replace("Tipo de Servicio")
                    : setModalMensajeView(!isModalMensajeView)
                }
              >
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>)}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
