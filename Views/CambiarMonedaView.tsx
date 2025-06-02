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
import { cambiarValorMonedaUSD, getValorMonedaUSD } from "../services/MonedaService";
import { useUsuario } from "../contexts/UsuarioContext";

export default function CambiarMonedaView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 930; // Puedes ajustar este umbral según sea necesario
  const { usuario, setUsuario } = useUsuario();

  const [isModalMensajeView, setModalMensajeView] = React.useState(false);

  const [cambioMoneda, setCambioMoneda] = useState("");
  useFocusEffect(
    useCallback(() => {
      const runEffects = async () => {
        if (usuario?.token) {
            const result = await getValorMonedaUSD(usuario.token);
            setCambioMoneda(result);
        }
      };
      runEffects();

      return () => {
        // Código que se ejecuta cuando se cierra la interfaz
      };
    }, [])
  );

  // Cambiar moneda function
  const cambiarMoneda = async () =>{
    if (usuario?.token) {
        await cambiarValorMonedaUSD(usuario.token, cambioMoneda);
        setModalMensajeView(true);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/*Barra superior*/}
      <Navbar />
      {/* Vista animada que se despliega hacia la izquierda */}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: "10%",
        }}
      >
        <View style={{ width: "20%", marginLeft: "40%", }}>
          <Text style={styles.labelTextModalDesktop}>
            {"Cambio de moneda de USD -> CUP"}
          </Text>
          <CustomTextImputSearch
            style={styles.textImputModal}
            cursorColor={Colors.azul_Oscuro}
            value={cambioMoneda}
            onChangeText={(text) => {
              // Permite solo números y un punto decimal
              const numericValue = text.replace(/[^0-9.]/g, ""); // Elimina caracteres que no sean dígitos o puntos
              // Asegura que solo haya un punto decimal
              const validNumericValue =
                numericValue.split(".").length > 2
                  ? numericValue.replace(/\.+$/, "") // Elimina puntos adicionales al final
                  : numericValue;

              setCambioMoneda(validNumericValue);
            }}
            placeholder="Digite un número"
          />
        </View>
        <View style={{ width: "20%", marginLeft: "41%" }}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.azul_Oscuro,
              borderRadius: 15,
              width: "80%", // Ancho fijo para pantallas de escritorio
              height: 30, // Altura fija para pantallas de escritorio
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "5%",
              shadowColor: "#000",
              shadowOffset: { width: 3, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              marginTop: "3%", // Margen adicional entre botones
            }}
            onPress={() => {cambiarMoneda()}}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
              }}
            >
              Cambiar Moneda
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
                {`Se ha cambiado el valor de la moneda a ${cambioMoneda}`}
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
                onPress={() => setModalMensajeView(!isModalMensajeView)
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
