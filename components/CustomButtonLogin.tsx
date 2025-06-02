import { Colors } from '../styles/Colors';
import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, Animated, View, useWindowDimensions } from 'react-native';

interface CustomButtonProps {
  imageSource: any;
  text: any;
  onPress: () => void;
  isSelected: boolean; // Nuevo parámetro para cambiar el color del botón
}

const CustomButtonNavbar: React.FC<CustomButtonProps> = ({ imageSource, onPress, text, isSelected }) => {
  const [scale] = useState(new Animated.Value(1));
  const { width } = useWindowDimensions();

  const isMobile = width < 930;

  // Estilos condicionales según el parámetro `isSelected`
  const buttonStyles = [
    isMobile ? styles.mobileButton : styles.desktopButton,
    isSelected && { backgroundColor: Colors.azul_Oscuro } // Cambia solo el color si `isSelected` es true
  ];
  const viewStyles = isMobile ? styles.mobileContent : styles.desktopContent;

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
        <View style={viewStyles}>
          <Image source={imageSource} style={styles.image} />
          <Text style={styles.text}>{text}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mobileButton: {
    backgroundColor: Colors.azul_Claro,
    borderRadius: 15,
    height: 80,
    width: "180%",
    marginLeft: "80%",
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  desktopButton: {
    backgroundColor: Colors.azul_Claro,
    borderRadius: 15,
    width: "4%",
    minWidth: 120,
    height: 100,
    marginHorizontal: 10,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  desktopContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  mobileContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    color: Colors.blanco,
  },
});

export default CustomButtonNavbar;
