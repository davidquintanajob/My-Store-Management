import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { Colors } from "../styles/Colors";

const CustomRadioButton = ({
  onPress,
  selected,
  label,
}: {
  onPress: () => void;
  selected: boolean;
  label: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.radioButton, selected && styles.radioButtonSelected]}
  >
    <Text
      style={[
        styles.radioButtonText,
        selected && styles.radioButtonTextSelected,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: "row",
    height: 50,
    width: "45%",
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
    marginHorizontal: "2%",
    backgroundColor: Colors.azul_Suave, // Color de fondo del botón
  },
  radioButtonSelected: {
    backgroundColor: Colors.azul_Oscuro, // Color de fondo del botón seleccionado
  },
  radioButtonText: {
    fontSize: 16,
    color: Colors.blanco, // Color del texto
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Sombra oscura suave
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 2, // Difuminado de la sombra
  },
  radioButtonTextSelected: {
    fontWeight: "bold", // Texto en negritas para el botón seleccionado
    color: Colors.blanco_Suave, // Color del texto para el botón seleccionado
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
});

export default CustomRadioButton;
