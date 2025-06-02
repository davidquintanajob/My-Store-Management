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
import { LinearGradient } from "expo-linear-gradient";
import {
  actualizarProveedor,
  addProveedor,
  deleteProveedor,
  filtrarProveedor,
  getAllProveedores,
  getProveedorById,
} from "../services/ProveedorServices";
import CustomTextImputSearch from "../components/CustomTextImputSearch";

import { useUsuario } from "../contexts/UsuarioContext";
import {
  getAllTiendas,
  getAllTiendasByProduct,
  getTiendaById,
} from "../services/TiendaServices";
import { TiendaPiker } from "../components/MyDateTableTiendas";
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
import { isPermiso } from "../services/RolPermisosAndRol";
import { useModalProveedoresDates } from "../contexts/AuxiliarContextFromModalProveedores";
import {
  EntradaShowModal,
  MyDateTableModalShowDatesEntradas,
} from "../components/MyDateTableModalShowDatesEntradas";
import { getAllEntradasByProveedorId } from "../services/EntradaServices";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import {
  Cliente,
  MyDateTableClientes,
} from "../components/MyDateTableClientes";
import {
  actualizarCliente,
  addCliente,
  deleteCliente,
  filtrarCliente,
  getAllClientes,
  getClienteById,
  ordenarClientes,
} from "../services/clienteServices";
import { useSortClientes } from "../contexts/AuxiliarSortClientes";

export default function ClientesView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  // Datos del usuario que está logueado
  const { usuario, setUsuario } = useUsuario();
  const { sortClientes, setSortClientes } = useSortClientes();
  const { modalProveedoresDates, setModalProveedoresDates } =
    useModalProveedoresDates();

  // Constantes para controlar la animación del boton desplegable
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado
  const animationValueOptions = useRef(new Animated.Value(0)).current; // Valor animado

  // Variables para controlar los campos de los formularios de agregar proovedores y ver datos
  const [idClienteDetails, setIdClienteDetails] = useState("");
  const [nombreClienteDetails, setNombreClienteDetails] = useState("");
  const [correoEmailClienteDetails, setCorreoEmailClienteDetails] =
    useState("");
  const [telefonoClienteDetails, setTelefonoClienteDetails] = useState("");
  const [notaClienteDetails, setNotaClienteDetails] = useState("");
  const [descripcionClienteDetails, setDescripcionClienteDetails] =
    useState("");
  const [cfiClienteDetails, setCfiClienteDetails] = useState("");
  const [detallesBancariosClienteDetils, setDetallesBancariosProveedorDetils] =
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
  const [isPermisoAgregarCliente, setIsPermisoAgregarCliente] =
    React.useState(false);
  const [isPermisoEliminarCliente, setIsPermisoEliminarCliente] =
    React.useState(false);
  const [isPermisoModificarCliente, setIsPermisoModificarCliente] =
    React.useState(false);

    const checkPermiso = async () => {
      if (usuario?.token) {
        // Verificar y almacenar el permiso de agregar cliente
        if (localStorage.getItem("resultAgregarClienteView") === null) {
          const resultAgregarClienteView = await isPermiso(
            usuario.token,
            "16",
            usuario.id_usuario
          );
          setIsPermisoAgregarCliente(resultAgregarClienteView);
          localStorage.setItem("resultAgregarClienteView", resultAgregarClienteView);
        } else {
          setIsPermisoAgregarCliente(Boolean(localStorage.getItem("resultAgregarClienteView")));
        }
    
        // Verificar y almacenar el permiso de eliminar cliente
        if (localStorage.getItem("resultEliminarClienteView") === null) {
          const resultEliminarClienteView = await isPermiso(
            usuario.token,
            "18",
            usuario.id_usuario
          );
          setIsPermisoEliminarCliente(resultEliminarClienteView);
          localStorage.setItem("resultEliminarClienteView", resultEliminarClienteView);
        } else {
          setIsPermisoEliminarCliente(Boolean(localStorage.getItem("resultEliminarClienteView")));
        }
    
        // Verificar y almacenar el permiso de modificar cliente
        if (localStorage.getItem("resultModificarClienteView") === null) {
          const resultModificarClienteView = await isPermiso(
            usuario.token,
            "17",
            usuario.id_usuario
          );
          setIsPermisoModificarCliente(resultModificarClienteView);
          localStorage.setItem("resultModificarClienteView", resultModificarClienteView);
        } else {
          setIsPermisoModificarCliente(Boolean(localStorage.getItem("resultModificarClienteView")));
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

  const [entradasByProveedor, setEntradasByProveedor] = useState<
    EntradaShowModal[]
  >([]);

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
  const [filterItems, setFilterItems] = useState<Cliente[]>([]);

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

  const [dropdownItems, setDropDownItems] = useState<TiendaPiker[]>([]);

  //Variables Para los datos de busqueda
  const [nombreClienteSearch, setNombreClienteSearch] = useState("");
  const [cifSearch, setCifSearch] = useState("");
  const [telefonoSearch, setTelefonoSearch] = useState("");
  const [detallesBancariosSearch, setDetallesBancariosSearch] = useState("");

  // Variable visual para la carga de datos en la tabla
  const [loading, setLoading] = useState(false);

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
        setDropDownItems([{ label: "Tiendas", value: "" }, ...tiendasMapeados]);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar proovedor
  const callModalAddProveedor = () => {
    setNombreClienteDetails("");
    setCfiClienteDetails("");
    setNotaClienteDetails("");
    setTelefonoClienteDetails("");
    setDescripcionClienteDetails("");
    setCorreoEmailClienteDetails("");
    setDetallesBancariosProveedorDetils("");

    setModalProveedoresDates({
      id_proveedor: "",
      isAddProveedor: false,
      isModificarProveedor: false,
      fileEditable: true,
      isAddProductoShowProveedoresTiendas: false,
      isDetallesProveedores: false,
    });
  };
  const cargarDetailsOfCliente = async () => {
    if (usuario?.token && modalProveedoresDates?.id_proveedor) {
      const result = await getClienteById(
        usuario.token,
        modalProveedoresDates.id_proveedor
      );
      if (result) {
        setIdClienteDetails(modalProveedoresDates.id_proveedor);
        setNombreClienteDetails(result.nombre);
        setCorreoEmailClienteDetails(result.email || "");
        setDescripcionClienteDetails(result.descripcion || "");
        setTelefonoClienteDetails(result.telefono || "");
        setNotaClienteDetails(result.nota || "");
        setCfiClienteDetails(result.Cif || "");
        setDetallesBancariosProveedorDetils(result.detalles_bancarios || "");
      }
    }
  };

  const auxiliarFunctionFilter = async (): Promise<Cliente[] | null> => {
    if (usuario?.token) {
      try {
        const result = await filtrarCliente(
          usuario.token,
          nombreClienteSearch,
          telefonoSearch,
          cifSearch,
          detallesBancariosSearch
        );

        if (result) {
          const proveedoresMapeados: Cliente[] = await Promise.all(
            result.map(async (element: any) => ({
              id_Proveedor: element.id_proveedor,
              nombre: element.nombre,
              correo: element.email || "",
              direccion: element.direccion || "",
              telefono: element.telefono || "",
              nota: element.nota || "",
              cif: element.Cif || "",
              detalle_bancario: element.detalles_bancarios || "",
              descripcion: element.descripcion || "",
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
    filtrarYOrdenarClientes();
  }, [selectedOptionTipoOrden, sortClientes]);

  useEffect(() => {
    cargarDetailsOfCliente();
  }, [modalProveedoresDates]);
  // Para filtrar y/o ordenar los datos según se halla digitado o seleccionado
  const obtenerTodosLosClientes = async () => {
    if (usuario?.token != undefined) {
      try {
        // Obtener proovedores desde la tabla
        const result = await getAllClientes(usuario.token);

        if (result && Array.isArray(result)) {
          // Mapeamos los proovedores y obtenemos tanto la cantidadTotal como si tienen opciones
          const clientesMapeados: Cliente[] = await Promise.all(
            result.map(async (element: any) => {
              // Mapeamos a la interfaz Proveedor
              return {
                id_Cliente: element.id_cliente, // Mapea 'id_proovedor' a 'id_Proveedor'
                nombre: element.nombre, // Mapea 'nombre' directamente
                correo: element.email || "", // Asume que hay un campo 'correo' o usa un valor por defecto
                detalle_bancario: element.detalles_bancarios || "", // Asume que hay un campo 'detalle_bancario' o usa un valor por defecto
                telefono: element.telefono || "", // Mapea un teléfono o usa un valor por defecto
                nota: element.nota || "",
                cif: element.Cif || "",
                descripcion: element.descripcion || "",
              };
            })
          );

          // Actualizamos el estado de filterItems con los productos mapeados
          setFilterItems(clientesMapeados);
        } else {
          console.log("No se encontraron proveedoress.");
        }
      } catch (error) {
        console.log(
          "Error al obtener los proveedores o verificar permisos:",
          error
        );
        alert("Ocurrió un problema al cargar los datos de los proveedores");
      }
    } else {
      alert(
        "Ocurrió un problema al obtener el token de identificación del usuario para cargar los datos de los proovedores"
      );
    }
  };

  // Función para cuando precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      // Aquí ejecutas la función que deseas
      filtrarYOrdenarClientes();
    }
  };

  useFocusEffect(
    useCallback(() => {
      const runEffects = async () => {
        await checkPermiso();
        await obtenerTodosLosClientes();
        getDatesTiendaPiker();
      };
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  const [auxOrdenar, setAxuOrdenar] = useState(false);

  // Filtrar y ordenar productos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarClientes = async () => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let productosFiltrados: Cliente[] =
          (await auxiliarFunctionFilter()) || [];

        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortClientes?.criterioOrden && sortClientes.tipoOrden) {
          productosFiltrados = await ordenarClientes(
            usuario.token,
            productosFiltrados,
            sortClientes.criterioOrden,
            auxOrdenar
          );
        }

        // Actualizar el estado con los productos filtrados (y ordenados si corresponde)
        setFilterItems(productosFiltrados);
      }
    } catch (error) {
      console.error("Error al filtrar y ordenar los proovedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const auxSetModalProovedoresDates = () => {
    setNombreClienteDetails("");
    setCorreoEmailClienteDetails("");
    setDescripcionClienteDetails("");
    setTelefonoClienteDetails("");
    setNotaClienteDetails("");

    setModalProveedoresDates({
      id_proveedor: "",
      isAddProveedor: true,
      fileEditable: true,
      isModificarProveedor: false,
      isAddProductoShowProveedoresTiendas: false,
      isDetallesProveedores: false,
    });
  };

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreClienteSearch("");
    setCifSearch("");
    setDetallesBancariosSearch("");
    setTelefonoSearch("");
    setSelectedOptionTipoOrden("");
  };

  // Método para agregar un nuevo producto al sistema
  const addNewCliente = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Agregando cliente. Espere por favor");
    setModalMensajeView(true);
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL AGREGAR CLIENTE. Por favor verifique los siguientes campos:\n";

      if (nombreClienteDetails.trim() === "") {
        validarCampos += "-El nombre del cliente no puede ser vacío";
        flag = false;
      }

      if (flag) {
        await addCliente(
          usuario.token,
          nombreClienteDetails,
          correoEmailClienteDetails,
          telefonoClienteDetails,
          descripcionClienteDetails,
          notaClienteDetails,
          cfiClienteDetails,
          detallesBancariosClienteDetils
        );

        // Agregar Acción de usuario agregar proveedor

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó al sistema al cliente ${nombreClienteDetails}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          8
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(
          `El Cliente "${nombreClienteDetails}" fue insertado con éxito`
        );
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setNombreClienteDetails("");
        setTelefonoClienteDetails("");
        setCorreoEmailClienteDetails("");
        setDescripcionClienteDetails("");
        setNotaClienteDetails("");
        setCfiClienteDetails("");
        setDetallesBancariosProveedorDetils("");
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
    setIsButtonDisabled(false);
  };
  // Método para actualizar los datos de un producto
  const modificarProveedor = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Modificando cliente. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL MODIFICAR CLIENTE. Compruebe los siguientes campos:\n";

      if (nombreClienteDetails.trim() === "") {
        flag = false;
        validarCampos += "-El nombre del cliente no puede ser vacío";
      }
      if (parseInt(idClienteDetails) === 1) {
        flag = false;
        validarCampos +=
          "-No se puede modificar al cliente Anónimo ya que se usa en la lógica del software";
      }

      if (flag) {
        await actualizarCliente(
          usuario.token,
          idClienteDetails,
          nombreClienteDetails,
          correoEmailClienteDetails,
          telefonoClienteDetails,
          descripcionClienteDetails,
          notaClienteDetails,
          cfiClienteDetails,
          detallesBancariosClienteDetils
        );
        // Agregar Acción de usuario modificar proveedor

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} modificó al cliente ${nombreClienteDetails}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          8
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(
          `El Cliente "${nombreClienteDetails}" se modificó con éxito`
        );
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
  // Método para eliminar proveedor
  const eliminarProveedor = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Eliminando cliente. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL TRATAR DE ELIMINAR EL CLIENTE. Motivos:\n";

      if (parseInt(idClienteDetails) === 1) {
        flag = false;
        validarCampos +=
          "-No se puede eliminar al cliente Anónimo ya que se usa en la lógica del software";
      }

      if (flag) {
        const resulDeletProveedor = await deleteCliente(
          usuario.token,
          idClienteDetails
        );
        if (resulDeletProveedor) {
          // Agregar Acción de usuario agregar proveedor

          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó al cliente ${nombreClienteDetails}`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            8
          );

          setIsBotonModalMesajeVisible(true);
          setModalMensaje(
            `El Cliente "${nombreClienteDetails}" se eliminó con éxito`
          );
          setModalMensajeView(true);
          setReflechModalMensajeView(true);
        } else {
          setIsBotonModalMesajeVisible(true);
          validarCampos +=
            "-Ya se han echo operaciones en el sistema con este cliente.\n";
          setModalMensaje(validarCampos);
          setModalMensajeView(true);
        }
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
    "Nombre",
    "CIF / CI",
    "Correo",
    "Detalle Bancario",
    "Teléfono",
  ];
  const columnasMyDateTableEntradaModal = [
    "Producto",
    "Cantidad",
    "Costo",
    "Fecha",
  ];
  const columnasMyDateTableProveedorModal = [
    "Nombre",
    "CIF / CI",
    "Correo",
    "Detalle Bancario",
    "Teléfono",
  ];

  const columnasMyDateTableMovil = [
    "Nombre",
    "Correo",
    "Detalle Bancario",
    "telefono",
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
          {isPermisoAgregarCliente && (
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
              <Text style={styles.radioButtonTextMovil}>Agregar Cliente</Text>
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
            <MyDateTableClientes
              isMobile={isMobile}
              items={filterItems}
              columns={columnasMyDateTable}
              columnasMyDateTableProveedorModal={
                columnasMyDateTableProveedorModal
              }
              columnasMyDateTableTiendaModal={columnasMyDateTableEntradaModal}
              tiendasByProducto={[]}
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
                    Nombre del Cliente:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="Nombre del cliente"
                    onKeyPress={handleKeyPress}
                    value={nombreClienteSearch}
                    onChangeText={setNombreClienteSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>
                    CIF / Carnet Identidad:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="CIF / Carnet Identidad"
                    value={cifSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setCifSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>
                    Detalles Bancarios:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="Detalles Bancarios"
                    onKeyPress={handleKeyPress}
                    value={detallesBancariosSearch}
                    onChangeText={setDetallesBancariosSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>
                    Número de Teléfono:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="Número de Teléfono"
                    value={telefonoSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setTelefonoSearch}
                  />

                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      marginTop: "5%",
                    }}
                  >
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
                          filtrarYOrdenarClientes();
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
          visible={modalProveedoresDates?.isAddProveedor ?? false}
          animationType="fade"
          onRequestClose={callModalAddProveedor}
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
                width: "95%",
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
                {modalProveedoresDates?.isModificarProveedor ?? false
                  ? "Modificar Producto"
                  : modalProveedoresDates?.isAddProductoShowProveedoresTiendas ??
                    false
                  ? "Datos del Proveedor"
                  : "Agregar Proveedor"}
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
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Cliente
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={isPermisoModificarCliente ? true : false}
                  value={nombreClienteDetails}
                  onChangeText={setNombreClienteDetails}
                  placeholder="Nombre del cliente"
                />

                {/* Contenedor para los campos Número de Teléfono y CIF */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Número de Teléfono */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Número de Teléfono
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={telefonoClienteDetails}
                      onChangeText={setTelefonoClienteDetails}
                      editable={isPermisoModificarCliente ? true : false}
                      placeholder="Número de Teléfono"
                    />
                  </View>

                  {/* Campo CIF */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Código de Identificación Fiscal (CIF)
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={cfiClienteDetails}
                      onChangeText={setCfiClienteDetails}
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarCliente ? true : false}
                      placeholder="Código de Identificación Fiscal"
                    />
                  </View>
                </View>

                {/*Campos de detalles vancarios y de email */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Correo Electrónico */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Correo Electrónico
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={correoEmailClienteDetails}
                      onChangeText={setCorreoEmailClienteDetails}
                      editable={isPermisoModificarCliente ? true : false}
                      placeholder="Correo Electrónico"
                    />
                  </View>

                  {/* Campo Detalles Bancarios */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Detalles Bancarios
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={detallesBancariosClienteDetils}
                      onChangeText={setDetallesBancariosProveedorDetils}
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarCliente ? true : false}
                      placeholder="Detalles Bancarios"
                    />
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>Nota</Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={isPermisoModificarCliente ? true : false}
                  value={notaClienteDetails}
                  onChangeText={setNotaClienteDetails}
                  placeholder="Nota"
                />

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
                  placeholder="Escribe la descripción del cliente"
                  multiline={true}
                  editable={isPermisoModificarCliente ? true : false}
                  numberOfLines={5}
                  value={descripcionClienteDetails}
                  onChangeText={setDescripcionClienteDetails}
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
                  {isPermisoModificarCliente &&
                    modalProveedoresDates?.isDetallesProveedores && (
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
                            `¿Estás seguro que deseas MODIFICAR los datos cliente ${nombreClienteDetails}?`
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
                          Modificar Cliente
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para eliminar proveedor */}
                  {isPermisoEliminarCliente &&
                    modalProveedoresDates?.isDetallesProveedores && (
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
                            `¿Estás seguro que deseas ELIMINAR al cliente ${nombreClienteDetails}?`
                          );
                          setIsModalChekEliminarVisible(true);
                          setModalProveedoresDates({
                            id_proveedor: "",
                            isAddProveedor: false,
                            isModificarProveedor: false,
                            fileEditable: true,
                            isAddProductoShowProveedoresTiendas: false,
                            isDetallesProveedores: false,
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
                          Eliminar Cliente
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarCliente &&
                    modalProveedoresDates?.id_proveedor === "" && (
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
                        onPress={() => addNewCliente()}
                        disabled={isButtonDisabled}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Cliente
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
                      ? eliminarProveedor()
                      : modificarProveedor()
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
                      ? navigation.replace("Clientes")
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
          {(isPermisoAgregarCliente ||
            isPermisoModificarCliente ||
            isPermisoEliminarCliente) && (
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
                Agregar Cliente
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
            <Text style={styles.textSearchDesktop}>Nombre del Cliente:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del Cliente"
              value={nombreClienteSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreClienteSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>
              CIF / Carnet Identidad:
            </Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="CIF / Carnet Identidad"
              value={cifSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setCifSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Detalles Bancarios:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Detalles Bancarios"
              value={detallesBancariosSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setDetallesBancariosSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Número de Teléfono:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Número de Teléfono"
              value={telefonoSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setTelefonoSearch}
            />

            <View
              style={{ width: "100%", flexDirection: "row", marginTop: "5%" }}
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
                  onPress={() => filtrarYOrdenarClientes()}
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
            <MyDateTableClientes
              isMobile={isMobile}
              items={filterItems}
              columns={columnasMyDateTable}
              columnasMyDateTableProveedorModal={
                columnasMyDateTableProveedorModal
              }
              columnasMyDateTableTiendaModal={columnasMyDateTableEntradaModal}
              tiendasByProducto={[]}
              proveedorByProducto={proveedorByProducto}
            />
          )}
        </View>
        <Modal
          transparent={true}
          visible={modalProveedoresDates?.isAddProveedor ?? false}
          animationType="fade"
          onRequestClose={callModalAddProveedor}
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
                {modalProveedoresDates?.isModificarProveedor ?? false
                  ? "Modificar Producto"
                  : modalProveedoresDates?.isAddProductoShowProveedoresTiendas ??
                    false
                  ? "Datos del Cliente"
                  : "Agregar Cliente"}
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
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Cliente
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={isPermisoModificarCliente ? true : false}
                  value={nombreClienteDetails}
                  onChangeText={setNombreClienteDetails}
                  placeholder="Nombre del cliente"
                />

                {/* Contenedor para los campos Número de Teléfono y CIF */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Número de Teléfono */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Número de Teléfono
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={telefonoClienteDetails}
                      onChangeText={setTelefonoClienteDetails}
                      editable={isPermisoModificarCliente ? true : false}
                      placeholder="Número de Teléfono"
                    />
                  </View>

                  {/* Campo CIF */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Código de Identificación Fiscal (CIF)
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={cfiClienteDetails}
                      onChangeText={setCfiClienteDetails}
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarCliente ? true : false}
                      placeholder="Código de Identificación Fiscal"
                    />
                  </View>
                </View>

                {/*Campos de detalles vancarios y de email */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Correo Electrónico */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Correo Electrónico
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={correoEmailClienteDetails}
                      onChangeText={setCorreoEmailClienteDetails}
                      editable={isPermisoModificarCliente ? true : false}
                      placeholder="Correo Electrónico"
                    />
                  </View>

                  {/* Campo Detalles Bancarios */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Detalles Bancarios
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={detallesBancariosClienteDetils}
                      onChangeText={setDetallesBancariosProveedorDetils}
                      cursorColor={Colors.azul_Oscuro}
                      editable={isPermisoModificarCliente ? true : false}
                      placeholder="Detalles Bancarios"
                    />
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>Nota</Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={isPermisoModificarCliente ? true : false}
                  value={notaClienteDetails}
                  onChangeText={setNotaClienteDetails}
                  placeholder="Nota"
                />

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
                  placeholder="Escribe la descripción del cliente"
                  multiline={true}
                  editable={isPermisoModificarCliente ? true : false}
                  numberOfLines={5}
                  value={descripcionClienteDetails}
                  onChangeText={setDescripcionClienteDetails}
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
                  {isPermisoModificarCliente &&
                    modalProveedoresDates?.isDetallesProveedores && (
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
                            `¿Estás seguro que deseas MODIFICAR los datos cliente ${nombreClienteDetails}?`
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
                          Modificar Cliente
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Botón para eliminar proveedor */}
                  {isPermisoEliminarCliente &&
                    modalProveedoresDates?.isDetallesProveedores && (
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
                            `¿Estás seguro que deseas ELIMINAR al cliente ${nombreClienteDetails}?`
                          );
                          setIsModalChekEliminarVisible(true);
                          setModalProveedoresDates({
                            id_proveedor: "",
                            isAddProveedor: false,
                            isModificarProveedor: false,
                            fileEditable: true,
                            isAddProductoShowProveedoresTiendas: false,
                            isDetallesProveedores: false,
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
                          Eliminar Cliente
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarCliente &&
                    modalProveedoresDates?.id_proveedor === "" && (
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
                        onPress={() => addNewCliente()}
                        disabled={isButtonDisabled}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Cliente
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
                      ? eliminarProveedor()
                      : modificarProveedor()
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
                      ? navigation.replace("Clientes")
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
