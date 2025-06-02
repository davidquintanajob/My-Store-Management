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
import CustomTextImputSearch from "../components/CustomTextImputSearch";
import CustomDropdown from "../components/CustomDropDownPicker";
import {
  createProductoInTienda,
  expedirExelProductosEnMyTienda,
  filterProductsEnTienda,
  getAllProductos,
  getProductoById,
  getProductoCantidadTotal,
  getRelacionProductoByTienda,
  moverProducto,
  ordenarProducts,
  updateProductoTienda,
} from "../services/ProductoServices";
import { useUsuario } from "../contexts/UsuarioContext";
import {
  getAllTiendas,
  getAllTiendasByProduct,
  getCantidadProductoInTiendaEspecifica,
  getTiendaById,
  isProductoInTienda,
  tienda_Realizarventa,
} from "../services/TiendaServices";
import { TiendaPiker } from "../components/MyDateTableTiendas";
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from "react-native-image-picker";
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
import { useModalProductsDates } from "../contexts/AuxiliarContextFromModalProductsDates";
import { useSortProductos } from "../contexts/AuxiliarSortProductos";
import { isPermiso } from "../services/RolPermisosAndRol";
import { crearimagenUnProducto } from "../services/ImageServices";
import { MyDateTableEnMyTienda } from "../components/MyDataTableEnMyTienda";
import CustomDropDownPikerFromMover from "../components/CustomDropDownPikerFromMover";
import { cerverHostImages } from "../services/cerverHost";
import { addNewMovimiento } from "../services/MovimientosServices";
import { Producto, ProductoPiker } from "../components/MyDateTableProductos";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import { getAllEntradasByProductoId } from "../services/EntradaServices";
import { getValorMonedaUSD } from "../services/MonedaService";
import CustomDropdownDetails from "../components/CustomDropDownDetails";
import { ProveedorPiker } from "../components/MyDateTableProveedores";
import { MyDateInput } from "../components/MyDateInput";
import { getAllTipoServicios } from "../services/TipoServiciosServices";
import { getAllClientes } from "../services/clienteServices";
import { addVenta, getVentaByIDOfServicio } from "../services/ventasServices";
import { addServicio, getServicioByID } from "../services/ServiciosServices";

export default function EnMyTiendaView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  // Datos del usuario que está logueado
  const { usuario, setUsuario } = useUsuario();
  const { sortProductos, setSortProductos } = useSortProductos();
  const { modalProductsDates, setModalProductsDates } = useModalProductsDates();

  // Constantes para controlar la animación del boton desplegable
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado
  const animationValueOptions = useRef(new Animated.Value(0)).current; // Valor animado

  // Variable auxiliar para la optimización
  const [optimizacionFirstLoadingData, setOptimizacionFirstLoadingData] =
    useState(false);

  const [cambioMoneda, setCambioMoneda] = useState(0);
  // Variables para controlar los campos de los formularios de agregar producto y ver datos
  const [costoPromedio, setCostoPromedio] = useState("");
  const [cantidadProductoDetails, setCantidadProductoDetails] = useState("");
  const [idProductoDetails, setIdProductoDetails] = useState("");
  const [nombreProductoDetails, setNombreProductoDetails] = useState("");
  const [precioProductoDetails, setPrecioProductoDetails] = useState("");
  const [precioEmpresaProductoDetails, setPrecioEmpresaProductoDetails] =
    useState("");
  const [skuDetails, setSkuDetails] = useState("");
  const [descripcionProductoDetails, setDescripcionProductoDetails] =
    useState("");
  // Estado para almacenar las imágenes seleccionadas
  const [selectedImages, setSelectedImages] = useState<Asset[]>([]);

  const [isModalMensajeViewExel, setModalMensajeViewExel] =
    React.useState(false);
  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [isModalMesajeMoverVisible, setModalMesajeMoverVisible] =
    React.useState(false);
  const [isModalMesajeRestarVisible, setModalMesajeRestarVisible] =
    React.useState(false);
  const [isModalRestarProductos, setModalRestarProductos] =
    React.useState(false);
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);
  const [isBotonModalMesajeVisible, setIsBotonModalMesajeVisible] =
    useState(false);

  const [modalMensaje, setModalMensaje] = React.useState("");
  const [isModalMoverVisible, setModalMoverVisible] = React.useState(false);
  const [isModalVenderProductoVisible, setIsModalVenderProductoVisible] =
    React.useState(false);

  // ********** Variables y metodos para servicio **************
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

  const [isVentaProducto, setIsVentaProducto] = useState(false);

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
  // Variables para controlar los campos de los formularios de agregar entradass y ver datos
  const [idServicioDetails, setIdServicioDetails] = useState("");
  const [idClienteDetails, setIdClienteDetails] = useState("");
  const [idTiendaDetails, setIdTiendaDetails] = useState(
    usuario?.id_tienda ?? ""
  );
  const [idTipoServicioDetails, setIdTipoServicioDetails] = useState("2");
  const [cantidadProductoServicioDetails, setCantidadProductoServicioDetails] =
    useState("1");
  const [costoPromedioProductoUSDDetails, setCostoPromedioProductoUSDDetails] =
    useState("0");
  const [costoPromedioProductoCUPDetails, setCostoPromedioProductoCUPDetails] =
    useState("0");
  const [precioUSDDetails, setPrecioUSDDetails] = useState("");
  const [precioCUPDetails, setPrecioCUPDetails] = useState("");
  const [notaDetails, setNotaDetails] = useState("");
  const [descripcionDetails, setDescripcionDetails] = useState("");
  const [fechaDiaDetails, setFechaDiaDetails] = useState("");
  const [fechaMesDetails, setFechaMesDetails] = useState("");
  const [fechaAnnoDetails, setFechaAnnoDetails] = useState("");

  // Variable auxiliar para el redondeo de memerio
  const [auxRedondeo, setAuxRedondeo] = useState("");

  const [isDateLoaded, setIsDateLoaded] = useState(false);

  const checkPermisoServicios = async () => {
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
        setIsPermisoAgregarServicio(
          Boolean(localStorage.getItem("resultAgregarServicio"))
        );
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
        setIsPermisoEliminarServicio(
          Boolean(localStorage.getItem("resultEliminarServicio"))
        );
      }

      // Verificar y almacenar el permiso de modificar servicio
      if (localStorage.getItem("resultModificarServicio") === null) {
        const resultModificarServicio = await isPermiso(
          usuario.token,
          "24",
          usuario.id_usuario
        );
        setIsPermisoModificarServicio(resultModificarServicio);
        localStorage.setItem(
          "resultModificarServicio",
          resultModificarServicio
        );
      } else {
        setIsPermisoModificarServicio(
          Boolean(localStorage.getItem("resultModificarServicio"))
        );
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
        setIsPermisoServicioLocal(
          Boolean(localStorage.getItem("resulServicioLocal"))
        );
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
        setIsPermisoServicioGeneral(
          Boolean(localStorage.getItem("resultServicioGeneral"))
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
        setDropDownItemsNombreTipoServicio(tipoServiciosMapeados);
        setIdTipoServicioDetails("2");
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
        result = await getAllProductos(usuario.token);
        if (result && Array.isArray(result.data)) {
          const productosMapeados: ProductoPiker[] = await Promise.all(
            result.data.map(async (element: any) => ({
              label: element.nombre,
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
        if (result && Array.isArray(result.data)) {
          const productosMapeados: ProductoPiker[] = await Promise.all(
            result.data.map(async (element: any) => ({
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
  const cargarDetailsOfProductoVenta = async () => {
    if (usuario?.token) {
      const result = await getServicioByID(usuario.token, idProductoDetails);

      // Si es un tip de servicios de venta se carga el producto que se halla vendiod o que se esté vendiendo con todos su datos
      if (parseInt(idTipoServicioDetails) === 2) {
        const resultventa = await getVentaByIDOfServicio(
          usuario.token,
          idServicioDetails
        );
        // Actualizar variable para mostrar venta de producto
        setIsVentaProducto(true);

        // Comprobar si el servicio era de venta y si es así cargar datos de este
        if (resultventa) {
          setIdProductoDetails(resultventa.producto.id_producto);
          setCantidadProductoServicioDetails(resultventa.cantidad);
          setIdTiendaDetails(result.tienda.id_tienda);
          setPrecioUSDDetails(resultventa.producto.precio);
          setPrecioCUPDetails(
            String(parseInt(resultventa.producto.precio) * cambioMoneda)
          );
          setCostoPromedioProductoUSDDetails(
            resultventa.producto.costo_acumulado
          );
        } else {
          // Cargar datos vacios para ingrezar un nuevo producto

          // Actualizar variable para mostrar venta de producto
          setIsVentaProducto(true);

          setIdProductoDetails("");
          setCantidadProductoServicioDetails("");
          setPrecioUSDDetails("");
          setPrecioCUPDetails("");
          setCostoPromedioProductoUSDDetails("");
        }
      } else {
        // Actualizar variable para mostrar venta de producto
        setIsVentaProducto(false);
        setPrecioUSDDetails(result.precio);
        setPrecioCUPDetails(String(parseInt(result.precio) * cambioMoneda));
        setCostoPromedioProductoUSDDetails(result.costo);
      }
    }
  };
  const addNewServicio = async () => {
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
      if (auxIsProductoInTienda) {
        if (
          parseInt(auxIsProductoInTienda.cantidad) <
          parseInt(cantidadProductoServicioDetails)
        ) {
          flag = false;
          validarCampos +=
            "-La cantidad que desea vender es mayor que la cantidad que hay en la tienda.\n";
        }
      }
      if (costoPromedioProductoUSDDetails === "") {
        flag = false;
        validarCampos += "-Digite el costo del servicio.\n";
      }
      if (precioUSDDetails === "") {
        flag = false;
        validarCampos += "-Defina el precio cobrado al cliente.\n";
      }
      // Validaciones si es una venta
      if (parseInt(idTipoServicioDetails) === 2) {
        if (idProductoDetails === "") {
          flag = false;
          validarCampos += "-Seleccione un producto para vender.\n";
        }
        if (cantidadProductoServicioDetails === "") {
          flag = false;
          validarCampos +=
            "-Defina la cantidad que desea vender del producto.\n";
        }
      }
      if (flag) {
        const resultAddServicio = await addServicio(
          usuario.token,
          `${fechaMesDetails}-${fechaDiaDetails}-${fechaAnnoDetails}`,
          precioUSDDetails,
          notaDetails,
          idTiendaDetails,
          idTipoServicioDetails,
          idClienteDetails,
          "Not suport yet",
          "not suport yet"
        );

        //Agregar venta si es que es necezario
        if (parseInt(idTipoServicioDetails) === 2) {
          await addVenta(
            usuario.token,
            idProductoDetails,
            resultAddServicio.id_servicio,
            cantidadProductoServicioDetails
          );
          await tienda_Realizarventa(
            usuario.token,
            idProductoDetails,
            idTiendaDetails,
            `${parseInt(cantidadProductoServicioDetails)}`
          );

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
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó un servicio del tipo de servicio ${nombreTipoServicio?.label} al cliente ${nombreCliente?.label}. Se vendió una cantidad de ${cantidadProductoServicioDetails} del producto ${nombreProducto?.label} a un precio de ${precioUSDDetails} USD`;
          await addAccionUsuario(
            usuario.token,
            auxAddAccionUsuarioDescripcion,
            `${year}-${month}-${day}`,
            usuario.id_usuario,
            7
          );
        } else {
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
          let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} agregó un servicio del tipo de servicio ${nombreTipoServicio?.label} a un precio de ${precioUSDDetails} USD al cliente ${nombreCliente?.label}`;
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
        setModalMensaje(`El servicio se agregó con éxito`);
        setModalMensajeView(true);
        setReflechModalMensajeView(true);
        setIdClienteDetails("");
        setPrecioUSDDetails("");
        setPrecioCUPDetails("");
        setCantidadProductoServicioDetails("");
        setCostoPromedioProductoUSDDetails("");
        setIdTipoServicioDetails("");
        setNotaDetails("");
        setDescripcionDetails("");
        setIsModalVenderProductoVisible(false);
        setModalProductsDates({
          id_producto: "",
          isAddProducto: false,
          fileEditable: true,
          isModificarProducto: false,
          isAddProductoShowProveedoresTiendas: false,
          isAddProductoShowProveedores: false,
        });
      } else {
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
      }
    }
  };
  const callVenta = async () => {
    if (usuario?.token) {
      setIsDateLoaded(false);
      const currentDate = new Date();

      // Extraemos el año, mes y día de la fecha actual
      const year = String(currentDate.getFullYear());
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
      const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

      setFechaDiaDetails(String(parseInt(day)));
      setFechaMesDetails(String(parseInt(month)));
      setFechaAnnoDetails(String(parseInt(year)));

      setIsModalVenderProductoVisible(true);
      setIsDateLoaded(true);
    }
  };
  // ********** Variables y metodos para servicio **************

  // Constante para almacenar variables para mover roducto
  const [nombreTiendaUsuarioActual, setNombreTiendaUsuarioActual] =
    React.useState("");
  const [cantidadTiendaUsuarioActual, setCantidadTiendaUsuarioActual] =
    React.useState("");
  const [tiendaMoverDesde, setTiendaMoverDesde] = React.useState("");
  const [cantidadMoverProducto, setCantidadMoverProducto] = React.useState("");
  const [cantidadRestarProducto, setCantidadRestarProducto] =
    React.useState("");
  const [tiendaNombreEspecificaDesde, setTiendaNombreEspecificoDesde] =
    React.useState("");
  const [tiendaNombreEspecificaHasta, setTiendaNombreEspecificoHasta] =
    React.useState("");
  const [tiendaMoverHasta, setTiendaMoverHasta] = React.useState("");
  const [tiendasByProductoDesde, setTiendasByProductoDesde] = React.useState<
    TiendaPiker[]
  >([]);
  const [tiendasByProductoHasta, setTiendasByProductoHasta] = React.useState<
    TiendaPiker[]
  >([]);

  // Restar productos function
  const restarProductosValidarCampos = async () => {
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string = `ERROR AL RESTAR PRODUCTOS. Verifique los siguientes parámetros.\n`;

      if (
        parseInt(cantidadTiendaUsuarioActual) < parseInt(cantidadRestarProducto)
      ) {
        flag = false;
        validarCampos +=
          "-La cantidad a restar es mayor que la cantidad en la tienda.\n";
      }

      if (flag) {
        setModalRestarProductos(false);
        setModalMesajeRestarVisible(true);
      } else {
        setModalMensaje(validarCampos);
        setModalMensajeView(true);
        setIsBotonModalMesajeVisible(true);
        setReflechModalMensajeView(false);
      }
    }
  };
  const restarProductosFuction = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Restando producto. Espere por favor");
    setModalMensajeView(true);
    if (usuario) {
      let cantidadNueva: number =
        parseInt(cantidadTiendaUsuarioActual) -
        parseInt(cantidadRestarProducto);
      await updateProductoTienda(
        usuario.token,
        idProductoDetails,
        selectedValueNombreTienda,
        String(cantidadNueva)
      );

      // Agregar Acción de usuario mover producto

      const currentDate = new Date();
      const year = String(currentDate.getFullYear());
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
      const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
      let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} restó una cantidad de ${cantidadRestarProducto} de ${nombreProductoDetails} de la tienda ${nombreTiendaUsuarioActual}`;
      await addAccionUsuario(
        usuario.token,
        auxAddAccionUsuarioDescripcion,
        `${year}-${month}-${day}`,
        usuario.id_usuario,
        1
      );

      setModalMensaje(
        `Se restaron ${cantidadRestarProducto} de la tienda ${nombreTiendaUsuarioActual}`
      );
      setIsBotonModalMesajeVisible(true);
      setModalMensajeView(true);
      setIsBotonModalMesajeVisible(true);
      setReflechModalMensajeView(true);
    }
  };
  // Mover productos
  const moverProductoFunction = async () => {
    setIsBotonModalMesajeVisible(false);
    setModalMensaje("Moviendo producto. Espere por favor");
    setModalMensajeView(true);

    if (usuario?.token) {
      await moverProducto(
        usuario.token,
        idProductoDetails,
        tiendaMoverDesde,
        tiendaMoverHasta,
        cantidadMoverProducto
      );
      const currentDate = new Date();
      const year = String(currentDate.getFullYear());
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
      const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
      await addNewMovimiento(
        usuario.token,
        `${month}-${day}-${year}`,
        tiendaMoverDesde,
        tiendaMoverHasta,
        cantidadMoverProducto,
        idProductoDetails,
        usuario.id_usuario
      );

      await createProductoInTienda(
        usuario.token,
        idProductoDetails,
        tiendaMoverHasta
      );

      // Agregar Acción de usuario mover producto

      let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} movió ${cantidadMoverProducto} de ${nombreProductoDetails} desde la tienda ${tiendaNombreEspecificaDesde} hasta la tienda ${tiendaNombreEspecificaHasta}`;
      await addAccionUsuario(
        usuario.token,
        auxAddAccionUsuarioDescripcion,
        `${year}-${month}-${day}`,
        usuario.id_usuario,
        2
      );

      setModalMensaje(
        `Se movieron ${cantidadMoverProducto} de ${nombreProductoDetails} desde la tienda ${tiendaNombreEspecificaDesde} a ${tiendaNombreEspecificaHasta}`
      );
      setIsBotonModalMesajeVisible(true);
      setReflechModalMensajeView(true);
      setModalMesajeMoverVisible(false);
      setModalMensajeView(true);
    }
  };

  const moverProdcutoFunctionValidarCampos = async () => {
    let flag: boolean = true;
    let validarCampos: string = "Error. Compruebe los siguientes parámetros:\n";
    let cantidadDelProductoEnLaTiendaDesde: number = 0;
    // Obtener cantidad del producto en la tienda especifica desde dodne se quiere mover
    if (usuario?.token) {
      const result = await isProductoInTienda(
        usuario.token,
        idProductoDetails,
        tiendaMoverDesde
      );
      if (result.encontrado) {
        cantidadDelProductoEnLaTiendaDesde = parseInt(result.cantidad);
      }
    }
    if (tiendaMoverDesde === tiendaMoverHasta) {
      flag = false;
      validarCampos +=
        "-La tienda origen no puede ser igual a la tienda destino.\n";
    }
    if (cantidadMoverProducto === "0") {
      flag = false;
      validarCampos += "-La cantidad a mover debe ser mayor que 0.\n";
    }
    if (cantidadMoverProducto === "") {
      flag = false;
      validarCampos += "-La cantidad a mover no puede ser vacío.\n";
    } else if (
      parseInt(cantidadMoverProducto) > cantidadDelProductoEnLaTiendaDesde
    ) {
      // Comprobar que la cantidad que se desea mover no es mayor que la cantidad que existe en la tienda
      flag = false;
      validarCampos +=
        "-La cantidad a mover es mayor que la cantidad que existe en la tienda.\n";
    }
    if (isPermisoMoverGeneral && tiendaMoverDesde === "") {
      flag = false;
      validarCampos +=
        "-Elija la tienda desde la que decea hacer el movimiento.\n";
    }
    if (tiendaMoverHasta === "") {
      flag = false;
      validarCampos +=
        "-Elija una tienda a la que desea hacer el movimiento.\n";
    }

    if (flag) {
      const tiendaEspecificaHasta = tiendasByProductoHasta.find(
        (tienda) => tienda.value === tiendaMoverHasta
      );
      setTiendaNombreEspecificoHasta(String(tiendaEspecificaHasta?.label));
      const tiendaEspecificaDesde = tiendasByProductoDesde.find(
        (tienda) => tienda.value === tiendaMoverDesde
      );
      setTiendaNombreEspecificoDesde(String(tiendaEspecificaDesde?.label));
      setModalMoverVisible(false);
      setReflechModalMensajeView(true);
      setModalMesajeMoverVisible(true);
    } else {
      setModalMensaje(validarCampos);
      setModalMensajeView(true);
      setIsBotonModalMesajeVisible(true);
      setReflechModalMensajeView(false);
    }
  };
  // Función para buscar cuando se precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === "Enter") {
      // Aquí ejecutas la función que deseas
      filtrarYOrdenarProductos();
    }
  };

  // Cargar datos de las tiendas para mover un producto
  const cargarDatosTiendaParaMover = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllTiendas(usuario.token);
      const resultTiendas = await getAllTiendasByProduct(
        usuario.token,
        idProductoDetails
      );

      if (
        result &&
        Array.isArray(result.data) &&
        resultTiendas !== false &&
        Array.isArray(resultTiendas)
      ) {
        const allTiendasMapeados: TiendaPiker[] = await Promise.all(
          result.data.map(async (element: any) => ({
            label: element.nombre,
            value: element.id_tienda,
          }))
        );
        let auxIdTiendas: string[] = [];
        let auxDataTiendasProducto: TiendaPiker[] = [];
        resultTiendas.forEach(async (element) => {
          // Filtrar productos que esten en la tienda pero que no esten en 0
          if (parseInt(element.cantidad) > 0) {
            auxIdTiendas.push(element.id_tienda);
          }
        });
        for (let element of auxIdTiendas) {
          let item: TiendaPiker = { value: "", label: "" };
          const datosTendaExisteProducto = await getTiendaById(
            usuario.token,
            element
          );
          item.label = datosTendaExisteProducto.nombre;
          item.value = element;
          auxDataTiendasProducto.push(item);
        }

        // Verificar si el valor existe en auxDataTiendasProducto
        let existeTienda: boolean = false;

        existeTienda = auxDataTiendasProducto.some((tienda) => {
          tienda.value === usuario.id_tienda;
        });

        for (let index = 0; index < auxDataTiendasProducto.length; index++) {
          if (auxDataTiendasProducto[index].value === usuario.id_tienda) {
            existeTienda = true;
          }
        }

        if (existeTienda) {
          // Agregar un valor si es que la tienda del usuario es la desde
          setTiendaMoverDesde(usuario.id_tienda);
        }
        if (!isPermisoMoverGeneral) {
          setTiendaMoverDesde(usuario.id_tienda);
        }

        setTiendasByProductoDesde(auxDataTiendasProducto);
        setTiendasByProductoHasta(allTiendasMapeados);
      }
    }
  };

  const cargarVariablesMover = async () => {
    if (usuario?.token) {
      const resultTienda = await getTiendaById(usuario.token, tiendaMoverDesde);
      const resultCantidadEnTienda = await isProductoInTienda(
        usuario.token,
        idProductoDetails,
        tiendaMoverDesde
      );

      setCantidadTiendaUsuarioActual(resultCantidadEnTienda.cantidad);
      setNombreTiendaUsuarioActual(resultTienda.nombre);
    }
  };
  // Controlar las variables que se muestran en el modal de mover
  useEffect(() => {
    if (optimizacionFirstLoadingData) {
      cargarVariablesMover();
    }
  }, [tiendaMoverDesde]);

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
    cargarDetailsOfProductoVenta();
  }, [idTipoServicioDetails]);
  useEffect(() => {
    if (idProductoDetails !== "" && usuario?.token) {
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
    }
  }, [idProductoDetails]);

  // Método para exportar a exel
  const exportarExel = async () => {
    setModalMensaje(
      "Recopilando datos de todos los productos filtrados para el Exel. Espere un momento por favor."
    );
    setLoadingOfExel(true);
    setModalMensajeViewExel(true);
    if (usuario?.token) {
      const currentDate = new Date();

      // Extraemos el año, mes y día de la fecha actual
      const year = String(currentDate.getFullYear());
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
      const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

      const result = await expedirExelProductosEnMyTienda(
        usuario.token,
        filterItems
      );

      if (result) {
        const url = window.URL.createObjectURL(result);

        // Crea un enlace de descarga
        const a = document.createElement("a");
        a.href = url;
        a.download = `${usuario.nombre_tienda}_${day}-${month}-${year}.xlsx`; // Nombre del archivo descargado
        document.body.appendChild(a);

        // Haz clic en el enlace para iniciar la descarga
        a.click();

        // Limpia el enlace creado y la URL Blob
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("No se pudo descargar el archivo.");
      }
    }
    setLoadingOfExel(false);
  };

  // Condicionales para mostrar según los permisos
  const [isPermisoButtonAddProducto, setIsPermisoButtonAddProducto] =
    useState(false);
  const [isPermisoHistorialDeProveedores, setIsPermisoHistorialDeProveedores] =
    useState(false);
  const [isPermisoOpcionesDeCelda, setIsPermisoOpcionesDeCelda] =
    React.useState(false);
  const [isPermisoMoverLocal, setIsPermisoMoverLocal] = React.useState(false);
  const [isPermisoMoverGeneral, setIsPermisoMoverGeneral] =
    React.useState(false);
  const [isPermisoRestarProducto, setIsPermisoRestarProducto] =
    React.useState(false);

  const checkPermiso = async () => {
    if (usuario?.token) {
      // Verificar y almacenar el permiso del botón de agregar producto
      if (localStorage.getItem("resultPermisoButonAddProducto") === null) {
        const resultPermisoButonAddProducto = await isPermiso(
          usuario.token,
          "6",
          usuario.id_usuario
        );
        setIsPermisoButtonAddProducto(resultPermisoButonAddProducto);
        localStorage.setItem(
          "resultPermisoButonAddProducto",
          resultPermisoButonAddProducto
        );
      } else {
        setIsPermisoButtonAddProducto(
          Boolean(localStorage.getItem("resultPermisoButonAddProducto"))
        );
      }

      // Verificar y almacenar el permiso del historial de proveedores
      if (
        localStorage.getItem("resultPermisoHistorialDeProveedores") === null
      ) {
        const resultPermisoHistorialDeProveedores = await isPermiso(
          usuario.token,
          "38",
          usuario.id_usuario
        );
        setIsPermisoHistorialDeProveedores(resultPermisoHistorialDeProveedores);
        localStorage.setItem(
          "resultPermisoHistorialDeProveedores",
          resultPermisoHistorialDeProveedores
        );
      } else {
        setIsPermisoHistorialDeProveedores(
          Boolean(localStorage.getItem("resultPermisoHistorialDeProveedores"))
        );
      }

      // Verificar y almacenar el permiso del botón de modificar
      if (localStorage.getItem("resultPermisoButonOptionModificar") === null) {
        const resultPermisoButonOptionModificar = await isPermiso(
          usuario.token,
          "7",
          usuario.id_usuario
        );
        localStorage.setItem(
          "resultPermisoButonOptionModificar",
          resultPermisoButonOptionModificar
        );
      } else {
      }

      // Verificar y almacenar el permiso del botón de eliminar
      if (localStorage.getItem("resultPermisoButonOptionEliminar") === null) {
        const resultPermisoButonOptionEliminar = await isPermiso(
          usuario.token,
          "8",
          usuario.id_usuario
        );
        localStorage.setItem(
          "resultPermisoButonOptionEliminar",
          resultPermisoButonOptionEliminar
        );
      } else {
      }

      // Verificar y almacenar el permiso del botón de mover local
      if (localStorage.getItem("resultPermisoButonOptionMoverLocal") === null) {
        const resultPermisoButonOptionMoverLocal = await isPermiso(
          usuario.token,
          "30",
          usuario.id_usuario
        );
        setIsPermisoMoverLocal(resultPermisoButonOptionMoverLocal);
        localStorage.setItem(
          "resultPermisoButonOptionMoverLocal",
          resultPermisoButonOptionMoverLocal
        );
      } else {
        setIsPermisoMoverLocal(
          Boolean(localStorage.getItem("resultPermisoButonOptionMoverLocal"))
        );
      }

      // Verificar y almacenar el permiso del botón de mover general
      if (
        localStorage.getItem("resultPermisoButonOptionMoverGeneral") === null
      ) {
        const resultPermisoButonOptionMoverGeneral = await isPermiso(
          usuario.token,
          "31",
          usuario.id_usuario
        );
        setIsPermisoMoverGeneral(resultPermisoButonOptionMoverGeneral);
        localStorage.setItem(
          "resultPermisoButonOptionMoverGeneral",
          resultPermisoButonOptionMoverGeneral
        );
      } else {
        setIsPermisoMoverGeneral(
          Boolean(localStorage.getItem("resultPermisoButonOptionMoverGeneral"))
        );
      }

      // Verificar y almacenar el permiso de venta general
      if (localStorage.getItem("resultPermisoVentaGeneral") === null) {
        const resultPermisoVentaGeneral = await isPermiso(
          usuario.token,
          "27",
          usuario.id_usuario
        );
        setIsPermisoRestarProducto(resultPermisoVentaGeneral);
        localStorage.setItem(
          "resultPermisoVentaGeneral",
          resultPermisoVentaGeneral
        );
      } else {
        setIsPermisoRestarProducto(
          Boolean(localStorage.getItem("resultPermisoVentaGeneral"))
        );
      }

      // Llamar a la función de verificación de permisos de servicios
      checkPermisoServicios();

      // Actualiza el estado con los resultados
      setIsPermisoOpcionesDeCelda(
        Boolean(localStorage.getItem("resultPermisoButonOptionEliminar")) ||
          Boolean(localStorage.getItem("resultPermisoButonOptionModificar")) ||
          Boolean(localStorage.getItem("resultPermisoButonOptionMoverLocal")) ||
          Boolean(localStorage.getItem("resultPermisoButonOptionMoverGeneral"))
      );
    }
  };

  const onDrop = (event: PanGestureHandlerGestureEvent) => {
    // Aquí puedes agregar la lógica para procesar los archivos
  };

  // Estado para controlar la opción seleccionada de los RadioButons de filtrado
  const [selectedOptionTipoOrden, setSelectedOptionTipoOrden] = useState<
    string | null
  >(null);

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
  const [filterItems, setFilterItems] = useState<Producto[]>([]);

  const [tiendasByProducto, setTiendasByProducto] = useState<TiendaShowModal[]>(
    []
  );

  const getTiendasByProducto = async (id_producto: string) => {
    if (usuario?.token) {
      const result = await getAllTiendasByProduct(usuario.token, id_producto);

      // Asegurándonos de que `result` es un array y contiene los datos esperados.
      if (Array.isArray(result)) {
        // Mapeamos los datos de tiendas al formato de TiendaShowModal.
        const tiendas: TiendaShowModal[] = result.map((item) => ({
          id_tienda: item.tienda.id_tienda.toString(),
          nombre: item.tienda.nombre,
          cantidad: item.cantidad.toString(), // Aquí usamos `item.cantidad` directamente.
        }));

        // Actualizamos el estado con las tiendas formateadas.
        setTiendasByProducto(tiendas);
      }
    }
  };

  const cargarProveedoresPorProducto = async (id_producto: string) => {
    try {
      if (usuario?.token) {
        // Llamamos a la API para obtener todas las entradas según el producto
        const entradas = await getAllEntradasByProductoId(
          usuario?.token,
          id_producto
        );
        const resultProducto = await getProductoById(
          usuario.token,
          id_producto
        );

        if (entradas) {
          setCostoPromedio(
            resultProducto.costo_acumulado
          );
          // Mapeamos los datos de las entradas para obtener solo la información que necesitamos
          const proveedores = entradas.map((entrada: any) => ({
            id_proveedor: entrada.proveedor.id_proveedor,
            nombre: entrada.proveedor.nombre,
            cantidad: entrada.cantidad,
            costoPorUnidad: entrada.costo,
          }));

          // Actualizamos el estado con los datos obtenidos
          setProveedorByProducto(proveedores);
        }
      }
    } catch (error) {
      console.log("Error al cargar los proveedores por producto:", error);
    }
  };

  const [proveedorByProducto, setProveedorByProducto] = useState<
    ProveedoresShowModal[]
  >([]);

  const [dropdownItems, setDropDownItems] = useState<TiendaPiker[]>([]);

  //Variables Para los datos de busqueda
  const [nombreProductoSearch, setNombreProductoSearch] = useState("");
  const [sKUSearch, setSKUSearch] = useState("");
  const [cantidadSearch, setCantidadSearch] = useState("");
  const [rangoPrecioDesdeSearch, setRangoPrecioDesdeSearch] = useState("");
  const [rangoPrecioHastaSearch, setRangoPrecioHastaSearch] = useState("");
  const [selectedValueNombreTienda, setSelectedValueNombreTienda] = useState<
    string | null
  >(usuario?.id_tienda);

  // Variable visual para la carga de datos en la tabla
  const [loading, setLoading] = useState(false);
  const [loadingOfExel, setLoadingOfExel] = useState(false);

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
        setDropDownItems(tiendasMapeados);
      }
    }
  };

  // Método auxiliar para llamar al modal de agregar producto
  const callModalAddProducto = () => {
    setModalProductsDates({
      id_producto: "",
      isAddProducto: false,
      isModificarProducto: false,
      fileEditable: true,
      isAddProductoShowProveedoresTiendas: false,
      isAddProductoShowProveedores: false,
    });
  };
  const cargarDetailsOfProducto = async () => {
    if (usuario?.token && modalProductsDates?.id_producto) {
      const result = await getProductoById(
        usuario.token,
        modalProductsDates.id_producto
      );

      if (result) {
        // Establecer los detalles del producto
        setIdProductoDetails(result.id_producto);
        setNombreProductoDetails(result.nombre);
        setPrecioProductoDetails(result.precio);
        setPrecioEmpresaProductoDetails(result.precio_empresa);
        setSkuDetails(result.Sku);
        setDescripcionProductoDetails(result.descripcion || ""); // Maneja el caso de descripción nula

        // Cargar historial de proveedores y tiendas en el que existe el producto
        getTiendasByProducto(result.id_producto);
        cargarProveedoresPorProducto(result.id_producto);

        const resultTienda = await getTiendaById(
          usuario.token,
          tiendaMoverDesde
        );

        const resultCantidadEnTienda = await isProductoInTienda(
          usuario.token,
          result.id_producto,
          selectedValueNombreTienda
        );

        const auxiliarNombreTiendaPiker = dropdownItems.find((element) => {
          return (
            parseInt(element.value) ===
            parseInt(selectedValueNombreTienda ?? "0")
          );
        });

        setCantidadTiendaUsuarioActual(resultCantidadEnTienda.cantidad);
        setNombreTiendaUsuarioActual(auxiliarNombreTiendaPiker?.label ?? "");

        // Convertir las imágenes de URL a base64
        const imagesPromises = result.imagenes.map(async (img: any) => {
          let httpImage: string = await img.url;
          let parseHttp = httpImage.substring(1, httpImage.length);
          httpImage = cerverHostImages + parseHttp;
          return { uri: httpImage }; // Almacenar en el formato adecuado
        });

        // Esperar a que todas las promesas se resuelvan
        const images = await Promise.all(imagesPromises);
        setSelectedImages(images);
      }
    }
  };

  const convertUrlToBase64 = async (url: string): Promise<string> => {
    console.log(url);

    const response = await fetch(url);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error("Error al obtener la imagen");
    }

    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string); // Este es el contenido en base64
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Convierte el blob a base64
    });
  };

  const auxiliarFunctionFilter = async (): Promise<Producto[] | null> => {
    if (usuario?.token) {
      try {
        const result = await filterProductsEnTienda(
          usuario.token,
          nombreProductoSearch,
          sKUSearch,
          rangoPrecioDesdeSearch,
          rangoPrecioHastaSearch,
          cantidadSearch,
          selectedValueNombreTienda
        );

        if (result) {
          const productosMapeados: Producto[] = await Promise.all(
            result.map(async (element: any) => ({
              id_Producto: element.id_producto, // Mapea 'id_producto' a 'id_Producto'
              nombre: element.producto.nombre, // Mapea 'nombre' directamente
              sku: element.producto.Sku, // Mapea 'Sku' a 'sku'
              cantidadTotal: element.cantidad,
              precioUSD: element.producto.precio.toString(), // Mapea 'precio' a 'precioUSD' y lo convierte a string
              precioEmpresaUSD: element.producto.precio_empresa,
            }))
          );

          return productosMapeados; // Devuelve los productos mapeados
        }
      } catch (error) {
        console.error("Error al filtrar los productos:", error);
        return null;
      }
    }
    return null; // Devuelve null si no hay token o no se pudieron filtrar productos
  };

  useEffect(() => {
    if (optimizacionFirstLoadingData) {
      cargarDetailsOfProducto();
    }
  }, [modalProductsDates]);

  useFocusEffect(
    useCallback(() => {
      const runEffects = async () => {
        setSelectedValueNombreTienda(usuario?.id_tienda);
        setCambioMoneda(await getValorMonedaUSD(usuario?.token));
        await checkPermiso();

        // *************
        await getTipoServicioPikerDetails();
        await getClientesPikerDetails();
        await getProductosPikerDetails();
        await getTiendasPikerDetails();
        // ******************

        getDatesTiendaPiker();
      };
      runEffects();
      setOptimizacionFirstLoadingData(true);

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  const [auxOrdenar, setAxuOrdenar] = useState(false);
  // Filtrar y ordenar productos cada vez que se haga un cambio en los datos.
  const filtrarYOrdenarProductos = async () => {
    setLoading(true);
    try {
      if (usuario?.token) {
        // Ejecutar la función auxiliar de filtrado para obtener los productos filtrados
        let productosFiltrados: Producto[] = await auxiliarFunctionFilter();

        console.log(sortProductos?.criterioOrden && selectedOptionTipoOrden);
        setAxuOrdenar(auxOrdenar ? false : true);

        // Si hay criterios de ordenamiento, aplicarlos sobre los productos filtrados
        if (sortProductos?.criterioOrden && sortProductos.tipoOrden) {
          productosFiltrados = await ordenarProducts(
            usuario.token,
            productosFiltrados,
            sortProductos.criterioOrden,
            auxOrdenar
          );
        }

        // Actualizar el estado con los productos filtrados (y ordenados si corresponde)
        setFilterItems(productosFiltrados);
      }
    } catch (error) {
      console.error("Error al filtrar y ordenar los productos:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Llamar a la función cuando alguna de las dependencias cambie
    filtrarYOrdenarProductos();
  }, [sortProductos, selectedOptionTipoOrden]);

  const auxSetModalProductsDates = () => {
    setNombreProductoDetails("");
    setPrecioProductoDetails("");
    setPrecioEmpresaProductoDetails("");
    setSkuDetails("");
    setDescripcionProductoDetails("");
    setSelectedImages([]);

    setModalProductsDates({
      id_producto: "",
      isAddProducto: true,
      fileEditable: true,
      isModificarProducto: false,
      isAddProductoShowProveedoresTiendas: false,
      isAddProductoShowProveedores: false,
    });
  };

  // Método para cargar las imágenes
  const handleImageUpload = () => {
    const options = {
      mediaType: "photo" as const, // Solo fotos
      quality: 1, // Calidad máxima de la imagen
      includeBase64: false, // No incluir en base64
      selectionLimit: 100,
      includeExtra: true,
    };

    // Abre la galería de imágenes
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log("El usuario canceló la selección de la imagen.");
      } else if (response.errorMessage) {
        console.error(
          "Error al seleccionar la imagen: ",
          response.errorMessage
        );
      } else if (response.assets && response.assets.length > 0) {
        // Agregar la nueva imagen al estado
        setSelectedImages((prevImages) => {
          // Calcula cuántas imágenes se pueden agregar sin exceder el límite de 100
          const availableSpace = 100 - prevImages.length; // Espacio disponible en el estado
          const newImages = response.assets.slice(0, availableSpace); // Selecciona solo las imágenes necesarias para no exceder el límite
          return [...prevImages, ...newImages]; // Agrega las nuevas imágenes al estado
        });
      } else {
        console.log("No se seleccionó ninguna imagen.");
      }
    });
  };

  // Función para eliminar una imagen por su índice
  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  // Método para limpiar campos del buscador
  const clearFields = () => {
    setNombreProductoSearch("");
    setSKUSearch("");
    setCantidadSearch("");
    setRangoPrecioDesdeSearch("");
    setRangoPrecioHastaSearch("");
    setSelectedOptionTipoOrden("");
    setSelectedValueNombreTienda(usuario?.id_tienda);
  };

  // Columnas para llenar la tabla
  const columnasMyDateTableDesktop = [
    "SKU",
    "Nombre",
    "PrecioCUP",
    "Cantidad en la Tienda",
  ];
  const columnasMyDateTableTiendaModal = ["Nombre", "Cantidad"];
  const columnasMyDateTableProveedorModal = ["Nombre", "Cantidad", "Costo"];

  const columnasMyDateTableMovil = [
    "SKU",
    "Nombre",
    "Precio",
    "Cantidad",
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
            onPress={() => exportarExel()}
            style={{
              flexDirection: "row",
              height: 30,
              width: "40%",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: Colors.azul_Oscuro, // Color de la sombra
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
              shadowRadius: 14, // Difuminado
              borderColor: Colors.verde_claro,
              borderWidth: 3,
              padding: 10,
              borderRadius: 10,
              marginHorizontal: "1%",
              marginTop: "1%",
              backgroundColor: Colors.verde_claro, // Color de fondo del botón
            }}
          >
            <Image
              source={require("../images/exel.png")}
              style={{ width: 20, height: 20, marginRight: "10%" }}
            />
            <Text
              style={[
                styles.radioButtonTextDesktop,
                sortProductos?.criterioOrden === "option1" &&
                  styles.radioButtonSelected &&
                  styles.radioButtonTextSelected,
              ]}
            >
              Exportar a Excel
            </Text>
          </TouchableOpacity>

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
            <MyDateTableEnMyTienda
              isMobile={isMobile}
              items={filterItems}
              columns={columnasMyDateTable}
              columnasMyDateTableProveedorModal={
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

                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <Text style={styles.textSearchMovil}>SKU:</Text>
                    <Text style={styles.textSearchMovil}></Text>
                    <Text style={styles.textSearchMovil}></Text>
                    <Text style={styles.textSearchMovil}></Text>
                    <Text style={styles.textSearchMovil}></Text>
                    <Text style={styles.textSearchMovil}>Cantidad:</Text>
                  </View>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="SKU"
                      value={sKUSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={setSKUSearch}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Cantidad"
                      value={cantidadSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setCantidadSearch(numericValue);
                      }}
                    />
                  </View>

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchMovil}>
                    Rango de Precio en CUP:
                  </Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Desde"
                      value={rangoPrecioDesdeSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoPrecioDesdeSearch(numericValue);
                      }}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyMovil}
                      placeholder="Hasta"
                      value={rangoPrecioHastaSearch}
                      onKeyPress={handleKeyPress}
                      onChangeText={(text) => {
                        // Filtra caracteres no numéricos
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoPrecioHastaSearch(numericValue);
                      }}
                    />
                  </View>

                  {(String(usuario?.id_rol) === "2" ||
                    String(usuario?.id_rol) === "1") && (
                    <View style={styles.separatorBlanco} />
                  )}

                  {(String(usuario?.id_rol) === "2" ||
                    String(usuario?.id_rol) === "1") && (
                    <Text style={styles.textSearchMovil}>
                      Cambiar de Tienda:
                    </Text>
                  )}
                  {(String(usuario?.id_rol) === "2" ||
                    String(usuario?.id_rol) === "1") && (
                    <View
                      style={{ position: "relative", zIndex: 500, height: 100 }}
                    >
                      <CustomDropdown
                        value={selectedValueNombreTienda}
                        placeholder="Tiendas"
                        setValue={setSelectedValueNombreTienda}
                        items={dropdownItems}
                      />
                    </View>
                  )}
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      marginTop: 25,
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
          visible={modalProductsDates?.isAddProducto ?? false}
          animationType="fade"
          onRequestClose={callModalAddProducto}
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
                onPress={callModalAddProducto}
              >
                <Text style={{ color: Colors.blanco_Suave }}>X</Text>
              </TouchableOpacity>

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
                {/*(modalProductsDates?.isModificarProducto ?? false)? "Modificar Producto" : (modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                false */}
                {modalProductsDates?.isModificarProducto ?? false
                  ? "Modificar Producto"
                  : modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                    false
                  ? "Datos del Producto"
                  : "Agregar Producto"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Producto */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre Del Producto
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  value={nombreProductoDetails}
                  onChangeText={setNombreProductoDetails}
                  cursorColor={Colors.azul_Oscuro}
                  editable={modalProductsDates?.fileEditable ? true : false}
                  placeholder="Nombre del producto"
                />

                {/* Contenedor para los campos Precio y Precio de Empresa */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Precio */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    
                  </View>

                  {/* Campo Precio de Empresa */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Precio de empresa en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={precioEmpresaProductoDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setPrecioEmpresaProductoDetails(validNumericValue);
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Precio de empresa en CUP"
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
                  {/* Campo Precio CUP */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Precio en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={precioCUPDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setCostoPromedio(validNumericValue);
                      }}
                      editable={false}
                      placeholder="Precio en CUP"
                    />
                  </View>

                  {/* Costo */}
                  {isPermisoHistorialDeProveedores && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        Costo Promedio
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        cursorColor={Colors.azul_Oscuro}
                        value={costoPromedio}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;

                          setCostoPromedio(validNumericValue);
                        }}
                        editable={false}
                        placeholder="Costo Promedio"
                      />
                    </View>
                  )}
                </View>

                {/*Contenedor para los precios en CUP */}
                {modalProductsDates?.isModificarProducto
                  ? false
                  : (modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                      false) && (
                      <View
                        style={{
                          width: "100%",
                          justifyContent: "space-between", // Para separar los campos de forma uniforme
                          alignItems: "center",
                          flexDirection: "row",
                          paddingHorizontal: 10,
                        }}
                      >
                        {/* Campo Precio en CUP*/}
                        <View style={{ width: "45%", marginLeft: "2%" }}>
                          <Text style={styles.labelTextModalDesktop}>
                            Precio en CUP
                          </Text>
                          <CustomTextImputSearch
                            style={styles.textImputModal}
                            value={(
                              parseFloat(precioProductoDetails) * cambioMoneda
                            ).toFixed(0)}
                            cursorColor={Colors.azul_Oscuro}
                            editable={false}
                            placeholder="Precio en CUP"
                          />
                        </View>

                        {/* Campo SKU*/}
                        <View
                          style={{
                            width: "45%",
                            marginLeft: "2%",
                            marginRight: "2%",
                          }}
                        >
                          <Text style={styles.labelTextModalDesktop}>Sku</Text>
                          <CustomTextImputSearch
                            style={styles.textImputModal}
                            value={skuDetails}
                            onChangeText={setSkuDetails}
                            cursorColor={Colors.azul_Oscuro}
                            editable={
                              modalProductsDates?.fileEditable ? true : false
                            }
                            placeholder="Sku"
                          />
                        </View>
                      </View>
                    )}

                {modalProductsDates?.isModificarProducto
                  ? false
                  : (modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                      false) && (
                      <View
                        style={{
                          borderColor: Colors.azul_Oscuro,
                          borderWidth: 2,
                          marginTop: "3%",
                          borderRadius: 15,
                          flexDirection: "row",
                          height: 350,
                          width: "90%",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            height: 340,
                            width: "45%",
                          }}
                        >
                          <Text style={styles.labelTextModalMovil}>
                            Tiendas en las que existe el producto
                          </Text>
                          <MyDateTableModalShowDatesTienda
                            columns={columnasMyDateTableTiendaModal}
                            items={tiendasByProducto}
                          />
                        </View>
                        {(modalProductsDates?.isAddProductoShowProveedores ??
                          false) &&
                          isPermisoHistorialDeProveedores && (
                            <View
                              style={{
                                height: 340,
                                width: "45%",
                              }}
                            >
                              <Text style={styles.labelTextModalMovil}>
                                Historial de proveedores
                              </Text>
                              <MyDateTableModalShowDateProveedores
                                columns={columnasMyDateTableProveedorModal}
                                items={proveedorByProducto}
                              />
                            </View>
                          )}
                      </View>
                    )}

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
                  placeholder="Escribe la descripción del producto"
                  multiline={true}
                  value={descripcionProductoDetails}
                  onChangeText={setDescripcionProductoDetails}
                  editable={modalProductsDates?.fileEditable ? true : false}
                  numberOfLines={5}
                  scrollEnabled={true}
                />

                {/* Campo para cargar fotos */}
                <PanGestureHandler onGestureEvent={onDrop}>
                  <View
                    style={{
                      marginTop: 20,
                      width: "90%",
                      borderWidth: 1,
                      borderColor: Colors.azul_Oscuro,
                      borderRadius: 13,
                      padding: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.blanco_Suave,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.negro,
                        marginBottom: "5%",
                      }}
                    >
                      Imágenes del producto
                    </Text>

                    {/* Botón para cargar imágenes */}
                    {(modalProductsDates?.fileEditable ?? false) && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Claro,
                          borderRadius: 15,
                          width: "90%", // Ancho fijo para pantallas de escritorio
                          height: 50, // Altura fija para pantallas de escritorio
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 3, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                        }}
                        onPress={handleImageUpload}
                      >
                        <Text style={{ color: Colors.blanco }}>
                          Seleccionar Imagenes
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Vista para mostrar las imágenes seleccionadas */}
                    {selectedImages.length > 0 && (
                      <ScrollView
                        horizontal={true}
                        style={{
                          marginTop: 10,
                          width: "100%",
                          height: 100, // Ajusta la altura de la vista de imágenes
                        }}
                      >
                        {selectedImages.map((image, index) => (
                          <View
                            key={index}
                            style={{
                              position: "relative",
                              width: 100,
                              height: 100,
                              marginRight: 10,
                            }}
                          >
                            <Image
                              key={index}
                              source={{ uri: image.uri }} // Usa la URI de la imagen
                              style={{
                                width: 100,
                                height: 100,
                                marginRight: 10,
                                borderRadius: 10,
                              }}
                            />
                            <TouchableOpacity
                              style={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                backgroundColor: "red",
                                borderRadius: 15,
                                width: 20,
                                height: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1,
                              }}
                              onPress={() => handleRemoveImage(index)}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 14,
                                }}
                              >
                                X
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                </PanGestureHandler>

                {/**Contenedor para los botones */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  {(isPermisoMoverGeneral || isPermisoMoverLocal) && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.azul_Claro,
                        padding: 10,
                        marginTop: "3%",
                        marginLeft: "5%",
                        borderRadius: 12,
                        width: "30%", // Ajusta el ancho de los botones
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        setModalProductsDates({
                          id_producto: "",
                          isAddProducto: false,
                          isModificarProducto: false,
                          fileEditable: false,
                          isAddProductoShowProveedoresTiendas: false,
                          isAddProductoShowProveedores: false,
                        });
                        cargarDatosTiendaParaMover();
                        setModalMoverVisible(true);
                      }}
                    >
                      <Text style={{ color: "white" }}>Mover Producto</Text>
                    </TouchableOpacity>
                  )}
                  {isPermisoRestarProducto && false  && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.rojo_oscuro,
                        padding: 10,
                        marginTop: "3%",
                        borderRadius: 12,
                        width: "30%", // Ajusta el ancho de los botones
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        callModalAddProducto();
                        setModalRestarProductos(true);
                      }}
                    >
                      <Text style={{ color: "white" }}>Restar Producto</Text>
                    </TouchableOpacity>
                  )}
                  {false && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.verde_claro,
                        padding: 10,
                        marginTop: "3%",
                        marginRight: "5%",
                        borderRadius: 12,
                        width: "30%", // Ajusta el ancho de los botones
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        callVenta();
                      }}
                    >
                      <Text style={{ color: "white" }}>Vender Producto</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/*Modal de servicio */}
        <Modal
          transparent={true}
          visible={isModalVenderProductoVisible}
          animationType="fade"
          onRequestClose={() =>
            setIsModalVenderProductoVisible(!isModalVenderProductoVisible)
          }
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
                onPress={() =>
                  setIsModalVenderProductoVisible(!isModalVenderProductoVisible)
                }
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
                Vender Producto
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
                  style={{ width: "100%", zIndex: 5000, position: "relative" }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre del Cliente
                  </Text>
                </View>
                <View
                  style={{ width: "100%", zIndex: 5000, position: "relative" }}
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
                  />
                </View>

                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    position: "relative",
                    zIndex: 1500,
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Tienda dodnde se presto el servicio */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
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
                      readOnly={!false}
                      searchable={true}
                      onDropdownOpen={() => {}}
                    />
                  </View>

                  {/* Tipo Servicio */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Tipo de Servicio: Venta
                    </Text>
                  </View>
                </View>

                {isVentaProducto && <View style={styles.separatorNegro} />}

                {/* Nombre Producto */}
                {isVentaProducto && (
                  <View
                    style={{
                      width: "100%",
                      zIndex: 100,
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
                      zIndex: 500,
                      position: "relative",
                    }}
                  >
                    <CustomDropdownDetails
                      value={idProductoDetails}
                      placeholder="Seleccione un produto"
                      setValue={setIdProductoDetails}
                      items={dropdownItemsNombreproducto}
                      searchable={true}
                      readOnly={!false}
                      onDropdownOpen={() => {}}
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
                        value={cantidadProductoServicioDetails}
                        onChangeText={(text) => {
                          // Filtra caracteres no numéricos
                          const numericValue = text.replace(/[^0-9]/g, "");
                          setCantidadProductoServicioDetails(numericValue);
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
                          ? "Costo promedio del producto en USD"
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
                          parseInt(idTipoServicioDetails) === 2
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
                          parseInt(idTipoServicioDetails) === 2
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
                    <Text style={styles.labelTextModalDesktop}>
                      {isVentaProducto
                        ? "Precio por unidad en USD"
                        : "Precio del servicio en USD"}
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={precioUSDDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        if (validNumericValue !== "") {
                          setPrecioCUPDetails(
                            String(
                              (
                                parseFloat(validNumericValue) * cambioMoneda
                              ).toFixed(0)
                            )
                          );
                        } else {
                          setPrecioCUPDetails("0");
                        }
                        setPrecioUSDDetails(validNumericValue);
                        setAuxRedondeo("PrecioUSD");
                      }}
                      editable={
                        isPermisoModificarServicio || isPermisoServicioLocal
                      }
                      placeholder="Precio por unidad en usd"
                    />
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
                    zIndex: 600,
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
                        onDropdownOpen={() => {}}
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
                    zIndex: 500,
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
                    onPress={() => {
                      addNewServicio();
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                      }}
                    >
                      Agregar Servicio
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal mensaje para Restar Productos*/}
        <Modal
          transparent={true}
          visible={isModalMesajeRestarVisible}
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
                {`Estás seguro de que deseas restar una cantidad de ${cantidadRestarProducto} del producto ${nombreProductoDetails} de la tienda ${nombreTiendaUsuarioActual}?`}
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
                  onPress={() => restarProductosFuction()}
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
                  onPress={() =>
                    setModalMesajeRestarVisible(!isModalMesajeRestarVisible)
                  }
                >
                  <Text style={{ color: "white" }}>No</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setModalMesajeRestarVisible(!isModalMesajeRestarVisible)
                }
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal restar Productos*/}
        <Modal
          transparent={true}
          visible={isModalRestarProductos}
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
                height: 300,
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
                {`Restar ${nombreProductoDetails} de la tienda ${nombreTiendaUsuarioActual} en la cual hay ${cantidadTiendaUsuarioActual}`}
              </Text>

              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Cantidad a restar
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
                value={cantidadRestarProducto}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCantidadRestarProducto(numericValue);
                }}
                cursorColor={Colors.azul_Oscuro}
                editable={modalProductsDates?.fileEditable ? true : false}
                placeholder="Cantidad a restar"
              />

              <TouchableOpacity
                onPress={() => restarProductosValidarCampos()}
                style={{
                  backgroundColor: Colors.rojo_oscuro,
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
                  Restar Productos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalRestarProductos(!isModalRestarProductos)}
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal restar Productos*/}
        <Modal
          transparent={true}
          visible={isModalRestarProductos}
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
                {`Restar ${nombreProductoDetails} de la tienda ${nombreTiendaUsuarioActual} en la cual hay ${cantidadTiendaUsuarioActual}`}
              </Text>

              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Cantidad a restar
              </Text>
              <CustomTextImputSearch
                style={styles.textImputModal}
                value={nombreProductoDetails}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCantidadSearch(numericValue);
                }}
                cursorColor={Colors.azul_Oscuro}
                editable={modalProductsDates?.fileEditable ? true : false}
                placeholder="Cantidad a restar"
              />

              <TouchableOpacity
                onPress={() =>
                  setModalMesajeMoverVisible(!isModalMesajeMoverVisible)
                }
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal mensaje para el Mover*/}
        <Modal
          transparent={true}
          visible={isModalMesajeMoverVisible}
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
                width: 450,
                height: 250,
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
                {`Desea mover ${cantidadMoverProducto} producto ${nombreProductoDetails} desde la tienda ${tiendaNombreEspecificaDesde} a ${tiendaNombreEspecificaHasta}?`}
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
                  onPress={() => moverProductoFunction()}
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
                  onPress={() =>
                    setModalMesajeMoverVisible(!isModalMesajeMoverVisible)
                  }
                >
                  <Text style={{ color: "white" }}>No</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setModalMesajeMoverVisible(!isModalMesajeMoverVisible)
                }
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para el Mover*/}
        <Modal
          transparent={true}
          visible={isModalMoverVisible}
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
                width: 400, // Ajusta el ancho del modal a un porcentaje del ancho de la pantalla
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
                {tiendaMoverDesde === ""
                  ? "Seleccione una tienda origen"
                  : `Mover Producto "${nombreProductoDetails}" en la Tienda\n ${nombreTiendaUsuarioActual} con una cantidad de ${cantidadTiendaUsuarioActual}`}
              </Text>

              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                La cantidad que desea mover
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
                  backgroundColor: Colors.blanco_Suave,
                  borderRadius: 13,
                  fontSize: 18, // Tamaño de letra más grande
                  textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                  textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
                  textShadowRadius: 2, // Difuminado de la sombra
                  fontWeight: "bold", // Letra en negritas
                  paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
                }}
                cursorColor={Colors.azul_Oscuro}
                placeholder="Cantidad a mover"
                value={cantidadMoverProducto}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCantidadMoverProducto(numericValue);
                }}
              />

              <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 10 }}>
                Tiendas para mover los productos
              </Text>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {" "}
                {/* Este View se asegura que la tabla ocupe el 100% */}
                {isPermisoMoverGeneral && (
                  <CustomDropDownPikerFromMover
                    value={tiendaMoverDesde}
                    items={tiendasByProductoDesde}
                    placeholder="Tienda desde donde se quiere mover"
                    setValue={setTiendaMoverDesde}
                  />
                )}
                <CustomDropDownPikerFromMover
                  value={tiendaMoverHasta}
                  items={tiendasByProductoHasta}
                  placeholder="Tienda a la que se quiere mover"
                  setValue={setTiendaMoverHasta}
                />
              </View>

              <TouchableOpacity
                onPress={() => moverProdcutoFunctionValidarCampos()}
                style={{
                  backgroundColor: Colors.azul_Claro,
                  borderRadius: 15,
                  marginTop: 150,
                  width: "90%", // Ancho fijo para pantallas de escritorio
                  height: 50, // Altura fija para pantallas de escritorio
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
              >
                <Text style={{ color: Colors.blanco }}>Mover</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalMoverVisible(!isModalMoverVisible)}
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
                width: 350,
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
                      ? navigation.replace("Mi Tienda")
                      : setModalMensajeView(!isModalMensajeView)
                  }
                >
                  <Text style={{ color: "white" }}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>

        {/*Modal mensaje para el exel */}
        <Modal
          transparent={true}
          visible={isModalMensajeViewExel}
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

              {loadingOfExel ? (
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
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
                  >
                    Datos Recopilados. Espere a que termine la descarga.
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#007BFF", // Cambia esto por Colors.azul_Oscuro si lo tienes definido
                      padding: 10,
                      borderRadius: 8,
                      width: "48%", // Ajusta el ancho del botón
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() =>
                      setModalMensajeViewExel(!isModalMensajeViewExel)
                    } // Llama a la función onClose para cerrar el modal
                  >
                    <Text style={{ color: "white" }}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
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
          <TouchableOpacity
            onPress={() => exportarExel()}
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
              borderColor: Colors.verde_claro,
              borderWidth: 3,
              padding: 10,
              borderRadius: 10,
              marginHorizontal: "1%",
              marginTop: "1%",
              backgroundColor: Colors.verde_claro, // Color de fondo del botón
            }}
          >
            <Image
              source={require("../images/exel.png")}
              style={{ width: 20, height: 20, marginRight: "10%" }}
            />
            <Text
              style={[
                styles.radioButtonTextDesktop,
                sortProductos?.criterioOrden === "option1" &&
                  styles.radioButtonSelected &&
                  styles.radioButtonTextSelected,
              ]}
            >
              Exportar a Excel
            </Text>
          </TouchableOpacity>
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
              value={nombreProductoSearch}
              onChangeText={setNombreProductoSearch}
              onKeyPress={handleKeyPress}
            />

            <View style={styles.separatorBlanco} />

            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <Text style={styles.textSearchDesktop}>SKU:</Text>
              <Text style={styles.textSearchDesktop}></Text>
              <Text style={styles.textSearchDesktop}></Text>
              <Text style={styles.textSearchDesktop}></Text>
              <Text style={styles.textSearchDesktop}></Text>
              <Text style={styles.textSearchDesktop}>Cantidad:</Text>
            </View>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="SKU"
                value={sKUSearch}
                onChangeText={setSKUSearch}
                onKeyPress={handleKeyPress}
              />
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Cantidad"
                value={cantidadSearch}
                onKeyPress={handleKeyPress}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCantidadSearch(numericValue);
                }}
              />
            </View>

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>
              Rango de Precio en CUP:
            </Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Desde"
                value={rangoPrecioDesdeSearch}
                onKeyPress={handleKeyPress}
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
                onKeyPress={handleKeyPress}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoPrecioHastaSearch(numericValue);
                }}
              />
            </View>

            {(String(usuario?.id_rol) === "2" ||
              String(usuario?.id_rol) === "1") && (
              <View style={styles.separatorBlanco} />
            )}

            {(String(usuario?.id_rol) === "2" ||
              String(usuario?.id_rol) === "1") && (
              <Text style={styles.textSearchDesktop}>Cambiar de Tienda:</Text>
            )}
            {(String(usuario?.id_rol) === "2" ||
              String(usuario?.id_rol) === "1") && (
              <View style={{ position: "relative", zIndex: 500, height: 100 }}>
                <CustomDropdown
                  value={selectedValueNombreTienda}
                  placeholder="Tiendas"
                  setValue={setSelectedValueNombreTienda}
                  items={dropdownItems}
                />
              </View>
            )}
            <View
              style={{ width: "100%", flexDirection: "row", marginTop: 25 }}
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
                  onPress={() => filtrarYOrdenarProductos()}
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
            <MyDateTableEnMyTienda
              isMobile={isMobile}
              items={filterItems}
              columns={columnasMyDateTable}
              columnasMyDateTableProveedorModal={
                columnasMyDateTableProveedorModal
              }
              columnasMyDateTableTiendaModal={columnasMyDateTableTiendaModal}
              tiendasByProducto={tiendasByProducto}
              proveedorByProducto={proveedorByProducto}
            />
          )}
        </View>

        {/*Modal de en my tienda producto details */}
        <Modal
          transparent={true}
          visible={modalProductsDates?.isAddProducto ?? false}
          animationType="fade"
          onRequestClose={callModalAddProducto}
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
                onPress={callModalAddProducto}
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
                {modalProductsDates?.isModificarProducto ?? false
                  ? "Modificar Producto"
                  : modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                    false
                  ? "Datos del Producto"
                  : "Agregar Producto"}
              </Text>

              {/* ScrollView para permitir el desplazamiento del contenido */}
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 20, // Espacio al final del contenido
                }}
              >
                {/* Nombre del Producto */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.labelTextModalDesktop}>
                    Nombre Del Producto
                  </Text>
                </View>
                <CustomTextImputSearch
                  style={styles.textImputModal}
                  cursorColor={Colors.azul_Oscuro}
                  editable={modalProductsDates?.fileEditable ? true : false}
                  value={nombreProductoDetails}
                  onChangeText={setNombreProductoDetails}
                  placeholder="Nombre del producto"
                />

                {/* Contenedor para los campos Precio y Precio de Empresa */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between", // Para separar los campos de forma uniforme
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  {/* Campo Precio */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    
                  </View>

                  {/* Campo Precio de Empresa */}
                  <View
                    style={{
                      width: "45%",
                      marginLeft: "2%",
                      marginRight: "2%",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Precio de empresa en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      value={precioEmpresaProductoDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setPrecioEmpresaProductoDetails(validNumericValue);
                      }}
                      cursorColor={Colors.azul_Oscuro}
                      editable={modalProductsDates?.fileEditable ? true : false}
                      placeholder="Precio de empresa en CUP"
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
                  {/* Campo Precio CUP */}
                  <View style={{ width: "45%", marginLeft: "2%" }}>
                    <Text style={styles.labelTextModalDesktop}>
                      Precio en CUP
                    </Text>
                    <CustomTextImputSearch
                      style={styles.textImputModal}
                      cursorColor={Colors.azul_Oscuro}
                      value={precioCUPDetails}
                      onChangeText={(text) => {
                        // Permite solo números y un punto decimal
                        const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                        // Asegura que solo haya un punto decimal
                        const validNumericValue =
                          numericValue.split(".").length > 2
                            ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                            : numericValue;

                        setCostoPromedio(validNumericValue);
                      }}
                      editable={false}
                      placeholder="Precio en CUP"
                    />
                  </View>

                  {/* Costo */}
                  {isPermisoHistorialDeProveedores && (
                    <View
                      style={{
                        width: "45%",
                        marginLeft: "2%",
                        marginRight: "2%",
                      }}
                    >
                      <Text style={styles.labelTextModalDesktop}>
                        Costo Promedio
                      </Text>
                      <CustomTextImputSearch
                        style={styles.textImputModal}
                        cursorColor={Colors.azul_Oscuro}
                        value={costoPromedio}
                        onChangeText={(text) => {
                          // Permite solo números y un punto decimal
                          const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
                          // Asegura que solo haya un punto decimal
                          const validNumericValue =
                            numericValue.split(".").length > 2
                              ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                              : numericValue;

                          setCostoPromedio(validNumericValue);
                        }}
                        editable={false}
                        placeholder="Costo Promedio"
                      />
                    </View>
                  )}
                </View>

                {modalProductsDates?.isModificarProducto
                  ? false
                  : (modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                      false) && (
                      <View
                        style={{
                          width: "100%",
                          justifyContent: "space-between", // Para separar los campos de forma uniforme
                          alignItems: "center",
                          flexDirection: "row",
                          paddingHorizontal: 10,
                        }}
                      >
                        {/* Campo Precio en CUP*/}
                        <View style={{ width: "45%", marginLeft: "2%" }}></View>

                        {/* Campo Precio de Empresa en CUP*/}
                        <View
                          style={{
                            width: "45%",
                            marginLeft: "2%",
                            marginRight: "2%",
                          }}
                        >
                          <Text style={styles.labelTextModalDesktop}>Sku</Text>
                          <CustomTextImputSearch
                            style={styles.textImputModal}
                            value={skuDetails}
                            onChangeText={setSkuDetails}
                            cursorColor={Colors.azul_Oscuro}
                            editable={
                              modalProductsDates?.fileEditable ? true : false
                            }
                            placeholder="Sku"
                          />
                        </View>
                      </View>
                    )}

                {modalProductsDates?.isModificarProducto
                  ? false
                  : (modalProductsDates?.isAddProductoShowProveedoresTiendas ??
                      false) && (
                      <View
                        style={{
                          borderColor: Colors.azul_Oscuro,
                          borderWidth: 2,
                          marginTop: "3%",
                          borderRadius: 15,
                          flexDirection: "row",
                          height: 350,
                          width: "90%",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            height: 350,
                            width: "50%",
                          }}
                        >
                          <Text style={styles.labelTextModalDesktop}>
                            Tiendas en las que existe el producto
                          </Text>
                          <MyDateTableModalShowDatesTienda
                            columns={columnasMyDateTableTiendaModal}
                            items={tiendasByProducto}
                          />
                        </View>
                        {(modalProductsDates?.isAddProductoShowProveedores ??
                          false) &&
                          isPermisoHistorialDeProveedores && (
                            <View
                              style={{
                                height: 350,
                                width: "50%",
                              }}
                            >
                              <Text style={styles.labelTextModalDesktop}>
                                Historial de proveedores
                              </Text>
                              <MyDateTableModalShowDateProveedores
                                columns={columnasMyDateTableProveedorModal}
                                items={proveedorByProducto}
                              />
                            </View>
                          )}
                      </View>
                    )}

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
                  placeholder="Escribe la descripción del producto"
                  multiline={true}
                  editable={modalProductsDates?.fileEditable ? true : false}
                  numberOfLines={5}
                  value={descripcionProductoDetails}
                  onChangeText={setDescripcionProductoDetails}
                  scrollEnabled={true}
                />

                {/* Campo para cargar fotos */}
                <PanGestureHandler onGestureEvent={onDrop}>
                  <View
                    style={{
                      marginTop: 20,
                      width: "90%",
                      borderWidth: 1,
                      borderColor: Colors.azul_Oscuro,
                      borderRadius: 13,
                      padding: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.blanco_Suave,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.negro,
                        marginBottom: "5%",
                      }}
                    >
                      Imágenes del producto
                    </Text>

                    {/* Botón para cargar imágenes */}
                    {(modalProductsDates?.fileEditable ?? false) && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: Colors.azul_Claro,
                          borderRadius: 15,
                          width: "90%", // Ancho fijo para pantallas de escritorio
                          height: 50, // Altura fija para pantallas de escritorio
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 3, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 5,
                        }}
                        onPress={handleImageUpload}
                      >
                        <Text style={{ color: Colors.blanco }}>
                          Seleccionar Imagenes
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Vista para mostrar las imágenes seleccionadas */}
                    {selectedImages.length > 0 && (
                      <ScrollView
                        horizontal={true}
                        style={{
                          marginTop: 10,
                          width: "100%",
                          height: 100, // Ajusta la altura de la vista de imágenes
                        }}
                      >
                        {selectedImages.map((image, index) => (
                          <View
                            key={index}
                            style={{
                              position: "relative",
                              width: 100,
                              height: 100,
                              marginRight: 10,
                            }}
                          >
                            <Image
                              key={index}
                              source={{ uri: image.uri }} // Usa la URI de la imagen
                              style={{
                                width: 100,
                                height: 100,
                                marginRight: 10,
                                borderRadius: 10,
                              }}
                            />
                            <TouchableOpacity
                              style={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                backgroundColor: "red",
                                borderRadius: 15,
                                width: 20,
                                height: 20,
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1,
                              }}
                              onPress={() => handleRemoveImage(index)}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontSize: 14,
                                }}
                              >
                                X
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                </PanGestureHandler>

                {/**Contenedor para los botones */}
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  {(isPermisoMoverGeneral || isPermisoMoverLocal) && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.azul_Claro,
                        padding: 10,
                        marginTop: "3%",
                        marginLeft: "5%",
                        borderRadius: 12,
                        width: "30%", // Ajusta el ancho de los botones
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        setModalProductsDates({
                          id_producto: "",
                          isAddProducto: false,
                          isModificarProducto: false,
                          fileEditable: false,
                          isAddProductoShowProveedoresTiendas: false,
                          isAddProductoShowProveedores: false,
                        });
                        cargarDatosTiendaParaMover();
                        setModalMoverVisible(true);
                      }}
                    >
                      <Text style={{ color: "white" }}>Mover Producto</Text>
                    </TouchableOpacity>
                  )}
                  {isPermisoRestarProducto && false && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.rojo_oscuro,
                        padding: 10,
                        marginTop: "3%",
                        borderRadius: 12,
                        width: "30%", // Ajusta el ancho de los botones
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        callModalAddProducto();
                        setModalRestarProductos(true);
                      }}
                    >
                      <Text style={{ color: "white" }}>Restar Producto</Text>
                    </TouchableOpacity>
                  )}
                  {false && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.verde_claro,
                        padding: 10,
                        marginTop: "3%",
                        marginRight: "5%",
                        borderRadius: 12,
                        width: "30%", // Ajusta el ancho de los botones
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        callVenta();
                      }}
                    >
                      <Text style={{ color: "white" }}>Vender Producto</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal mensaje para Restar Productos*/}
        <Modal
          transparent={true}
          visible={isModalMesajeRestarVisible}
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
                {`Estás seguro de que deseas restar una cantidad de ${cantidadRestarProducto} del producto ${nombreProductoDetails} de la tienda ${nombreTiendaUsuarioActual}?`}
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
                  onPress={() => restarProductosFuction()}
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
                  onPress={() =>
                    setModalMesajeRestarVisible(!isModalMesajeRestarVisible)
                  }
                >
                  <Text style={{ color: "white" }}>No</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setModalMesajeRestarVisible(!isModalMesajeRestarVisible)
                }
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal restar Productos*/}
        <Modal
          transparent={true}
          visible={isModalRestarProductos}
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
                height: 300,
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
                {`Restar ${nombreProductoDetails} de la tienda ${nombreTiendaUsuarioActual} en la cual hay ${cantidadTiendaUsuarioActual}`}
              </Text>

              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Cantidad a restar
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
                value={cantidadRestarProducto}
                onChangeText={(text) => {
                  // Filtra caracteres no numéricos
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCantidadRestarProducto(numericValue);
                }}
                cursorColor={Colors.azul_Oscuro}
                editable={modalProductsDates?.fileEditable ? true : false}
                placeholder="Cantidad a restar"
              />

              <TouchableOpacity
                onPress={() => restarProductosValidarCampos()}
                style={{
                  backgroundColor: Colors.rojo_oscuro,
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
                  Restar Productos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalRestarProductos(!isModalRestarProductos)}
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal mensaje para el Mover*/}
        <Modal
          transparent={true}
          visible={isModalMesajeMoverVisible}
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
                width: 450,
                height: 250,
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
                {`Desea mover ${cantidadMoverProducto} producto ${nombreProductoDetails} desde la tienda ${tiendaNombreEspecificaDesde} a ${tiendaNombreEspecificaHasta}?`}
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
                  onPress={() => moverProductoFunction()}
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
                  onPress={() =>
                    setModalMesajeMoverVisible(!isModalMesajeMoverVisible)
                  }
                >
                  <Text style={{ color: "white" }}>No</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setModalMesajeMoverVisible(!isModalMesajeMoverVisible)
                }
                style={{ marginTop: 20, alignItems: "center" }}
              >
                <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para el Mover*/}
        <Modal
          transparent={true}
          visible={isModalMoverVisible}
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
                width: 500, // Ajusta el ancho del modal a un porcentaje del ancho de la pantalla
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
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
                {tiendaMoverDesde === ""
                  ? "Seleccione una tienda origen"
                  : `Mover Producto "${nombreProductoDetails}" en la Tienda ${nombreTiendaUsuarioActual} con una cantidad de ${cantidadTiendaUsuarioActual}`}
              </Text>

              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                La cantidad que desea mover
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
                  backgroundColor: Colors.blanco_Suave,
                  borderRadius: 13,
                  fontSize: 18, // Tamaño de letra más grande
                  textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                  textShadowOffset: { width: 0.5, height: 0.5 }, // Desplazamiento de la sombra
                  textShadowRadius: 2, // Difuminado de la sombra
                  fontWeight: "bold", // Letra en negritas
                  paddingHorizontal: 10, // Espacio interno para que no esté pegado al borde
                }}
                cursorColor={Colors.azul_Oscuro}
                placeholder="Cantidad a mover"
                value={cantidadMoverProducto}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setCantidadMoverProducto(numericValue);
                }}
              />

              <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 10 }}>
                Tiendas para mover los productos
              </Text>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  position: "relative",
                  zIndex: 500,
                }}
              >
                {" "}
                {/* Este View se asegura que la tabla ocupe el 100% */}
                {isPermisoMoverGeneral && (
                  <CustomDropDownPikerFromMover
                    value={tiendaMoverDesde}
                    items={tiendasByProductoDesde}
                    placeholder="Tienda desde donde se quiere mover"
                    setValue={setTiendaMoverDesde}
                  />
                )}
                <CustomDropDownPikerFromMover
                  value={tiendaMoverHasta}
                  items={tiendasByProductoHasta}
                  placeholder="Tienda a la que se quiere mover"
                  setValue={setTiendaMoverHasta}
                />
              </View>

              <TouchableOpacity
                onPress={() => moverProdcutoFunctionValidarCampos()}
                style={{
                  backgroundColor: Colors.azul_Claro,
                  borderRadius: 15,
                  marginTop: 170,
                  width: "90%", // Ancho fijo para pantallas de escritorio
                  height: 50, // Altura fija para pantallas de escritorio
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
              >
                <Text style={{ color: Colors.blanco }}>Mover</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalMoverVisible(!isModalMoverVisible)}
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
                      ? navigation.replace("Mi Tienda")
                      : setModalMensajeView(!isModalMensajeView)
                  }
                >
                  <Text style={{ color: "white" }}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>

        {/*Modal mensaje para el exel */}
        <Modal
          transparent={true}
          visible={isModalMensajeViewExel}
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

              {loadingOfExel ? (
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
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
                  >
                    Datos Recopilados. Espere a que termine la descarga.
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#007BFF", // Cambia esto por Colors.azul_Oscuro si lo tienes definido
                      padding: 10,
                      borderRadius: 8,
                      width: "48%", // Ajusta el ancho del botón
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() =>
                      setModalMensajeViewExel(!isModalMensajeViewExel)
                    } // Llama a la función onClose para cerrar el modal
                  >
                    <Text style={{ color: "white" }}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
