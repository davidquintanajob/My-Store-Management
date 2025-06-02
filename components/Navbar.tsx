import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  useWindowDimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "../styles/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../styles/Colors";
import CustomButtonNavbar from "./CustomButtonLogin";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useUsuario } from "../contexts/UsuarioContext";
import { isPermiso } from "../services/RolPermisosAndRol";
import "../styles/ScrollView.css";
import { useSelectedButon } from "../contexts/globalButonNavbarSelected";
import CustomDropdownProvicional from "./CustomButonLoginOptions";
import CustomTextImputSearch from "../components/CustomTextImputSearch";
import { cambiarContrasennaUsuarios } from "../services/UsuarioServices";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import { usePermisosUsuario as usePermisosUsuarioNavbar } from "../contexts/PermisosNavbarContext";
import { getEntradasPorVencer } from "../services/EntradaServices";

const Navbar = () => {
  // Para poder navegar entre vistas
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  // Estado para controlar si el menú está expandido
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado
  const [modalUsuarioDetails, setModalUsuarioDetails] = useState(false);

  const [contrasennaVieja, setContrasennaVieja] = useState("");
  const [contrasennaNueva1, setContrasennaNueva1] = useState("");
  const [contrasennaNueva2, setContrasennaNueva2] = useState("");

  const [hasPermisoViewProducto, setHasPermisoViewProducto] = useState(false);
  const [hasPermisoViewTipoServicio, setHasPermisoViewTipoServicio] =
    useState(false);
  const [hasPermisoViewUsuario, setHasPermisoViewUsuario] = useState(false);
  const [hasPermisoViewTienda, setHasPermisoViewTienda] = useState(false);
  const [hasPermisoViewAccion, setHasPermisoViewAccion] = useState(false);
  const [hasPermisoViewEntrada, setHasPermisoViewEntrada] = useState(false);
  const [hasPermisoViewProveedor, setHasPermisoViewProveedor] = useState(false);
  const [hasPermisoViewMovimiento, setHasPermisoViewMovimiento] =
    useState(false);
  const [hasPermisoViewCliente, setHasPermisoViewCliente] = useState(false);
  const [hasPermisoViewGarantia, setHasPermisoViewGarantia] = useState(false);
  const nombreProductoRef = useRef(null);
  const { setUsuario, usuario } = useUsuario();
  const { permisosUsuarioNavbar, setPermisosUsuarioNavbar } =
    usePermisosUsuarioNavbar();
  const { setSelectedButon, selectedButon } = useSelectedButon();

  const [isModalMensajeView, setModalMensajeView] = React.useState(false);
  const [notificacionesPendientes, setNotificacionesPendientes] = useState(0);
  const [entradasProximasVencer, setEntradasProximasVencer] = useState<
    unknown[]
  >([]);
  const [modalMensaje, setModalMensaje] = React.useState("");
  const [isReflechModalMensajeView, setReflechModalMensajeView] =
    React.useState(false);
  const [isModalChekEliminarEntrada, setIsModalChekEliminarEntrada] =
    useState(false);
  const [isModalChekVisible, setIsModalChekVisible] = useState(false);
  const [mesajeModalChek, setMesajeModalChek] = useState("");

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (value: any) => {
    setSelectedButon({
      butonSelected: "Administración",
    });
    if (value === "1") {
      navigation.navigate("Usuarios");
    } else if (value === "3") {
      navigation.navigate("Tiendas");
    } else if (value === "2") {
      navigation.navigate("Acciones");
    } else if (value === "4") {
      navigation.navigate("Permisos");
    } else if (value === "5") {
      navigation.navigate("Tipo de Servicio");
    } else if (value === "6") {
      navigation.navigate("Cambiar Moneda");
    }
    setSelectedOption(value);
  };

  const [options, setOptions] = useState<
    { label: string; value: string; image: any }[]
  >([]);
  useEffect(() => {
    const checkPermiso = async () => {
      if (usuario?.token) {
        setHasPermisoViewEntrada(
          permisosUsuarioNavbar?.resultEntradaView ?? false
        );
        setHasPermisoViewProducto(
          permisosUsuarioNavbar?.resultProductoView ?? false
        );
        setHasPermisoViewProveedor(
          permisosUsuarioNavbar?.resultProveedorView ?? false
        );
        setHasPermisoViewAccion(
          permisosUsuarioNavbar?.resultAccionesView ?? false
        );
        setHasPermisoViewMovimiento(
          (permisosUsuarioNavbar?.resultMovimientoLocalView ?? false) ||
            (permisosUsuarioNavbar?.resultMovimientoGeneralView ?? false)
        );
        setHasPermisoViewUsuario(
          (permisosUsuarioNavbar?.resultAgregarUsuario ?? false) ||
            (permisosUsuarioNavbar?.resultModificarUsuario ?? false) ||
            (permisosUsuarioNavbar?.resultEliminarUsuario ?? false)
        );
        setHasPermisoViewTienda(parseInt(usuario.id_usuario) === 1);
        setHasPermisoViewCliente(
          permisosUsuarioNavbar?.resultClienteView ?? false
        );
        setHasPermisoViewGarantia(
          permisosUsuarioNavbar?.resultGarantiaView ?? false
        );

        const newOptions = [];
        if (
          (permisosUsuarioNavbar?.resultAgregarUsuario ?? false) ||
          (permisosUsuarioNavbar?.resultModificarUsuario ?? false) ||
          (permisosUsuarioNavbar?.resultEliminarUsuario ?? false)
        ) {
          newOptions.push({
            label: "Usuarios",
            value: "1",
            image: require("../images/usuarios.png"),
          });
        }
        if (permisosUsuarioNavbar?.resultAccionesView ?? false) {
          newOptions.push({
            label: "Acciones",
            value: "2",
            image: require("../images/acción.png"),
          });
        }
        if (parseInt(usuario.id_rol) === 1) {
          newOptions.push({
            label: "Tiendas",
            value: "3",
            image: require("../images/tienda.png"),
          });
        }
        /*
        newOptions.push({
          label: "Permisos",
          value: "4",
          image: require("../images/tienda.png")
        })
          */
        if (permisosUsuarioNavbar?.resultTipoServicio) {
          newOptions.push({
            label: "Tipos de Servicios",
            value: "5",
            image: require("../images/Tipo_Servicio.png"),
          });
        }
        if (parseInt(usuario.id_rol) === 1 && false) {
          newOptions.push({
            label: "Cambiar  moneda",
            value: "6",
            image: require("../images/Cambio_moneda.png"),
          });
        }

        // Actualiza el estado de options
        setOptions(newOptions);
      }
    };

    checkPermiso(); // Llama a la función al montar el componente
  }, [permisosUsuarioNavbar]);

  // Estilos condicionales
  const buttonStyles = isMobile ? true : false;
  const buttonsContainerStyles = isMobile
    ? styles.buttonContainterMovile
    : styles.buttonsContainerDesktop;

  const fechaActual = new Date();
  const proximoMes = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth() + 1,
    fechaActual.getDate()
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        // Código que se ejecutará cuando la pantalla esté enfocada
  
        // Llamada a la función asíncrona
        if (usuario?.token && parseInt(usuario.id_rol) !== 4) {
          let result
          if (localStorage.getItem("entradasProximasVencer") === null) {
              result = await getEntradasPorVencer(
              usuario.token,
              proximoMes.toISOString()
            );
            setNotificacionesPendientes(result.length);
            setEntradasProximasVencer(result);
            localStorage.setItem(
              "entradasProximasVencer",
              JSON.stringify(result)
            );
          } else {
            const entradasProximasVencer = JSON.parse(
              localStorage.getItem("entradasProximasVencer")
            );
            setNotificacionesPendientes(entradasProximasVencer.length);
            setEntradasProximasVencer(entradasProximasVencer);
          }
        }
      };
  
      fetchData();
  
      // Si necesitas limpiar algo cuando la pantalla pierde el foco, puedes retornar una función de limpieza
      return () => {
        console.log("La pantalla de Login perdió el foco");
      };
    }, [])
  );

  // Función para cambiar la contraseña
  const changePassword = async () => {
    if (usuario?.token) {
      let flag: boolean = true;
      let validarCampos: string =
        "ERROR AL CAMBIAR LA CONTRASEÑA. Comprueve los siguientes parámetros:\n";

      if (contrasennaNueva1 !== contrasennaNueva2) {
        flag = false;
        validarCampos +=
          "-No ha ingresado bien su contraseña en los campos requeridos.\n";
      }
      if (contrasennaNueva1.length < 6) {
        flag = false;
        validarCampos +=
          "-La contraseña nueva debe tener más de 6 caracteres.\n";
      }
      if (contrasennaNueva1.trim() === "" || contrasennaNueva2.trim() === "") {
        flag = false;
        validarCampos +=
          "-Debe digitar la nueva contraseña en los campos correspondientes.\n";
      }

      if (flag) {
        const result = cambiarContrasennaUsuarios(
          usuario.token,
          contrasennaVieja,
          contrasennaNueva1,
          contrasennaNueva2,
          usuario.nombre_usuario
        );

        const currentDate = new Date();
        const year = String(currentDate.getFullYear());
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
        const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos
        let auxAddAccionUsuarioDescripcion: string = `El usuario ${usuario.nombre} cambió su contraseña.`;
        await addAccionUsuario(
          usuario.token,
          auxAddAccionUsuarioDescripcion,
          `${year}-${month}-${day}`,
          usuario.id_usuario,
          5
        );

        setIsModalChekVisible(false);
        setModalMensaje(`La contraseña se cambió con éxito.`);
        setReflechModalMensajeView(false);
        setModalMensajeView(true);
      } else {
        setModalMensaje(validarCampos);
        setReflechModalMensajeView(false);
        setModalMensajeView(true);
      }
    }
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
        toValue: 300, // Altura máxima cuando esté expandido
        duration: 300, // Duración de la animación en milisegundos
        useNativeDriver: false, // No usar driver nativo
      }).start();
    }
  };

  // Definir el estilo animado para la altura del componente
  const animatedStyle = {
    height: animationValue,
  };
  function botones() {
    return (
      <ScrollView
        horizontal={true}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
        showsHorizontalScrollIndicator={true}
      >
        <View style={buttonsContainerStyles}>
          {hasPermisoViewProducto && (
            <CustomButtonNavbar
              imageSource={require("../images/features.png")}
              text={"En tu Tienda"}
              isSelected={selectedButon?.butonSelected === "Mi Tienda"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Mi Tienda",
                });
                navigation.navigate("Mi Tienda");
              }}
            />
          )}
          {hasPermisoViewProducto && (
            <CustomButtonNavbar
              imageSource={require("../images/product.png")}
              text={"Productos"}
              isSelected={selectedButon?.butonSelected === "Productos"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Productos",
                });
                navigation.navigate("Productos");
              }}
            />
          )}
          {hasPermisoViewProducto && (
            <CustomButtonNavbar
              imageSource={require("../images/public-service.png")}
              text={"Ventas"}
              isSelected={selectedButon?.butonSelected === "Servicios"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Servicios",
                });
                navigation.navigate("Ventas");
              }}
            />
          )}
          {hasPermisoViewMovimiento && (
            <CustomButtonNavbar
              imageSource={require("../images/moving.png")}
              text={"Movimientos"}
              isSelected={selectedButon?.butonSelected === "Movimientos"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Movimientos",
                });
                navigation.navigate("Movimientos");
              }}
            />
          )}
          {/*hasPermisoViewGarantia && (<CustomButtonNavbar
              imageSource={require("../images/reembolso.png")}
              text={"Garantias"}
              isSelected={selectedButon?.butonSelected === "Garantias"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Garantias",
                });
                navigation.navigate("Garantías");
              }}
            />)*/}
          {hasPermisoViewCliente && (
            <CustomButtonNavbar
              imageSource={require("../images/nueva-cuenta.png")}
              text={"Clientes"}
              isSelected={selectedButon?.butonSelected === "Clientes"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Clientes",
                });
                navigation.navigate("Clientes");
              }}
            />
          )}
          {(parseInt(usuario?.id_rol) === 1 ||
            parseInt(usuario?.id_rol) === 2 ||
            parseInt(usuario?.id_rol) === 3
          ) && (
            <CustomButtonNavbar
              imageSource={require("../images/Deudas.png")}
              text={"Deudas"}
              isSelected={selectedButon?.butonSelected === "Deudas"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Deudas",
                });
                navigation.navigate("Deudas");
              }}
            />
          )}
          {hasPermisoViewProveedor && (
            <CustomButtonNavbar
              imageSource={require("../images/gente.png")}
              text={"Proveedores"}
              isSelected={selectedButon?.butonSelected === "Proveedores"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Proveedores",
                });
                navigation.navigate("Proveedores");
              }}
            />
          )}
          {hasPermisoViewEntrada && (
            <CustomButtonNavbar
              imageSource={require("../images/entrada.png")}
              text={"Entradas"}
              isSelected={selectedButon?.butonSelected === "Entradas"}
              onPress={() => {
                setSelectedButon({
                  butonSelected: "Entradas",
                });
                navigation.navigate("Entradas");
              }}
            />
          )}
          {/*<CustomButtonNavbar
            imageSource={require("../images/informe.png")}
            text={"Reportes"}
            onPress={() => {}}
          />*/}
          {(hasPermisoViewUsuario ||
            hasPermisoViewTienda ||
            hasPermisoViewAccion) && (
            <CustomDropdownProvicional
              imageSource={require("../images/gerente.png")} // Ajusta la ruta de la imagen
              text="Administración"
              options={options}
              onSelect={handleSelect}
              isSelected={selectedButon?.butonSelected === "Administración"}
            />
          )}
        </View>
      </ScrollView>
    );
  }

  // Comprobar si se está en desktop o en movil
  if (buttonStyles) {
    return (
      <View style={{ padding: 15 }}>
        <LinearGradient
          colors={[Colors.azul_Claro, Colors.azul_Oscuro]} // Gradiente de azul oscuro a azul claro
          start={[0, 0]}
          end={[1, 0]}
          style={styles.navbarMobile}
        >
          <TouchableOpacity
            onPress={() => setModalUsuarioDetails(!modalUsuarioDetails)}
          >
            <View
              style={{
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                borderWidth: 1,
                borderColor: Colors.blanco,
                borderRadius: 15,
                width: 300,
                height: 60,
                marginVertical: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 20, color: Colors.blanco }}>
                  Usuario
                </Text>
                {notificacionesPendientes > 0 && (
                  <View
                    style={{
                      backgroundColor: Colors.rojo_oscuro,
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: 5,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: Colors.blanco }}>
                      {notificacionesPendientes}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.separatorBlanco} />
              <Text style={{ fontSize: 16, color: Colors.blanco }}>
                Nombre: {usuario?.nombre}
              </Text>
              <Text style={{ fontSize: 16, color: Colors.blanco }}>
                Usuario: {usuario?.nombre_usuario}
              </Text>
              <TouchableOpacity
                style={{
                  width: "90%",
                  height: "45%",
                  marginTop: "5%",
                  backgroundColor: Colors.azul_Suave,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={{ fontSize: 16, color: Colors.blanco }}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.azul_Claro,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 15,
              width: "90%", // Ajusta este valor si es necesario
              height: 40, // Valor fijo para mantener consistencia en la altura
              marginTop: 35, // Valor más exacto en píxeles
              justifyContent: "center",
              paddingHorizontal: 15, // Espaciado interno horizontal para separar el contenido del borde
              shadowColor: "#000",
              shadowOffset: { width: 3, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
            onPress={toggleExpansion}
          >
            <Image
              source={require("../images/menu.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text style={styles.textNavbarMovil}>Opciones de Navegación</Text>
          </TouchableOpacity>
        </LinearGradient>
        {/* Vista animada */}
        {isExpanded && (
          <Animated.View style={[{ overflow: "hidden" }, animatedStyle]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
              {/* Llamada a la función para renderizar los botones */}
              {botones()}
            </ScrollView>
          </Animated.View>
        )}

        {modalUsuarioDetails && (
          <Modal
            transparent={true}
            visible={modalUsuarioDetails}
            animationType="fade"
            onRequestClose={() => setModalUsuarioDetails(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: Colors.rojo_oscuro,
                    borderRadius: 30,
                    height: 40,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setContrasennaVieja("");
                    setContrasennaNueva1("");
                    setContrasennaNueva2("");
                    setModalUsuarioDetails(false);
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
                  Tus Datos
                </Text>

                <ScrollView
                  style={{ width: "100%" }}
                  contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 20,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Tu nombre: {usuario?.nombre}
                    </Text>
                    <Text style={styles.labelTextModalDesktop}>
                      Tu nombre de usuario en el sistema:{" "}
                      {usuario?.nombre_usuario}
                    </Text>
                    <Text style={styles.labelTextModalDesktop}>
                      Tu rol en el sistema: {usuario?.nombre_rol}
                    </Text>
                    <Text style={styles.labelTextModalDesktop}>
                      Tienda en la que trabajas: {usuario?.nombre_tienda}
                    </Text>
                  </View>

                  <View style={styles.separatorNegro} />

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color: Colors.negro, // Color del texto
                        textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                        textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                        textShadowRadius: 2, // Difuminado de la sombra
                      }}
                    >
                      Cambiar Contraseña
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Contraseña Vieja
                    </Text>
                  </View>
                  <CustomTextImputSearch
                    ref={nombreProductoRef}
                    style={styles.textImputModal}
                    cursorColor={Colors.azul_Oscuro}
                    value={contrasennaVieja}
                    onChangeText={setContrasennaVieja}
                    placeholder="Contraseña vieja"
                  />

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Contraseña Nueva
                    </Text>
                  </View>
                  <CustomTextImputSearch
                    ref={nombreProductoRef}
                    style={styles.textImputModal}
                    cursorColor={Colors.azul_Oscuro}
                    value={contrasennaNueva1}
                    onChangeText={setContrasennaNueva1}
                    placeholder="Contraseña nueva"
                  />

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Repita la Nueva Contraseña
                    </Text>
                  </View>
                  <CustomTextImputSearch
                    ref={nombreProductoRef}
                    style={styles.textImputModal}
                    cursorColor={Colors.azul_Oscuro}
                    value={contrasennaNueva2}
                    onChangeText={setContrasennaNueva2}
                    placeholder="Contraseña nueva"
                  />

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
                    onPress={() => {
                      setMesajeModalChek(
                        `Estas seguro que deseas cambiar tu contraseña nueva a ${contrasennaNueva1}`
                      );
                      setIsModalChekVisible(true);
                      setModalUsuarioDetails(!modalUsuarioDetails);
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                      }}
                    >
                      Cambiar Contraseña
                    </Text>
                  </TouchableOpacity>

                  {notificacionesPendientes > 0 && (
                    <View
                      style={{
                        width: "90%",
                        height: "50%",
                        backgroundColor: Colors.blanco_Suave,
                        borderRadius: 15,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 5,
                        marginLeft: 10,
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          color: Colors.negro,
                          textShadowColor: "rgba(0, 0, 0, 0.5)",
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 2,
                        }}
                      >
                        Notificaciones Pendientes
                      </Text>
                      <ScrollView
                        style={{ width: "100%" }}
                        contentContainerStyle={{
                          alignItems: "center",
                          paddingBottom: 20,
                        }}
                      >
                        <View
                          style={{
                            marginBottom: 10,
                            marginLeft: "5%",
                            marginTop: "2%",
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              color: Colors.negro,
                              width: "30%",
                              fontWeight: "bold",
                            }}
                          >
                            Producto
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: Colors.negro,
                              width: "20%",
                              fontWeight: "bold",
                            }}
                          >
                            Tienda
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: Colors.negro,
                              width: "20%",
                              fontWeight: "bold",
                            }}
                          >
                            Días hasta vencimiento
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: Colors.negro,
                              width: "20%",
                              fontWeight: "bold",
                              marginRight: "4%"
                            }}
                          >
                            Fecha de vencimiento
                          </Text>
                        </View>

                        <View style={{
                          width: "100%", // Ancho del separador
                          height: 1, // Altura de la línea (grosor)
                          backgroundColor: Colors.negro, // Color blanco
                        }} />

                        {entradasProximasVencer.map((entrada, index) => (
                          <View
                            key={index}
                            style={{
                              marginBottom: 10,
                              marginLeft: "5%",
                              marginTop: "2%",
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderBottomWidth: 1,
                              borderBottomColor: Colors.gris_claro,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                color: Colors.negro,
                                width: "30%",
                              }}
                            >
                              {entrada.producto.nombre}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: Colors.negro,
                                width: "20%",
                              }}
                            >
                              {entrada.tienda.nombre}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: Colors.negro,
                                width: "20%",
                              }}
                            >
                              {`Faltan ${Math.round(
                                (new Date(entrada.fecha_vencimiento).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 3600 * 24)
                              )} días`}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: Colors.negro,
                                width: "20%",
                                marginRight: "3%"
                              }}
                            >
                              {entrada.fecha_vencimiento.split("T")[0]}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}

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
                  onPress={() => changePassword()}
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
                    ? navigation.navigate("Login")
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
      <>
        <LinearGradient
          colors={[Colors.azul_Claro, Colors.azul_Oscuro]}
          start={[0, 0]}
          end={[1, 0]}
          style={styles.navbarDekstop}
        >
          <TouchableOpacity
            onPress={() => setModalUsuarioDetails(!modalUsuarioDetails)}
          >
            <View
              style={{
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                borderWidth: 1,
                borderColor: Colors.blanco,
                borderRadius: 15,
                width: 300,
                height: 60,
                marginVertical: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 20, color: Colors.blanco }}>
                  Usuario
                </Text>
                {notificacionesPendientes > 0 && (
                  <View
                    style={{
                      backgroundColor: Colors.rojo_oscuro,
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: 5,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: Colors.blanco }}>
                      {notificacionesPendientes}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.separatorBlanco} />
              <Text style={{ fontSize: 16, color: Colors.blanco }}>
                Nombre: {usuario?.nombre}
              </Text>
              <Text style={{ fontSize: 16, color: Colors.blanco }}>
                Usuario: {usuario?.nombre_usuario}
              </Text>
              <TouchableOpacity
                style={{
                  width: "90%",
                  height: "45%",
                  marginTop: "5%",
                  backgroundColor: Colors.azul_Suave,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 3, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={{ fontSize: 16, color: Colors.blanco }}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          {botones()}
        </LinearGradient>

        {modalUsuarioDetails && (
          <Modal
            transparent={true}
            visible={modalUsuarioDetails}
            animationType="fade"
            onRequestClose={() => setModalUsuarioDetails(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: Colors.rojo_oscuro,
                    borderRadius: 30,
                    height: 40,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setContrasennaVieja("");
                    setContrasennaNueva1("");
                    setContrasennaNueva2("");
                    setModalUsuarioDetails(false);
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
                  Tus Datos
                </Text>

                <ScrollView
                  style={{ width: "100%" }}
                  contentContainerStyle={{
                    alignItems: "center",
                    paddingBottom: 20,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Tu nombre: {usuario?.nombre}
                    </Text>
                    <Text style={styles.labelTextModalDesktop}>
                      Tu nombre de usuario en el sistema:{" "}
                      {usuario?.nombre_usuario}
                    </Text>
                    <Text style={styles.labelTextModalDesktop}>
                      Tu rol en el sistema: {usuario?.nombre_rol}
                    </Text>
                    <Text style={styles.labelTextModalDesktop}>
                      Tienda en la que trabajas: {usuario?.nombre_tienda}
                    </Text>
                  </View>

                  <View style={styles.separatorNegro} />

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color: Colors.negro, // Color del texto
                        textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
                        textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
                        textShadowRadius: 2, // Difuminado de la sombra
                      }}
                    >
                      Cambiar Contraseña
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Contraseña Vieja
                    </Text>
                  </View>
                  <CustomTextImputSearch
                    ref={nombreProductoRef}
                    style={styles.textImputModal}
                    cursorColor={Colors.azul_Oscuro}
                    value={contrasennaVieja}
                    onChangeText={setContrasennaVieja}
                    placeholder="Contraseña vieja"
                  />

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Contraseña Nueva
                    </Text>
                  </View>
                  <CustomTextImputSearch
                    ref={nombreProductoRef}
                    style={styles.textImputModal}
                    cursorColor={Colors.azul_Oscuro}
                    value={contrasennaNueva1}
                    onChangeText={setContrasennaNueva1}
                    placeholder="Contraseña nueva"
                  />

                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.labelTextModalDesktop}>
                      Repita la Nueva Contraseña
                    </Text>
                  </View>
                  <CustomTextImputSearch
                    ref={nombreProductoRef}
                    style={styles.textImputModal}
                    cursorColor={Colors.azul_Oscuro}
                    value={contrasennaNueva2}
                    onChangeText={setContrasennaNueva2}
                    placeholder="Contraseña nueva"
                  />

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
                    onPress={() => {
                      setMesajeModalChek(
                        `Estas seguro que deseas cambiar tu contraseña nueva a ${contrasennaNueva1}`
                      );
                      setIsModalChekVisible(true);
                      setModalUsuarioDetails(!modalUsuarioDetails);
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                      }}
                    >
                      Cambiar Contraseña
                    </Text>
                  </TouchableOpacity>

                  {notificacionesPendientes > 0 && (
                    <View
                      style={{
                        width: "90%",
                        height: "50%",
                        backgroundColor: Colors.blanco_Suave,
                        borderRadius: 15,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 5,
                        marginLeft: 10,
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          color: Colors.negro,
                          textShadowColor: "rgba(0, 0, 0, 0.5)",
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 2,
                        }}
                      >
                        Notificaciones Pendientes
                      </Text>
                      <ScrollView
                        style={{ width: "100%" }}
                        contentContainerStyle={{
                          alignItems: "center",
                          paddingBottom: 20,
                        }}
                      >
                        <View
                          style={{
                            marginBottom: 10,
                            marginLeft: "5%",
                            marginTop: "2%",
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: Colors.negro,
                              width: "30%",
                              fontWeight: "bold",
                            }}
                          >
                            Producto
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: Colors.negro,
                              width: "20%",
                              fontWeight: "bold",
                            }}
                          >
                            Tienda
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: Colors.negro,
                              width: "20%",
                              fontWeight: "bold",
                            }}
                          >
                            Días hasta vencimiento
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: Colors.negro,
                              width: "20%",
                              fontWeight: "bold",
                              marginRight: "4%"
                            }}
                          >
                            Fecha de vencimiento
                          </Text>
                        </View>

                        <View style={{
                          width: "100%", // Ancho del separador
                          height: 1, // Altura de la línea (grosor)
                          backgroundColor: Colors.negro, // Color blanco
                        }} />

                        {entradasProximasVencer.map((entrada, index) => (
                          <View
                            key={index}
                            style={{
                              marginBottom: 10,
                              marginLeft: "5%",
                              marginTop: "2%",
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderBottomWidth: 1,
                              borderBottomColor: Colors.gris_claro,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                color: Colors.negro,
                                width: "30%",
                              }}
                            >
                              {entrada.producto.nombre}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.negro,
                                width: "20%",
                              }}
                            >
                              {entrada.tienda.nombre}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.negro,
                                width: "20%",
                              }}
                            >
                              {`Faltan ${Math.round(
                                (new Date(entrada.fecha_vencimiento).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 3600 * 24)
                              )} días`}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.negro,
                                width: "20%",
                              }}
                            >
                              {entrada.fecha_vencimiento.split("T")[0]}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}

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
                  onPress={() => changePassword()}
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
                onPress={() => {
                  setContrasennaVieja("");
                  setContrasennaNueva1("");
                  setContrasennaNueva2("");
                  isReflechModalMensajeView
                    ? navigation.navigate("Login")
                    : setModalMensajeView(!isModalMensajeView);
                }}
              >
                <Text style={{ color: "white" }}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  }
};

export default Navbar;
