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
} from "../services/ProductoServices";
import { ProductoPiker } from "../components/MyDateTableProductos";
import { useModalEntradasDates } from "../contexts/AuxiliarContextModalEntradas";
import { MyDateInput } from "../components/MyDateInput";
import { useSortEntradas } from "../contexts/AuxiliarSortEntradas";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import { MyDateTablePermisos, Permiso } from "../components/MyDateTablePermisos";

export default function PermisosView() {
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
  const [idEntradaDetails, setIdEntradaDetails] = useState("");
  const [idProveedorDetails, setIdProveedorDetails] = useState("");
  const [idProductoDetails, setIdProductoDetails] = useState("");
  const [idTiendaDetails, setIdTiendaDetails] = useState("");
  const [cantidadDetails, setCantidadDetails] = useState("");
  const [costoDetails, setCostoDetails] = useState("");
  const [fechaDiaDetails, setFechaDiaDetails] = useState("");
  const [fechaMesDetails, setFechaMesDetails] = useState("");
  const [fechaAnnoDetails, setFechaAnnoDetails] = useState("");

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
      const resultAgregarEntrada = await isPermiso(
        usuario.token,
        usuario.id_rol,
        "10"
      );
      const resultEliminarEntrada = await isPermiso(
        usuario.token,
        usuario.id_rol,
        "12"
      );
      const resultModificarEntrada = await isPermiso(
        usuario.token,
        usuario.id_rol,
        "11"
      );

      setIsPermisoAgregarEntrada(resultAgregarEntrada);
      setIsPermisoEliminarEntrada(resultEliminarEntrada);
      setIsPermisoModificarEntrada(resultModificarEntrada);
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
  const [filterItems, setFilterItems] = useState<Permiso[]>([]);

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
    setIdProveedorDetails("");
    setCostoDetails("");
    setCantidadDetails("");
    setIdProductoDetails("");

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
        setCostoDetails(result.costo);

        // Actualizamos las fechas (nuevos datos)
        setFechaDiaDetails(String(parseInt(day)));
        setFechaMesDetails(String(parseInt(month)));
        setFechaAnnoDetails(String(parseInt(year)));

        // Actualizamos los valores auxiliares
        setIdProductoAuxModificarDetails(result.producto.id_producto);
        setIdTiendaAuxModificarDetails(result.tienda.id_tienda);
        setCantidadAuxModificarDetails(result.cantidad);

        // Marcamos los datos como cargados al final del proceso
        setIsDateLoaded(true);
      }
    }
  };

  const auxiliarFunctionFilter = async (): Promise<Permiso[] | null> => {
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
          const proveedoresMapeados: Permiso[] = await Promise.all(
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
          const proveedoresMapeados: Permiso[] = await Promise.all(
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
  const filtrarYOrdenarEntradas = async () => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let EntradasFiltradas: Permiso[] =
          (await auxiliarFunctionFilter()) || [];

        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortEntradas?.criterioOrden && sortEntradas.tipoOrden) {
          EntradasFiltradas = await ordenarEntradas(
            usuario.token,
            EntradasFiltradas,
            sortEntradas.criterioOrden,
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
    filtrarYOrdenarEntradas();
  }, [
    fechaDiaDesdeSearch,
    fechaMesDesdeSearch,
    fechaAnnoDesdeSearch,
    fechaDiaHastaSearch,
    fechaMesHastaSearch,
    fechaAnnoHastaSearch,
    sortEntradas,
  ]);

  const auxSetModalProovedoresDates = () => {
    setIsDateLoaded(false);
    setIdProveedorDetails("");
    setIdProductoDetails("");
    setIdTiendaDetails("");
    setCantidadDetails("");
    setCostoDetails("");

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
  const addNewEntrada = async () => {
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
      if (costoDetails === "") {
        flag = false;
        validarCampos += "-Ingrese el costo del producto por unidad.\n";
      }

      if (flag) {
        await addEntrada(
          usuario.token,
          costoDetails,
          cantidadDetails,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          parseInt(idProveedorDetails),
          parseInt(idProductoDetails),
          parseInt(idTiendaDetails)
        );

        await addProductoEntrada(
          usuario.token,
          parseInt(idTiendaDetails),
          parseInt(idProductoDetails),
          parseInt(cantidadDetails)
        );

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
        setModalMensaje(`La entrada fue insertado con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setIdProveedorDetails("");
        setIdProductoDetails("");
        setIdTiendaDetails("");
        setCostoDetails("");
        setCantidadDetails("");
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
      if (costoDetails === "") {
        flag = false;
        validarCampos += "-Ingrese el costo del producto por unidad.\n";
      }

      if (flag) {
        await modificarEntrada(
          usuario.token,
          idEntradaDetails,
          costoDetails,
          cantidadDetails,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          parseInt(idProveedorDetails),
          parseInt(idProductoDetails),
          parseInt(idTiendaDetails)
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

        setModalMensaje(`La entrada se modificó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setIdProveedorDetails("");
        setCostoDetails("");
        setIdProductoDetails("");
        setCantidadDetails("");
      } else {
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };
  // Método para eliminar los datos de un producto
  const eliminarEntradaFunction = async () => {
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

        setModalMensaje(`La entrada se eliminó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setIdProveedorDetails("");
        setCostoDetails("");
        setIdProductoDetails("");
        setCantidadDetails("");
      } else {
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = [
    "Nombre Proveedor",
    "Nombre Producto",
    "Cantidad",
    "Costo Por Unidad",
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
    "Costo Por Unidad",
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
            <MyDateTablePermisos
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
                      zIndex: 500
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
                        onDropdownOpen={()=> controlarCapas("FechaDesdeSearsh")}
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
                        onDropdownOpen={()=> controlarCapas("FechaHastaSearsh")}
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
                    placeholder="Proveedores"
                    setValue={setIdProveedorDetails}
                    items={dropdownItemsNombreProveedor}
                    searchable={true}
                  />
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
                    placeholder="Tiendas"
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
                    <Text style={styles.labelTextModalMovil}>Costo en USD</Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
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
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarEntrada ? true : false}
                      placeholder="Costo en USD"
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
                          Modificar Entrada
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
                  {isPermisoEliminarEntrada &&
                    modalEntradasDates?.id_entrada !== "" && (
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
                    ? navigation.replace("Permisos")
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
            <Text style={styles.textSearchDesktop}>Nombre del Proveedor:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del proveedor"
              value={nombreProveedorSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreProveedorSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Nombre del Producto:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del Producto"
              value={nombreProductoSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreProductoSearch}
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
                  onPress={() => filtrarYOrdenarEntradas()}
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
            <MyDateTablePermisos
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
                    placeholder="Proveedores"
                    setValue={setIdProveedorDetails}
                    items={dropdownItemsNombreProveedor}
                    searchable={true}
                  />
                </View>

                {/* Nombre del Producto */}
                <View
                  style={{ width: "100%", zIndex: 1500, position: "relative" }}
                >
                  <Text style={styles.labelTextModalDesktop}>
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
                    placeholder="Tiendas"
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
                      Costo en USD
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
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
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarEntrada ? true : false}
                      placeholder="Costo en USD"
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
                      />
                    )}
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
                          Modificar Entrada
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
                  {isPermisoEliminarEntrada &&
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
                            `¿Estás seguro que deseas ELIMINAR al esta entrada?`
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
                    ? navigation.replace("Permisos")
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
