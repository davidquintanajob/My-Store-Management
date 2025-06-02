import { Colors } from "../styles/Colors";
import React, { useState } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Animated,
  View,
  useWindowDimensions,
} from "react-native";

interface CustomButtonProps {
  text: any;
  imageSource: any;
  onPress: () => void;
}

const CustomButtonAdministradorView: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  imageSource,
}) => {
  const [scale] = useState(new Animated.Value(1));
  const { width } = useWindowDimensions(); // Obtiene el ancho de la ventana

  // Define el umbral para identificar si es un dispositivo móvil
  const isMobile = width < 1150; // Puedes ajustar este umbral según sea necesario

  // Estilos condicionales
  const buttonStyles = isMobile ? styles.movilButton : styles.desktopButton;

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

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.desktopContent}>
          <Image source={imageSource} style={styles.image} />
          <Text style={styles.textDesktop}>{text}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  desktopButton: {
    height: 110,
    width: 110,
    justifyContent: "center",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: Colors.negro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    marginHorizontal: 10
  },
  movilButton: {
    height: 110,
    width: 110,
    justifyContent: "center",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: Colors.negro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    marginHorizontal: 10
  },
  desktopContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  textDesktop: {
    fontSize: 16,
    color: Colors.negro, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
    fontWeight: "bold"
  },
  textMovil: {
    fontSize: 16,
    color: Colors.negro, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
    fontWeight: "bold"
  },
  image: {
    height: 70,
    width: 70,
    tintColor: Colors.negro,
  },
});

export default CustomButtonAdministradorView;
