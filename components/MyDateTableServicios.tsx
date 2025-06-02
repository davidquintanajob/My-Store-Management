import * as React from "react";
import { DataTable } from "react-native-paper";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Button,
  Animated,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { Colors } from "../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import { TiendaShowModal } from "./MyDateTableModalShowDatesTienda";
import { ProveedoresShowModal } from "./MyDateTableModalShowDateProveedores";
import { useUsuario } from "../contexts/UsuarioContext";
import { isPermiso } from "../services/RolPermisosAndRol";
import { isProductoInTienda } from "../services/TiendaServices";
import { deleteProducto } from "../services/ProductoServices";
import CustomTextImputSearch from "./CustomTextImputSearch";
import {
  MyDateTableModalDataMoverTiendas,
  TiendaMoverShowModal,
} from "./MyDateTableModalDataMoverTiendas";
import { useModalEntradasDates } from "../contexts/AuxiliarContextModalEntradas";
import { useSortEntradas } from "../contexts/AuxiliarSortEntradas";
import { useSortServicios } from "../contexts/AuxiliarSortServicios";
import { getValorMonedaUSD } from "../services/MonedaService";

export interface Servicio {
  id_Servicio: string;
  id_Cliente: string;
  id_Tienda: string;
  id_Tipo_servicio: string;
  id_Deuda: string;
  id_Garantia: string;
  fecha: string;
  precio: string;
  nota: string;
  descripcion: string;
  nombreCliente: string;
  nombreTienda: string;
  nombreTipoServicio: string;
  nombreProducto?: string;
  cantidad?: string;
  devuelto: boolean;
  costo: string;
  costo_tipo_servicio: string;
  cantidad_transferida: string;
}

interface Props {
  items: Servicio[];
  columns: string[];
  isMobile: boolean;
  columnasMyDateTableEntradaModal: string[];
  columnasMyDateTableTiendaModal: string[];
  tiendasByProducto: TiendaShowModal[];
  proveedorByProducto: ProveedoresShowModal[];
}

export const MyDateTableServicios: React.FC<Props> = ({
  items,
  columns,
  isMobile,
}) => {
  const navigation = useNavigation();
  const [scale] = React.useState(new Animated.Value(1));
  const { modalEntradasDates, setModalEntradasDates } = useModalEntradasDates();
  const { usuario, setUsuario } = useUsuario();
  const { sortServicios, setSortServicios } = useSortServicios();

  // Estilos condicionales
  const containterStyles = isMobile
    ? styles.containerMovil
    : styles.containerDesktop;

  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [displayedItems, setDisplayedItems] = React.useState<Servicio[]>([]); // Estado para los elementos mostrados

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isModalModificarVisible, setModalModificarVisible] =
    React.useState(false);
  const [isModalEliminarVisible, setModalEliminarVisible] =
    React.useState(false);
  const [isModalMoverVisible, setModalMoverVisible] = React.useState(false);
  const [isModalMensajeView, setModalMensajeView] = React.useState(false);

  const [cambioMoneda, setCambioMoneda] = React.useState(0);

  const [modalMensaje, setModalMensaje] = React.useState("");

  const columnasParaLaTablaMoverProducto = ["Nombre"];
  const [tiendasByProducto, setTiendasByProducto] = React.useState<
    TiendaMoverShowModal[]
  >([
    { id_tienda: "1", nombre: "Tienda 1" },
    { id_tienda: "2", nombre: "Tienda 2" },
    { id_tienda: "3", nombre: "Tienda 3" },
  ]);

  const detailsModalView = (id_entrada: string) => {
    setModalEntradasDates({
      id_entrada: id_entrada,
      isAddEntrada: true,
      fileEditable: false,
      isModificarEntrada: false,
    });
  };

  // Condicionales para mostrar según los permisos
  const [isPermisoOpcionesDeCelda, setIsPermisoOpcionesDeCelda] =
    React.useState(false);
  const [
    isPermisoOpcionesDeCeldaModificar,
    setIsPermisoOpcionesDeCeldaModificar,
  ] = React.useState(false);
  const [
    isPermisoOpcionesDeCeldaEliminar,
    setIsPermisoOpcionesDeCeldaEliminar,
  ] = React.useState(false);
  const [
    isPermisoOpcionesDeCeldaMoverLocal,
    setIsPermisoOpcionesDeCeldaMoverLocal,
  ] = React.useState(false);
  const [
    isPermisoOpcionesDeCeldaMoverGeneral,
    setIsPermisoOpcionesDeCeldaMoverGeneral,
  ] = React.useState(false);
  const [isPermisoServicioGeneral, setIsPermisoServicioGeneral] =
    React.useState(false);

  // Constante para almacenar la cantidad de productos a mover
  const [cantidadMoverProducto, setCantidadMoverProducto] = React.useState("");
  // Codógp dodne se llama a los permisos de el usuario
  const checkPermiso = async () => {
    if (usuario?.token) {
      const resultServicioGeneral = await isPermiso(
        usuario.token,
        "27",
        usuario.id_usuario
      );

      // Actualiza el estado con los resultado
      setIsPermisoServicioGeneral(resultServicioGeneral);
    }
  };

  React.useEffect(() => {
    const obtenerCambioPrecio = async () => {
      if (usuario?.token) {
        // Obtener alro de oneda de cambio
        setCambioMoneda(await getValorMonedaUSD(usuario.token));
      }
    };
    checkPermiso();
    obtenerCambioPrecio();
  }, []);

  React.useEffect(() => {
    // Actualiza los elementos mostrados al cambiar de página
    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    // Limpia los elementos actuales antes de actualizar
    setDisplayedItems([]); // Limpia los elementos de la tabla
    setTimeout(() => {
      setDisplayedItems(items.slice(from, to)); // Muestra los nuevos elementos después de un breve intervalo
    }, 0); // Opcional: puedes ajustar este tiempo si quieres un pequeño retraso visual
  }, [page, items, itemsPerPage]);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 0 && newPage * itemsPerPage < items.length) {
      setPage(newPage); // Cambia de página si es válido
    }
  };

  // Este métodod devuelve el mensaje el fodo de la tabla con los parámetros requeridos
  const mensajeOfEndTable = () => {
    let mensaje = "Importes totales minoristas filtrados:  ";
    let sumaMinoristaUSD = 0;
    let sumaMayoristaUSD = 0;
    let sumaTransferencias = 0;

    items.forEach((item) => {
      if (!item.devuelto) {
        sumaTransferencias += parseFloat(item.cantidad_transferida);
        if (parseInt(item.id_Tipo_servicio) === 25) {
          sumaMayoristaUSD +=
            parseFloat(item.precio) *
            (item.cantidad ? parseInt(item.cantidad ?? "0") : 0);
        } else {
          sumaMinoristaUSD +=
            parseFloat(item.precio) *
            (parseInt(item.id_Tipo_servicio) === 2
              ? item.cantidad
                ? parseInt(item.cantidad ?? "0")
                : 0
              : 1); //
        }
      }
    });

    mensaje += `CUP: ${(
      sumaMinoristaUSD * cambioMoneda
    ).toFixed(0)}      Importes mayoristas filtrados:  CUP: ${(
      sumaMayoristaUSD * cambioMoneda
    ).toFixed(0)} `;
    mensaje += `      Transferencias CUP: ${sumaTransferencias}`;
    return String(mensaje);
  };
  const mensajeOfEndTableGanancia = () => {
    let mensaje = "Suma de ganancias por servicios prestados ";
    let sumaGanancia = 0;

    items.forEach((item) => {
      if (
        parseInt(item.id_Tipo_servicio) === 2 ||
        parseInt(item.id_Tipo_servicio) === 25
      ) {
        sumaGanancia +=
          ((parseFloat(item.precio) * cambioMoneda) -
            parseFloat(item.costo) +
            parseFloat(item.costo_tipo_servicio)) *
          (item.cantidad ? parseInt(item.cantidad ?? "0") : 0);
      } else {
        sumaGanancia +=
          (parseFloat(item.precio) * cambioMoneda) -
          parseFloat(item.costo) +
          parseFloat(item.costo_tipo_servicio);
      }
    });

    mensaje += `    CUP: ${(sumaGanancia).toFixed(0)}`;

    return String(mensaje);
  };

  // Auxliliar para ordenar entradas
  const sortEntradasAux = (column: string) => {
    let aux = "";

    // Lógica para determinar el criterioOrden
    if (column === "Fecha") {
      aux = "option3";
    } else if (column === "Nombre Cliente") {
      aux = "option4";
    } else if (column === "Precio") {
      aux = "option5";
    }

    // Llamamos a setSortProductos con el nuevo valor
    setSortServicios({
      items: items,
      criterioOrden: aux,
      tipoOrden: "option1", // Alterna entre "option1" y "option2"
    });
  };

  // Función para mostrar las columnas de la tabla
  const showTableColumns = () => {
    return (
      <DataTable.Header>
        {columns.map((column, index) => (
          <DataTable.Title
            key={index}
            style={[
              styles.headerColumn,
              {
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
            numeric={index > 1}
          >
            <Text
              style={
                isMobile ? styles.headerTextMovil : styles.headerTextDesktop
              }
            >
              {column}
              {(column === "Nombre Cliente" ||
                column === "Precio" ||
                column === "Fecha") && (
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.azul_Suave,
                    marginLeft: 10, // Cambiar porcentaje a píxeles o usar un valor numérico para más control
                    width: 24, // Cambia este tamaño a un valor fijo que funcione bien visualmente
                    height: 24, // Asegúrate de que tenga tamaño consistente
                    justifyContent: "center", // Centrar contenido del botón
                    alignItems: "center", // Centrar contenido del botón
                    borderRadius: 6, // Para darle forma de botón circular si lo deseas
                    marginBottom: 4, // Elevar el botón del borde inferior
                    paddingTop: 2, // Ajustar ligeramente la posición interna del contenido
                  }}
                  onPress={() => sortEntradasAux(column)}
                >
                  <Image
                    source={require("../images/ordenar.png")}
                    style={{ width: "100%", height: "100%" }}
                  />
                </TouchableOpacity>
              )}
            </Text>
          </DataTable.Title>
        ))}
      </DataTable.Header>
    );
  };
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 1.5,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const [idEntradaOption, setIdEntradaOption] = React.useState("");
  const [option, setOption] = React.useState("");
  // Capturar el id del producto que se quiere hacer algo con el
  // Función para abrir/cerrar el modal
  const toggleModal = (id_producto: string) => {
    setIdEntradaOption(id_producto);
    setModalVisible(!isModalVisible);
  };
  const toggleModalOption = (option: string) => {
    setOption(option);
    setModalVisible(!isModalVisible);
    if (option === "Modificar") {
      setModalEntradasDates({
        id_entrada: idEntradaOption,
        isAddEntrada: true,
        fileEditable: true,
        isModificarEntrada: false,
      });
      if (usuario?.token) {
        const result = ""; // Quieri para todas las tiendas en las que no se encuentra el usuario
      }
    } else if (option === "Eliminar") {
      setModalEliminarVisible(!isModalEliminarVisible);
    } else if (option == "Mover") {
      setModalMoverVisible(!isModalMoverVisible);
    }
  };

  const auxDeleteProductoById = async () => {
    const aux = await deleteProductoById();
    setModalEliminarVisible(!isModalEliminarVisible);
    if (aux) {
      const nuevosProductos = displayedItems.filter(
        (producto) => producto.id_Cliente !== idEntradaOption
      );
      setDisplayedItems(nuevosProductos);
      setModalMensaje("Producto eliminado con éxito");
      setModalMensajeView(true);
    } else {
      setModalMensaje(
        "ERROR AL ELIMINAR: Ya se han echo operaciones con el producto o ya está en una tieda"
      );
      setModalMensajeView(true);
    }
  };
  const deleteProductoById = async () => {
    if (usuario?.token) {
      const result = await isProductoInTienda(
        usuario.token,
        idEntradaOption,
        usuario.id_tienda
      );
      if (result == 0) {
        const auxDelete = await deleteProducto(usuario.token, idEntradaOption);
        if (auxDelete) {
          return true;
        } else {
          return false;
        }
      } else {
        console.log("Huvo un problema al comprobar la tienda del producto");
        return false;
      }
    }
  };

  if (isMobile) {
    return (
      <View style={containterStyles}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <DataTable style={{ width: "150%" }}>
            {showTableColumns()}

            {displayedItems.map((item) => (
              <DataTable.Row
                key={item.id_Servicio}
                onPress={() => detailsModalView(item.id_Servicio)}
                style={[
                  { justifyContent: "space-around" }, // Estilo base
                  item.id_Deuda === null && {
                    borderWidth: 2,
                    borderColor: "red",
                  }, // Estilo condicional
                ]}
              >
                {/* Primera celda - Nombre Cliente*/}
                <DataTable.Cell
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Text
                    style={{
                      flexWrap: "wrap",
                      width: "100%",
                      textAlign: "center", // Cambiado a 'center' para centrar el texto
                    }}
                    numberOfLines={2} // Limita a 2 líneas
                  >
                    {item.nombreCliente}
                  </Text>
                </DataTable.Cell>

                {/* Segunda celda - Nombre Tienda */}
                <DataTable.Cell
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Text
                    style={{
                      flexWrap: "wrap",
                      width: "100%",
                      textAlign: "center", // Cambiado a 'center' para centrar el texto
                    }}
                    numberOfLines={2} // Limita a 2 líneas
                  >
                    {item.nombreTienda}
                  </Text>
                </DataTable.Cell>

                {/* Tercera celda - Precio USD */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar contenido
                >
                  {item.nombreTipoServicio}
                </DataTable.Cell>

                {/* Cuarta celda - Precio Producto */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text>{item.nombreProducto ? item.nombreProducto : ""}</Text>
                </DataTable.Cell>

                {/* Cuarta celda - Cantidad Producto */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text>{item.cantidad ? item.cantidad : ""}</Text>
                </DataTable.Cell>

                {/* Cuarta celda - Precio CUP */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text
                    style={{
                      color: item.devuelto ? Colors.gris_claro : Colors.negro,
                    }}
                  >
                    {(item.cantidad)? ((parseFloat(item.precio)) * cambioMoneda).toFixed(0) : ""}
                  </Text>
                </DataTable.Cell>

                {/* Cuarta celda - Precio CUP */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text
                    style={{
                      color: item.devuelto ? Colors.gris_claro : Colors.negro,
                    }}
                  >
                    {(item.cantidad)? (((parseFloat(item.precio) * parseInt(item.cantidad)) * cambioMoneda).toFixed(0)) : (parseFloat(item.precio) * cambioMoneda).toFixed(0)}
                  </Text>
                </DataTable.Cell>

                {/* Quinta celda - Fecha */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text>{item.fecha.split("T")[0]}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            {/* Modal con las opciones de Mover, Modificar, Eliminar */}
            <Modal
              transparent={true}
              visible={isModalVisible}
              animationType="fade"
              onRequestClose={() => toggleModal("")}
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
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
                  >
                    Opciones
                  </Text>

                  {isPermisoOpcionesDeCeldaModificar && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.azul_Oscuro,
                        flex: 1,
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 10,
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center", // Alinea el contenido al inicio del botón
                      }}
                      onPress={() => {
                        toggleModalOption("Modificar");
                      }}
                    >
                      <Image
                        source={require("../images/edit.png")}
                        style={{
                          height: 26, // Ajusta el tamaño según lo necesites
                          width: 26, // Ajusta el tamaño según lo necesites
                          marginRight: 10, // Espacio entre la imagen y el texto
                        }}
                      />
                      <Text style={{ color: "white", fontSize: 16 }}>
                        Modificar
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isPermisoOpcionesDeCeldaEliminar && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.rojo_oscuro,
                        flex: 1,
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 10,
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center", // Alinea el contenido al inicio del botón
                      }}
                      onPress={() => {
                        toggleModalOption("Eliminar");
                      }}
                    >
                      <Image
                        source={require("../images/delete.png")}
                        style={{
                          height: 26, // Ajusta el tamaño según lo necesites
                          width: 26, // Ajusta el tamaño según lo necesites
                          marginRight: 10, // Espacio entre la imagen y el texto
                        }}
                      />
                      <Text style={{ color: "white" }}>Eliminar</Text>
                    </TouchableOpacity>
                  )}

                  {(isPermisoOpcionesDeCeldaMoverGeneral ||
                    isPermisoOpcionesDeCeldaMoverLocal) && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.azul_Claro,
                        flex: 1,
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 10,
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center", // Alinea el contenido al inicio del botón
                      }}
                      onPress={() => {
                        toggleModalOption("Mover");
                      }}
                    >
                      <Image
                        source={require("../images/mover.png")}
                        style={{
                          height: 26, // Ajusta el tamaño según lo necesites
                          width: 26, // Ajusta el tamaño según lo necesites
                          marginRight: 10, // Espacio entre la imagen y el texto
                        }}
                      />
                      <Text style={{ color: "white" }}>Mover</Text>
                    </TouchableOpacity>
                  )}

                  {/* Botón para cerrar el modal */}
                  <TouchableOpacity
                    onPress={() => toggleModal("")}
                    style={{ marginTop: 20, alignItems: "center" }}
                  >
                    <Text style={{ color: Colors.azul_Oscuro }}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Modal para comprbar el Modificar */}
            <Modal
              transparent={true}
              visible={isModalModificarVisible}
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
                  <Text>
                    {idEntradaOption}
                    {option}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      setModalModificarVisible(!isModalModificarVisible)
                    }
                    style={{ marginTop: 20, alignItems: "center" }}
                  >
                    <Text style={{ color: Colors.azul_Oscuro }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Modal para el Eliminar*/}
            <Modal
              transparent={true}
              visible={isModalEliminarVisible}
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
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
                  >
                    ¿Estás seguro de que deseas eliminar este producto?
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
                      onPress={() => auxDeleteProductoById()}
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
                        setModalEliminarVisible(!isModalEliminarVisible)
                      }
                    >
                      <Text style={{ color: "white" }}>No</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setModalEliminarVisible(!isModalEliminarVisible)
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
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
                  >
                    Mover Producto a Tienda
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

                  <Text
                    style={{ fontSize: 16, marginBottom: 5, marginTop: 10 }}
                  >
                    Tiendas para mover los productos
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    {/* Este View se asegura que la tabla ocupe el 100% */}
                    <MyDateTableModalDataMoverTiendas
                      columns={columnasParaLaTablaMoverProducto}
                      items={tiendasByProducto} // Asegura que la tabla ocupe el 100% del ancho del contenedor
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => alert("Not Suport yet")}
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
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 20,
                    }}
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
                    onPress={() => navigation.replace("Servicios")}
                  >
                    <Text style={{ color: "white" }}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text>{mensajeOfEndTable()}</Text>
            </View>

            {(parseInt(usuario?.id_rol) === 1 ||
              parseInt(usuario?.id_rol) === 2) && (
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text>{mensajeOfEndTableGanancia()}</Text>
              </View>
            )}

            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButtonMovil,
                  page === 0 && styles.disabledButton,
                ]}
                onPress={() => handleChangePage(page - 1)}
                disabled={page === 0} // Desactiva el botón si es la primera página
              >
                <Text style={styles.paginationLabel}>Anterior</Text>
              </TouchableOpacity>

              <Text style={styles.paginationLabel}>
                {`${page * itemsPerPage + 1}-${Math.min(
                  (page + 1) * itemsPerPage,
                  items.length
                )} de ${items.length}`}
              </Text>

              <TouchableOpacity
                style={[
                  styles.paginationButtonMovil,
                  (page + 1) * itemsPerPage >= items.length &&
                    styles.disabledButton,
                ]}
                onPress={() => handleChangePage(page + 1)}
                disabled={(page + 1) * itemsPerPage >= items.length} // Desactiva si es la última página
              >
                <Text style={styles.paginationLabel}>Próxima</Text>
              </TouchableOpacity>
            </View>
          </DataTable>
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={containterStyles}>
        <DataTable>
          {showTableColumns()}

          {displayedItems.map((item) => {
            return (
              <DataTable.Row
                key={item.id_Servicio}
                onPress={() => detailsModalView(item.id_Servicio)}
              >
                {/* Primera celda - Nombre Cliente*/}
                <DataTable.Cell style={styles.handerRow}>
                  <Text
                    style={{
                      flexWrap: "wrap",
                      width: "100%",
                      textAlign: "center", // Cambiado a 'center'
                    }}
                    numberOfLines={2}
                  >
                    {item.nombreCliente}
                  </Text>
                </DataTable.Cell>

                {/* Segunda celda - Nombre Tienda */}
                <DataTable.Cell style={styles.handerRow}>
                  <Text
                    style={{
                      flexWrap: "wrap",
                      width: "100%",
                      textAlign: "center", // Cambiado a 'center'
                    }}
                    numberOfLines={2}
                  >
                    {item.nombreTienda}
                  </Text>
                </DataTable.Cell>

                {/* Tercera celda - Nombre Del Tipo de Servicio */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" }, // Centrar contenido
                  ]}
                >
                  {item.nombreTipoServicio}
                </DataTable.Cell>

                {/* Cuarta celda - Precio Producto */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text>{item.nombreProducto ? item.nombreProducto : ""}</Text>
                </DataTable.Cell>

                {/* Cuarta celda - Cantidad Producto */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text>{item.cantidad ? item.cantidad : ""}</Text>
                </DataTable.Cell>

                {/* Cuarta celda - Precio CUP */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text
                    style={{
                      color: item.devuelto ? Colors.gris_claro : Colors.negro,
                    }}
                  >
                    {(item.cantidad)? ((parseFloat(item.precio)) * cambioMoneda).toFixed(0) : ""}
                  </Text>
                </DataTable.Cell>

                {/* Cuarta celda - Precio CUP */}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text
                    style={{
                      color: item.devuelto ? Colors.gris_claro : Colors.negro,
                    }}
                  >
                    {(item.cantidad)? (((parseFloat(item.precio) * parseInt(item.cantidad)) * cambioMoneda).toFixed(0)) : (parseFloat(item.precio) * cambioMoneda).toFixed(0)}
                  </Text>
                </DataTable.Cell>

                {/* Quinta celda - Fecha*/}
                <DataTable.Cell
                  numeric
                  style={[
                    styles.handerRow,
                    { justifyContent: "center", alignItems: "center" },
                  ]} // Centrar el texto
                >
                  <Text>{item.fecha.split("T")[0]}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}

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
                  width: 400,
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
                  onPress={() => navigation.replace("Productos")}
                >
                  <Text style={{ color: "white" }}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text>{mensajeOfEndTable()}</Text>
          </View>

          {(parseInt(usuario?.id_rol) === 1 ||
            parseInt(usuario?.id_rol) === 2) && (
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text>{mensajeOfEndTableGanancia()}</Text>
            </View>
          )}

          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButtonDesktop,
                page === 0 && styles.disabledButton,
              ]}
              onPress={() => handleChangePage(page - 1)}
              disabled={page === 0} // Desactiva el botón si es la primera página
            >
              <Text style={styles.paginationLabel}>Anterior</Text>
            </TouchableOpacity>

            <Text style={styles.paginationLabel}>
              {`${page * itemsPerPage + 1}-${Math.min(
                (page + 1) * itemsPerPage,
                items.length
              )} of ${items.length}`}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButtonDesktop,
                (page + 1) * itemsPerPage >= items.length &&
                  styles.disabledButton,
              ]}
              onPress={() => handleChangePage(page + 1)}
              disabled={(page + 1) * itemsPerPage >= items.length} // Desactiva si es la última página
            >
              <Text style={styles.paginationLabel}>Próxima</Text>
            </TouchableOpacity>
          </View>
        </DataTable>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  containerDesktop: {
    flex: 1,
    padding: 10,
    marginTop: "2%",
  },
  containerMovil: {
    flex: 1,
    marginTop: "2%",
    marginBottom: "20%",
  },
  headerTextDesktop: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerTextMovil: {
    fontSize: 12,
    fontWeight: "bold",
  },
  headerColumn: {
    justifyContent: "center",
  },
  handerRow: {
    fontSize: 14,
    justifyContent: "center",
    fontWeight: "bold",
    width: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  paginationButtonDesktop: {
    backgroundColor: Colors.azul_Suave,
    borderRadius: 20,
    width: "15%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul_Suave,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 3,
  },
  paginationButtonMovil: {
    backgroundColor: Colors.azul_Suave,
    borderRadius: 20,
    width: "30%",
    height: 40,
    marginHorizontal: "3%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul_Suave,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 3,
  },
  paginationLabel: {
    fontSize: 14,
    color: Colors.negro,
  },
  disabledButton: {
    backgroundColor: Colors.blanco_Suave,
  },
});
