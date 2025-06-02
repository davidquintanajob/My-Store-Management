import { Colors } from '../styles/Colors';
import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, Animated, View, useWindowDimensions } from 'react-native';

interface CustomButtonProps {
  text: any;
  onPress: () => void;
}

const CustomButtonSearchContainer: React.FC<CustomButtonProps> = ({onPress, text }) => {
  const [scale] = useState(new Animated.Value(1));

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
      style={styles.desktopButton}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.desktopContent}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  desktopButton: {
    backgroundColor: Colors.azul_Claro,
    borderRadius: 15,
    width: "90%", // Ancho fijo para pantallas de escritorio
    height: 50, // Altura fija para pantallas de escritorio
    marginLeft: "5%",
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
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  text: {
    fontSize: 23,
    color: Colors.blanco,
  },
});

export default CustomButtonSearchContainer;