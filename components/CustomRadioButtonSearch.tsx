import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../styles/Colors";

interface CustomRadioButtonProps {
  onPress: () => void;
  selected: boolean;
  label: string;
}

const CustomRadioButtonSingle: React.FC<CustomRadioButtonProps> = ({
  onPress,
  selected,
  label,
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
    height: 40,
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.azul_Oscuro,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    borderColor: Colors.azul_Claro,
    borderWidth: 3,
    padding: 10,
    borderRadius: 10,
    marginLeft: "5%",
    backgroundColor: Colors.azul_Suave,
  },
  radioButtonSelected: {
    backgroundColor: Colors.azul_Oscuro,
  },
  radioButtonText: {
    fontSize: 16,
    color: Colors.blanco,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  radioButtonTextSelected: {
    fontWeight: "bold",
    color: Colors.blanco_Suave,
  },
});

export default CustomRadioButtonSingle;