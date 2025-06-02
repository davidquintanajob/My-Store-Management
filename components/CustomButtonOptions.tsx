import { Colors } from '../styles/Colors';
import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, Animated, View, useWindowDimensions } from 'react-native';

interface CustomButtonProps {
  text: any;
  onPress: () => void;
}

const CustomButtonOptions: React.FC<CustomButtonProps> = ({onPress, text }) => {
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
          <Text style={styles.textMovil}>{text}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  desktopButton: {
    backgroundColor: Colors.azul_Suave,
    borderRadius: 15,
    width: "12%", // Ancho fijo para pantallas de escritorio
    height: 50, // Altura fija para pantallas de escritorio
    marginRight: "2%",
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.azul_Oscuro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    elevation: 3,
  },
  movilButton: {
    backgroundColor: Colors.azul_Suave,
    borderRadius: 15,
    width: "50%", // Ancho fijo para pantallas de escritorio
    height: 50, // Altura fija para pantallas de escritorio
    marginRight: "2%",
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.azul_Oscuro, // Color de la sombra
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, // Ajusta la opacidad para hacer la sombra más difuminada
    shadowRadius: 14, // Difuminado
    elevation: 3,
  },
  desktopContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  textDesktop: {
    fontSize: 19,
    color: Colors.blanco,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  textMovil: {
    fontSize: 16,
    color: Colors.blanco,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
});

export default CustomButtonOptions;