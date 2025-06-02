import Navbar from "../components/Navbar";
import { Colors } from "../styles/Colors";
import { styles } from "../styles/Styles";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomTextImputSearch from "../components/CustomTextImputSearch";
import CustomDropdown from "../components/CustomDropDownPicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/CustomStyles.css";

export default function ServiciosView() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana
  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 1150; // Puedes ajustar este umbral según sea necesario

  // Variable visual para la carga de datos en la tabla
  const [loading, setLoading] = useState(false);
  
  // Constantes para controlar la animación del boton desplegable
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current; // Valor animado

  // Definir el estilo animado para la altura del componente
  const animatedStyle = {
    height: animationValue,
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

  // Constantes y funciones para los radio butons para ordenar
  const [selectedOptionTipoOrden, setSelectedOptionTipoOrden] = useState<
    string | null
  >(null);
  const handleSelectTipoOrden = (value: string) => {
    setSelectedOptionTipoOrden(value);
  };
  // Constante para controlar la fecha "desde" seleccionada
  const [selectedDateDesde, setSelectedDateDesde] = useState(new Date());

  //Variables Para los datos de búsqueda
  const [nombreCliente, setNombreClienteSearch] = useState("");
  const [rangoPrecioDesdeSearch, setRangoPrecioDesdeSearch] = useState("");
  const [rangoPrecioHastaSearch, setRangoPrecioHastaSearch] = useState("");
  const [selectedValueNombreTienda, setSelectedValueNombreTienda] = useState<
    string | null
  >(null);
  const [selectedValueTipoServicio, setSelectedValueTipoServicio] = useState<
    string | null
  >(null);

  // Ejemplo Para el DropDown de tienda
  const dropdownItems = [
    { label: "Opción 1", value: "opcion1" },
    { label: "Opción 2", value: "opcion2" },
    { label: "Opción 3", value: "opcion3" },
  ];

  // Ejemplo Para el DropDown de tipos de servicios
  const dropdownItemsTipo = [
    { label: "Opción 1", value: "opcion1" },
    { label: "Opción 2", value: "opcion2" },
    { label: "Opción 3", value: "opcion3" },
  ];

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
          <TouchableOpacity
            onPress={() => alert("Not Suort Yet")}
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
            <Text style={styles.radioButtonTextMovil}>Agregar Servicio</Text>
          </TouchableOpacity>
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

          <Text style={styles.labelTextMovil}>Opciones de Ordenamiento:</Text>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => handleSelectTipoOrden("option1")}
              style={[
                styles.radioButtonMovil,
                selectedOptionTipoOrden === "option1" &&
                  styles.radioButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.radioButtonTextDesktop,
                  selectedOptionTipoOrden === "option1" &&
                    styles.radioButtonSelected &&
                    styles.radioButtonTextSelected,
                ]}
              >
                Menor a Mayor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelectTipoOrden("option2")}
              style={[
                styles.radioButtonMovil,
                selectedOptionTipoOrden === "option2" &&
                  styles.radioButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.radioButtonTextDesktop,
                  selectedOptionTipoOrden === "option2" &&
                    styles.radioButtonSelected &&
                    styles.radioButtonTextSelected,
                ]}
              >
                Mayor a Menor
              </Text>
            </TouchableOpacity>
          </View>
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
            <Text>La tabla de movil debe ir aquí</Text>
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
                  colors={[Colors.azul_Claro, Colors.azul_Oscuro]}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={styles.searchContainerMovil}
                >
                  <Text style={styles.textSearchDesktop}>
                    Nombre del Cliente:
                  </Text>
                  <CustomTextImputSearch
                    style={styles.customTextImputSearchFullDesktop}
                    placeholder="Nombre del Cliente"
                    value={nombreCliente}
                    onChangeText={setNombreClienteSearch}
                  />

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchDesktop}>Rango de Fecha:</Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
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
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <DatePicker
                      selected={selectedDateDesde}
                      onChange={(date) => setSelectedDateDesde(date)}
                      className="datePickerCustomWrapper"
                      popperPlacement="top-end" // Esto asegurará que el calendario se muestre por encima
                      portalId="root-portal" // Esto es útil para asegurarse de que el componente DatePicker se renderice por encima de otros
                    />
                    <DatePicker
                      selected={selectedDateDesde}
                      className="datePickerCustomWrapper"
                      onChange={(date) => setSelectedDateDesde(date)}
                      popperPlacement="top-end" // Esto asegurará que el calendario se muestre por encima
                      portalId="root-portal" // Esto es útil para asegurarse de que el componente DatePicker se renderice por encima de otros
                    />
                  </View>

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchDesktop}>Rango de Precio:</Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyDesktop}
                      placeholder="Desde"
                      value={rangoPrecioDesdeSearch}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoPrecioDesdeSearch(numericValue);
                      }}
                    />
                    <CustomTextImputSearch
                      style={styles.customTextImputSearchFiftyDesktop}
                      placeholder="Hasta"
                      value={rangoPrecioHastaSearch}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setRangoPrecioHastaSearch(numericValue);
                      }}
                    />
                  </View>

                  <View style={styles.separatorBlanco} />

                  <Text style={styles.textSearchDesktop}>
                    Buscar por Tipo de Servicio:
                  </Text>
                  <CustomDropdown
                    value={selectedValueTipoServicio}
                    setValue={setSelectedValueTipoServicio}
                    items={dropdownItemsTipo}
                  />
                  <Text style={styles.textSearchDesktop}>
                    Buscar por Tienda:
                  </Text>
                  <CustomDropdown
                    value={selectedValueNombreTienda}
                    setValue={setSelectedValueNombreTienda}
                    items={dropdownItems}
                  />
                </LinearGradient>
              </ScrollView>
            </Animated.View>
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        {/* Barra superior */}
        <Navbar />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: "1%",
            marginTop: "10%",
          }}
        >
          {/* Contenedor para las opciones de búsqueda del paciente */}
          <LinearGradient
            colors={[Colors.azul_Claro, Colors.azul_Oscuro]}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.searchContainerDesktop}
          >
            <Text style={styles.textSearchDesktop}>Nombre del Cliente:</Text>
            <CustomTextImputSearch
              style={styles.customTextImputSearchFullDesktop}
              placeholder="Nombre del Cliente"
              value={nombreCliente}
              onChangeText={setNombreClienteSearch}
            />

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Rango de Fecha:</Text>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
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
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <DatePicker
                selected={selectedDateDesde}
                onChange={(date) => setSelectedDateDesde(date)}
                className="datePickerCustomWrapper"
                popperPlacement="top-end" // Esto asegurará que el calendario se muestre por encima
                portalId="root-portal" // Esto es útil para asegurarse de que el componente DatePicker se renderice por encima de otros
              />
              <DatePicker
                selected={selectedDateDesde}
                className="datePickerCustomWrapper"
                onChange={(date) => setSelectedDateDesde(date)}
                popperPlacement="top-end" // Esto asegurará que el calendario se muestre por encima
                portalId="root-portal" // Esto es útil para asegurarse de que el componente DatePicker se renderice por encima de otros
              />
            </View>

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>Rango de Precio:</Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Desde"
                value={rangoPrecioDesdeSearch}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoPrecioDesdeSearch(numericValue);
                }}
              />
              <CustomTextImputSearch
                style={styles.customTextImputSearchFiftyDesktop}
                placeholder="Hasta"
                value={rangoPrecioHastaSearch}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setRangoPrecioHastaSearch(numericValue);
                }}
              />
            </View>

            <View style={styles.separatorBlanco} />

            <Text style={styles.textSearchDesktop}>
              Buscar por Tipo de Servicio:
            </Text>
            <CustomDropdown
              value={selectedValueTipoServicio}
              setValue={setSelectedValueTipoServicio}
              items={dropdownItemsTipo}
            />
            <Text style={styles.textSearchDesktop}>Buscar por Tienda:</Text>
            <CustomDropdown
              value={selectedValueNombreTienda}
              setValue={setSelectedValueNombreTienda}
              items={dropdownItems}
            />
          </LinearGradient>
        </View>
      </View>
    );
  }
}
