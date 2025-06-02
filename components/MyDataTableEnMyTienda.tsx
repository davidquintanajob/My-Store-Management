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
import { useModalProductsDates } from "../contexts/AuxiliarContextFromModalProductsDates";
import {
  MyDateTableModalShowDatesTienda,
  TiendaShowModal,
} from "./MyDateTableModalShowDatesTienda";
import { ProveedoresShowModal } from "./MyDateTableModalShowDateProveedores";
import { useSortProductos } from "../contexts/AuxiliarSortProductos";
import { useUsuario } from "../contexts/UsuarioContext";
import { isPermiso } from "../services/RolPermisosAndRol";
import {
  getAllTiendas,
  getAllTiendasByProduct,
  getTiendaById,
  isProductoInTienda,
} from "../services/TiendaServices";
import { deleteProducto, moverProducto } from "../services/ProductoServices";
import CustomTextImputSearch from "./CustomTextImputSearch";
import {
  MyDateTableModalDataMoverTiendas,
  TiendaMoverShowModal,
} from "./MyDateTableModalDataMoverTiendas";
import { TiendaPiker } from "./MyDateTableTiendas";
import CustomDropDownPikerFromMover from "./CustomDropDownPikerFromMover";
import { addNewMovimiento } from "../services/MovimientosServices";
import { Producto } from "./MyDateTableProductos";
import { getValorMonedaUSD } from "../services/MonedaService";

interface Props {
  items: Producto[];
  columns: string[];
  isMobile: boolean;
  columnasMyDateTableProveedorModal: string[];
  columnasMyDateTableTiendaModal: string[];
  tiendasByProducto: TiendaShowModal[];
  proveedorByProducto: ProveedoresShowModal[];
}

export const MyDateTableEnMyTienda: React.FC<Props> = ({
  items,
  columns,
  isMobile,
}) => {
  const navigation = useNavigation();
  const [scale] = React.useState(new Animated.Value(1));
  const { modalProductsDates, setModalProductsDates } = useModalProductsDates();
  const { sortProductos, setSortProductos } = useSortProductos();
  const { usuario, setUsuario } = useUsuario();

  // Estilos condicionales
  const containterStyles = isMobile
    ? styles.containerMovil
    : styles.containerDesktop;

  const [cambioMoneda, setCambioMoneda] = React.useState(0);
  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [displayedItems, setDisplayedItems] = React.useState<Producto[]>([]); // Estado para los elementos mostrados

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isModalModificarVisible, setModalModificarVisible] =
    React.useState(false);
  const [isModalEliminarVisible, setModalEliminarVisible] =
    React.useState(false);
  const [isModalMoverVisible, setModalMoverVisible] = React.useState(false);
  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [isModalMesajeMoverVisible, setModalMesajeMoverVisible] =
    React.useState(false);

  const [modalMensaje, setModalMensaje] = React.useState("");

  const columnasParaLaTablaMoverProducto = ["Nombre"];
  const [tiendaByProductoSelected, setTiendaByProductoSelected] =
    React.useState<string | null>("");
  const [tiendasByProducto, setTiendasByProducto] = React.useState<
    TiendaPiker[]
  >([
    { value: "1", label: "Tienda 1" },
    { value: "2", label: "Tienda 2" },
    { value: "3", label: "Tienda 3" },
  ]);

  const detailsModalView = (id_producto: string) => {
    setModalProductsDates({
      id_producto: id_producto,
      isAddProducto: true,
      fileEditable: false,
      isModificarProducto: false,
      isAddProductoShowProveedoresTiendas: true,
      isAddProductoShowProveedores: true,
    });
  };

  // Controlar el doble clic del boton
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

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

  // Constante para almacenar la cantidad de productos a mover
  const [tiendaMoverDesde, setTiendaMoverDesde] = React.useState("");
  const [cantidadMoverProducto, setCantidadMoverProducto] = React.useState("");
  const [nombreProductoOption, setNombreProductoOption] = React.useState("");
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

  const moverProductoFunction = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    if (usuario?.token) {
      await moverProducto(
        usuario.token,
        idProductoOption,
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
        idProductoOption,
        usuario.id_usuario
      );

      setModalMensaje(
        `Se movieron ${cantidadMoverProducto} de ${nombreProductoOption} desde la tienda ${tiendaNombreEspecificaDesde} a ${tiendaNombreEspecificaHasta}`
      );
      setModalMesajeMoverVisible(false);
      setModalMensajeView(true);
    }
  };

  const moverProdcutoFunctionValidarCampos = async () => {
    if (isButtonDisabled) return; // Si el botón está deshabilitado, no hacer nada

    setIsButtonDisabled(true); // Deshabilitar el botón

    let flag: boolean = true;
    let validarCampos: string = "Error. Comprueve los siguientes parámetros:\n";
    let cantidadDelProductoEnLaTiendaDesde: number = 0;
    // Obtener cantidad del producto en la tienda especifica desde dodne se quiere mover
    if (usuario?.token) {
      const result = await isProductoInTienda(
        usuario.token,
        idProductoOption,
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
    if (cantidadMoverProducto === "") {
      flag = false;
      validarCampos += "-La cantidad a mover no puede ser vacio.\n";
    } else if (
      parseInt(cantidadMoverProducto) > cantidadDelProductoEnLaTiendaDesde
    ) {
      // Comprobar que la cantidad que se desea mover no es mayor que la cantidad que existe en la tienda
      flag = false;
      validarCampos +=
        "-La cantidad a mover es mayor que la cantidad que existe en la tienda.\n";
    }
    if (isPermisoOpcionesDeCeldaMoverGeneral && tiendaMoverDesde === "") {
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
      setModalMesajeMoverVisible(true);
    } else {
      setModalMensaje(validarCampos);
      setModalMoverVisible(false);
      setModalMensajeView(true);
    }
  };

  // Cargar datos de las tiendas para mover un producto
  const cargarDatosTiendaParaMover = async () => {
    if (usuario?.token != undefined) {
      const result = await getAllTiendas(usuario.token);
      const resultTiendas = await getAllTiendasByProduct(
        usuario.token,
        idProductoOption
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
        if (!isPermisoOpcionesDeCeldaMoverGeneral) {
          setTiendaMoverDesde(usuario.id_tienda);
        }

        alert(`Datos cargador: ${auxDataTiendasProducto.length}`);
        setTiendasByProductoDesde(auxDataTiendasProducto);
        setTiendasByProductoHasta(allTiendasMapeados);
      }
    }
  };

  // Codógp dodne se llama a los permisos de el usuario
  React.useEffect(() => {
    const checkPermiso = async () => {
      if (usuario?.token) {
        const resultPermisoButonOptionModificar = await isPermiso(
          usuario.token,
          "7",
          usuario.id_usuario
        );
        const resultPermisoButonOptionEliminar = await isPermiso(
          usuario.token,
          "8",
          usuario.id_usuario
        );
        const resultPermisoButonOptionMoverLocal = await isPermiso(
          usuario.token,
          "30",
          usuario.id_usuario
        );
        const resultPermisoButonOptionMoverGeneral = await isPermiso(
          usuario.token,
          "31",
          usuario.id_usuario
        );

        // Actualiza el estado con los resultado
        setIsPermisoOpcionesDeCeldaModificar(resultPermisoButonOptionModificar);
        setIsPermisoOpcionesDeCeldaEliminar(resultPermisoButonOptionEliminar);
        setIsPermisoOpcionesDeCeldaMoverLocal(
          resultPermisoButonOptionMoverLocal
        );
        setIsPermisoOpcionesDeCeldaMoverGeneral(
          resultPermisoButonOptionMoverGeneral
        );
        setIsPermisoOpcionesDeCelda(
          resultPermisoButonOptionEliminar ||
            resultPermisoButonOptionModificar ||
            resultPermisoButonOptionMoverLocal ||
            resultPermisoButonOptionMoverGeneral
        );

        // Cargar cambio de moneda
        setCambioMoneda(await getValorMonedaUSD(usuario.token));
      }
    };

    checkPermiso(); // Llama a la función al montar el componente
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

  // Función para comunicarse con el context de Sortroductos para ordenar luego
  const sortProductosAux = (column: string) => {
    let aux = "";
    if (column === "Nombre") {
      aux = "option3";
    } else if (
      column === "PrecioUSD" ||
      column === "PrecioCUP" ||
      column === "Precio"
    ) {
      aux = "option4";
    } else if (column === "Cantidad Total" || column === "Cantidad") {
      aux = "option5";
    }
    setSortProductos({
      items: items,
      criterioOrden: aux,
      tipoOrden: "option1",
    });
  };
  // Función para mostrar las columnas de la tabla
  const showTableColumns = () => {
    return (
      <DataTable.Header style={{ justifyContent: "space-between" }}>
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
            </Text>
            {(column === "PrecioUSD" ||
              column === "Nombre" ||
              column === "Precio" ||
              column === "PrecioCUP" ||
              column === "Cantidad" ||
              column === "Cantidad Total") && (
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
                onPress={() => sortProductosAux(column)}
              >
                <Image
                  source={require("../images/ordenar.png")}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
            )}
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

  const [idProductoOption, setIdProductoOption] = React.useState("");
  const [option, setOption] = React.useState("");
  // Capturar el id del producto que se quiere hacer algo con el
  // Función para abrir/cerrar el modal
  const toggleModal = (id_producto: string) => {
    setIdProductoOption(id_producto);
    setModalVisible(!isModalVisible);
  };
  const toggleModalOption = (option: string) => {
    setOption(option);
    setModalVisible(!isModalVisible);
    if (option === "Modificar") {
      setModalProductsDates({
        id_producto: idProductoOption,
        isAddProducto: true,
        fileEditable: true,
        isModificarProducto: true,
        isAddProductoShowProveedoresTiendas: true,
        isAddProductoShowProveedores: true,
      });
      if (usuario?.token) {
        const result = ""; // Quieri para todas las tiendas en las que no se encuentra el usuario
      }
    } else if (option === "Eliminar") {
      setModalEliminarVisible(!isModalEliminarVisible);
    } else if (option == "Mover") {
      alert("Entró a mover");
      cargarDatosTiendaParaMover();
      setModalMoverVisible(!isModalMoverVisible);
    }
  };

  const auxDeleteProductoById = async () => {
    const aux = await deleteProductoById();
    setModalEliminarVisible(!isModalEliminarVisible);
    if (aux) {
      const nuevosProductos = displayedItems.filter(
        (producto) => producto.id_Producto !== idProductoOption
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
        idProductoOption,
        usuario.id_tienda
      );
      if (result == 0) {
        const auxDelete = await deleteProducto(usuario.token, idProductoOption);
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
                key={item.id_Producto}
                onPress={() => detailsModalView(item.id_Producto)}
                style={{ justifyContent: "space-around" }}
              >
                <DataTable.Cell style={styles.handerRow}>
                  {item.sku}
                </DataTable.Cell>
                <DataTable.Cell style={styles.handerRow}>
                  <Text
                    style={{
                      textAlign: "center",
                      textAlignVertical: "center",
                      width: "100%",
                      flexWrap: "wrap",
                    }}
                    numberOfLines={2} // Limita a 2 líneas
                  >
                    {item.nombre}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric style={styles.handerRow}>
                  {(parseFloat(item.precioUSD) * cambioMoneda).toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell numeric style={styles.handerRow}>
                  <Text>{item.cantidadTotal} </Text>
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
                    {idProductoOption}
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
                    onPress={() => navigation.replace("Productos")}
                  >
                    <Text style={{ color: "white" }}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

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
                key={item.id_Producto}
                onPress={() => detailsModalView(item.id_Producto)}
              >
                <DataTable.Cell style={styles.handerRow}>
                  {item.sku}
                </DataTable.Cell>
                <DataTable.Cell style={styles.handerRow}>
                  <Text
                    style={{
                      textAlign: "center",
                      textAlignVertical: "center",
                      width: "100%",
                      flexWrap: "wrap",
                    }}
                    numberOfLines={2} // Limita a 2 líneas
                  >
                    {item.nombre}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric style={styles.handerRow}>
                  {(parseFloat(item.precioUSD) * cambioMoneda).toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell numeric style={styles.handerRow}>
                  <Text>{item.cantidadTotal} </Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}

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
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
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
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
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
                  {`Estas seguro de que deseas mover una cantidad de ${cantidadMoverProducto} del producto ${nombreProductoOption} desde la tienda ${tiendaNombreEspecificaDesde} a ${tiendaNombreEspecificaHasta}?`}
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
                  {`Mover Producto "${nombreProductoOption}" a una Tienda\ncon una cantidad de ${cantidadMoverProducto} en ${tiendaNombreEspecificaDesde}`}
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
                  {isPermisoOpcionesDeCeldaMoverGeneral && (
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
                  disabled={isButtonDisabled}
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
