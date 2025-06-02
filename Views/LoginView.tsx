import Navbar from "../components/Navbar";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react"; // userState es un hook que permite manejar el estado en componentes
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { styles } from "../styles/Styles";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../styles/Colors";
import CustomTextImputSearch from "../components/CustomTextImputSearch";
import { useUsuario } from "../contexts/UsuarioContext";
import { getUsuarioById, iniciarSecionUser } from "../services/UsuarioServices";
import { getPermisosOfRol, RolPermiso } from "../services/RolPermisosAndRol";
import { useSelectedButon } from "../contexts/globalButonNavbarSelected";
import { addAccionUsuario } from "../services/AccionesUsuarioServices";
import axios from "axios";

export default function LoginView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario

  const checkBackend = async () => {
    const url = "https://my-leniogestionbackend.onrender.com/usuario";
    let retries = 0;
    const maxRetries = 5; // Número máximo de reintentos

    while (retries < maxRetries) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(response);

        if (response.status === 403) {
          console.log("OKAY"); // El backend respondió correctamente
          return; // Salir de la función
        } else if (!response.ok) {
          throw new Error(`Error en la petición: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        retries++;
        console.log(`Reintentando (${retries}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Esperar 5 segundos antes de reintentar
      }
    }

    console.error("Número máximo de reintentos alcanzado. No se pudo conectar al backend.");
  };

  useFocusEffect(
    React.useCallback(() => {
      // Código que se ejecutará cuando la pantalla esté enfocada
      console.log("La pantalla de Login está enfocada");
      
      //checkBackend()

      // Si necesitas limpiar algo cuando la pantalla pierde el foco, puedes retornar una función de limpieza
      return () => {
        console.log("La pantalla de Login perdió el foco");
      };
    }, [])
  );

  //Datos de el usuario
  const { setUsuario, usuario } = useUsuario();
  const { setSelectedButon, selectedButon } = useSelectedButon();

  // Estilo según la vita desktop o movil
  const ContainerStyle = isMobile
    ? styles.loginContainerStilesMovil
    : styles.loginContainerStilesDesktop;

  // Constantes para controlar el estado del Modal
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isModalMesajeVisible, setModalMesajeVisible] = React.useState(false);
  const [modalMesaje, setModalMesaje] = React.useState("");

  // Función para abrir/cerrar el modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Variables para los datos de los usuarios
  const [username, setUsername] = useState("");
  const [pasword, setPasword] = useState("");

  // Funciones de servicios con los usuarios
  const iniciarSecion = async () => {
    setModalMesajeVisible(true);
    setModalMesaje("Iniciando sesión...");

    localStorage.clear();
    if (username.trim() != "" && pasword.trim() != "") {
      const resultUserAuth = await iniciarSecionUser(username, pasword);
    // Comprueba si result es false
    if (resultUserAuth) {
      // Si result no es false, se manejan la resuesta
      // Obtener más datos de los usuarios
      const resultUserDates = await getUsuarioById(resultUserAuth.data.token,resultUserAuth.data.id_usuario);
      
      if (resultUserDates) {
        // Guardamos el usuario en el contexto
        const permisos: RolPermiso[] | false = await getPermisosOfRol(resultUserAuth.data.token, resultUserAuth.data.rol.id_rol);
        if (permisos) {
          setUsuario({
            id_usuario: resultUserDates.data.id_usuario,
            nombre: resultUserAuth.data.nombre,
            telefono: resultUserDates.data.telefono, // Usa undefined si no hay valor
            direccion: resultUserDates.data.direccion, // Usa undefined si no hay valor
            carnet_identidad: resultUserDates.data.carnet_identidad, // Usa undefined si no hay valor
            detalles_bancarios: resultUserDates.data.detalles_bancarios, // Usa undefined si no hay valor
            nombre_usuario: username, // Esta propiedad es obligatoria
            email: resultUserDates.data.email, // Esta propiedad es obligatoria
            token: resultUserAuth.data.token,
            id_rol: resultUserAuth.data.rol.id_rol,
            nombre_rol: resultUserAuth.data.rol.nombre,
            id_tienda: resultUserAuth.data.tienda.id_tienda,
            nombre_tienda: resultUserAuth.data.tienda.nombre,
            permisos: permisos
          });

          // Agregar Acción de usuario iniciar seción
          
          const currentDate = new Date();
          
          // Extraemos el año, mes y día de la fecha actual
          const year = String(currentDate.getFullYear());
          const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Los meses comienzan desde 0, por lo que sumamos 1
          const day = String(currentDate.getDate()).padStart(2, "0"); // Aseguramos que siempre haya dos dígitos

          let auxAddAccionUsuarioDescripcion: string = `El usuario ${resultUserAuth.data.nombre} con el nombre de usuario ${username} inició sesión`;
          await addAccionUsuario(resultUserAuth.data.token, auxAddAccionUsuarioDescripcion, `${year}-${month}-${day}`, resultUserDates.data.id_usuario, 5);
          
          // Navegar
          setModalMesajeVisible(false);
          navigation.navigate("HomeScreen");
        }
      }else{
        alert("Error en userDates");
        toggleModal();
      }
    } else {
      // Maneja el caso en que la autenticación falla
      setPasword("");
      setModalMesajeVisible(false);
      toggleModal();
    }
    }else{
      toggleModal();
    }
  };

  // Función para cuando precione la tecla enter
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter') {
      // Aquí ejecutas la función que deseas
      iniciarSecion()
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LinearGradient
        colors={[Colors.azul_Claro, Colors.azul_Oscuro]} // Gradiente de azul oscuro a azul claro
        start={[0, 0]}
        end={[1, 0]}
        style={ContainerStyle}
      >
        <Image
          source={require("../images/logo.png")}
          style={{
            position: "absolute",
            resizeMode: "cover",
            height: "50%",
            width: "70%",
            marginBottom: "95%",
            shadowOffset: { width: 3, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: "35%",
          }}
        >
          <Text style={styles.textSearchDesktop}>Nombre de Usuario:</Text>
          <CustomTextImputSearch
            style={styles.textImputLogin}
            placeholder="Nombre de Usuario"
            value={username}
            onChangeText={setUsername}
            onKeyPress={handleKeyPress}
          />

          <Text style={styles.textSearchDesktop}>Contraseña</Text>
          <CustomTextImputSearch
            style={styles.textImputLogin}
            placeholder="Contraseña"
            value={pasword}
            secureTextEntry={true}
            onChangeText={setPasword}
            onKeyPress={handleKeyPress}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.azul_Claro,
              borderRadius: 15,
              borderColor: Colors.azul_Suave,
              borderWidth: 2,
              width: "90%", // Ancho fijo para pantallas de escritorio
              height: 35, // Altura fija para pantallas de escritorio
              alignItems: "center",
              marginTop: "5%",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 3, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
            onPress={() => {
              setSelectedButon({
                butonSelected: ""
              })
              iniciarSecion()
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
                textShadowRadius: 200, // Difuminado de la sombra
              }}
            >
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              width: "100%",
            }}
          >

            <Modal
              transparent={true}
              visible={isModalVisible}
              animationType="fade"
              onRequestClose={toggleModal}
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
                  style={isMobile? styles.modalViewMesajeContainerMovil : styles.modalViewMesajeContainerDesktop}
                >
                  <Text style={styles.labelTextDesktop}>
                    Error al iniciar sesión, posibles errores:
                  </Text>
                  <Text style={styles.labelTextDesktop}>
                    -Nombre de usuario o contraseña incorrecta.
                  </Text>
                  <Text style={styles.labelTextDesktop}>
                    -Debe llenar todos los campos.
                  </Text>

                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "5%",
                      width: "100%", // Hacer que el botón ocupe todo el ancho
                      paddingVertical: 10, // Espaciado vertical
                      backgroundColor: Colors.azul_Oscuro,
                      borderRadius: 5, // Bordes redondeados
                    }}
                    onPress={toggleModal}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Intentar de nuevo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal
              transparent={true}
              visible={isModalMesajeVisible}
              animationType="fade"
              onRequestClose={toggleModal}
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
                  style={isMobile? styles.modalViewMesajeContainerMovil : styles.modalViewMesajeContainerDesktop}
                >
                  <Text style={styles.labelTextDesktop}>
                    {modalMesaje}
                  </Text>
                </View>
              </View>
            </Modal>

          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
