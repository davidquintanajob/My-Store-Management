import Navbar from "../components/Navbar";
import { Colors } from "../styles/Colors";
import { styles } from "../styles/Styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react"; // userState es un hook que permite manejar el estado en componentes
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
import { ProveedoresShowModal } from "../components/MyDateTableModalShowDateProveedores";
import { getAllRol, isPermiso } from "../services/RolPermisosAndRol";
import { useModalProveedoresDates } from "../contexts/AuxiliarContextFromModalProveedores";
import {
  EntradaShowModal,
  MyDateTableModalShowDatesEntradas,
} from "../components/MyDateTableModalShowDatesEntradas";
import { getAllEntradasByProveedorId } from "../services/EntradaServices";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import {
  MyDateTableUsuarios,
  UsuarioTabla,
} from "../components/MyDateTableUsuarios";
import {
  actualizarUsuarioConContraseña,
  actualizarUsuarioSinContraseña,
  addUsuario,
  deleteUsuario,
  filtrarUsuario,
  getAllUsuarios,
  getUsuarioById,
  ordenarUsuarios,
} from "../services/UsuarioServices";
import CustomDropdown from "../components/CustomDropDownPicker";
import CustomDropdownDetails from "../components/CustomDropDownDetails";
import { HomeScreen } from "./HomeScreen";
import { useSortProductos } from "../contexts/AuxiliarSortProductos";
import { useSortUsuarios } from "../contexts/AuxiliarSortUsuarios";
import CustomRadioButton from "../components/CustomRadioButtonsSearch";
import React from "react";

export default function UsuariosView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  // Variables auxiliares para controlar el despliege de los dropDownsPiers
  const [capaPrioridadTiendasSearsh, setCapaPrioridadTiendasSearsh] =
    useState(500);
  const [capaPrioridadRolesSearsh, setCapaPrioridadRolesSearsh] = useState(500);

  // Método para controlar las capas desplegables
  const controlarCapas = (prioridad: string) => {
    if (prioridad === "TiendasSearsh") {
      setCapaPrioridadRolesSearsh(1500);
      setCapaPrioridadTiendasSearsh(2000);
    } else if (prioridad === "RolesSearsh") {
      setCapaPrioridadRolesSearsh(2000);
      setCapaPrioridadTiendasSearsh(1500);
    }
  };

  // Datos del usuario que está logueado
  const { usuario, setUsuario } = useUsuario();
  const { sortUsuarios } = useSortUsuarios();
  const { modalProveedoresDates, setModalProveedoresDates } =
    useModalProveedoresDates();

  // Constantes para controlar la animación del boton desplegable
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado
  const animationValueOptions = useRef(new Animated.Value(0)).current; // Valor animado

  // Variables para controlar los campos de los formularios de agregar proovedores y ver datos
  const [dropdownItemsTiendasDetails, setDropDownItemsTiendasDetails] =
    useState<TiendaPiker[]>([]);
  const [dropdownItemsRolesDetails, setDropDownItemsRolesDetails] = useState<
    TiendaPiker[]
  >([]);
  const [idUsuarioDetails, setIdusuarioDetails] = useState("");
  const [nombreDelUsuarioDetails, setNombreDelUsuarioDetails] = useState("");
  const [nombreUsuarioDetails, setNombreUsuarioDetails] = useState("");
  const [salario_CUPDetails, setsalario_CUPDetails] = useState("");
  const [nombreUsuarioDetailsOriginal, setNombreUsuarioDetailsOriginal] =
    useState("");
  const [correoEmailUsuarioDetails, setCorreoEmailUsuarioDetails] =
    useState("");
  const [contrasennaUsuarioDetails, setContrasennaUsuarioDetails] =
    useState("");
  const [CarnetIdentidadUsuarioDetails, setCarnetIdentidadUsuarioDetails] =
    useState("");
  const [direccionUsuarioDetails, setDireccionUsuarioDetails] = useState("");
  const [telefonoUsuarioDetails, setTelefonoUsuarioDetails] = useState("");
  const [detallesBancariosUsuarioDetils, setDetallesBancariosUsuarioDetils] =
    useState("");
  const [tiendaUsuarioDetails, setTiendaUsuarioDetails] = useState("");
  const [rolUsuarioDetails, setRolUsuarioDetails] = useState("");
  const [selecterActivoDetails, setSelecterActivoDetails] = useState("");

  const options = [
    { label: "Permitido", value: "permitido" },
    { label: "Denegado", value: "denegado" },
  ];

  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [modalMensaje, setModalMensaje] = React.useState("");
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);
  const [isBotonModalMesajeVisible, setIsBotonModalMesajeVisible] =
    useState(false);

  const [isModalChekVisible, setIsModalChekVisible] = useState(false);
  const [isModalChekEliminarVisible, setIsModalChekEliminarVisible] =
    useState(false);
  const [mesajeModalChek, setMesajeModalChek] = useState("");

  // Condicionales para mostrar según los permisos
  const [isPermisoAgregarProveedor, setIsPermisoAgregarProveedor] =
    React.useState(false);
  const [isPermisoEliminarProveedor, setIsPermisoEliminarProveedor] =
    React.useState(false);
  const [isPermisoModificarProveedor, setIsPermisoModificarProveedor] =
    React.useState(false);
  const [isPermisoModificarGerarquico, setIsPermisoModificarGerarquico] =
    useState(false);

    const checkPermiso = async () => {
      if (usuario?.token) {
        // Verificar y almacenar el permiso de agregar usuario
        if (localStorage.getItem("resultAgregarUsuario") === null) {
          const resultAgregarUsuario = await isPermiso(
            usuario.token,
            "1",
            usuario.id_usuario
          );
          setIsPermisoAgregarProveedor(resultAgregarUsuario);
          localStorage.setItem("resultAgregarUsuario", resultAgregarUsuario);
        } else {
          setIsPermisoAgregarProveedor(Boolean(localStorage.getItem("resultAgregarUsuario")));
        }
    
        // Verificar y almacenar el permiso de eliminar usuario
        if (localStorage.getItem("resultEliminarUsuario") === null) {
          const resultEliminarUsuario = await isPermiso(
            usuario.token,
            "3",
            usuario.id_usuario
          );
          setIsPermisoEliminarProveedor(resultEliminarUsuario);
          localStorage.setItem("resultEliminarUsuario", resultEliminarUsuario);
        } else {
          setIsPermisoEliminarProveedor(Boolean(localStorage.getItem("resultEliminarUsuario")));
        }
    
        // Verificar y almacenar el permiso de modificar usuario
        if (localStorage.getItem("resultModificarUsuario") === null) {
          const resultModificarUsuario = await isPermiso(
            usuario.token,
            "2",
            usuario.id_usuario
          );
          setIsPermisoModificarProveedor(resultModificarUsuario);
          localStorage.setItem("resultModificarUsuario", resultModificarUsuario);
        } else {
          setIsPermisoModificarProveedor(Boolean(localStorage.getItem("resultModificarUsuario")));
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
  const [filterItems, setFilterItems] = useState<UsuarioTabla[]>([]);

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

  const [dropdownItemsTiendasSearsh, setDropDownItemsTiendasSearsh] = useState<
    TiendaPiker[]
  >([]);
  const [dropdownItemsRolesSearsh, setDropDownItemsRolesSearsh] = useState<
    TiendaPiker[]
  >([]);
  const [tiendaNombreSeleccionadaSearch, setTiendaNombreSeleccionadaSearch] =
    useState("");
  const [rolNombreSeleccionadoSearsh, setRolNombreSeleccionadoSearsh] =
    useState("");

  //Variables Para los datos de busqueda
  const [nombreUsuarioSearch, setNombreUsuarioSearch] = useState("");
  const [correoEmyleSearch, setCorreoEmyleSearch] = useState("");
  const [telefonoSearch, setTelefonoSearch] = useState("");

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
        setDropDownItemsTiendasSearsh([
          { label: "Seleccione una tienda", value: "" },
          ...tiendasMapeados,
        ]);
      }
    }
  };

  const getDatesRolesPiker = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllRol(usuario.token);

      if (result && Array.isArray(result)) {
        const rolesMapeados: TiendaPiker[] = await Promise.all(
          result.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_rol,
          }))
        );

        // Agregar un valor adicional para el valor inicial
        setDropDownItemsRolesSearsh([
          { label: "Seleccione un rol", value: "" },
          ...rolesMapeados,
        ]);
      }
    }
  };

  const getDatesTiendasAndRolesParaAgregarUsuario = async () => {
    // Cargar datos de los dropDown
    if (usuario?.token != undefined) {
      const resultTiendas = await getAllTiendas(usuario.token);
      const resultRoles = await getAllRol(usuario.token);

      if (
        resultTiendas &&
        Array.isArray(resultTiendas.data) &&
        resultRoles &&
        Array.isArray(resultRoles)
      ) {
        const tiendasMapeados: TiendaPiker[] = await Promise.all(
          resultTiendas.data.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_tienda,
          }))
        );
        const rolesMapeados: TiendaPiker[] = await Promise.all(
          resultRoles
            .filter((element: any) => {
              if (parseInt(usuario.id_rol) === 1) {
                return parseInt(element.id_rol) !== 1;
              } else if (parseInt(usuario.id_rol) === 2) {
                return (
                  parseInt(element.id_rol) !== 1 &&
                  parseInt(element.id_rol) !== 2
                );
              } else if (parseInt(usuario.id_rol) === 3) {
                return (
                  parseInt(element.id_rol) !== 1 &&
                  parseInt(element.id_rol) !== 2 &&
                  parseInt(element.id_rol) !== 3
                );
              }
              return true; // Si el rol es diferente de 1, 2 o 3, no se aplica ningún filtro
            })
            .map(async (element: any) => ({
              label: element.nombre,
              value: element.id_rol,
            }))
        );

        // Agregar un valor adicional para el valor inicial
        setDropDownItemsTiendasDetails(tiendasMapeados);
        setDropDownItemsRolesDetails(rolesMapeados);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar proovedor
  const callModalAddProveedor = async () => {
    setNombreDelUsuarioDetails("");
    setNombreUsuarioDetails("");
    setNombreUsuarioDetailsOriginal("");
    setDireccionUsuarioDetails("");
    setTelefonoUsuarioDetails("");
    setCarnetIdentidadUsuarioDetails("");
    setCorreoEmailUsuarioDetails("");
    setDetallesBancariosUsuarioDetils("");

    setModalProveedoresDates({
      id_proveedor: "",
      isAddProveedor: false,
      isModificarProveedor: false,
      fileEditable: true,
      isAddProductoShowProveedoresTiendas: false,
      isDetallesProveedores: false,
    });
  };
  const cargarDetailsOfUsuario = async () => {
    if (usuario?.token && modalProveedoresDates?.id_proveedor) {
      const result = await getUsuarioById(
        usuario.token,
        modalProveedoresDates.id_proveedor
      );

      if (result) {
        setIdusuarioDetails(result.data.id_usuario);
        setNombreUsuarioDetails(result.data.nombre_usuario);
        setNombreUsuarioDetailsOriginal(result.data.nombre_usuario);
        setNombreDelUsuarioDetails(result.data.nombre);
        setDireccionUsuarioDetails(result.data.direccion || "");
        setTelefonoUsuarioDetails(result.data.telefono || "");
        setCarnetIdentidadUsuarioDetails(result.data.carnet_identidad || "");
        setCorreoEmailUsuarioDetails(result.data.email || "");
        setDetallesBancariosUsuarioDetils(result.data.detalle_bancario || "");
        setsalario_CUPDetails(result.data.salario_CUP);
        setSelecterActivoDetails(result.data.activo ? "permitido" : "denegado");

        // Cargar datos de los dropDown
        if (usuario?.token != undefined) {
          const resultTiendas = await getAllTiendas(usuario.token);
          const resultRoles = await getAllRol(usuario.token);

          if (
            resultTiendas &&
            Array.isArray(resultTiendas.data) &&
            resultRoles &&
            Array.isArray(resultRoles)
          ) {
            const tiendasMapeados: TiendaPiker[] = await Promise.all(
              resultTiendas.data.map(async (element: any) => ({
                label: element.nombre,
                value: element.id_tienda,
              }))
            );

            if (
              !(parseInt(usuario.id_rol) >= parseInt(result.data.rol.id_rol))
            ) {
              const rolesMapeados: TiendaPiker[] = await Promise.all(
                resultRoles
                  .filter((element: any) => {
                    if (parseInt(usuario.id_rol) === 1) {
                      return parseInt(element.id_rol) !== 1;
                    } else if (parseInt(usuario.id_rol) === 2) {
                      return (
                        parseInt(element.id_rol) !== 1 &&
                        parseInt(element.id_rol) !== 2
                      );
                    } else if (parseInt(usuario.id_rol) === 3) {
                      return (
                        parseInt(element.id_rol) !== 1 &&
                        parseInt(element.id_rol) !== 2 &&
                        parseInt(element.id_rol) !== 3
                      );
                    }
                    return true; // Si el rol es diferente de 1, 2 o 3, no se aplica ningún filtro
                  })
                  .map(async (element: any) => ({
                    label: element.nombre,
                    value: element.id_rol,
                  }))
              );

              setDropDownItemsRolesDetails(rolesMapeados);
            } else {
              const rolesMapeados: TiendaPiker[] = await Promise.all(
                resultRoles.map(async (element: any) => ({
                  label: element.nombre,
                  value: element.id_rol,
                }))
              );

              setDropDownItemsRolesDetails(rolesMapeados);
            }

            // Agregar un valor adicional para el valor inicial
            setDropDownItemsTiendasDetails(tiendasMapeados);
          }

          setTiendaUsuarioDetails(result.data.tienda.id_tienda);
          setRolUsuarioDetails(result.data.rol.id_rol);

          if (parseInt(usuario.id_rol) >= parseInt(result.data.rol.id_rol)) {
            setIsPermisoModificarGerarquico(false);
          } else {
            setIsPermisoModificarGerarquico(true);
          }
        }
      }
    }
  };

  const auxiliarFunctionFilter = async (): Promise<UsuarioTabla[] | null> => {
    if (usuario?.token) {
      try {
        const result = await filtrarUsuario(
          usuario.token,
          nombreUsuarioSearch,
          correoEmyleSearch,
          telefonoSearch,
          rolNombreSeleccionadoSearsh,
          tiendaNombreSeleccionadaSearch
        );

        if (result) {
          const usuariosMapeados: UsuarioTabla[] = await Promise.all(
            result.map(async (element: any) => ({
              id_Usuario: element.id_usuario,
              nombre: element.nombre,
              nombre_Usuario: element.nombre_usuario,
              correo: element.email ?? "",
              telefono: element.telefono ?? "",
              direccion: element.direccion ?? "",
              carnet_Identidad: element.carnet_identidad ?? "",
              detalle_bancario: element.detalle_bancario ?? "",
              id_rol: element.rol.id_rol,
              nombre_rol: element.rol.nombre,
              id_tienda: element.tienda.id_tienda,
              nombre_tienda: element.tienda.nombre,
              salario_CUP: element.salario_CUP
            }))
          );
          return usuariosMapeados;
        }
      } catch (error) {
        console.error("Error al filtrar los proveedoress:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    filtrarYOrdenarUsuarios();
  }, [sortUsuarios, selectedOptionTipoOrden]);

  useEffect(() => {
    cargarDetailsOfUsuario();
  }, [modalProveedoresDates]);
  // Para filtrar y/o ordenar los datos según se halla digitado o seleccionado
  const obtenerTodosLosUsuarios = async () => {
    if (usuario?.token != undefined) {
      try {
        // Obtener proovedores desde la tabla
        const result = await getAllUsuarios(usuario.token);

        if (result && Array.isArray(result)) {
          // Mapeamos los proovedores y obtenemos tanto la cantidadTotal como si tienen opciones
          const proveedoresMapeados: UsuarioTabla[] = await Promise.all(
            result.map(async (element: any) => {
              // Mapeamos a la interfaz Proveedor
              return {
                id_Usuario: element.id_usuario,
                nombre: element.nombre,
                nombre_Usuario: element.nombre_usuario,
                correo: element.email || "",
                telefono: element.telefono || "",
                direccion: element.direccion || "",
                carnet_Identidad: element.carnet_identidad || "",
                detalle_bancario: element.detalles_bancarios || "",
                id_rol: element.rol.id_rol,
                nombre_rol: element.rol.nombre,
                id_tienda: element.tienda.id_tienda,
                nombre_tienda: element.tienda.nombre,
                salario_CUP: element.salario_CUP
              };
            })
          );

          // Actualizamos el estado de filterItems con los productos mapeados
          setFilterItems(proveedoresMapeados);
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
      filtrarYOrdenarUsuarios();
    }
  };

  useFocusEffect(
    useCallback(() => {
      const runEffects = async () => {
        await checkPermiso();
        await obtenerTodosLosUsuarios();
        getDatesTiendaPiker();
        getDatesRolesPiker();
        getDatesTiendasAndRolesParaAgregarUsuario();
      };
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  const [auxOrdenar, setAxuOrdenar] = useState(false);

  // Filtrar y ordenar productos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarUsuarios = async () => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let productosFiltrados: UsuarioTabla[] =
          (await auxiliarFunctionFilter()) || [];

        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortUsuarios?.criterioOrden && sortUsuarios.tipoOrden) {
          productosFiltrados = await ordenarUsuarios(
            usuario.token,
            productosFiltrados,
            sortUsuarios.criterioOrden,
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

  const auxSetModalProovedoresDates = async () => {
    setNombreUsuarioDetails("");
    setNombreUsuarioDetailsOriginal("");
    setCorreoEmailUsuarioDetails("");
    setDireccionUsuarioDetails("");
    setTelefonoUsuarioDetails("");

    setModalProveedoresDates({
      id_proveedor: "",
      isAddProveedor: true,
      fileEditable: true,
      isModificarProveedor: false,
      isAddProductoShowProveedoresTiendas: false,
      isDetallesProveedores: false,
    });

    if (usuario?.token) {
      const resultRoles = await getAllRol(usuario.token);
      const rolesMapeados: TiendaPiker[] = await Promise.all(
        resultRoles
          .filter((element: any) => {
            if (parseInt(usuario.id_rol) === 1) {
              return parseInt(element.id_rol) !== 1;
            } else if (parseInt(usuario.id_rol) === 2) {
              return (
                parseInt(element.id_rol) !== 1 && parseInt(element.id_rol) !== 2
              );
            } else if (parseInt(usuario.id_rol) === 3) {
              return (
                parseInt(element.id_rol) !== 1 &&
                parseInt(element.id_rol) !== 2 &&
                parseInt(element.id_rol) !== 3
              );
            }
            return true; // Si el rol es diferente de 1, 2 o 3, no se aplica ningún filtro
          })
          .map(async (element: any) => ({
            label: element.nombre,
            value: element.id_rol,
          }))
      );

      setDropDownItemsRolesDetails(rolesMapeados);
    }
  };

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreUsuarioSearch("");
    setCorreoEmyleSearch("");
    setTelefonoSearch("");
    setRolNombreSeleccionadoSearsh("");
    setTiendaNombreSeleccionadaSearch("");
    setSelectedOptionTipoOrden("");
  };

  // Método para agregar un nuevo producto al sistema
  const addNewUsuario = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Agregando usuario. Espere por favor");
    setModalMensajeView(true);
    // Comprobar campos para agregar el producto
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL AGREGAR USUARIO. Por favor verifique los siguientes campos:\n";
      const resultUsuarios = await getAllUsuarios(usuario.token);
      for (let item of resultUsuarios) {
        if (item.nombre_usuario === nombreUsuarioDetails) {
          validarCampos += `-Ya existe un usuario con el nombreUsuario ${nombreUsuarioDetails}.\n`;
          flag = false;
          break;
        }
      }

      if (nombreDelUsuarioDetails.trim() === "") {
        validarCampos += "-El nombre del usuario no puede ser vacío.\n";
        flag = false;
      }
      if (correoEmailUsuarioDetails.trim() === "") {
        validarCampos += "-El correo electrónico no puede ser vacío.\n";
        flag = false;
      }
      if (contrasennaUsuarioDetails.trim() === "") {
        validarCampos += "-La contraseña no puede ser vacía.\n";
        flag = false;
      } else if (contrasennaUsuarioDetails.trim().length < 6) {
        validarCampos += "-La contraseña tiene que tener 6 o más caracteres.\n";
        flag = false;
      }
      if (nombreUsuarioDetails.trim() === "") {
        validarCampos += "-El nombreUsuario no puede ser vacío.\n";
        flag = false;
      }
      if (salario_CUPDetails === "") {
        validarCampos += "-El salario del trabajador no puede ser vacío.\n"
        flag = false;
      }
      if (tiendaUsuarioDetails === "") {
        flag = false;
        validarCampos +=
          "-No ha seleccionado la tienda donde trabajará el usuario.\n";
      }
      if (rolUsuarioDetails === "") {
        flag = false;
        validarCampos += "-No ha seleccionado un rol para el usuario.\n";
      }
      if (CarnetIdentidadUsuarioDetails.trim() !== "") {
        if (CarnetIdentidadUsuarioDetails.trim().length !== 11) {
          flag = false;
          validarCampos +=
            "-El carnet de identidad del usuario deve tener 11 dígitos. \n";
        }
      }

      if (flag) {
        await addUsuario(
          usuario.token,
          nombreDelUsuarioDetails,
          nombreUsuarioDetails,
          contrasennaUsuarioDetails,
          correoEmailUsuarioDetails,
          telefonoUsuarioDetails,
          direccionUsuarioDetails,
          CarnetIdentidadUsuarioDetails,
          detallesBancariosUsuarioDetils,
          rolUsuarioDetails,
          tiendaUsuarioDetails,
          salario_CUPDetails
        );

        // Agregar Acción de usuario agregar proveedor

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó al sistema al usuario ${nombreUsuarioDetails}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          5
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(
          `El Usuario "${nombreUsuarioDetails}" fue insertado con éxito`
        );
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setNombreDelUsuarioDetails("");
        setNombreUsuarioDetails("");
        setNombreUsuarioDetailsOriginal("");
        setContrasennaUsuarioDetails("");
        setDireccionUsuarioDetails("");
        setTelefonoUsuarioDetails("");
        setCarnetIdentidadUsuarioDetails("");
        setCorreoEmailUsuarioDetails("");
        setDetallesBancariosUsuarioDetils("");
        setDropDownItemsRolesDetails([]);
        setDropDownItemsTiendasDetails([]);
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setReflechModalMensajeView(false);
        setModalMensajeView(true);
      }
    }
  };
  // Método para actualizar los datos de un producto
  const modificarUsuario = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Modificando usuario. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL MODIFICAR USUARIO. Compruebe los siguientes campos:\n";

      const resultUsuarios = await getAllUsuarios(usuario.token);
      for (let item of resultUsuarios) {
        if (
          item.nombre_usuario === nombreUsuarioDetails &&
          nombreUsuarioDetailsOriginal !== nombreUsuarioDetails
        ) {
          validarCampos += `-Ya existe un usuario con el nombreUsuario ${nombreUsuarioDetails}.\n`;
          flag = false;
          break;
        }
      }

      if (nombreDelUsuarioDetails.trim() === "") {
        validarCampos += "-El nombre del usuario no puede ser vacío.\n";
        flag = false;
      }
      if (correoEmailUsuarioDetails.trim() === "") {
        validarCampos += "-El correo electrónico no puede ser vacío.\n";
        flag = false;
      }
      if (contrasennaUsuarioDetails.trim() !== "") {
        if (contrasennaUsuarioDetails.trim().length < 6) {
          validarCampos +=
            "-La contraseña tiene que tener 6 o más caracteres.\n";
          flag = false;
        }
      }
      if (salario_CUPDetails === "") {
        validarCampos += "-El salario del trabajador no puede ser vacío.\n"
        flag = false;
      }
      if (nombreUsuarioDetails.trim() === "") {
        validarCampos += "-El nombreUsuario no puede ser vacío.\n";
        flag = false;
      }
      if (tiendaUsuarioDetails === "") {
        flag = false;
        validarCampos +=
          "-No ha seleccionado la tienda donde trabajará el usuario.\n";
      }
      if (rolUsuarioDetails === "") {
        flag = false;
        validarCampos += "-No ha seleccionado un rol para el usuario.\n";
      }
      if (CarnetIdentidadUsuarioDetails.trim() !== "") {
        if (CarnetIdentidadUsuarioDetails.trim().length !== 11) {
          flag = false;
          validarCampos +=
            "-El carnet de identidad del usuario deve tener 11 dígitos. \n";
        }
      }

      if (flag) {
        if (contrasennaUsuarioDetails.trim() === "") {
          await actualizarUsuarioSinContraseña(
            usuario.token,
            idUsuarioDetails,
            nombreDelUsuarioDetails,
            nombreUsuarioDetails,
            correoEmailUsuarioDetails,
            telefonoUsuarioDetails,
            direccionUsuarioDetails,
            CarnetIdentidadUsuarioDetails,
            detallesBancariosUsuarioDetils,
            rolUsuarioDetails,
            tiendaUsuarioDetails,
            selecterActivoDetails === "permitido" ? true : false,
            salario_CUPDetails
          );
        } else {
          await actualizarUsuarioConContraseña(
            usuario.token,
            idUsuarioDetails,
            nombreDelUsuarioDetails,
            nombreUsuarioDetails,
            contrasennaUsuarioDetails,
            correoEmailUsuarioDetails,
            telefonoUsuarioDetails,
            direccionUsuarioDetails,
            CarnetIdentidadUsuarioDetails,
            detallesBancariosUsuarioDetils,
            rolUsuarioDetails,
            tiendaUsuarioDetails,
            selecterActivoDetails === "permitido" ? true : false,
            salario_CUPDetails
          );
        }

        // Agregar Acción de usuario modificar proveedor

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} modificó al usuario ${nombreUsuarioDetails}`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          5
        );

        setIsBotonModalMesajeVisible(true);
        setModalMensaje(
          `El Usuario "${nombreUsuarioDetails}" se modificó con éxito`
        );
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };
  // Método para eliminar proveedor
  const eliminarUsuario = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Eliminando usuario. Espere por favor");
    setModalMensajeView(true);
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL TRATAR DE ELIMINAR EL USUARIO. Motivos:\n";

      if (flag) {
        const resultDeleteUsuario = await deleteUsuario(
          usuario.token,
          idUsuarioDetails
        );

        if (resultDeleteUsuario) {
          // Agregar Acción de usuario agregar proveedor

          const currentDate = new Date();
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} eliminó al usuario ${nombreUsuarioDetails}`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            5
          );

          setIsBotonModalMesajeVisible(true);
          setModalMensaje(
            `El Usuario "${nombreUsuarioDetails}" se eliminó con éxito`
          );
          setModalMensajeView(true);
          setReflechModalMensajeView(true);
        } else {
          validarCampos +=
            "-El usuario ya ha echo operaciones en el sistema.\n";
          setModalMensaje(validarCampos);
          setReflechModalMensajeView;
          setModalMensajeView(true);
        }
      } else {
        setIsBotonModalMesajeVisible(true);
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = [
    "Nombre",
    "Correo",
    "Teléfono",
    "Salario CUP",
    "Rol",
    "Tienda",
  ];
  const columnasMyDateTableEntradaModal = [
    "Producto",
    "Cantidad",
    "Costo",
    "Fecha",
  ];
  const columnasMyDateTableProveedorModal = [
    "Nombre",
    "Correo",
    "Teléfono",
    "Rol",
    "Tienda",
  ];

  const columnasMyDateTableMovil = [
    "Nombre",
    "Correo",
    "Teléfono",
    "Salario CUP",
    "Rol",
    "Tienda",
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
          {isPermisoAgregarProveedor && (
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
              <Text style={styles.radioButtonTextMovil}>Agregar Usuario</Text>
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
            <MyDateTableUsuarios
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
                  <Text style={styles.textSearchMovil}>Nombre de Usuario:</Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="Nombre del proveedor"
                    value={nombreUsuarioSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setNombreUsuarioSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>
                    Correo del Usuario:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullMovil}
                    placeholder="Correo del Proveedor"
                    value={correoEmyleSearch}
                    onKeyPress={handleKeyPress}
                    onChangeText={setCorreoEmyleSearch}
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

                  <Text style={styles.textSearchMovil}>Rol:</Text>
                  <View
                    style={{
                      width: "100%",
                      zIndex: capaPrioridadRolesSearsh,
                      position: "relative",
                    }}
                  >
                    <CustomDropdown
                      value={rolNombreSeleccionadoSearsh}
                      placeholder="Roles"
                      setValue={setRolNombreSeleccionadoSearsh}
                      items={dropdownItemsRolesSearsh}
                      direction="BOTTOM"
                      onDropdownOpen={() => controlarCapas("RolesSearsh")}
                    />
                  </View>

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>Tienda:</Text>
                  <View
                    style={{
                      width: "100%",
                      zIndex: capaPrioridadTiendasSearsh,
                      position: "relative",
                    }}
                  >
                    <CustomDropdown
                      value={tiendaNombreSeleccionadaSearch}
                      placeholder="Tiendas"
                      setValue={setTiendaNombreSeleccionadaSearch}
                      items={dropdownItemsTiendasSearsh}
                      direction="BOTTOM"
                      onDropdownOpen={() => controlarCapas("TiendasSearsh")}
                    />
                  </View>
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
                        onPress={() => filtrarYOrdenarUsuarios()}
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
                  ? "Datos del Usuario"
                  : "Agregar Usuario"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Usuario */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Usuario
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={
                    modalProveedoresDates?.id_proveedor === ""
                      ? true
                      : isPermisoModificarProveedor &&
                        isPermisoModificarGerarquico
                  }
                  value={nombreDelUsuarioDetails}
                  onChangeText={setNombreDelUsuarioDetails}
                  placeholder="Nombre del usuario"
                />

                {/* Nombre Usuario */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre Usuario
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={
                    modalProveedoresDates?.id_proveedor === ""
                      ? true
                      : isPermisoModificarProveedor &&
                        isPermisoModificarGerarquico
                  }
                  value={nombreUsuarioDetails}
                  onChangeText={setNombreUsuarioDetails}
                  placeholder="Nombre usuario"
                />

                {/*Contraseña */}
                {(modalProveedoresDates?.id_proveedor === ""
                  ? true
                  : parseInt(usuario?.id_rol) === 1) && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      {modalProveedoresDates?.id_proveedor === ""
                        ? "Contraseña"
                        : "Cambiar Contraseña"}
                    </Text>
                  </View>
                )}
                {(modalProveedoresDates?.id_proveedor === ""
                  ? true
                  : parseInt(usuario?.id_rol) === 1) && (
                  <CustomTextImputSearch
                    style={styles.textImputModal}
                    cursorColor={Colors.azul_Oscuro}
                    editable={
                      modalProveedoresDates?.id_proveedor === ""
                        ? true
                        : isPermisoModificarProveedor &&
                          isPermisoModificarGerarquico
                    }
                    value={contrasennaUsuarioDetails}
                    onChangeText={setContrasennaUsuarioDetails}
                    placeholder="Nueva contraseña del usuario"
                  />
                )}

                {/* Dirección del Usuario */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Dirección del Usuario
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={
                    modalProveedoresDates?.id_proveedor === ""
                      ? true
                      : isPermisoModificarProveedor &&
                        isPermisoModificarGerarquico
                  }
                  value={direccionUsuarioDetails}
                  onChangeText={setDireccionUsuarioDetails}
                  placeholder="Dirección del Usuario    "
                />

                {/* Contenedor para los campos Número de Teléfono y Carnet de Identidad */}
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
                      value={telefonoUsuarioDetails}
                      onChangeText={(text) => {
                        // Filtrar solo números del 0 al 9
                        const filteredText = text.replace(/[^0-9]/g, "");
                        setTelefonoUsuarioDetails(filteredText);
                      }}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
                      placeholder="Número de Teléfono"
                    />
                  </View>

                  {/* Campo Carnet de Identidad */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Carnet de Identidad
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={CarnetIdentidadUsuarioDetails}
                      onChangeText={(text) => {
                        // Validar que el texto solo contenga números del 1 al 9
                        const regex = /^[0-9]*$/; // Expresión regular para solo permitir números del 1 al 9

                        // Verificar longitud y si el texto cumple con la expresión regular
                        if (text.length <= 11 && regex.test(text)) {
                          setCarnetIdentidadUsuarioDetails(text); // Actualiza el estado solo si es válido
                        }
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
                      placeholder="CarnetIdentidad"
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
                      value={correoEmailUsuarioDetails}
                      onChangeText={setCorreoEmailUsuarioDetails}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
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
                      value={detallesBancariosUsuarioDetils}
                      onChangeText={setDetallesBancariosUsuarioDetils}
                      cursorColor={Colors.azul_Oscuro}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
                      placeholder="Detalles Bancarios"
                    />
                  </View>
                </View>

                {/*Campos de detalles Salario y null */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo salario_CUP */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Salario diario en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={salario_CUPDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setsalario_CUPDetails(validNumericValue)
                      }}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
                      placeholder="Salario diario en CUP"
                    />
                  </View>

                  {/* Campo null */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                  </View>
                </View>
                
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    position: "relative",
                    zIndex: 1000,
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Tienda */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: 1000,
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Roles</Text>
                    <CustomDropdownDetails
                      value={rolUsuarioDetails}
                      placeholder="Roles"
                      setValue={setRolUsuarioDetails}
                      items={dropdownItemsRolesDetails}
                      readOnly={
                        !(modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico)
                      }
                      searchable={true}
                    />
                  </View>

                  {/* Campo Rol */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      position: "relative",
                      zIndex: 1000,
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Tiendas</Text>
                    <CustomDropdownDetails
                      value={tiendaUsuarioDetails}
                      placeholder="Tiendas"
                      setValue={setTiendaUsuarioDetails}
                      items={dropdownItemsTiendasDetails}
                      readOnly={
                        !(modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico)
                      }
                      searchable={true}
                    />
                  </View>
                </View>

                {/*Campo de los check bootom */}
                {modalProveedoresDates?.id_proveedor !== "" && (
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
                      Acceso al Sistema
                    </Text>
                  </View>
                )}
                {modalProveedoresDates?.id_proveedor !== "" && (
                  <View
                    style={{
                      padding: 20,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    {options.map((option) => (
                      <CustomRadioButton
                        key={option.value}
                        label={option.label}
                        selected={selecterActivoDetails === option.value}
                        onPress={() => {
                          if (
                            modalProveedoresDates?.id_proveedor === ""
                              ? true
                              : isPermisoModificarProveedor &&
                                isPermisoModificarGerarquico
                          ) {
                            setSelecterActivoDetails(option.value);
                          }
                        }}
                      />
                    ))}
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
                  {/* Botón para modificar proveedor */}
                  {isPermisoModificarProveedor &&
                    isPermisoModificarGerarquico &&
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
                            `¿Estás seguro que deseas MODIFICAR los datos proveedor ${nombreUsuarioDetails}?`
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Modificar Usuario
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para eliminar proveedor */}
                  {isPermisoEliminarProveedor &&
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
                            `¿Estás seguro que deseas ELIMINAR al proveedor ${nombreUsuarioDetails}?`
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
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Eliminar Usuario
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarProveedor &&
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
                        onPress={() => addNewUsuario()}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Usuario
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
                      ? eliminarUsuario()
                      : modificarUsuario()
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
                      ? navigation.replace("Usuarios")
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
          {(isPermisoAgregarProveedor ||
            isPermisoModificarProveedor ||
            isPermisoEliminarProveedor) && (
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
                Agregar Usuario
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
            <Text style={styles.textSearchDesktop}>Nombre de Usuario:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del proveedor"
              value={nombreUsuarioSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setNombreUsuarioSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Correo del Usuario:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Correo del Proveedor"
              value={correoEmyleSearch}
              onKeyPress={handleKeyPress}
              onChangeText={setCorreoEmyleSearch}
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

            <Text style={styles.textSearchDesktop}>Rol:</Text>
            <View
              style={{
                width: "100%",
                zIndex: capaPrioridadRolesSearsh,
                position: "relative",
              }}
            >
              <CustomDropdown
                value={rolNombreSeleccionadoSearsh}
                placeholder="Roles"
                setValue={setRolNombreSeleccionadoSearsh}
                items={dropdownItemsRolesSearsh}
                direction="BOTTOM"
                onDropdownOpen={() => controlarCapas("RolesSearsh")}
              />
            </View>

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Tienda:</Text>
            <View
              style={{
                width: "100%",
                zIndex: capaPrioridadTiendasSearsh,
                position: "relative",
              }}
            >
              <CustomDropdown
                value={tiendaNombreSeleccionadaSearch}
                placeholder="Tiendas"
                setValue={setTiendaNombreSeleccionadaSearch}
                items={dropdownItemsTiendasSearsh}
                direction="BOTTOM"
                onDropdownOpen={() => controlarCapas("TiendasSearsh")}
              />
            </View>
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
                  onPress={() => filtrarYOrdenarUsuarios()}
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
            <MyDateTableUsuarios
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
                  ? "Datos del Usuario"
                  : "Agregar Usuario"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Usuario */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Usuario
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={
                    modalProveedoresDates?.id_proveedor === ""
                      ? true
                      : isPermisoModificarProveedor &&
                        isPermisoModificarGerarquico
                  }
                  value={nombreDelUsuarioDetails}
                  onChangeText={setNombreDelUsuarioDetails}
                  placeholder="Nombre del usuario"
                />

                {/* Nombre Usuario */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre Usuario
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={
                    modalProveedoresDates?.id_proveedor === ""
                      ? true
                      : isPermisoModificarProveedor &&
                        isPermisoModificarGerarquico
                  }
                  value={nombreUsuarioDetails}
                  onChangeText={setNombreUsuarioDetails}
                  placeholder="Nombre usuario"
                />

                {/*Contraseña */}
                {(modalProveedoresDates?.id_proveedor === ""
                  ? true
                  : parseInt(usuario?.id_rol) === 1) && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      {modalProveedoresDates?.id_proveedor === ""
                        ? "Contraseña"
                        : "Cambiar Contraseña"}
                    </Text>
                  </View>
                )}
                {(modalProveedoresDates?.id_proveedor === ""
                  ? true
                  : parseInt(usuario?.id_rol) === 1) && (
                  <CustomTextImputSearch
                    style={styles.textImputModal}
                    cursorColor={Colors.azul_Oscuro}
                    editable={
                      modalProveedoresDates?.id_proveedor === ""
                        ? true
                        : isPermisoModificarProveedor &&
                          isPermisoModificarGerarquico
                    }
                    value={contrasennaUsuarioDetails}
                    onChangeText={setContrasennaUsuarioDetails}
                    placeholder="Nueva contraseña del usuario"
                  />
                )}

                {/* Dirección del Usuario */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Dirección del Usuario
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={
                    modalProveedoresDates?.id_proveedor === ""
                      ? true
                      : isPermisoModificarProveedor &&
                        isPermisoModificarGerarquico
                  }
                  value={direccionUsuarioDetails}
                  onChangeText={setDireccionUsuarioDetails}
                  placeholder="Dirección del Usuario    "
                />

                {/* Contenedor para los campos Número de Teléfono y Carnet de Identidad */}
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
                      value={telefonoUsuarioDetails}
                      onChangeText={(text) => {
                        // Filtrar solo números del 0 al 9
                        const filteredText = text.replace(/[^0-9]/g, "");
                        setTelefonoUsuarioDetails(filteredText);
                      }}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
                      placeholder="Número de Teléfono"
                    />
                  </View>

                  {/* Campo Carnet de Identidad */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Carnet de Identidad
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={CarnetIdentidadUsuarioDetails}
                      onChangeText={(text) => {
                        // Validar que el texto solo contenga números del 1 al 9
                        const regex = /^[0-9]*$/; // Expresión regular para solo permitir números del 1 al 9

                        // Verificar longitud y si el texto cumple con la expresión regular
                        if (text.length <= 11 && regex.test(text)) {
                          setCarnetIdentidadUsuarioDetails(text); // Actualiza el estado solo si es válido
                        }
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
                      placeholder="CarnetIdentidad"
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
                      value={correoEmailUsuarioDetails}
                      onChangeText={setCorreoEmailUsuarioDetails}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
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
                      value={detallesBancariosUsuarioDetils}
                      onChangeText={setDetallesBancariosUsuarioDetils}
                      cursorColor={Colors.azul_Oscuro}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
                      placeholder="Detalles Bancarios"
                    />
                  </View>
                </View>

                {/*Campos de detalles Salario y null */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo salario_CUP */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Salario diario en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={salario_CUPDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setsalario_CUPDetails(validNumericValue)
                      }}
                      editable={
                        modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico
                      }
                      placeholder="Salario diario en CUP"
                    />
                  </View>

                  {/* Campo null */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    position: "relative",
                    zIndex: 1000,
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Tienda */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      position: "relative",
                      zIndex: capaPrioridadTiendasSearsh,
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Roles</Text>
                    <CustomDropdownDetails
                      value={rolUsuarioDetails}
                      placeholder="Roles"
                      setValue={setRolUsuarioDetails}
                      items={dropdownItemsRolesDetails}
                      readOnly={
                        !(modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico)
                      }
                      searchable={true}
                    />
                  </View>

                  {/* Campo Rol */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                      position: "relative",
                      zIndex: capaPrioridadRolesSearsh,
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>Tiendas</Text>
                    <CustomDropdownDetails
                      value={tiendaUsuarioDetails}
                      placeholder="Tiendas"
                      setValue={setTiendaUsuarioDetails}
                      items={dropdownItemsTiendasDetails}
                      readOnly={
                        !(modalProveedoresDates?.id_proveedor === ""
                          ? true
                          : isPermisoModificarProveedor &&
                            isPermisoModificarGerarquico)
                      }
                      searchable={true}
                    />
                  </View>
                </View>

                {/*Campo de los check bootom */}
                {modalProveedoresDates?.id_proveedor !== "" && (
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
                      Acceso al Sistema
                    </Text>
                  </View>
                )}
                {modalProveedoresDates?.id_proveedor !== "" && (
                  <View
                    style={{
                      padding: 20,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    {options.map((option) => (
                      <CustomRadioButton
                        key={option.value}
                        label={option.label}
                        selected={selecterActivoDetails === option.value}
                        onPress={() => {
                          if (
                            modalProveedoresDates?.id_proveedor === ""
                              ? true
                              : isPermisoModificarProveedor &&
                                isPermisoModificarGerarquico
                          ) {
                            setSelecterActivoDetails(option.value);
                          }
                        }}
                      />
                    ))}
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
                  {/* Botón para modificar proveedor */}
                  {isPermisoModificarProveedor &&
                    isPermisoModificarGerarquico &&
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
                            `¿Estás seguro que deseas MODIFICAR los datos proveedor ${nombreUsuarioDetails}?`
                          );
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Modificar Usuario
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para eliminar proveedor */}
                  {isPermisoEliminarProveedor &&
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
                            `¿Estás seguro que deseas ELIMINAR al proveedor ${nombreUsuarioDetails}?`
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
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Eliminar Usuario
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Botón para agregar proveedor */}
                  {isPermisoAgregarProveedor &&
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
                        onPress={() => addNewUsuario()}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 16,
                          }}
                        >
                          Agregar Usuario
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
                      ? eliminarUsuario()
                      : modificarUsuario()
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
                      ? navigation.replace("Usuarios")
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
